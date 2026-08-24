// PATCH /api/commandes/[id] — avancement du statut d'une commande de couture.
import { prismaMock } from '@/test-utils/prisma-mock';
import { mockNextCookies, __cookieStore } from '@/test-utils/mock-cookies';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';

mockNextCookies();

vi.mock('@/lib/server/middleware', () => ({
  requireAuth: vi.fn(),
}));

import { requireAuth } from '@/lib/server/middleware';
import { PATCH } from './route';

const mockRequireAuth = vi.mocked(requireAuth);
const authedCtx = { user: { sub: 'user-1', email: 'atelier@example.com' } };

const CSRF = 'jeton-csrf';

function makePatch(corps: unknown, options: { csrf?: boolean } = {}): NextRequest {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    cookie: 'app-csrf=' + CSRF,
  };
  if (options.csrf !== false) headers['x-csrf-token'] = CSRF;
  return new NextRequest('http://test/api/commandes/cmd-1', {
    method: 'PATCH',
    headers,
    body: JSON.stringify(corps),
  });
}

const params = Promise.resolve({ id: 'cmd-1' });

beforeEach(() => {
  vi.clearAllMocks();
  __cookieStore.clear();
  mockRequireAuth.mockResolvedValue(authedCtx);
});

describe('PATCH /api/commandes/[id]', () => {
  it('Test 1 : refuse une requête sans en-tête CSRF', async () => {
    const res = await PATCH(makePatch({ status: 'FITTING' }, { csrf: false }), { params });
    expect(res.status).toBe(403);
    expect(prismaMock.tailoringOrder.update).not.toHaveBeenCalled();
  });

  it('Test 2 : renvoie 401 quand requireAuth refuse', async () => {
    mockRequireAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing token' }, { status: 401 }),
    );
    const res = await PATCH(makePatch({ status: 'FITTING' }), { params });
    expect(res.status).toBe(401);
    expect(prismaMock.tailoringOrder.update).not.toHaveBeenCalled();
  });

  it('Test 3 : rejette un statut hors du domaine', async () => {
    const res = await PATCH(makePatch({ status: 'TERMINEE' }), { params });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('VALIDATION_FAILED');
    expect(prismaMock.tailoringOrder.findFirst).not.toHaveBeenCalled();
  });

  it('Test 4 : rejette un corps vide', async () => {
    const res = await PATCH(makePatch({}), { params });
    expect(res.status).toBe(400);
  });

  it('Test 5 : la commande d’un autre atelier répond 404, pas 403', async () => {
    // Un 403 confirmerait son existence.
    prismaMock.tailoringOrder.findFirst.mockResolvedValue(null as never);
    const res = await PATCH(makePatch({ status: 'FITTING' }), { params });
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe('ORDER_NOT_FOUND');
    expect(prismaMock.tailoringOrder.update).not.toHaveBeenCalled();
  });

  it('Test 6 : la lecture est toujours filtrée sur l’atelier connecté', async () => {
    prismaMock.tailoringOrder.findFirst.mockResolvedValue({
      id: 'cmd-1',
      status: 'IN_PROGRESS',
    } as never);
    prismaMock.tailoringOrder.update.mockResolvedValue({ id: 'cmd-1' } as never);
    await PATCH(makePatch({ status: 'FITTING' }), { params });
    const args = prismaMock.tailoringOrder.findFirst.mock.calls[0]?.[0];
    expect(args?.where?.userId).toBe('user-1');
    expect(args?.where?.id).toBe('cmd-1');
  });

  it('Test 7 : écrit le nouveau statut et renvoie la commande', async () => {
    prismaMock.tailoringOrder.findFirst.mockResolvedValue({
      id: 'cmd-1',
      status: 'IN_PROGRESS',
    } as never);
    prismaMock.tailoringOrder.update.mockResolvedValue({
      id: 'cmd-1',
      status: 'FITTING',
    } as never);

    const res = await PATCH(makePatch({ status: 'FITTING' }), { params });
    expect(res.status).toBe(200);
    expect((await res.json()).commande.status).toBe('FITTING');
    const args = prismaMock.tailoringOrder.update.mock.calls[0]?.[0];
    expect(args?.data?.status).toBe('FITTING');
  });

  it('Test 8 : pose deliveredAt en passant à DELIVERED', async () => {
    prismaMock.tailoringOrder.findFirst.mockResolvedValue({
      id: 'cmd-1',
      status: 'DELIVERY',
    } as never);
    prismaMock.tailoringOrder.update.mockResolvedValue({ id: 'cmd-1' } as never);

    await PATCH(makePatch({ status: 'DELIVERED' }), { params });
    const args = prismaMock.tailoringOrder.update.mock.calls[0]?.[0];
    expect(args?.data?.deliveredAt).toBeInstanceOf(Date);
  });

  it('Test 9 : efface deliveredAt quand on sort de DELIVERED', async () => {
    // Correction d'erreur : sans cet effacement, les rapports compteraient une
    // livraison qui n'a pas eu lieu.
    prismaMock.tailoringOrder.findFirst.mockResolvedValue({
      id: 'cmd-1',
      status: 'DELIVERED',
    } as never);
    prismaMock.tailoringOrder.update.mockResolvedValue({ id: 'cmd-1' } as never);

    await PATCH(makePatch({ status: 'DELIVERY' }), { params });
    const args = prismaMock.tailoringOrder.update.mock.calls[0]?.[0];
    expect(args?.data?.deliveredAt).toBeNull();
  });

  it('Test 10 : la réponse porte x-request-id', async () => {
    prismaMock.tailoringOrder.findFirst.mockResolvedValue({
      id: 'cmd-1',
      status: 'IN_PROGRESS',
    } as never);
    prismaMock.tailoringOrder.update.mockResolvedValue({ id: 'cmd-1' } as never);
    const res = await PATCH(makePatch({ status: 'FITTING' }), { params });
    expect(res.headers.get('x-request-id')).toBeTruthy();
  });

  it('Test 11 : le fichier de route exporte runtime=nodejs', () => {
    const source = fs.readFileSync(path.join(__dirname, 'route.ts'), 'utf8');
    expect(source).toMatch(/export const runtime = 'nodejs'/);
  });
});
