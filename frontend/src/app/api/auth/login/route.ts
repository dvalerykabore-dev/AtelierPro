// POST /api/auth/login — AUTH-02 + AUTH-10 lockout integration.
//
// Source: RESEARCH.md Pattern 9 (sequence) + Pattern 8 (constant-time error
// path) + Pattern 10 (lockout-store integration).
//
// Order is load-bearing per D-24 (enumeration resistance):
//   1. Zod validate body
//   2. Per-email rate limit (10/15m — D-08)
//   3. Lockout flag check (Redis) — early-out before bcrypt cost
//   4. User lookup
//   5. No-user branch: dummy bcrypt compare → INVALID_CREDENTIALS (no recordFailure)
//   6. verifyPassword → on fail recordFailure → LOCKED_OUT or INVALID_CREDENTIALS
//   7. emailVerifiedAt check (after credential match — D-24)
//   8. recordSuccess
//   9. ouvre un défi par e-mail — AUCUN cookie ici (voir plus bas)
//
// AtelierPro — la route ne connecte plus à elle seule. Le mot de passe validé
// ouvre un code à usage unique envoyé à l'adresse du compte ; c'est
// `/api/auth/verify-login` qui pose les cookies une fois le code saisi. Les
// étapes 1 à 7 sont inchangées, y compris leur ordre : c'est lui qui rend la
// route résistante à l'énumération, et il ne se réarrange pas sans conséquence.
export const runtime = 'nodejs';

import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import {
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  setCsrfCookie,
  verifyPassword,
} from '@/lib/server/auth';
import { isLockedOut, recordFailure, recordSuccess } from '@/lib/server/auth/lockout';
import { ouvrirDefi } from '@/lib/server/auth/login-challenge';
import { envoyerCodeConnexion } from '@/lib/server/auth/envoi-code-connexion';
import { dummyBcryptCompare } from '@/lib/server/auth/dummy-bcrypt';
import { createEmailLimiter } from '@/lib/server/middleware/rate-limit-by-email';
import { getRedis } from '@/lib/server/redis';
import { prisma } from '@/lib/server/prisma';
import { zEmail } from '@/lib/server/zod-helpers';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';

const LoginSchema = z.object({
  email: zEmail,
  password: z.string().min(1),
});

// Module-level limiter — D-08: 10 attempts / 15 min per email.
const redis = getRedis() ?? undefined;
const limiter = createEmailLimiter(
  { ...(redis ? { redis } : {}) },
  {
    bucket: 'auth:login',
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.AUTH_LOGIN_RATE_LIMIT_MAX ?? 10),
    code: 'TOO_MANY_LOGIN_ATTEMPTS',
    message: 'Too many login attempts. Try again later.',
  },
);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    // 1. Validate body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', message: 'Invalid JSON body' },
        { status: 400, headers: { 'x-request-id': ctx.requestId } },
      );
    }
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', message: 'Invalid request body' },
        { status: 400, headers: { 'x-request-id': ctx.requestId } },
      );
    }
    const { email, password } = parsed.data;

    // 2. Rate limit per email
    const rl = await limiter.check(req, email);
    if (rl) {
      rl.headers.set('x-request-id', ctx.requestId);
      return rl;
    }

    // 3. Lockout flag check — early out before bcrypt
    if (await isLockedOut(email)) {
      log.warn('login blocked by lockout', { email });
      return NextResponse.json(
        { error: 'LOCKED_OUT', message: 'Account temporarily locked.' },
        { status: 423, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    // 4. User lookup
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        emailVerifiedAt: true,
        tokenVersion: true,
        status: true,
      },
    });

    // 5. No-user (or OAuth-only) branch: dummy bcrypt then INVALID_CREDENTIALS.
    //    No recordFailure here per D-24 — Pattern 9 step 4 only counts failures
    //    against accounts that exist (otherwise an attacker can DoS arbitrary
    //    emails by guessing).
    if (!user || !user.passwordHash) {
      await dummyBcryptCompare(password);
      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        { status: 400, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    // 6. verifyPassword → on fail, recordFailure
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      const r = await recordFailure(email);
      if (r.locked) {
        return NextResponse.json(
          { error: 'LOCKED_OUT', message: 'Account temporarily locked.' },
          { status: 423, headers: { 'x-request-id': ctx.requestId } },
        );
      }
      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        { status: 400, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    // 7. emailVerifiedAt check — after credential match (D-24).
    //    Don't recordFailure here; it's not a credential failure.
    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        { error: 'EMAIL_NOT_VERIFIED', message: 'Please verify your email first.' },
        { status: 403, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    // 7b. D-ADMIN-02 — refuse SUSPENDED users AFTER credentials verify (no
    //     enumeration leak: same code path as a non-existent email up to here)
    //     but BEFORE issuing cookies.
    //
    //     WR-04: clear the lockout counter for SUSPENDED users via
    //     `recordSuccess`. The credentials already passed verifyPassword, so
    //     the account holder is legitimate — there is nothing more to deter
    //     by pinning the counter. Without this, every login attempt by a
    //     suspended user accrues toward the lockout, and a SUPERADMIN
    //     restore leaves the user one failed attempt away from a fresh
    //     lockout. Clearing here keeps the counter clean across the
    //     suspend → restore lifecycle.
    if (user.status === 'SUSPENDED') {
      await recordSuccess(email);
      return NextResponse.json(
        {
          error: 'ACCOUNT_SUSPENDED',
          message: 'This account has been suspended. Contact support.',
        },
        { status: 403, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    // 8. Reset failure count. Le mot de passe est bon — le compteur de
    //    verrouillage n'a plus rien à retenir, que le second facteur aboutisse
    //    ou non. Le laisser courir punirait une adresse e-mail lente.
    await recordSuccess(email);

    // 9. Second facteur — un code envoyé à l'adresse du compte.
    //
    //    Aucun cookie n'est posé ici : le mot de passe prouve ce qu'on sait, le
    //    code prouve qu'on a accès à la boîte. Ouvrir la session dès maintenant
    //    reviendrait à n'avoir qu'un seul facteur, et le code ne serait plus
    //    qu'une formalité qu'on peut ignorer.
    const defi = await ouvrirDefi(prisma, user.id);
    const envoi = await envoyerCodeConnexion({
      to: user.email,
      code: defi.code,
      expiresAt: defi.expiresAt,
    });

    if (envoi.etat === 'echec') {
      // Le code existe en base mais n'est pas parti. Le dire, plutôt que de
      // laisser attendre un e-mail qui ne viendra pas — une nouvelle tentative
      // en émettra un autre et invalidera celui-ci.
      return NextResponse.json(
        {
          error: 'LOGIN_CODE_NOT_SENT',
          message: 'Could not send the login code. Try again.',
        },
        { status: 502, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    if (envoi.etat === 'non-configure') {
      // Aucun fournisseur d'e-mail : personne ne recevrait jamais de code, et
      // exiger le second facteur fermerait l'application à tout le monde, y
      // compris en développement local. On ouvre la session avec le seul mot de
      // passe, et `anomaliesProduction` signale le cas au démarrage pour qu'un
      // déploiement réel ne tourne pas dans cet état sans le savoir.
      log.warn('connexion sans second facteur : aucun fournisseur d’e-mail configuré', {
        userId: user.id,
      });
      const accessToken = await createAccessToken({
        sub: user.id,
        email: user.email,
        tokenVersion: user.tokenVersion,
      });
      const refreshToken = await createRefreshToken(user.id, user.tokenVersion);
      await setAuthCookies(accessToken, refreshToken);
      await setCsrfCookie();

      return NextResponse.json(
        { ok: true, user: { sub: user.id, email: user.email } },
        { status: 200, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    log.info('code de connexion envoyé', { userId: user.id });
    return NextResponse.json(
      { ok: true, challenge: true, email: user.email },
      { status: 200, headers: { 'x-request-id': ctx.requestId } },
    );
  });
}
