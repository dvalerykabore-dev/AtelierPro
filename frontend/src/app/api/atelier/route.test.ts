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

// La ville, l'adresse, les horaires et le logo s'affichaient en constantes
// tirées du jeu d'exemple — « Ouagadougou », « Secteur 15, rue 15.42 »,
// « 08h00 — 18h00 », un « A » sur fond or — identiques pour tous les comptes.
describe('PATCH /api/atelier — ville et adresse', () => {
  it('enregistre la ville et l’adresse sur le compte connecté', async () => {
    const res = await PATCH(makePatch({ city: 'Bobo-Dioulasso', address: 'Secteur 4, rue 4.12' }));
    expect(res.status).toBe(200);
    const data = prismaMock.user.update.mock.calls[0]?.[0]?.data;
    expect(data?.workshopCity).toBe('Bobo-Dioulasso');
    expect(data?.workshopAddress).toBe('Secteur 4, rue 4.12');
  });

  it('une chaîne vide efface la ville', async () => {
    await PATCH(makePatch({ city: '  ' }));
    expect(prismaMock.user.update.mock.calls[0]?.[0]?.data?.workshopCity).toBeNull();
  });

  it('ne touche pas au nom quand seule la ville est envoyée', async () => {
    // `exactOptionalPropertyTypes` : une clé absente doit rester absente, sinon
    // enregistrer une ville effacerait le nom de l'atelier au passage.
    await PATCH(makePatch({ city: 'Ouagadougou' }));
    const data = prismaMock.user.update.mock.calls[0]?.[0]?.data;
    expect(data).not.toHaveProperty('workshopName');
    expect(data).not.toHaveProperty('phone');
  });

  it('refuse une adresse trop longue', async () => {
    const res = await PATCH(makePatch({ address: 'a'.repeat(241) }));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });
});

describe('PATCH /api/atelier — horaires', () => {
  it('enregistre l’ouverture et la fermeture', async () => {
    const res = await PATCH(makePatch({ opensAt: '08:00', closesAt: '18:00' }));
    expect(res.status).toBe(200);
    const data = prismaMock.user.update.mock.calls[0]?.[0]?.data;
    expect(data?.workshopOpensAt).toBe('08:00');
    expect(data?.workshopClosesAt).toBe('18:00');
  });

  it('refuse une heure seule', async () => {
    // N'écrire que l'ouverture laisserait la fermeture à sa valeur précédente
    // et pourrait composer « 19h00 — 18h00 », que personne n'a demandé.
    const res = await PATCH(makePatch({ opensAt: '08:00' }));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('refuse une fermeture antérieure à l’ouverture', async () => {
    const res = await PATCH(makePatch({ opensAt: '18:00', closesAt: '08:00' }));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('refuse une heure hors format', async () => {
    const res = await PATCH(makePatch({ opensAt: '8h', closesAt: '18:00' }));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('accepte de vider les deux — c’est un retrait volontaire', async () => {
    const res = await PATCH(makePatch({ opensAt: '', closesAt: '' }));
    expect(res.status).toBe(200);
    const data = prismaMock.user.update.mock.calls[0]?.[0]?.data;
    expect(data?.workshopOpensAt).toBeNull();
    expect(data?.workshopClosesAt).toBeNull();
  });
});

describe('PATCH /api/atelier — logo', () => {
  const LOGO = 'https://res.cloudinary.com/demo/image/upload/v1/user-1/abc.png';

  it('enregistre une URL issue de l’envoi', async () => {
    const res = await PATCH(makePatch({ logoUrl: LOGO }));
    expect(res.status).toBe(200);
    expect(prismaMock.user.update.mock.calls[0]?.[0]?.data?.workshopLogoUrl).toBe(LOGO);
  });

  it('refuse une adresse extérieure au stockage', async () => {
    // Le logo est chargé par un `<img src>` sur chaque écran de l'atelier :
    // une adresse tierce verrait passer son IP à chaque affichage.
    const res = await PATCH(makePatch({ logoUrl: 'https://exemple.net/pixel.png' }));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('refuse un schéma qui ne charge pas une image distante', async () => {
    const res = await PATCH(makePatch({ logoUrl: 'javascript:alert(1)' }));
    expect(res.status).toBe(400);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it('une chaîne vide retire le logo', async () => {
    const res = await PATCH(makePatch({ logoUrl: '' }));
    expect(res.status).toBe(200);
    expect(prismaMock.user.update.mock.calls[0]?.[0]?.data?.workshopLogoUrl).toBeNull();
  });
});
