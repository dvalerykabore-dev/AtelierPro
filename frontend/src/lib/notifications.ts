import type { CategorieNotif, Notification } from '@/lib/mock/atelier';

/**
 * Présentation des notifications réelles.
 *
 * Le serveur stocke un `type` libre et un `data` JSON ; l'écran, lui, a besoin
 * d'une catégorie, d'une icône et d'une pastille de couleur. La traduction se
 * fait ici, en un seul endroit, pour que l'ajout d'un type côté atelier n'ait
 * pas à toucher le composant.
 */

/** Forme renvoyée par `/api/notifications`. */
export interface NotificationApi {
  id: string;
  type: string;
  title: string;
  body: string;
  data: unknown;
  readAt: string | null;
  createdAt: string;
}

type Icone = Notification['icone'];

interface Apparence {
  categorie: CategorieNotif;
  icone: Icone;
  couleurIcone: string;
}

/**
 * Types réellement émis à ce jour.
 *
 * Trois seulement, et tous hérités du starter : rien dans le domaine atelier
 * (commandes, versements, retards) ne crée encore de notification. Ce tableau
 * grandira le jour où un émetteur existera — il n'anticipe pas des types qui
 * n'ont pas de producteur, sinon la table décrirait une application imaginaire.
 */
const APPARENCES: Record<string, Apparence> = {
  PAYMENT_RECEIVED: {
    categorie: 'Paiements',
    icone: 'paiement',
    couleurIcone: 'bg-success text-primary-foreground',
  },
  WITHDRAWAL_REQUESTED: {
    categorie: 'Paiements',
    icone: 'paiement',
    couleurIcone: 'bg-accent text-primary-foreground',
  },
  WELCOME: {
    categorie: 'Atelier',
    icone: 'equipe',
    couleurIcone: 'bg-secondary text-primary',
  },
};

/** Repli : un type inconnu reste lisible plutôt que de faire planter la liste. */
const APPARENCE_DEFAUT: Apparence = {
  categorie: 'Atelier',
  icone: 'message',
  couleurIcone: 'bg-muted text-muted-foreground',
};

export function apparenceDe(type: string): Apparence {
  return APPARENCES[type] ?? APPARENCE_DEFAUT;
}

/**
 * Lien de l'action, quand la notification désigne une commande de l'atelier.
 *
 * Seule la clé `commandeId` est suivie. Le `PAYMENT_RECEIVED` du starter porte
 * un `orderId` qui référence le modèle `Order` générique, pas
 * `TailoringOrder` : le suivre mènerait à une fiche introuvable.
 */
export function lienDe(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null;
  const id = (data as { commandeId?: unknown }).commandeId;
  return typeof id === 'string' && id !== '' ? `/commandes/${id}` : null;
}

const MINUTE = 60_000;
const HEURE = 60 * MINUTE;
const JOUR = 24 * HEURE;

/**
 * « Il y a 18 min », « Il y a 3 h », « 12 août ».
 *
 * Au-delà d'une semaine le relatif cesse d'aider : « il y a 34 jours » ne dit
 * rien qu'une date ne dise mieux.
 */
export function momentRelatif(iso: string, maintenant: Date = new Date()): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const ecart = maintenant.getTime() - d.getTime();
  // Une horloge client en avance sur le serveur ne doit pas produire
  // « il y a -2 min ».
  if (ecart < MINUTE) return 'À l’instant';
  if (ecart < HEURE) return `Il y a ${Math.floor(ecart / MINUTE)} min`;
  if (ecart < JOUR) return `Il y a ${Math.floor(ecart / HEURE)} h`;
  if (ecart < 7 * JOUR) {
    const jours = Math.floor(ecart / JOUR);
    return jours === 1 ? 'Hier' : `Il y a ${jours} j`;
  }
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/**
 * Notification serveur → forme d'affichage.
 *
 * `moment` est calculé à l'affichage et non stocké : une liste ouverte pendant
 * une heure afficherait sinon des « il y a 2 min » périmés.
 */
export function versUI(n: NotificationApi, maintenant?: Date): Notification {
  const apparence = apparenceDe(n.type);
  const href = lienDe(n.data);
  return {
    id: n.id,
    categorie: apparence.categorie,
    icone: apparence.icone,
    couleurIcone: apparence.couleurIcone,
    titre: n.title,
    corps: n.body,
    moment: momentRelatif(n.createdAt, maintenant),
    lue: n.readAt !== null,
    ...(href ? { action: 'Voir la commande', href } : {}),
  };
}
