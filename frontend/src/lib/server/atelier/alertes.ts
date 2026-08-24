// Alertes d'échéance de l'atelier — commandes en retard et livraisons du
// lendemain.
//
// C'est la seule notification qui apprend quelque chose à un tailleur seul :
// être averti d'un versement qu'on vient soi-même de saisir n'apprend rien,
// mais une commande dont la date est passée pendant qu'on cousait, si.
import 'server-only';
import type { PrismaClient } from '@prisma/client';
import { createNotification } from '@/lib/server/notifications';
import { commandeEnRetard, livraisonDemain } from '@/lib/server/notifications/templates';

export interface AlertesOptions {
  prisma: PrismaClient;
  /** Injecté par les tests ; en production, l'instant du passage du cron. */
  maintenant?: Date;
  batchSize?: number;
}

export interface ResultatAlertes {
  retards: number;
  livraisons: number;
  /** Commandes passées en LATE au cours de ce passage. */
  marqueesEnRetard: number;
}

/** Minuit UTC du jour de `d` — les échéances se comparent en jours, pas en heures. */
export function jourUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** « 2026-08-24 » — suffixe de clé de déduplication, une alerte par jour. */
function cleJour(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const EN_COURS = ['IN_PROGRESS', 'FITTING', 'DELIVERY', 'LATE'];

/**
 * Signale les échéances du jour.
 *
 * Idempotent par construction : `dedupeKey` porte la date, et
 * `createNotification` avale la collision d'unicité. Deux passages le même jour
 * ne produisent qu'une alerte par commande — un cron qui rejoue après un
 * incident ne réveille pas l'atelier deux fois.
 */
export async function signalerEcheances(opts: AlertesOptions): Promise<ResultatAlertes> {
  const batchSize = opts.batchSize ?? 200;
  const aujourdhui = jourUtc(opts.maintenant ?? new Date());
  const demain = new Date(aujourdhui.getTime() + 24 * 60 * 60 * 1000);
  const surlendemain = new Date(demain.getTime() + 24 * 60 * 60 * 1000);
  const jour = cleJour(aujourdhui);

  // ── Retards ──────────────────────────────────────────────────────────────
  // Échéance strictement antérieure à aujourd'hui : une commande due
  // aujourd'hui n'est pas en retard, elle est due.
  const enRetard = await opts.prisma.tailoringOrder.findMany({
    where: { dueDate: { lt: aujourdhui }, status: { in: EN_COURS } },
    orderBy: { dueDate: 'asc' },
    take: batchSize,
    select: {
      id: true,
      userId: true,
      sequence: true,
      garment: true,
      status: true,
      dueDate: true,
      customer: { select: { name: true } },
    },
  });

  let retards = 0;
  let marqueesEnRetard = 0;
  for (const c of enRetard) {
    // Le statut suit l'alerte. Sans cela, la notification dirait « en retard »
    // pendant que la fiche afficherait « en cours » — et rien ne dirait laquelle
    // des deux se trompe.
    if (c.status !== 'LATE') {
      const u = await opts.prisma.tailoringOrder.updateMany({
        where: { id: c.id, status: { in: EN_COURS } },
        data: { status: 'LATE' },
      });
      if (u.count > 0) marqueesEnRetard += 1;
    }

    const cree = await createNotification(
      opts.prisma,
      commandeEnRetard({
        userId: c.userId,
        commandeId: c.id,
        sequence: c.sequence,
        tenue: c.garment,
        client: c.customer.name,
        echeance: c.dueDate ?? aujourdhui,
        jour,
      }),
    );
    if (cree) retards += 1;
  }

  // ── Livraisons du lendemain ──────────────────────────────────────────────
  const demainDues = await opts.prisma.tailoringOrder.findMany({
    where: { dueDate: { gte: demain, lt: surlendemain }, status: { in: EN_COURS } },
    orderBy: { dueDate: 'asc' },
    take: batchSize,
    select: {
      id: true,
      userId: true,
      sequence: true,
      garment: true,
      customer: { select: { name: true } },
    },
  });

  let livraisons = 0;
  for (const c of demainDues) {
    const cree = await createNotification(
      opts.prisma,
      livraisonDemain({
        userId: c.userId,
        commandeId: c.id,
        sequence: c.sequence,
        tenue: c.garment,
        client: c.customer.name,
        jour,
      }),
    );
    if (cree) livraisons += 1;
  }

  return { retards, livraisons, marqueesEnRetard };
}
