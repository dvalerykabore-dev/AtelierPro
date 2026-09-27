// GET / POST /api/commandes/[id]/notes — les notes survivent au rechargement.
//
// Elles vivaient dans l'état du composant : un artisan écrivait « manches plus
// courtes », fermait l'onglet, et l'information n'existait plus — après que le
// formulaire eut confirmé l'enregistrement.
import { prismaMock } from '@/test-utils/prisma-mock';
import { mockNextCookies, __cookieStore } from '@/test-utils/mock-cookies';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

mockNextCookies();

vi.mock('@/lib/server/middleware', () => ({ requireAuth: vi.fn() }));

import { requireAuth } from '@/lib/server/middleware';
import { GET, POST } from './route';

const mockRequireAuth = vi.mocked(requireAuth);
const authedCtx = { user: { sub: 'user-1', email: 'moussa@atelier.bf' } };
const CSRF = 'jeton-csrf';
const params = Promise.resolve({ id: 'cmd-1' });

function makeReq(methode: 'GET' | 'POST', corps?: unknown, options: { csrf?: boolean } = {}) {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    cookie: 'app-csrf=' + CSRF,
  };
  if (options.csrf !== false) headers['x-csrf-token'] = CSRF;
  return new NextRequest('http://test/api/commandes/cmd-1/notes', {
    method: methode,
    headers,
    ...(corps === undefined ? {} : { body: JSON.stringify(corps) }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  __cookieStore.clear();
  mockRequireAuth.mockResolvedValue(authedCtx);
  prismaMock.tailoringOrder.findFirst.mockResolvedValue({ id: 'cmd-1' } as never);
  prismaMock.orderNote.findMany.mockResolvedValue([] as never);
  prismaMock.user.findUnique.mockResolvedValue({
    workshopName: 'Atelier Koné',
    email: 'moussa@atelier.bf',
  } as never);
  prismaMock.orderNote.create.mockResolvedValue({
    id: 'note-1',
    author: 'Atelier Koné',
    body: 'Manches plus courtes',
    createdAt: new Date('2026-08-25T09:00:00Z'),
  } as never);
});

describe('appartenance de la commande', () => {
  it('renvoie 404 — et non 403 — pour la commande d’un autre atelier', async () => {
    // Dire « interdit » confirmerait que la commande existe, ce qu’un atelier
    // n’a pas à apprendre sur un autre.
    prismaMock.tailoringOrder.findFirst.mockResolvedValue(null as never);
    expect((await GET(makeReq('GET'), { params })).status).toBe(404);
    const res = await POST(makeReq('POST', { body: 'x' }), { params });
    expect(res.status).toBe(404);
    expect(prismaMock.orderNote.create).not.toHaveBeenCalled();
  });

  it('filtre la commande sur l’atelier connecté', async () => {
    await GET(makeReq('GET'), { params });
    expect(prismaMock.tailoringOrder.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'cmd-1', userId: 'user-1' } }),
    );
  });
});

describe('GET', () => {
  it('rend la plus récente en tête', async () => {
    // Sur une commande en cours, c’est la dernière consigne qui vaut.
    await GET(makeReq('GET'), { params });
    expect(prismaMock.orderNote.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
    );
  });

  it('renvoie 401 sans session', async () => {
    mockRequireAuth.mockResolvedValueOnce(NextResponse.json({ error: 'x' }, { status: 401 }));
    expect((await GET(makeReq('GET'), { params })).status).toBe(401);
  });
});

describe('POST', () => {
  it('refuse sans en-tête CSRF', async () => {
    const res = await POST(makeReq('POST', { body: 'x' }, { csrf: false }), { params });
    expect(res.status).toBe(403);
    expect(prismaMock.orderNote.create).not.toHaveBeenCalled();
  });

  it('écrit la note et la rattache à la commande', async () => {
    const res = await POST(makeReq('POST', { body: 'Manches plus courtes' }), { params });
    expect(res.status).toBe(201);
    expect(prismaMock.orderNote.create.mock.calls[0]?.[0]?.data).toEqual(
      expect.objectContaining({
        userId: 'user-1',
        tailoringOrderId: 'cmd-1',
        body: 'Manches plus courtes',
      }),
    );
  });

  it('signe du nom de l’atelier', async () => {
    await POST(makeReq('POST', { body: 'x' }), { params });
    expect(prismaMock.orderNote.create.mock.calls[0]?.[0]?.data.author).toBe('Atelier Koné');
  });

  it('à défaut de nom, ne signe jamais de l’adresse entière', async () => {
    // Une adresse e-mail en pied de note s’exposerait à qui regarde par-dessus
    // l’épaule, en atelier.
    prismaMock.user.findUnique.mockResolvedValue({
      workshopName: null,
      email: 'moussa@atelier.bf',
    } as never);
    await POST(makeReq('POST', { body: 'x' }), { params });
    const auteur = prismaMock.orderNote.create.mock.calls[0]?.[0]?.data.author as string;
    expect(auteur).toBe('moussa');
    expect(auteur).not.toContain('@');
  });

  it('fige l’auteur : renommer l’atelier ne réattribue pas les anciennes notes', async () => {
    // L’auteur est une chaîne écrite une fois, pas une jointure vers le compte.
    await POST(makeReq('POST', { body: 'x' }), { params });
    const data = prismaMock.orderNote.create.mock.calls[0]?.[0]?.data;
    expect(typeof data?.author).toBe('string');
    expect(data).not.toHaveProperty('authorId');
  });

  it('refuse une note vide ou faite d’espaces', async () => {
    expect((await POST(makeReq('POST', { body: '' }), { params })).status).toBe(400);
    expect((await POST(makeReq('POST', { body: '    ' }), { params })).status).toBe(400);
    expect(prismaMock.orderNote.create).not.toHaveBeenCalled();
  });

  it('refuse au-delà de 2000 caractères', async () => {
    const res = await POST(makeReq('POST', { body: 'a'.repeat(2001) }), { params });
    expect(res.status).toBe(400);
  });
});
