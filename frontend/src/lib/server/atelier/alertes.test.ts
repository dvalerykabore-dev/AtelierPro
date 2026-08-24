import { describe, expect, it, vi, beforeEach } from 'vitest';
import { signalerEcheances, jourUtc } from './alertes';

vi.mock('@/lib/server/notifications', () => ({
  createNotification: vi.fn(),
}));

import { createNotification } from '@/lib/server/notifications';

const mockCreate = vi.mocked(createNotification);

/** Le 24 août 2026 à 6h UTC — l'heure de passage du cron. */
const MAINTENANT = new Date('2026-08-24T06:00:00.000Z');

function commande(partiel: Record<string, unknown> = {}) {
  return {
    id: 'cmd-1',
    userId: 'user-1',
    sequence: 7,
    garment: 'Robe wax cérémonie',
    status: 'IN_PROGRESS',
    dueDate: new Date('2026-08-20T00:00:00.000Z'),
    customer: { name: 'Salimata Zongo' },
    ...partiel,
  };
}

function prismaFactice(retards: unknown[], livraisons: unknown[]) {
  const findMany = vi.fn().mockResolvedValueOnce(retards).mockResolvedValueOnce(livraisons);
  const updateMany = vi.fn().mockResolvedValue({ count: 1 });
  return {
    prisma: { tailoringOrder: { findMany, updateMany } } as never,
    findMany,
    updateMany,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Par défaut, chaque notification est neuve.
  mockCreate.mockResolvedValue({ id: 'notif-1' } as never);
});

describe('jourUtc', () => {
  it('ramène un instant à minuit UTC', () => {
    expect(jourUtc(new Date('2026-08-24T23:45:00.000Z')).toISOString()).toBe(
      '2026-08-24T00:00:00.000Z',
    );
  });
});

describe('signalerEcheances — retards', () => {
  it('ne cherche que les commandes échues avant aujourd’hui', async () => {
    // Une commande due aujourd'hui n'est pas en retard, elle est due.
    const { prisma, findMany } = prismaFactice([], []);
    await signalerEcheances({ prisma, maintenant: MAINTENANT });

    const where = findMany.mock.calls[0]?.[0]?.where;
    expect(where.dueDate.lt.toISOString()).toBe('2026-08-24T00:00:00.000Z');
    expect(where.status.in).not.toContain('DELIVERED');
  });

  it('émet une alerte et bascule la commande en LATE', async () => {
    const { prisma, updateMany } = prismaFactice([commande()], []);
    const res = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(res.retards).toBe(1);
    expect(res.marqueesEnRetard).toBe(1);
    expect(updateMany).toHaveBeenCalledTimes(1);
    expect(updateMany.mock.calls[0]?.[0]?.data).toEqual({ status: 'LATE' });
  });

  it('ne rebascule pas une commande déjà LATE', async () => {
    const { prisma, updateMany } = prismaFactice([commande({ status: 'LATE' })], []);
    const res = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(updateMany).not.toHaveBeenCalled();
    expect(res.marqueesEnRetard).toBe(0);
    // L'alerte du jour part quand même : la commande est toujours en retard.
    expect(res.retards).toBe(1);
  });

  it('date la clé de déduplication au jour, pas au passage', async () => {
    const { prisma } = prismaFactice([commande()], []);
    await signalerEcheances({ prisma, maintenant: MAINTENANT });

    const input = mockCreate.mock.calls[0]?.[1];
    expect(input?.dedupeKey).toBe('commande-retard:cmd-1:2026-08-24');
    expect(input?.type).toBe('COMMANDE_EN_RETARD');
    expect(input?.userId).toBe('user-1');
  });

  it('porte commandeId pour que l’écran sache où mener', async () => {
    const { prisma } = prismaFactice([commande()], []);
    await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(mockCreate.mock.calls[0]?.[1]?.data).toMatchObject({ commandeId: 'cmd-1' });
  });

  it('ne compte pas une alerte déjà envoyée', async () => {
    // `createNotification` rend null sur collision de dedupeKey.
    mockCreate.mockResolvedValue(null as never);
    const { prisma } = prismaFactice([commande()], []);
    const res = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(res.retards).toBe(0);
  });
});

describe('signalerEcheances — livraisons du lendemain', () => {
  it('borne la fenêtre sur la seule journée de demain', async () => {
    const { prisma, findMany } = prismaFactice([], []);
    await signalerEcheances({ prisma, maintenant: MAINTENANT });

    const where = findMany.mock.calls[1]?.[0]?.where;
    expect(where.dueDate.gte.toISOString()).toBe('2026-08-25T00:00:00.000Z');
    expect(where.dueDate.lt.toISOString()).toBe('2026-08-26T00:00:00.000Z');
  });

  it('émet une alerte sans toucher au statut', async () => {
    const { prisma, updateMany } = prismaFactice([], [commande({ id: 'cmd-2' })]);
    const res = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(res.livraisons).toBe(1);
    expect(updateMany).not.toHaveBeenCalled();
    expect(mockCreate.mock.calls[0]?.[1]?.type).toBe('LIVRAISON_DEMAIN');
    expect(mockCreate.mock.calls[0]?.[1]?.dedupeKey).toBe('livraison-demain:cmd-2:2026-08-24');
  });
});

describe('signalerEcheances — passage à vide', () => {
  it('ne crée rien quand aucune échéance ne tombe', async () => {
    const { prisma, updateMany } = prismaFactice([], []);
    const res = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(res).toEqual({ retards: 0, livraisons: 0, marqueesEnRetard: 0 });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(updateMany).not.toHaveBeenCalled();
  });
});
