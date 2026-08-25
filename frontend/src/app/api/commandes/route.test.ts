// POST /api/commandes — l'acompte d'une commande neuve entre en caisse.
//
// Le cœur de ces tests : `CashMovement` est la source de vérité de l'argent de
// l'atelier. Écrire `depositAmount` sans la ligne de caisse correspondante
// faisait afficher « 20 000 F encaissés » sur la fiche pendant que la
// trésorerie annonçait 0 F de recettes, sans moyen de savoir qui avait raison.
import { prismaMock } from '@/test-utils/prisma-mock';
import { mockNextCookies, __cookieStore } from '@/test-utils/mock-cookies';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

mockNextCookies();

vi.mock('@/lib/server/middleware', () => ({
  requireAuth: vi.fn(),
}));

import { requireAuth } from '@/lib/server/middleware';
import { POST } from './route';

const mockRequireAuth = vi.mocked(requireAuth);
const authedCtx = { user: { sub: 'user-1', email: 'atelier@example.com' } };
const CSRF = 'jeton-csrf';

const COMMANDE_VALIDE = {
  customerId: 'cli-1',
  garment: 'Boubou brodé',
  priceAmount: 80_000,
  depositAmount: 20_000,
};

function makePost(corps: unknown, options: { csrf?: boolean } = {}): NextRequest {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    cookie: 'app-csrf=' + CSRF,
  };
  if (options.csrf !== false) headers['x-csrf-token'] = CSRF;
  return new NextRequest('http://test/api/commandes', {
    method: 'POST',
    headers,
    body: JSON.stringify(corps),
  });
}

/** Commande telle que la rend `select: SELECTION`. */
const commandeRendue = { id: 'cmd-1', sequence: 12, priceAmount: 80_000, depositAmount: 20_000 };

beforeEach(() => {
  vi.clearAllMocks();
  __cookieStore.clear();
  mockRequireAuth.mockResolvedValue(authedCtx);

  // Le client appartient bien à l'atelier.
  prismaMock.customer.findFirst.mockResolvedValue({ id: 'cli-1' } as never);
  // Aucune commande antérieure : la numérotation démarre à 1.
  prismaMock.tailoringOrder.findFirst.mockResolvedValue(null as never);
  prismaMock.tailoringOrder.create.mockResolvedValue({ id: 'cmd-1', sequence: 12 } as never);
  prismaMock.tailoringOrder.findUniqueOrThrow.mockResolvedValue(commandeRendue as never);
  prismaMock.tailoringOrder.update.mockResolvedValue(commandeRendue as never);
  prismaMock.cashMovement.create.mockResolvedValue({ id: 'mv-1' } as never);
  prismaMock.cashMovement.aggregate.mockResolvedValue({ _sum: { amount: 20_000 } } as never);
  prismaMock.$transaction.mockImplementation((cb: unknown) => {
    if (typeof cb === 'function') {
      return (cb as (tx: typeof prismaMock) => unknown)(prismaMock) as Promise<unknown>;
    }
    return Promise.resolve(cb);
  });
});

describe('POST /api/commandes — garde-fous', () => {
  it('refuse une requête sans en-tête CSRF', async () => {
    const res = await POST(makePost(COMMANDE_VALIDE, { csrf: false }));
    expect(res.status).toBe(403);
    expect(prismaMock.tailoringOrder.create).not.toHaveBeenCalled();
  });

  it('renvoie 401 quand requireAuth refuse', async () => {
    mockRequireAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing token' }, { status: 401 }),
    );
    const res = await POST(makePost(COMMANDE_VALIDE));
    expect(res.status).toBe(401);
    expect(prismaMock.cashMovement.create).not.toHaveBeenCalled();
  });

  it('refuse un client qui n’appartient pas à l’atelier', async () => {
    prismaMock.customer.findFirst.mockResolvedValueOnce(null as never);
    const res = await POST(makePost(COMMANDE_VALIDE));
    expect(res.status).toBe(404);
    expect(prismaMock.cashMovement.create).not.toHaveBeenCalled();
  });

  it('refuse un acompte supérieur au prix, sans rien écrire', async () => {
    const res = await POST(makePost({ ...COMMANDE_VALIDE, depositAmount: 100_000 }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('DEPOSIT_EXCEEDS_PRICE');
    expect(prismaMock.cashMovement.create).not.toHaveBeenCalled();
  });
});

describe('POST /api/commandes — l’acompte entre en caisse', () => {
  it('écrit une entrée de caisse rattachée à la commande', async () => {
    const res = await POST(makePost(COMMANDE_VALIDE));
    expect(res.status).toBe(201);

    expect(prismaMock.cashMovement.create).toHaveBeenCalledTimes(1);
    const data = prismaMock.cashMovement.create.mock.calls[0]?.[0]?.data;
    expect(data).toEqual(
      expect.objectContaining({
        userId: 'user-1',
        direction: 'IN',
        amount: 20_000,
        tailoringOrderId: 'cmd-1',
      }),
    );
  });

  it('ne pose jamais depositAmount à la création — recalerAcompte s’en charge', async () => {
    // C'est l'invariant : un seul chemin vers ce champ. Deux écritures
    // concurrentes finiraient par diverger, sans arbitre pour trancher.
    await POST(makePost(COMMANDE_VALIDE));
    const data = prismaMock.tailoringOrder.create.mock.calls[0]?.[0]?.data;
    expect(data).not.toHaveProperty('depositAmount');
    // recalerAcompte agrège les entrées puis met le champ à jour.
    expect(prismaMock.cashMovement.aggregate).toHaveBeenCalledTimes(1);
    expect(prismaMock.tailoringOrder.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { depositAmount: 20_000 } }),
    );
  });

  it('date le mouvement du jour, sans composante horaire', async () => {
    // `occurredAt` est un jour, pas un instant : un acompte pris le 31 à 23 h
    // basculerait au mois suivant selon le fuseau.
    await POST(makePost(COMMANDE_VALIDE));
    const occurredAt = prismaMock.cashMovement.create.mock.calls[0]?.[0]?.data
      .occurredAt as unknown as Date;
    expect(occurredAt).toBeInstanceOf(Date);
    expect(occurredAt.toISOString().endsWith('T00:00:00.000Z')).toBe(true);
  });

  it('laisse category nul : une recette a une commande pour origine, pas un poste', async () => {
    await POST(makePost(COMMANDE_VALIDE));
    const data = prismaMock.cashMovement.create.mock.calls[0]?.[0]?.data;
    expect(data).not.toHaveProperty('category');
  });

  it('porte le numéro de commande dans le libellé', async () => {
    await POST(makePost(COMMANDE_VALIDE));
    const data = prismaMock.cashMovement.create.mock.calls[0]?.[0]?.data;
    expect(data?.label).toBe('Acompte commande #012');
  });

  it('retient le mode de règlement demandé', async () => {
    await POST(makePost({ ...COMMANDE_VALIDE, depositMethod: 'MOBILE_MONEY' }));
    expect(prismaMock.cashMovement.create.mock.calls[0]?.[0]?.data.method).toBe('MOBILE_MONEY');
  });

  it('retombe sur les espèces quand le mode n’est pas précisé', async () => {
    await POST(makePost(COMMANDE_VALIDE));
    expect(prismaMock.cashMovement.create.mock.calls[0]?.[0]?.data.method).toBe('ESPECES');
  });

  it('refuse un mode de règlement inconnu', async () => {
    const res = await POST(makePost({ ...COMMANDE_VALIDE, depositMethod: 'BITCOIN' }));
    expect(res.status).toBe(400);
    expect(prismaMock.cashMovement.create).not.toHaveBeenCalled();
  });
});

describe('POST /api/commandes — sans acompte', () => {
  it('n’écrit aucune ligne de caisse pour un acompte nul', async () => {
    // Une ligne à 0 F encombrerait le journal sans rien apprendre.
    const res = await POST(makePost({ ...COMMANDE_VALIDE, depositAmount: 0 }));
    expect(res.status).toBe(201);
    expect(prismaMock.cashMovement.create).not.toHaveBeenCalled();
    expect(prismaMock.tailoringOrder.update).not.toHaveBeenCalled();
  });

  it('n’écrit rien non plus quand le champ est absent', async () => {
    const sansAcompte = {
      customerId: COMMANDE_VALIDE.customerId,
      garment: COMMANDE_VALIDE.garment,
      priceAmount: COMMANDE_VALIDE.priceAmount,
    };
    const res = await POST(makePost(sansAcompte));
    expect(res.status).toBe(201);
    expect(prismaMock.cashMovement.create).not.toHaveBeenCalled();
  });
});

describe('POST /api/commandes — atomicité', () => {
  it('crée la commande et son encaissement dans une seule transaction', async () => {
    // Hors transaction, une collision de numéro laisserait un encaissement
    // orphelin : de l'argent en caisse sans commande pour l'expliquer.
    await POST(makePost(COMMANDE_VALIDE));
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });
});
