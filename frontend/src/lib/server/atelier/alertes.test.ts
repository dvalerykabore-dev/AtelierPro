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

/** Échéance largement devant nous — un abonnement qui court. */
const ECHEANCE_LOIN = new Date('2027-01-01T00:00:00.000Z');

/**
 * @param prefs Réglages de l'atelier « user-1 ». `null` = aucun réglage
 *              enregistré, ce qui vaut accord — on n'attend pas d'un artisan
 *              qu'il active ses alertes avant de les recevoir.
 * @param plan  Palier de l'atelier « user-1 ». Par défaut « essentiel », le
 *              premier qui inclut les alertes : les cas d'origine testent le
 *              comportement d'un atelier abonné, le gratuit a ses propres cas.
 */
function prismaFactice(
  retards: unknown[],
  livraisons: unknown[],
  prefs: unknown = null,
  plan = 'essentiel',
) {
  const findMany = vi.fn().mockResolvedValueOnce(retards).mockResolvedValueOnce(livraisons);
  const updateMany = vi.fn().mockResolvedValue({ count: 1 });
  const prefsFindMany = vi
    .fn()
    .mockResolvedValue(prefs === null ? [] : [{ userId: 'user-1', prefs }]);
  const userFindMany = vi
    .fn()
    .mockResolvedValue([
      { id: 'user-1', plan, planExpiresAt: plan === 'freemium' ? null : ECHEANCE_LOIN },
    ]);
  return {
    prisma: {
      tailoringOrder: { findMany, updateMany },
      notificationPreferences: { findMany: prefsFindMany },
      user: { findMany: userFindMany },
    } as never,
    findMany,
    updateMany,
    prefsFindMany,
    userFindMany,
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

describe('signalerEcheances — respect des préférences', () => {
  it("émet quand l'atelier n'a jamais rien réglé", async () => {
    // Absence de ligne vaut accord : on n'attend pas d'un artisan qu'il
    // active ses alertes avant de pouvoir les recevoir.
    const { prisma } = prismaFactice([commande()], []);
    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });
    expect(r.retards).toBe(1);
  });

  it("se tait quand l'atelier a coupé les alertes de retard", async () => {
    const { prisma } = prismaFactice([commande()], [], {
      COMMANDE_EN_RETARD: { inApp: false },
    });
    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });
    expect(r.retards).toBe(0);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("bascule quand même la commande en LATE malgré l'alerte coupée", async () => {
    // Le réglage porte sur l'avertissement, pas sur le fait. Une commande est
    // en retard qu'on veuille l'entendre ou non — sinon couper l'alerte
    // fausserait le planning et les rapports.
    const { prisma, updateMany } = prismaFactice([commande()], [], {
      COMMANDE_EN_RETARD: { inApp: false },
    });
    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });
    expect(updateMany).toHaveBeenCalledTimes(1);
    expect(r.marqueesEnRetard).toBe(1);
  });

  it('couper les retards ne coupe pas les livraisons du lendemain', async () => {
    const { prisma } = prismaFactice([], [commande()], {
      COMMANDE_EN_RETARD: { inApp: false },
    });
    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });
    expect(r.livraisons).toBe(1);
  });

  it('se tait sur les livraisons quand ce canal-là est coupé', async () => {
    const { prisma } = prismaFactice([], [commande()], {
      LIVRAISON_DEMAIN: { inApp: false },
    });
    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });
    expect(r.livraisons).toBe(0);
  });

  it("un réglage e-mail à false ne coupe pas l'alerte interne", async () => {
    // Les deux canaux sont indépendants. Couper l'e-mail ne doit pas faire
    // disparaître la notification de l'écran.
    const { prisma } = prismaFactice([commande()], [], {
      COMMANDE_EN_RETARD: { email: false },
    });
    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });
    expect(r.retards).toBe(1);
  });

  it("ne lit les préférences qu'une fois par lot", async () => {
    // Vingt commandes en retard dans le même atelier ne doivent pas coûter
    // vingt lectures de la même ligne.
    const lot = [commande({ id: 'c1' }), commande({ id: 'c2' }), commande({ id: 'c3' })];
    const { prisma, prefsFindMany } = prismaFactice(lot, []);
    await signalerEcheances({ prisma, maintenant: MAINTENANT });
    expect(prefsFindMany).toHaveBeenCalledTimes(1);
    expect(prefsFindMany.mock.calls[0]?.[0]?.where.userId.in).toEqual(['user-1']);
  });
});

describe('signalerEcheances — le palier', () => {
  it('n’avertit pas un atelier au gratuit', async () => {
    const { prisma } = prismaFactice([commande()], [], null, 'freemium');

    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(r.retards).toBe(0);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('marque quand même sa commande en retard', async () => {
    // C'est l'état de la commande, pas un service vendu. Le planning et les
    // rapports d'un atelier au gratuit doivent dire la vérité.
    const { prisma, updateMany } = prismaFactice([commande()], [], null, 'freemium');

    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(r.marqueesEnRetard).toBe(1);
    expect(updateMany).toHaveBeenCalledTimes(1);
  });

  it('n’avertit pas non plus d’une livraison du lendemain au gratuit', async () => {
    const demain = commande({ dueDate: new Date('2026-08-25T00:00:00.000Z') });
    const { prisma } = prismaFactice([], [demain], null, 'freemium');

    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(r.livraisons).toBe(0);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('retombe au gratuit quand l’abonnement a expiré', async () => {
    const { prisma } = prismaFactice([commande()], []);
    (
      prisma as unknown as { user: { findMany: ReturnType<typeof vi.fn> } }
    ).user.findMany.mockResolvedValue([
      // Échéance dépassée depuis la veille du passage du cron.
      { id: 'user-1', plan: 'pro', planExpiresAt: new Date('2026-08-23T06:00:00.000Z') },
    ]);

    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(r.retards).toBe(0);
    expect(r.marqueesEnRetard).toBe(1);
  });

  it('avertit un atelier dont l’abonnement court encore', async () => {
    const { prisma } = prismaFactice([commande()], [], null, 'pro');

    const r = await signalerEcheances({ prisma, maintenant: MAINTENANT });

    expect(r.retards).toBe(1);
  });
});
