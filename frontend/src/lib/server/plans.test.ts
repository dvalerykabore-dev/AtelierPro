// Application des paliers côté serveur.
//
// `planActifDe` est la fonction qui décide payant ou gratuit. Elle était
// couverte seulement de biais — par les alertes et par la route d'envoi — ce
// qui laissait ses cas limites sans filet : échéance nulle, échéance
// exactement atteinte, palier inconnu lu en base.
//
// `prismaMock` en premier : son `vi.mock('@/lib/server/prisma')` se hisse
// au-dessus de l'import du module testé.
import { prismaMock } from '@/test-utils/prisma-mock';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

import {
  planActifDe,
  lirePlanActif,
  lirePlansActifs,
  exigerCapacite,
  exigerPlaceArtisan,
} from './plans';

const MAINTENANT = new Date('2026-09-04T12:00:00.000Z');
const DEVANT = new Date('2026-12-01T00:00:00.000Z');
const DERRIERE = new Date('2026-08-01T00:00:00.000Z');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('planActifDe', () => {
  it('laisse le gratuit au gratuit', () => {
    expect(planActifDe({ plan: 'freemium', planExpiresAt: null }, MAINTENANT)).toBe('freemium');
  });

  it('rend le palier payé tant que l’échéance est devant', () => {
    expect(planActifDe({ plan: 'pro', planExpiresAt: DEVANT }, MAINTENANT)).toBe('pro');
  });

  it('redescend au gratuit une fois l’échéance passée', () => {
    expect(planActifDe({ plan: 'premium', planExpiresAt: DERRIERE }, MAINTENANT)).toBe('freemium');
  });

  it('redescend au gratuit si le palier est payant sans aucune échéance', () => {
    // Un compte marqué « pro » sans date payée n'a rien réglé : c'est soit une
    // écriture manuelle, soit un encaissement à moitié écrit. Dans les deux cas
    // on ne donne pas l'accès.
    expect(planActifDe({ plan: 'pro', planExpiresAt: null }, MAINTENANT)).toBe('freemium');
  });

  it('ferme à la seconde exacte de l’échéance', () => {
    // Strictement supérieur : l'instant de l'échéance n'est plus couvert. Un
    // abonnement « jusqu'au 4 septembre 12h00 » expire À 12h00.
    expect(planActifDe({ plan: 'pro', planExpiresAt: MAINTENANT }, MAINTENANT)).toBe('freemium');
    expect(
      planActifDe({ plan: 'pro', planExpiresAt: new Date(MAINTENANT.getTime() + 1) }, MAINTENANT),
    ).toBe('pro');
  });

  it('retombe au gratuit devant un palier que le code ne connaît plus', () => {
    // Cas réel : la grille à trois paliers laissait des comptes « atelier » ou
    // « maison ». Ils doivent continuer à fonctionner, en gratuit.
    expect(planActifDe({ plan: 'atelier', planExpiresAt: DEVANT }, MAINTENANT)).toBe('freemium');
    expect(planActifDe({ plan: '', planExpiresAt: DEVANT }, MAINTENANT)).toBe('freemium');
  });
});

describe('lirePlanActif', () => {
  it('rend le palier du compte', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      plan: 'essentiel',
      planExpiresAt: DEVANT,
    } as never);

    await expect(lirePlanActif('user-1')).resolves.toBe('essentiel');
  });

  it('rend le gratuit quand le compte n’existe pas', async () => {
    // Un jeton valide dont le compte a été supprimé entre-temps : on ferme les
    // écrans payants plutôt que de planter.
    prismaMock.user.findUnique.mockResolvedValue(null as never);

    await expect(lirePlanActif('disparu')).resolves.toBe('freemium');
  });
});

describe('lirePlansActifs', () => {
  it('ne fait aucune requête pour une liste vide', async () => {
    const map = await lirePlansActifs(prismaMock, [], MAINTENANT);

    expect(map.size).toBe(0);
    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });

  it('dédoublonne les identifiants avant d’interroger la base', async () => {
    prismaMock.user.findMany.mockResolvedValue([] as never);

    await lirePlansActifs(prismaMock, ['a', 'a', 'b', 'a'], MAINTENANT);

    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { in: ['a', 'b'] } } }),
    );
  });

  it('applique l’échéance compte par compte', async () => {
    prismaMock.user.findMany.mockResolvedValue([
      { id: 'a', plan: 'pro', planExpiresAt: DEVANT },
      { id: 'b', plan: 'pro', planExpiresAt: DERRIERE },
    ] as never);

    const map = await lirePlansActifs(prismaMock, ['a', 'b'], MAINTENANT);

    expect(map.get('a')).toBe('pro');
    expect(map.get('b')).toBe('freemium');
  });
});

describe('exigerCapacite', () => {
  it('laisse passer quand le palier ouvre la capacité', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ plan: 'pro', planExpiresAt: DEVANT } as never);

    await expect(exigerCapacite('user-1', 'tresorerie')).resolves.toBeNull();
  });

  it('refuse en 402 et dit quel palier acheter', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      plan: 'essentiel',
      planExpiresAt: DEVANT,
    } as never);

    const refus = await exigerCapacite('user-1', 'rapports');

    expect(refus).toBeInstanceOf(NextResponse);
    expect(refus?.status).toBe(402);
    const corps = (await refus?.json()) as Record<string, unknown>;
    expect(corps['error']).toBe('PLAN_REQUIRED');
    // De quoi construire l'invitation sans que le client connaisse la grille.
    expect(corps['currentPlan']).toBe('essentiel');
    expect(corps['requiredPlan']).toBe('pro');
    expect(corps['capability']).toBe('rapports');
    expect(String(corps['message'])).toContain('Pro');
  });

  it('refuse dès que l’abonnement a expiré, même sur un palier haut', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      plan: 'premium',
      planExpiresAt: DERRIERE,
    } as never);

    const refus = await exigerCapacite('user-1', 'mannequin');

    expect(refus?.status).toBe(402);
  });
});

describe('exigerPlaceArtisan', () => {
  it('laisse passer sous le plafond', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      plan: 'freemium',
      planExpiresAt: null,
    } as never);
    prismaMock.artisan.count.mockResolvedValue(1 as never);

    await expect(exigerPlaceArtisan('user-1')).resolves.toBeNull();
  });

  it('refuse à la limite, en nommant le plafond', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      plan: 'freemium',
      planExpiresAt: null,
    } as never);
    prismaMock.artisan.count.mockResolvedValue(2 as never);

    const refus = await exigerPlaceArtisan('user-1');

    expect(refus?.status).toBe(402);
    const corps = (await refus?.json()) as Record<string, unknown>;
    expect(corps['error']).toBe('ARTISAN_LIMIT_REACHED');
    expect(corps['limit']).toBe(2);
  });

  it('ne compte que les fiches actives', async () => {
    // Un artisan parti est désactivé, pas supprimé : ses commandes passées
    // doivent rester lisibles. Il serait absurde qu'un départ occupe encore
    // une place payée.
    prismaMock.user.findUnique.mockResolvedValue({
      plan: 'essentiel',
      planExpiresAt: DEVANT,
    } as never);
    prismaMock.artisan.count.mockResolvedValue(3 as never);

    await exigerPlaceArtisan('user-1');

    expect(prismaMock.artisan.count).toHaveBeenCalledWith({
      where: { userId: 'user-1', active: true },
    });
  });

  it('ne borne jamais Premium', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      plan: 'premium',
      planExpiresAt: DEVANT,
    } as never);
    prismaMock.artisan.count.mockResolvedValue(900 as never);

    await expect(exigerPlaceArtisan('user-1')).resolves.toBeNull();
  });
});
