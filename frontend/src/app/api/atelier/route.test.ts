// PATCH /api/atelier — nom commercial de l'atelier connecté.
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
  return new NextRequest('http://test/api/atelier', {
    method: 'PATCH',
    headers,
    body: JSON.stringify(corps),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  __cookieStore.clear();
  mockRequireAuth.mockResolvedValue(authedCtx);
  prismaMock.user.update.mockResolvedValue({ workshopName: 'Atelier Zongo' } as never);
});

describe('PATCH /api/atelier', () => {
  it('Test 1 : refuse une requête sans en-tête CSRF', async () => {
    const res = await PATCH(makePatch({ workshopName: 'X' }, { csrf: false }));
    expect(res.status).toBe(403);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('Test 2 : renvoie 401 quand requireAuth refuse', async () => {
    mockRequireAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing token' }, { status: 401 }),
    );
    const res = await PATCH(makePatch({ workshopName: 'X' }));
    expect(res.status).toBe(401);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('Test 3 : enregistre le nom sur le compte connecté', async () => {
    const res = await PATCH(makePatch({ workshopName: 'Atelier Zongo' }));
    expect(res.status).toBe(200);
    const args = prismaMock.user.update.mock.calls[0]?.[0];
    expect(args?.where?.id).toBe('user-1');
    expect(args?.data?.workshopName).toBe('Atelier Zongo');
  });

  it('Test 4 : coupe les espaces autour du nom', async () => {
    await PATCH(makePatch({ workshopName: '  Atelier Zongo  ' }));
    expect(prismaMock.user.update.mock.calls[0]?.[0]?.data?.workshopName).toBe('Atelier Zongo');
  });

  it('Test 5 : une chaîne vide efface le nom', async () => {
    // Retrait volontaire : l'écran revient à « Mon atelier ».
    await PATCH(makePatch({ workshopName: '   ' }));
    expect(prismaMock.user.update.mock.calls[0]?.[0]?.data?.workshopName).toBeNull();
  });

  it('Test 6 : refuse un nom trop long', async () => {
    const res = await PATCH(makePatch({ workshopName: 'a'.repeat(121) }));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('Test 7 : refuse un corps sans le champ', async () => {
    const res = await PATCH(makePatch({}));
    expect(res.status).toBe(400);
  });

  it('Test 8 : la réponse porte x-request-id', async () => {
    const res = await PATCH(makePatch({ workshopName: 'X' }));
    expect(res.headers.get('x-request-id')).toBeTruthy();
  });

  it('Test 9 : le fichier de route exporte runtime=nodejs', () => {
    const source = fs.readFileSync(path.join(__dirname, 'route.ts'), 'utf8');
    expect(source).toMatch(/export const runtime = 'nodejs'/);
  });
});
