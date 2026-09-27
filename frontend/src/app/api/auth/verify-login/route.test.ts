// POST /api/auth/verify-login — la route qui ouvre réellement la session.
//
// `/api/auth/login` valide le mot de passe et envoie un code sans rien poser ;
// c'est ici que les cookies apparaissent. Tout ce qui laisserait passer sans
// code valide annulerait le second facteur entier.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '@/test-utils/prisma-mock';
import { mockNextCookies, __cookieStore } from '@/test-utils/mock-cookies';
import { NextRequest } from 'next/server';

mockNextCookies();

vi.mock('@/lib/server/auth/login-challenge', async () => {
  const actual = await vi.importActual<typeof import('@/lib/server/auth/login-challenge')>(
    '@/lib/server/auth/login-challenge',
  );
  return { ...actual, consommerDefi: vi.fn() };
});

import { consommerDefi } from '@/lib/server/auth/login-challenge';
import { POST } from './route';

const CODE = 'ABCD2345';
let compteur = 0;
let adresse = '';

function makeReq(corps: unknown): NextRequest {
  return new NextRequest('https://test/api/auth/verify-login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(corps),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  __cookieStore.clear();
  // Une adresse par cas : le limiteur de débit est partagé par tout le fichier.
  compteur += 1;
  adresse = `atelier${compteur}@exemple.bf`;
  prismaMock.user.findUnique.mockResolvedValue({
    id: 'u1',
    email: adresse,
    tokenVersion: 0,
    status: 'ACTIVE',
  } as never);
  vi.mocked(consommerDefi).mockResolvedValue({ ok: true });
});

describe('POST /api/auth/verify-login — succès', () => {
  it('pose les trois cookies et rend l’utilisateur', async () => {
    const res = await POST(makeReq({ email: adresse, code: CODE }));

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, user: { sub: 'u1', email: adresse } });
    expect(__cookieStore.has('app-token')).toBe(true);
    expect(__cookieStore.has('app-refresh')).toBe(true);
    expect(__cookieStore.has('app-csrf')).toBe(true);
  });

  it('consomme le code au nom de l’utilisateur trouvé', async () => {
    await POST(makeReq({ email: adresse, code: CODE }));
    expect(consommerDefi).toHaveBeenCalledWith(expect.anything(), 'u1', CODE);
  });
});

describe('POST /api/auth/verify-login — refus', () => {
  it('refuse un code invalide, sans cookie', async () => {
    vi.mocked(consommerDefi).mockResolvedValue({ ok: false, motif: 'INVALIDE' });

    const res = await POST(makeReq({ email: adresse, code: CODE }));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('LOGIN_CODE_INVALID');
    expect(__cookieStore.has('app-token')).toBe(false);
  });

  it('distingue un code expiré — l’écran doit dire d’en redemander un', async () => {
    vi.mocked(consommerDefi).mockResolvedValue({ ok: false, motif: 'EXPIRE' });

    const res = await POST(makeReq({ email: adresse, code: CODE }));

    expect((await res.json()).error).toBe('LOGIN_CODE_EXPIRED');
    expect(__cookieStore.has('app-token')).toBe(false);
  });

  it('distingue un code brûlé par trop d’essais', async () => {
    vi.mocked(consommerDefi).mockResolvedValue({ ok: false, motif: 'TROP_DE_TENTATIVES' });

    const res = await POST(makeReq({ email: adresse, code: CODE }));

    expect((await res.json()).error).toBe('LOGIN_CODE_BURNED');
    expect(__cookieStore.has('app-token')).toBe(false);
  });

  it('répond comme un code faux quand l’adresse est inconnue', async () => {
    // Distinguer dirait à qui essaie qu'une adresse existe, et que le mot de
    // passe associé a déjà été deviné — deux renseignements de trop.
    prismaMock.user.findUnique.mockResolvedValue(null as never);

    const res = await POST(makeReq({ email: adresse, code: CODE }));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('LOGIN_CODE_INVALID');
    expect(consommerDefi).not.toHaveBeenCalled();
  });

  it('refuse un compte suspendu entre les deux étapes', async () => {
    // La suspension peut tomber après la saisie du mot de passe. Sans ce
    // contrôle, le code déjà envoyé ouvrirait quand même la session.
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: adresse,
      tokenVersion: 0,
      status: 'SUSPENDED',
    } as never);

    const res = await POST(makeReq({ email: adresse, code: CODE }));

    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe('ACCOUNT_SUSPENDED');
    expect(__cookieStore.has('app-token')).toBe(false);
  });

  it('rejette un code mal formé sans toucher à la base', async () => {
    const res = await POST(makeReq({ email: adresse, code: 'trop-court' }));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('VALIDATION_FAILED');
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it('rejette un corps qui n’est pas du JSON', async () => {
    const req = new NextRequest('https://test/api/auth/verify-login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'pas du json',
    });

    expect((await POST(req)).status).toBe(400);
  });
});
