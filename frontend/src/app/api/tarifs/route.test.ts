// GET / POST /api/tarifs — la grille tarifaire appartient enfin à l'atelier.
//
// Elle était une constante partagée : tous les ateliers facturaient les mêmes
// prix, et toute modification disparaissait au rechargement — y compris celles
// déjà utilisées pour chiffrer une commande.
import { prismaMock } from '@/test-utils/prisma-mock';
import { mockNextCookies, __cookieStore } from '@/test-utils/mock-cookies';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

mockNextCookies();

vi.mock('@/lib/server/middleware', () => ({ requireAuth: vi.fn() }));

import { requireAuth } from '@/lib/server/middleware';
import { GET, POST } from './route';

const mockRequireAuth = vi.mocked(requireAuth);
const authedCtx = { user: { sub: 'user-1', email: 'atelier@example.com' } };
const CSRF = 'jeton-csrf';

function makeReq(methode: 'GET' | 'POST', corps?: unknown, options: { csrf?: boolean } = {}) {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    cookie: 'app-csrf=' + CSRF,
  };
  if (options.csrf !== false) headers['x-csrf-token'] = CSRF;
  return new NextRequest('http://test/api/tarifs', {
    method: methode,
    headers,
    ...(corps === undefined ? {} : { body: JSON.stringify(corps) }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  __cookieStore.clear();
  mockRequireAuth.mockResolvedValue(authedCtx);
  prismaMock.priceItem.findMany.mockResolvedValue([] as never);
  prismaMock.priceItem.create.mockResolvedValue({
    id: 'tar-1',
    garment: 'Boubou bazin brodé',
    price: 35_000,
    unit: 'façon',
  } as never);
});

describe('GET /api/tarifs', () => {
  it('ne rend que la grille de l’atelier connecté', async () => {
    // Sans ce filtre, un atelier verrait — et facturerait — les prix d’un autre.
    await GET(makeReq('GET'));
    expect(prismaMock.priceItem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-1' } }),
    );
  });

  it('trie par tenue : la grille se lit, elle ne se fouille pas', async () => {
    await GET(makeReq('GET'));
    expect(prismaMock.priceItem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { garment: 'asc' } }),
    );
  });

  it('renvoie 401 sans session', async () => {
    mockRequireAuth.mockResolvedValueOnce(NextResponse.json({ error: 'x' }, { status: 401 }));
    expect((await GET(makeReq('GET'))).status).toBe(401);
  });
});

describe('POST /api/tarifs', () => {
  const VALIDE = { garment: 'Boubou bazin brodé', price: 35_000 };

  it('refuse sans en-tête CSRF', async () => {
    const res = await POST(makeReq('POST', VALIDE, { csrf: false }));
    expect(res.status).toBe(403);
    expect(prismaMock.priceItem.create).not.toHaveBeenCalled();
  });

  it('renvoie 401 sans session', async () => {
    mockRequireAuth.mockResolvedValueOnce(NextResponse.json({ error: 'x' }, { status: 401 }));
    expect((await POST(makeReq('POST', VALIDE))).status).toBe(401);
  });

  it('enregistre le tarif pour l’atelier connecté', async () => {
    const res = await POST(makeReq('POST', VALIDE));
    expect(res.status).toBe(201);
    expect(prismaMock.priceItem.create.mock.calls[0]?.[0]?.data).toEqual(
      expect.objectContaining({ userId: 'user-1', garment: 'Boubou bazin brodé', price: 35_000 }),
    );
  });

  it('applique « façon » par défaut', async () => {
    // C’est le cas courant : le client apporte son tissu. Laisser l’unité vide
    // rendrait la grille ambiguë au moment de facturer.
    await POST(makeReq('POST', VALIDE));
    expect(prismaMock.priceItem.create.mock.calls[0]?.[0]?.data).not.toHaveProperty('unit');
  });

  it('accepte « tout compris » et refuse le reste', async () => {
    await POST(makeReq('POST', { ...VALIDE, unit: 'tout compris' }));
    expect(prismaMock.priceItem.create.mock.calls[0]?.[0]?.data.unit).toBe('tout compris');

    const res = await POST(makeReq('POST', { ...VALIDE, unit: 'au kilo' }));
    expect(res.status).toBe(400);
  });

  it('refuse un prix à décimales', async () => {
    // Le franc CFA n’en a pas — invariant du CLAUDE.md.
    const res = await POST(makeReq('POST', { ...VALIDE, price: 35_000.5 }));
    expect(res.status).toBe(400);
    expect(prismaMock.priceItem.create).not.toHaveBeenCalled();
  });

  it('refuse un prix négatif et une tenue vide', async () => {
    expect((await POST(makeReq('POST', { ...VALIDE, price: -1 }))).status).toBe(400);
    expect((await POST(makeReq('POST', { ...VALIDE, garment: '   ' }))).status).toBe(400);
  });

  it('rend 409 sur un doublon plutôt qu’une erreur serveur', async () => {
    // Deux lignes au même nom rendraient le choix ambigu dans le formulaire de
    // commande — d’où la contrainte, et un code que l’écran sait traduire.
    prismaMock.priceItem.create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('doublon', {
        code: 'P2002',
        clientVersion: '5.22.0',
      }),
    );
    const res = await POST(makeReq('POST', VALIDE));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('TARIF_ALREADY_EXISTS');
  });

  it('rejette un corps qui n’est pas du JSON', async () => {
    const req = new NextRequest('http://test/api/tarifs', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: 'app-csrf=' + CSRF,
        'x-csrf-token': CSRF,
      },
      body: 'pas du json',
    });
    expect((await POST(req)).status).toBe(400);
  });
});
