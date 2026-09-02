/**
 * Notification templates.
 *
 * Each project defines its own typed wrappers around `createNotification`.
 * The example below ships with the template — adapt it, replace it, or add
 * more (e.g. `firePaymentReceived`, `fireExportReady`). The pattern:
 *
 *   1. Build a `CreateNotificationInput` with a *deterministic* dedupeKey
 *      so the unique constraint enforces at-most-once delivery for that
 *      logical event (e.g. `payment-received:${orderId}` — never include
 *      a timestamp or random suffix).
 *   2. Pass the input + your PrismaClient to `createNotification`.
 *   3. Optionally enqueue an email via `EmailQueue.enqueue` — but ONLY
 *      after the notification row is created, so a duplicate event never
 *      sends a duplicate email.
 *
 * Keep these helpers free of side effects beyond the row insert; the
 * email enqueue belongs at the call site so each project can pick the
 * right channel (no email vs. transactional vs. marketing).
 */

import type { CreateNotificationInput } from './index';

export function welcomeNotification(userId: string, email: string): CreateNotificationInput {
  return {
    userId,
    type: 'WELCOME',
    title: 'Welcome!',
    body: `Glad to have you on board, ${email}.`,
    dedupeKey: `welcome:${userId}`,
  };
}

/**
 * Example: notification dispatched after a successful payment.
 * Called from the Bictorys webhook handler's `onPaid` post-commit hook.
 */
export function paymentReceived(
  userId: string,
  orderId: string,
  amount: number,
  currency: string,
): CreateNotificationInput {
  return {
    userId,
    type: 'PAYMENT_RECEIVED',
    title: 'Payment received',
    body: `Order ${orderId} for ${amount} ${currency} confirmed.`,
    data: { orderId, amount, currency },
    dedupeKey: `payment-received:${orderId}`,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Atelier — alertes d'échéance, émises par le cron `atelier-alertes`.
//
// Rédigées en français : elles s'affichent telles quelles sur `/notifications`,
// contrairement aux modèles ci-dessus qui viennent du starter. `commandeId`
// dans `data` est la clé que l'écran suit pour ouvrir la fiche — voir
// `lienDe()` dans `lib/notifications.ts`.
//
// La clé de déduplication porte le jour : une commande en retard depuis une
// semaine ne produit qu'une alerte par jour, pas une par passage du cron.
// ───────────────────────────────────────────────────────────────────────────

interface AlerteCommande {
  userId: string;
  commandeId: string;
  sequence: number;
  tenue: string;
  client: string;
  /** Jour de l'alerte, « AAAA-MM-JJ » — dédoublonne à la journée. */
  jour: string;
}

/** « #007 » — le format court que l'atelier dicte à voix haute. */
function reference(sequence: number): string {
  return `#${String(sequence).padStart(3, '0')}`;
}

export function commandeEnRetard(
  alerte: AlerteCommande & { echeance: Date },
): CreateNotificationInput {
  const ref = reference(alerte.sequence);
  const date = alerte.echeance.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  return {
    userId: alerte.userId,
    type: 'COMMANDE_EN_RETARD',
    title: `Commande ${ref} en retard — ${alerte.client}`,
    body: `${alerte.tenue} devait être livrée le ${date}.`,
    // `title` et `body` sont rendus ici en français, une fois pour toutes ; les
    // mêmes éléments repartent séparément dans `data` pour que l'écran puisse
    // recomposer la phrase dans la langue du lecteur. Les deux coexistent : les
    // notifications écrites avant ce changement n'ont que la phrase figée, et
    // restent lisibles.
    data: {
      commandeId: alerte.commandeId,
      sequence: alerte.sequence,
      reference: ref,
      client: alerte.client,
      tenue: alerte.tenue,
      echeance: alerte.echeance.toISOString(),
    },
    dedupeKey: `commande-retard:${alerte.commandeId}:${alerte.jour}`,
  };
}

export function livraisonDemain(alerte: AlerteCommande): CreateNotificationInput {
  const ref = reference(alerte.sequence);
  return {
    userId: alerte.userId,
    type: 'LIVRAISON_DEMAIN',
    title: `Livraison demain — ${alerte.client}`,
    body: `${alerte.tenue} (${ref}) est attendue demain.`,
    data: {
      commandeId: alerte.commandeId,
      sequence: alerte.sequence,
      reference: ref,
      client: alerte.client,
      tenue: alerte.tenue,
    },
    dedupeKey: `livraison-demain:${alerte.commandeId}:${alerte.jour}`,
  };
}
