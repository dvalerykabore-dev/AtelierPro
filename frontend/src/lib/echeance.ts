/**
 * Date d'échéance d'une commande, telle qu'on la saisit et qu'on la lit.
 *
 * Le formulaire de commande n'en demandait aucune : il affichait une « date de
 * livraison calculée » constante — « Mardi 28 jan » pour toutes les commandes —
 * et n'envoyait rien au serveur. Toutes les commandes enregistrées jusqu'ici
 * ont une échéance nulle, donc le passage quotidien ne peut en signaler aucune
 * en retard et le planning n'a rien à quoi se raccrocher.
 *
 * Les fonctions ici sont pures : elles se testent sans navigateur, et c'est
 * exactement ce qui manquait pour attraper le défaut d'origine.
 */

import { ETIQUETTE_INTL, LANGUE_DEFAUT, type Langue } from '@/lib/langue';

/** Un jour au format du champ `<input type="date">` : `2026-08-31`. */
export type JourISO = string;

const JOUR_MS = 24 * 60 * 60 * 1000;

/** Aujourd'hui au format du champ date, en heure locale de l'atelier. */
export function aujourdhuiISO(maintenant = new Date()): JourISO {
  const a = maintenant.getFullYear();
  const m = String(maintenant.getMonth() + 1).padStart(2, '0');
  const j = String(maintenant.getDate()).padStart(2, '0');
  return `${a}-${m}-${j}`;
}

/** Découpe `2026-08-31` sans passer par `Date`, dont le fuseau décalerait le jour. */
function partsDe(jour: JourISO): { a: number; m: number; j: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(jour);
  if (!m) return null;
  return { a: Number(m[1]), m: Number(m[2]), j: Number(m[3]) };
}

/**
 * Convertit le jour saisi en instant ISO, à midi UTC.
 *
 * Midi et non minuit : à minuit UTC, un atelier situé à l'ouest voit la date
 * reculer d'un jour à l'affichage. Midi laisse douze heures de marge de chaque
 * côté, ce qui couvre tous les fuseaux habités.
 */
export function versISO(jour: JourISO): string | null {
  const p = partsDe(jour);
  if (!p) return null;
  const d = new Date(Date.UTC(p.a, p.m - 1, p.j, 12, 0, 0));
  if (Number.isNaN(d.getTime())) return null;
  // `Date.UTC` accepte le 31 février et le décale : on refuse ce que
  // l'utilisateur n'a pas pu vouloir dire.
  if (d.getUTCMonth() !== p.m - 1 || d.getUTCDate() !== p.j) return null;
  return d.toISOString();
}

/** Nombre de jours entiers entre deux jours. Négatif si le second est passé. */
export function joursEntre(depuis: JourISO, jusqua: JourISO): number | null {
  const a = partsDe(depuis);
  const b = partsDe(jusqua);
  if (!a || !b) return null;
  const ms = Date.UTC(b.a, b.m - 1, b.j) - Date.UTC(a.a, a.m - 1, a.j);
  return Math.round(ms / JOUR_MS);
}

/**
 * Contrôle de la date saisie. Rend le message à afficher, ou `null`.
 *
 * Une échéance dans le passé est refusée : elle naîtrait déjà en retard, et le
 * passage quotidien la signalerait dès le lendemain matin. Une échéance vide
 * est acceptée — toutes les commandes n'ont pas de date promise, et bloquer la
 * saisie ferait perdre la commande entière.
 */
export function validerEcheance(jour: JourISO, aujourdhui = aujourdhuiISO()): string | null {
  if (jour === '') return null;
  if (!partsDe(jour) || versISO(jour) === null) return 'Date invalide.';
  const ecart = joursEntre(aujourdhui, jour);
  if (ecart === null) return 'Date invalide.';
  if (ecart < 0) return 'Cette date est déjà passée — la commande naîtrait en retard.';
  return null;
}

/**
 * « mardi 8 septembre » — le jour de la semaine compte autant que la date en
 * atelier : une livraison promise « le 8 » se négocie autrement quand on voit
 * que le 8 tombe un dimanche.
 *
 * Les noms de jours et de mois viennent d'`Intl` plutôt que d'un tableau figé :
 * le tableau ne connaissait que le français, et l'écran retourné en arabe
 * affichait « mardi 8 septembre » au milieu d'un texte arabe.
 */
export function libelleEcheance(jour: JourISO, langue: Langue = LANGUE_DEFAUT): string {
  const p = partsDe(jour);
  if (!p) return '—';
  const d = new Date(Date.UTC(p.a, p.m - 1, p.j, 12));
  return new Intl.DateTimeFormat(ETIQUETTE_INTL[langue], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(d);
}

/**
 * « dans 5 jours », « demain », « aujourd'hui » — plus parlant qu'une date à
 * comparer de tête.
 *
 * `Intl.RelativeTimeFormat` rend « demain » et « hier » de lui-même avec
 * `numeric: 'auto'`, dans les trois langues, et décline les pluriels selon les
 * règles de chacune — l'arabe en compte six.
 */
export function delaiEnJours(
  jour: JourISO,
  aujourdhui = aujourdhuiISO(),
  langue: Langue = LANGUE_DEFAUT,
): string {
  const n = joursEntre(aujourdhui, jour);
  if (n === null) return '';
  return new Intl.RelativeTimeFormat(ETIQUETTE_INTL[langue], { numeric: 'auto' }).format(n, 'day');
}
