// Tests for POST /api/auth/login (AUTH-02 + AUTH-10 lockout integration).
// Order: prisma-mock + cookie-mock at module level so vi.mock auto-hoists
// above any module that imports `@/lib/server/prisma` or `next/headers`.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '@/test-utils/prisma-mock';
import { mockNextCookies, __cookieStore } from '@/test-utils/mock-cookies';

mockNextCookies();

// Mock lockout module so we can drive isLockedOut/recordFailure/recordSuccess.
vi.mock('@/lib/server/auth/lockout', () => ({
  isLockedOut: vi.fn(),
  recordFailure: vi.fn(),
  recordSuccess: vi.fn(),
}));

// Mock dummy-bcrypt so we can assert it's called on the no-user branch.
vi.mock('@/lib/server/auth/dummy-bcrypt', () => ({
  dummyBcryptCompare: vi.fn().mockResolvedValue(undefined),
}));

// Mock verifyPassword from auth.ts to avoid running real bcrypt in tests.
vi.mock('@/lib/server/auth', async () => {
  const actual = await vi.importActual<typeof import('@/lib/server/auth')>('@/lib/server/auth');
  return {
    ...actual,
    verifyPassword: vi.fn(),
  };
});

// Envoi du code de connexion — piloté par test.
//
// Par défaut « non-configure », ce qui est l'état de `.env.test` : la suite est
// conçue pour tourner sans clé de service. Attention au piège que cela tend —
// dans cet état la route retombe sur la connexion par mot de passe seul, si
// bien qu'un test qui ne redéfinit pas ce mock ne dit RIEN du second facteur.
// Le bloc « second facteur » plus bas est le seul à l'exercer.
vi.mock('@/lib/server/auth/envoi-code-connexion', () => ({
  envoyerCodeConnexion: vi.fn(),
}));

import { isLockedOut, recordFailure, recordSuccess } from '@/lib/server/auth/lockout';
import { dummyBcryptCompare } from '@/lib/server/auth/dummy-bcrypt';
import { envoyerCodeConnexion } from '@/lib/server/auth/envoi-code-connexion';
import { verifyPassword } from '@/lib/server/auth';
import { POST } from './route';
import { NextRequest } from 'next/server';

/** Compte existant, mot de passe bon, e-mail vérifié — le cas qui atteint l'étape 9. */
const UTILISATEUR_VALIDE = {
  id: 'u1',
  email: 'a@b.com',
  passwordHash: '$2a$12$hashhashhashhashhashhashhashhashhashhashhashhashhashhha',
  emailVerifiedAt: new Date('2026-01-01'),
  tokenVersion: 0,
};

function makeReq(body: unknown): NextRequest {
  return new NextRequest('https://test/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  __cookieStore.clear();
  vi.mocked(isLockedOut).mockReset();
  vi.mocked(recordFailure).mockReset();
  vi.mocked(recordSuccess).mockReset();
  vi.mocked(dummyBcryptCompare).mockReset();
  vi.mocked(verifyPassword).mockReset();
  vi.mocked(isLockedOut).mockResolvedValue(false);
  vi.mocked(recordFailure).mockResolvedValue({ count: 1, locked: false });
  vi.mocked(recordSuccess).mockResolvedValue(undefined);
  vi.mocked(dummyBcryptCompare).mockResolvedValue(undefined);
  vi.mocked(verifyPassword).mockResolvedValue(false);
  vi.mocked(envoyerCodeConnexion).mockReset();
  vi.mocked(envoyerCodeConnexion).mockResolvedValue({ etat: 'non-configure' });
  prismaMock.verificationCode.updateMany.mockResolvedValue({ count: 0 } as never);
  prismaMock.verificationCode.create.mockResolvedValue({ id: 'vc1' } as never);
});

describe('POST /api/auth/login', () => {
  it('Test 1: sans fournisseur d’e-mail — connecte directement (3 cookies)', async () => {
    // Repli assumé : sans clé d'envoi, personne ne recevrait jamais de code et
    // exiger le second facteur fermerait l'application à tout le monde. C'est
    // `anomaliesProduction` qui empêche un vrai déploiement de rester ainsi.
    prismaMock.user.findUnique.mockResolvedValue(UTILISATEUR_VALIDE as never);
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const res = await POST(makeReq({ email: 'a@b.com', password: 'longenough' }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ ok: true, user: { sub: 'u1', email: 'a@b.com' } });
    expect(body.challenge).toBeUndefined();
    expect(recordSuccess).toHaveBeenCalledWith('a@b.com');
    expect(__cookieStore.has('app-token')).toBe(true);
    expect(__cookieStore.has('app-refresh')).toBe(true);
    expect(__cookieStore.has('app-csrf')).toBe(true);
  });

  it('Test 2: no user — INVALID_CREDENTIALS, dummy compare called, no recordFailure', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await POST(makeReq({ email: 'noone@b.com', password: 'longenough' }));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('INVALID_CREDENTIALS');
    expect(dummyBcryptCompare).toHaveBeenCalledWith('longenough');
    expect(recordFailure).not.toHaveBeenCalled();
  });

  it('Test 3: wrong password — INVALID_CREDENTIALS + recordFailure called', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: '$2a$12$hashhashhashhashhashhashhashhashhashhashhashhashhashhha',
      emailVerifiedAt: new Date(),
      tokenVersion: 0,
    } as never);
    vi.mocked(verifyPassword).mockResolvedValue(false);
    vi.mocked(recordFailure).mockResolvedValue({ count: 1, locked: false });

    const res = await POST(makeReq({ email: 'a@b.com', password: 'wrong' }));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('INVALID_CREDENTIALS');
    expect(recordFailure).toHaveBeenCalledWith('a@b.com');
  });

  it('Test 4: lockout already active — 423 LOCKED_OUT, no bcrypt', async () => {
    vi.mocked(isLockedOut).mockResolvedValue(true);

    const res = await POST(makeReq({ email: 'a@b.com', password: 'whatever' }));

    expect(res.status).toBe(423);
    expect((await res.json()).error).toBe('LOCKED_OUT');
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    expect(verifyPassword).not.toHaveBeenCalled();
  });

  it('Test 5: 5th wrong password triggers lockout — 423 LOCKED_OUT', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: '$2a$12$hashhashhashhashhashhashhashhashhashhashhashhashhashhha',
      emailVerifiedAt: new Date(),
      tokenVersion: 0,
    } as never);
    vi.mocked(verifyPassword).mockResolvedValue(false);
    vi.mocked(recordFailure).mockResolvedValue({ count: 5, locked: true });

    const res = await POST(makeReq({ email: 'a@b.com', password: 'wrong' }));

    expect(res.status).toBe(423);
    expect((await res.json()).error).toBe('LOCKED_OUT');
  });

  it('Test 6: EMAIL_NOT_VERIFIED — credentials valid but emailVerifiedAt is null', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: '$2a$12$hashhashhashhashhashhashhashhashhashhashhashhashhashhha',
      emailVerifiedAt: null,
      tokenVersion: 0,
    } as never);
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const res = await POST(makeReq({ email: 'a@b.com', password: 'longenough' }));

    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe('EMAIL_NOT_VERIFIED');
    expect(recordSuccess).not.toHaveBeenCalled();
    expect(__cookieStore.has('app-token')).toBe(false);
  });

  it('Test 7: per-email rate limit — 11th attempt returns 429 TOO_MANY_LOGIN_ATTEMPTS', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    let last: Response | undefined;
    // D-08 default = 10/15m. The 11th attempt must be 429.
    for (let i = 0; i < 11; i++) {
      last = await POST(makeReq({ email: 'rl@b.com', password: 'longenough' }));
    }
    expect(last?.status).toBe(429);
    expect((await last!.json()).error).toBe('TOO_MANY_LOGIN_ATTEMPTS');
  });

  it('Test 8: VALIDATION_FAILED — missing password', async () => {
    const res = await POST(makeReq({ email: 'a@b.com' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('VALIDATION_FAILED');
  });

  it('Test 9 (D-ADMIN-02): SUSPENDED user with valid credentials — 403 ACCOUNT_SUSPENDED, no cookies, recordSuccess clears counter (WR-04)', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u_susp',
      email: 'suspended@b.com',
      passwordHash: '$2a$12$hashhashhashhashhashhashhashhashhashhashhashhashhashhha',
      emailVerifiedAt: new Date(),
      tokenVersion: 0,
      status: 'SUSPENDED',
    } as never);
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const res = await POST(makeReq({ email: 'suspended@b.com', password: 'longenough' }));

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('ACCOUNT_SUSPENDED');
    expect(body.message).toMatch(/suspended/i);
    // WR-04 — recordSuccess IS called: credentials passed verifyPassword,
    // so the user is legitimate; clearing the lockout counter prevents
    // post-restore lockout (where N-1 pre-suspension failures + 1 fresh
    // failure would lock a just-restored user out on the first attempt).
    expect(recordSuccess).toHaveBeenCalledWith('suspended@b.com');
    // No cookies issued.
    expect(__cookieStore.has('app-token')).toBe(false);
    expect(__cookieStore.has('app-refresh')).toBe(false);
    expect(__cookieStore.has('app-csrf')).toBe(false);
  });
});

/**
 * Second facteur — le chemin normal dès qu'un fournisseur d'e-mail est en place.
 *
 * Ce bloc est le SEUL à redéfinir `envoyerCodeConnexion` sur « envoye ». Le
 * reste de la suite tourne sur le repli sans fournisseur, hérité de
 * `.env.test`, où la route se comporte comme avant. Sans ces tests, on pourrait
 * supprimer entièrement le second facteur sans faire rougir un seul test.
 *
 * Chaque cas prend une adresse à lui : le limiteur de débit est un module
 * partagé par tout le fichier, et dix cas sur la même adresse finiraient en 429
 * — un échec qui ne dirait rien de la route.
 */
describe('POST /api/auth/login — second facteur', () => {
  let compteur = 0;
  let adresse = '';

  beforeEach(() => {
    compteur += 1;
    adresse = `atelier${compteur}@exemple.bf`;
    prismaMock.user.findUnique.mockResolvedValue({
      ...UTILISATEUR_VALIDE,
      email: adresse,
    } as never);
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(envoyerCodeConnexion).mockResolvedValue({ etat: 'envoye' });
  });

  it('ne pose AUCUN cookie tant que le code n’est pas saisi', async () => {
    // C'est tout l'objet du dispositif : ouvrir la session ici reviendrait à
    // n'avoir qu'un seul facteur, et le code ne serait qu'une formalité.
    const res = await POST(makeReq({ email: adresse, password: 'longenough' }));

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, challenge: true, email: adresse });
    expect(__cookieStore.has('app-token')).toBe(false);
    expect(__cookieStore.has('app-refresh')).toBe(false);
    expect(__cookieStore.has('app-csrf')).toBe(false);
  });

  it('enregistre un code de type LOGIN_CHALLENGE, distinct de la vérification d’e-mail', async () => {
    // Le type est ce qui empêche un code d'inscription d'ouvrir une session.
    await POST(makeReq({ email: adresse, password: 'longenough' }));

    const data = prismaMock.verificationCode.create.mock.calls[0]?.[0]?.data;
    expect(data).toMatchObject({ userId: 'u1', type: 'LOGIN_CHALLENGE' });
    expect(data?.expiresAt).toBeInstanceOf(Date);
  });

  it('invalide les codes précédents avant d’en émettre un nouveau', async () => {
    // Sans cela, tous les codes demandés dans la journée resteraient valables
    // en parallèle et la fenêtre d'attaque grandirait à chaque tentative.
    await POST(makeReq({ email: adresse, password: 'longenough' }));

    expect(prismaMock.verificationCode.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'u1', type: 'LOGIN_CHALLENGE', usedAt: null },
      }),
    );
  });

  it('envoie le code à l’adresse du compte, telle qu’elle est en base', async () => {
    // L'adresse à joindre vient de la ligne en base, pas de la saisie : c'est
    // elle qui fait autorité sur la boîte du compte.
    await POST(makeReq({ email: adresse, password: 'longenough' }));

    expect(envoyerCodeConnexion).toHaveBeenCalledWith(
      expect.objectContaining({ to: adresse, code: expect.any(String) }),
    );
  });

  it('ne renvoie jamais le code dans la réponse', async () => {
    // Il serait lisible par tout ce qui observe la réponse, et le second
    // facteur ne prouverait plus l'accès à la boîte.
    const res = await POST(makeReq({ email: adresse, password: 'longenough' }));

    const envoye = vi.mocked(envoyerCodeConnexion).mock.calls[0]?.[0]?.code;
    expect(envoye).toEqual(expect.any(String));
    expect(JSON.stringify(await res.json())).not.toContain(envoye);
  });

  it('502 quand l’e-mail ne part pas — plutôt que d’attendre un code qui ne viendra pas', async () => {
    vi.mocked(envoyerCodeConnexion).mockResolvedValue({ etat: 'echec' });

    const res = await POST(makeReq({ email: adresse, password: 'longenough' }));

    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe('LOGIN_CODE_NOT_SENT');
    expect(__cookieStore.has('app-token')).toBe(false);
  });

  it('un mot de passe faux n’émet aucun code', async () => {
    // Sinon n'importe qui ferait pleuvoir des e-mails sur l'adresse d'un
    // atelier en tapant n'importe quoi.
    vi.mocked(verifyPassword).mockResolvedValue(false);

    await POST(makeReq({ email: adresse, password: 'mauvais' }));

    expect(envoyerCodeConnexion).not.toHaveBeenCalled();
    expect(prismaMock.verificationCode.create).not.toHaveBeenCalled();
  });

  it('un e-mail non vérifié n’émet aucun code', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...UTILISATEUR_VALIDE,
      email: adresse,
      emailVerifiedAt: null,
    } as never);

    const res = await POST(makeReq({ email: adresse, password: 'longenough' }));

    expect(res.status).toBe(403);
    expect(envoyerCodeConnexion).not.toHaveBeenCalled();
  });

  it('un compte suspendu n’émet aucun code', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...UTILISATEUR_VALIDE,
      email: adresse,
      status: 'SUSPENDED',
    } as never);

    const res = await POST(makeReq({ email: adresse, password: 'longenough' }));

    expect(res.status).toBe(403);
    expect(envoyerCodeConnexion).not.toHaveBeenCalled();
    expect(prismaMock.verificationCode.create).not.toHaveBeenCalled();
  });
});
