import 'server-only';

import type { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import {
  PLAN_DEFAUT,
  aAcces,
  definitionDe,
  estPlan,
  palierRequis,
  peutAjouterArtisan,
  type Capacite,
  type Plan,
} from '@/lib/plans';
import { createLogger } from '@/lib/server/logger';
import { prisma } from '@/lib/server/prisma';

const log = createLogger();

/**
 * Application des paliers, côté serveur.
 *
 * La grille de la vitrine ne protège rien : elle décrit. Ce module est le seul
 * endroit qui refuse — toute route payante passe par `exigerCapacite`.
 *
 * Le palier n'est délibérément PAS porté par le jeton d'accès. Il y resterait
 * figé jusqu'à quinze minutes : un atelier qui vient de payer verrait sa
 * trésorerie encore fermée, et rien n'est plus sûr pour perdre un client que de
 * lui refuser ce qu'il vient d'acheter. Une lecture en base par requête gardée
 * est un coût négligeable devant ça.
 */

/** Ce qu'il faut lire sur le compte pour trancher. */
interface CompteAbonne {
  plan: string;
  planExpiresAt: Date | null;
}

/**
 * Le palier RÉELLEMENT actif, échéance appliquée.
 *
 * Deux cas ramènent au gratuit sans que personne n'ait rien réécrit en base :
 * l'échéance est passée, ou la colonne porte une clé que le code ne connaît
 * plus (palier retiré d'une version à l'autre). Dans les deux cas on ferme les
 * écrans payants, jamais les données.
 */
export function planActifDe(compte: CompteAbonne, maintenant: Date = new Date()): Plan {
  if (!estPlan(compte.plan)) {
    // Vaut la peine d'être signalé : c'est soit une écriture manuelle en base,
    // soit un palier supprimé du code sans migration des comptes qui le
    // portaient. Le compte continue de fonctionner, en gratuit.
    log.warn('plan inconnu sur un compte, retour au gratuit', { plan: compte.plan });
    return PLAN_DEFAUT;
  }
  if (compte.plan === PLAN_DEFAUT) return PLAN_DEFAUT;
  if (!compte.planExpiresAt) return PLAN_DEFAUT;
  return compte.planExpiresAt.getTime() > maintenant.getTime() ? compte.plan : PLAN_DEFAUT;
}

/** Lit le palier actif d'un compte. `PLAN_DEFAUT` si le compte a disparu. */
export async function lirePlanActif(userId: string): Promise<Plan> {
  const compte = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planExpiresAt: true },
  });
  if (!compte) return PLAN_DEFAUT;
  return planActifDe(compte);
}

/**
 * Les paliers actifs de plusieurs comptes, en une requête.
 *
 * Pour les traitements par lot — le cron d'alertes balaie toutes les commandes
 * en retard de tous les ateliers d'un coup. Une lecture par atelier y ferait
 * autant de requêtes que de comptes concernés.
 *
 * Le client Prisma est passé en paramètre plutôt que pris au singleton : les
 * jobs qui appellent cette fonction reçoivent déjà le leur, ce qui les rend
 * testables sans base.
 */
export async function lirePlansActifs(
  client: Pick<PrismaClient, 'user'>,
  userIds: readonly string[],
  maintenant: Date = new Date(),
): Promise<Map<string, Plan>> {
  const uniques = [...new Set(userIds)];
  if (uniques.length === 0) return new Map();

  const comptes = await client.user.findMany({
    where: { id: { in: uniques } },
    select: { id: true, plan: true, planExpiresAt: true },
  });
  return new Map(comptes.map((c) => [c.id, planActifDe(c, maintenant)]));
}

/**
 * Refuse la requête si le palier du compte n'ouvre pas cette capacité.
 *
 * Rend `null` quand tout va bien, une réponse à renvoyer sinon — le même
 * contrat que `requireAuth`, pour que les routes gardent une seule forme :
 *
 *     const refus = await exigerCapacite(auth.user.sub, 'rapports');
 *     if (refus) return refus;
 *
 * Le corps porte de quoi construire l'invitation à monter de palier sans que le
 * client ait à connaître la grille : le palier courant, celui qu'il faut, et la
 * capacité visée. `402 Payment Required` plutôt que 403 : ce n'est pas un
 * interdit, c'est un achat qui manque.
 */
export async function exigerCapacite(
  userId: string,
  capacite: Capacite,
): Promise<NextResponse | null> {
  const plan = await lirePlanActif(userId);
  if (aAcces(plan, capacite)) return null;

  const requis = palierRequis(capacite);
  return NextResponse.json(
    {
      error: 'PLAN_REQUIRED',
      message: `Cette fonction est incluse à partir du palier ${definitionDe(requis).nom}.`,
      capability: capacite,
      currentPlan: plan,
      requiredPlan: requis,
    },
    { status: 402 },
  );
}

/**
 * Refuse une fiche artisan de plus quand le plafond du palier est atteint.
 *
 * Compte les fiches ACTIVES seulement. Un artisan qui quitte l'atelier est
 * désactivé et non supprimé — ses commandes passées doivent rester lisibles —
 * et il serait absurde qu'un départ continue d'occuper une place payée.
 */
export async function exigerPlaceArtisan(userId: string): Promise<NextResponse | null> {
  const [plan, actifs] = await Promise.all([
    lirePlanActif(userId),
    prisma.artisan.count({ where: { userId, active: true } }),
  ]);
  if (peutAjouterArtisan(plan, actifs)) return null;

  const def = definitionDe(plan);
  return NextResponse.json(
    {
      error: 'ARTISAN_LIMIT_REACHED',
      message: `Le palier ${def.nom} couvre ${def.artisans} artisans. Désactivez une fiche ou changez de palier.`,
      limit: def.artisans,
      currentPlan: plan,
    },
    { status: 402 },
  );
}
