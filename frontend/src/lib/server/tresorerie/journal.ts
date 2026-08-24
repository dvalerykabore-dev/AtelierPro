import 'server-only';

import type { Prisma } from '@prisma/client';

/**
 * Outils partagés par les routes de trésorerie.
 *
 * L'essentiel tient dans deux règles : les jours sont ancrés à minuit UTC, et
 * l'acompte d'une commande n'est jamais écrit ailleurs qu'ici.
 */

/**
 * « 2026-08-23 » → minuit UTC.
 *
 * Même convention que `WorkshopTask.day` : les colonnes `@db.Date` se lisent en
 * UTC, et un `new Date('2026-08-23')` local décalerait la journée d'un cran
 * pour tout atelier à l'ouest de Greenwich — donc pour toute l'Afrique de
 * l'Ouest, précisément le public visé.
 */
export function jourUtc(iso: string): Date {
  const [a, m, j] = iso.split('-').map(Number);
  return new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1, j ?? 1));
}

/** Minuit UTC du jour courant. */
export function aujourdhuiUtc(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
}

/** Premier jour du mois « 2026-08 », à minuit UTC. */
export function debutDeMoisUtc(cle: string): Date {
  const [a, m] = cle.split('-').map(Number);
  return new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1, 1));
}

/** Premier jour du mois suivant — borne haute exclusive d'un intervalle. */
export function moisSuivantUtc(cle: string): Date {
  const [a, m] = cle.split('-').map(Number);
  return new Date(Date.UTC(a ?? 1970, m ?? 1, 1));
}

/** Clé « AAAA-MM » d'une date, lue en UTC. */
export function cleMoisUtc(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** Clé « AAAA-JJ-MM » d'une date, lue en UTC. */
export function cleJourUtc(d: Date): string {
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const j = String(d.getUTCDate()).padStart(2, '0');
  return `${d.getUTCFullYear()}-${m}-${j}`;
}

/** Décale une clé de mois de `n` mois. */
export function decalerMois(cle: string, n: number): string {
  const [a, m] = cle.split('-').map(Number);
  const d = new Date(Date.UTC(a ?? 1970, (m ?? 1) - 1 + n, 1));
  return cleMoisUtc(d);
}

/**
 * Recale `TailoringOrder.depositAmount` sur la somme réelle des encaissements.
 *
 * À appeler dans la transaction qui vient d'écrire ou de retirer un mouvement.
 * Le champ est un raccourci de lecture pour les écrans qui affichent une
 * commande sans charger son journal — il ne doit jamais être calculé à la main
 * ailleurs, sinon les deux chiffres finissent par se contredire et personne ne
 * sait lequel croire.
 */
export async function recalerAcompte(
  tx: Prisma.TransactionClient,
  tailoringOrderId: string,
): Promise<number> {
  const somme = await tx.cashMovement.aggregate({
    where: { tailoringOrderId, direction: 'IN' },
    _sum: { amount: true },
  });
  const encaisse = somme._sum.amount ?? 0;

  await tx.tailoringOrder.update({
    where: { id: tailoringOrderId },
    data: { depositAmount: encaisse },
  });

  return encaisse;
}

export const SELECTION_MOUVEMENT = {
  id: true,
  direction: true,
  amount: true,
  occurredAt: true,
  category: true,
  method: true,
  label: true,
  notes: true,
  tailoringOrderId: true,
  backfilled: true,
} satisfies Prisma.CashMovementSelect;
