// POST /api/auth/verify-login — second facteur d'une connexion.
//
// `/api/auth/login` a validé le mot de passe et envoyé un code à l'adresse du
// compte, sans poser de cookie. C'est ici que la session s'ouvre, une fois le
// code saisi.
//
// Dérogation CSRF, comme `/verify-email` : la route s'exécute avant toute
// session, et c'est elle qui pose le cookie CSRF. Appeler `verifyCsrf` ici
// refuserait toutes les requêtes légitimes.
export const runtime = 'nodejs';

import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import {
  VERIFICATION_CODE_REGEX,
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  setCsrfCookie,
} from '@/lib/server/auth';
import { consommerDefi } from '@/lib/server/auth/login-challenge';
import { createEmailLimiter } from '@/lib/server/middleware/rate-limit-by-email';
import { redis } from '@/lib/server/redis';
import { prisma } from '@/lib/server/prisma';
import { zEmail } from '@/lib/server/zod-helpers';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';

const Body = z.object({
  email: zEmail,
  code: z.string().regex(VERIFICATION_CODE_REGEX, 'Invalid login code format'),
});

const limiter = createEmailLimiter(redis ? { redis } : {}, {
  bucket: 'auth:verify-login',
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_VERIFY_LOGIN_RATE_LIMIT_MAX ?? 10),
  code: 'TOO_MANY_VERIFY_ATTEMPTS',
  message: 'Too many attempts. Try again later.',
});

/**
 * Refus indifférencié.
 *
 * Adresse inconnue, compte sans défi en cours, code faux, code déjà consommé :
 * tout rend le même corps. Distinguer dirait à qui essaie si l'adresse existe
 * et si un mot de passe a été deviné — deux renseignements que cette route
 * n'a aucune raison de donner.
 */
function refus(requestId: string): NextResponse {
  return NextResponse.json(
    { error: 'LOGIN_CODE_INVALID', message: 'Login code is invalid.' },
    { status: 400, headers: { 'x-request-id': requestId } },
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const json = await req.json().catch(() => null);
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', message: 'Invalid request body' },
        { status: 400, headers: { 'x-request-id': ctx.requestId } },
      );
    }
    const { email, code } = parsed.data;

    const rl = await limiter.check(req, email);
    if (rl) {
      rl.headers.set('x-request-id', ctx.requestId);
      return rl;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, tokenVersion: true, status: true },
    });
    if (!user) return refus(ctx.requestId);

    // Un compte suspendu entre la saisie du mot de passe et celle du code ne
    // doit pas obtenir de session. Le contrôle existe déjà sur `/login` ; le
    // refaire ici ferme la fenêtre entre les deux appels.
    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        {
          error: 'ACCOUNT_SUSPENDED',
          message: 'This account has been suspended. Contact support.',
        },
        { status: 403, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    const resultat = await consommerDefi(prisma, user.id, code);
    if (!resultat.ok) {
      if (resultat.motif === 'EXPIRE') {
        return NextResponse.json(
          { error: 'LOGIN_CODE_EXPIRED', message: 'Login code has expired.' },
          { status: 400, headers: { 'x-request-id': ctx.requestId } },
        );
      }
      if (resultat.motif === 'TROP_DE_TENTATIVES') {
        return NextResponse.json(
          {
            error: 'LOGIN_CODE_BURNED',
            message: 'Too many wrong entries for this code. Request a new one.',
          },
          { status: 400, headers: { 'x-request-id': ctx.requestId } },
        );
      }
      return refus(ctx.requestId);
    }

    const accessToken = await createAccessToken({
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    });
    const refreshToken = await createRefreshToken(user.id, user.tokenVersion);
    await setAuthCookies(accessToken, refreshToken);
    await setCsrfCookie();

    log.info('connexion confirmée par code', { userId: user.id });
    return NextResponse.json(
      { ok: true, user: { sub: user.id, email: user.email } },
      { status: 200, headers: { 'x-request-id': ctx.requestId } },
    );
  });
}
