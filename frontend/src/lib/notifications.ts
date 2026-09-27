import type { CategorieNotif, Notification } from '@/lib/mock/atelier';
import { DICTIONNAIRES } from '@/lib/i18n/dictionnaires';
import { traduire, type Parametres } from '@/lib/i18n/traduire';
import { ETIQUETTE_INTL, LANGUE_DEFAUT, type Langue } from '@/lib/langue';

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

/** Éléments qu'une alerte d'atelier transporte pour être rejouée en langue. */
interface PartsAlerte {
  reference: string;
  client: string;
  tenue: string;
  echeance?: string;
}

const chaine = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null);

/**
 * Extrait de `data` de quoi recomposer le texte, ou `null`.
 *
 * `null` pour les notifications écrites avant que le serveur ne renseigne ces
 * champs : l'écran retombe alors sur le `title`/`body` français enregistré, ce
 * qui reste très préférable à une ligne vide.
 */
function partsDe(data: unknown): PartsAlerte | null {
  if (typeof data !== 'object' || data === null) return null;
  const d = data as Record<string, unknown>;
  const reference = chaine(d.reference);
  const client = chaine(d.client);
  const tenue = chaine(d.tenue);
  if (!reference || !client || !tenue) return null;
  const echeance = chaine(d.echeance);
  return { reference, client, tenue, ...(echeance ? { echeance } : {}) };
}

/** Phrases rejouables, indexées par type de notification. */
const MODELES: Record<string, { titre: string; corps: string }> = {
  COMMANDE_EN_RETARD: {
    titre: 'Commande {reference} en retard — {client}',
    corps: '{tenue} devait être livrée le {date}.',
  },
  LIVRAISON_DEMAIN: {
    titre: 'Livraison demain — {client}',
    corps: '{tenue} ({reference}) est attendue demain.',
  },
};

const MINUTE = 60_000;
const HEURE = 60 * MINUTE;
const JOUR = 24 * HEURE;

/**
 * « Il y a 18 min », « Il y a 3 h », « 12 août ».
 *
 * Au-delà d'une semaine le relatif cesse d'aider : « il y a 34 jours » ne dit
 * rien qu'une date ne dise mieux.
 */
export function momentRelatif(
  iso: string,
  maintenant: Date = new Date(),
  langue: Langue = LANGUE_DEFAUT,
): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const etiquette = ETIQUETTE_INTL[langue];
  const relatif = new Intl.RelativeTimeFormat(etiquette, { numeric: 'auto', style: 'short' });

  const ecart = maintenant.getTime() - d.getTime();
  // Une horloge client en avance sur le serveur ne doit pas produire
  // « il y a -2 min ».
  if (ecart < MINUTE) return traduire(DICTIONNAIRES[langue], 'À l’instant');
  if (ecart < HEURE) return presenter(relatif.format(-Math.floor(ecart / MINUTE), 'minute'));
  if (ecart < JOUR) return presenter(relatif.format(-Math.floor(ecart / HEURE), 'hour'));
  if (ecart < 7 * JOUR) return presenter(relatif.format(-Math.floor(ecart / JOUR), 'day'));
  return new Intl.DateTimeFormat(etiquette, { day: 'numeric', month: 'short' }).format(d);
}

/**
 * Mise en forme de la vignette de date.
 *
 * Deux retouches sur ce que rend `Intl` : la majuscule initiale, parce que la
 * vignette est une légende autonome et non un mot dans une phrase ; et les
 * espaces insécables fines que le français insère avant « min », normalisées
 * en espace ordinaire — même raison que `formatPrice`, une sortie qui se
 * compare et se teste sans caractère invisible. Sans effet sur l'arabe, qui
 * n'a pas de casse.
 */
function presenter(s: string): string {
  // Échappées plutôt que littérales : une espace fine et une insécable sont
  // indiscernables à l'œil dans le source.
  return (s.charAt(0).toLocaleUpperCase() + s.slice(1)).replace(/[\u202f\u00a0]/g, ' ');
}

/**
 * Notification serveur → forme d'affichage.
 *
 * `moment` est calculé à l'affichage et non stocké : une liste ouverte pendant
 * une heure afficherait sinon des « il y a 2 min » périmés.
 */
export function versUI(
  n: NotificationApi,
  maintenant?: Date,
  langue: Langue = LANGUE_DEFAUT,
): Notification {
  const apparence = apparenceDe(n.type);
  const href = lienDe(n.data);
  const dictionnaire = DICTIONNAIRES[langue];
  const t = (cle: string, params?: Parametres) => traduire(dictionnaire, cle, params);

  // Le serveur écrit `title`/`body` en français au moment de l'alerte. Quand il
  // a aussi rangé les éléments dans `data`, on rejoue la phrase dans la langue
  // du lecteur plutôt que d'afficher la version figée ; sinon on garde celle-ci.
  const parts = MODELES[n.type] ? partsDe(n.data) : null;
  const modele = parts ? MODELES[n.type] : undefined;
  const valeurs: Parametres = parts
    ? {
        reference: parts.reference,
        client: parts.client,
        tenue: parts.tenue,
        date: parts.echeance
          ? new Intl.DateTimeFormat(ETIQUETTE_INTL[langue], {
              day: 'numeric',
              month: 'long',
            }).format(new Date(parts.echeance))
          : '',
      }
    : {};

  return {
    id: n.id,
    categorie: apparence.categorie,
    icone: apparence.icone,
    couleurIcone: apparence.couleurIcone,
    titre: modele ? t(modele.titre, valeurs) : n.title,
    corps: modele ? t(modele.corps, valeurs) : n.body,
    moment: momentRelatif(n.createdAt, maintenant, langue),
    lue: n.readAt !== null,
    ...(href ? { action: t('Voir la commande'), href } : {}),
  };
}
