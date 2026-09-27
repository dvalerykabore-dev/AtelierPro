/**
 * GET /api/tresorerie — le recoupement : recettes, dépenses, solde, prévision.
 *
 * Trois principes tiennent tout l'écran.
 *
 * 1. **La trésorerie compte l'argent encaissé, pas l'argent facturé.** Une
 *    commande de 80 000 F réglée de 20 000 F pèse 20 000 F ici et 80 000 F dans
 *    `/api/rapports`. Les deux chiffres sont justes et vont diverger — l'écran
 *    doit le dire, sans quoi l'écart passera pour une anomalie.
 *
 * 2. **Le mesuré et le prévu ne se mélangent jamais dans la même case.** Le
 *    solde est constaté ; la projection commence à partir d'aujourd'hui et
 *    s'annonce comme telle.
 *
 * 3. **Une charge déjà échue ce mois-ci n'est pas reprojetée.** Un loyer dû le
 *    5, quand on est le 23, est soit payé — il est alors dans le journal — soit
 *    en retard ; le compter une seconde fois inventerait une sortie.
 *
 * L'agrégation se fait en mémoire après quelques lectures, comme
 * `/api/rapports` : un atelier écrit des centaines de lignes par an, pas des
 * millions. Au-delà, il faudra passer à des `groupBy` SQL.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';

import { requireAuth } from '@/lib/server/middleware';
import { exigerCapacite } from '@/lib/server/plans';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { prisma } from '@/lib/server/prisma';
import {
  cleJourUtc,
  cleMoisUtc,
  debutDeMoisUtc,
  decalerMois,
} from '@/lib/server/tresorerie/journal';

/** Mois d'historique affichés dans la courbe du solde. */
const MOIS_HISTORIQUE = 6;

/** Mois projetés en avant. Au-delà, une échéance de commande ne veut plus rien dire. */
const MOIS_PREVISION = 3;

interface Seau {
  cle: string;
  recettes: number;
  depenses: number;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const refus = await exigerCapacite(auth.user.sub, 'tresorerie');
    if (refus) return refus;

    const userId = auth.user.sub;
    const maintenant = new Date();
    const moisCourant = cleMoisUtc(maintenant);
    const debutFenetre = debutDeMoisUtc(decalerMois(moisCourant, -(MOIS_HISTORIQUE - 1)));

    const [avant, dansLaFenetre, charges, commandesOuvertes, reprises] = await Promise.all([
      // Solde d'ouverture de la fenêtre : tout ce qui la précède, agrégé en
      // base plutôt que rapatrié — l'historique complet n'a pas à transiter.
      prisma.cashMovement.groupBy({
        by: ['direction'],
        where: { userId, occurredAt: { lt: debutFenetre } },
        _sum: { amount: true },
      }),
      prisma.cashMovement.findMany({
        where: { userId, occurredAt: { gte: debutFenetre } },
        select: { direction: true, amount: true, occurredAt: true, category: true },
      }),
      prisma.recurringCharge.findMany({
        where: { userId, active: true },
        select: { id: true, label: true, category: true, amount: true, dayOfMonth: true },
        orderBy: [{ dayOfMonth: 'asc' }],
      }),
      // Commandes non soldées : ce qu'il reste à encaisser est la seule donnée
      // dure dont dispose la prévision.
      prisma.tailoringOrder.findMany({
        where: { userId, priceAmount: { gt: 0 } },
        select: {
          id: true,
          sequence: true,
          priceAmount: true,
          depositAmount: true,
          dueDate: true,
          status: true,
          garment: true,
          customer: { select: { name: true } },
        },
        orderBy: [{ dueDate: 'asc' }],
      }),
      prisma.cashMovement.count({ where: { userId, backfilled: true } }),
    ]);

    const sommeAvant = (sens: string) => avant.find((a) => a.direction === sens)?._sum.amount ?? 0;
    const soldeOuverture = sommeAvant('IN') - sommeAvant('OUT');

    // ---- Historique mois par mois -----------------------------------------
    const seaux = new Map<string, Seau>();
    for (let recul = MOIS_HISTORIQUE - 1; recul >= 0; recul--) {
      const cle = decalerMois(moisCourant, -recul);
      seaux.set(cle, { cle, recettes: 0, depenses: 0 });
    }

    const parPoste = new Map<string, number>();

    for (const m of dansLaFenetre) {
      const cle = cleMoisUtc(m.occurredAt);
      const seau = seaux.get(cle);
      if (seau) {
        if (m.direction === 'IN') seau.recettes += m.amount;
        else seau.depenses += m.amount;
      }

      // Répartition par poste sur le mois en cours uniquement : c'est la
      // question qu'on se pose devant l'écran (« où est parti l'argent ce
      // mois-ci ? »), pas sur six mois cumulés.
      if (m.direction === 'OUT' && cle === moisCourant) {
        parPoste.set(
          m.category ?? 'DIVERS',
          (parPoste.get(m.category ?? 'DIVERS') ?? 0) + m.amount,
        );
      }
    }

    let cumul = soldeOuverture;
    const mois = [...seaux.values()].map((s) => {
      cumul += s.recettes - s.depenses;
      return {
        cle: s.cle,
        recettes: s.recettes,
        depenses: s.depenses,
        resultat: s.recettes - s.depenses,
        soldeFin: cumul,
        courant: s.cle === moisCourant,
      };
    });

    const solde = cumul;
    const courant = mois.find((m) => m.courant) ?? {
      cle: moisCourant,
      recettes: 0,
      depenses: 0,
      resultat: 0,
      soldeFin: solde,
      courant: true,
    };

    const totalPostes = [...parPoste.values()].reduce((s, v) => s + v, 0);
    const repartition = [...parPoste.entries()]
      .map(([poste, montant]) => ({
        poste,
        montant,
        pourcentage: totalPostes > 0 ? Math.round((montant / totalPostes) * 100) : 0,
      }))
      .sort((a, b) => b.montant - a.montant);

    // ---- Prévision ---------------------------------------------------------
    const attendus = commandesOuvertes
      .filter((c) => c.priceAmount > c.depositAmount)
      .map((c) => ({
        id: c.id,
        numero: c.sequence,
        client: c.customer.name,
        tenue: c.garment,
        montant: c.priceAmount - c.depositAmount,
        echeance: c.dueDate ? cleJourUtc(c.dueDate) : null,
        livree: c.status === 'DELIVERED',
      }));

    const sansEcheance = attendus.filter((a) => a.echeance === null);
    const chargesMensuelles = charges.reduce((s, c) => s + c.amount, 0);
    const jourDuMois = maintenant.getUTCDate();

    let projete = solde;
    const prevision = [];
    for (let avance = 0; avance < MOIS_PREVISION; avance++) {
      const cle = decalerMois(moisCourant, avance);

      const encaissements = attendus
        .filter((a) => a.echeance !== null && a.echeance.slice(0, 7) === cle)
        .reduce((s, a) => s + a.montant, 0);

      // Mois en cours : seules les échéances encore à venir sont projetées.
      const chargesDuMois =
        avance === 0
          ? charges.filter((c) => c.dayOfMonth >= jourDuMois).reduce((s, c) => s + c.amount, 0)
          : chargesMensuelles;

      projete += encaissements - chargesDuMois;
      prevision.push({
        cle,
        encaissements,
        charges: chargesDuMois,
        resultat: encaissements - chargesDuMois,
        soldeProjete: projete,
        partiel: avance === 0,
      });
    }

    // Une échéance dépassée sur une commande non soldée : l'argent était attendu
    // et n'est pas rentré. C'est ce qui explique un solde plus bas que prévu.
    const aujourdhui = cleJourUtc(
      new Date(
        Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), maintenant.getUTCDate()),
      ),
    );
    const enRetard = attendus.filter((a) => a.echeance !== null && a.echeance < aujourdhui);

    return NextResponse.json({
      solde,
      moisCourant: {
        cle: courant.cle,
        recettes: courant.recettes,
        depenses: courant.depenses,
        resultat: courant.resultat,
      },
      mois,
      repartition,
      totalRepartition: totalPostes,
      prevision: {
        mois: prevision,
        chargesMensuelles,
        charges,
        attendus: attendus.filter((a) => a.echeance !== null),
        sansEcheance: {
          nombre: sansEcheance.length,
          montant: sansEcheance.reduce((s, a) => s + a.montant, 0),
        },
        enRetard: {
          nombre: enRetard.length,
          montant: enRetard.reduce((s, a) => s + a.montant, 0),
        },
      },
      // Nombre d'écritures reconstituées depuis un acompte antérieur au
      // journal : leur date est approximative, l'écran doit le signaler.
      reprises,
    });
  });
}
