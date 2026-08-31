/**
 * Heures d'ouverture de l'atelier.
 *
 * L'écran de réglages affichait « 08h00 — 18h00 » en lecture seule, tiré du jeu
 * d'exemple : tous les ateliers voyaient les mêmes horaires, et aucun ne
 * pouvait poser les siens.
 *
 * On garde deux heures séparées plutôt qu'un libellé libre. Une chaîne
 * « 08h00 — 18h00 » s'affiche bien mais ne se compare pas : le jour où le
 * planning devra dire « cette tenue est promise après la fermeture », il lui
 * faudra deux nombres, pas une phrase.
 *
 * Module pur, sans React ni accès réseau — la route et le formulaire jugent
 * donc par le même code, et un horaire accepté à l'écran ne peut pas être
 * refusé à l'enregistrement.
 */

/** Une heure au format 24 h, « 08:30 ». C'est la forme stockée en base. */
export type Heure = string;

/** Pas de la liste déroulante, en minutes. La demi-heure suffit à un atelier. */
const PAS_MINUTES = 30;

const FORMAT = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Minutes écoulées depuis minuit, ou `null` si l'heure n'est pas lisible. */
export function minutesDe(heure: Heure): number | null {
  const m = FORMAT.exec(heure);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** `08:30` → `08h30`. La convention francophone, celle qu'on lit sur une devanture. */
export function formaterHeure(heure: Heure): string {
  const m = FORMAT.exec(heure);
  if (!m) return '—';
  return `${m[1]}h${m[2]}`;
}

/**
 * Tous les créneaux proposés dans le dérouleur, de `00:00` à `23:30`.
 *
 * La journée entière, et non une plage « raisonnable » : un atelier qui livre
 * un mariage travaille tard, et une liste qui s'arrête à 20 h l'obligerait à
 * mentir sur ses horaires.
 */
export const CRENEAUX: readonly Heure[] = Array.from(
  { length: (24 * 60) / PAS_MINUTES },
  (_, i) => {
    const total = i * PAS_MINUTES;
    const h = String(Math.floor(total / 60)).padStart(2, '0');
    const min = String(total % 60).padStart(2, '0');
    return `${h}:${min}`;
  },
);

/**
 * Contrôle du couple ouverture / fermeture. Rend le message à afficher, ou `null`.
 *
 * Les deux vont ensemble : une ouverture sans fermeture s'afficherait
 * « 08h00 — — », ce qui ne renseigne personne. Vider les deux est en revanche
 * un retrait volontaire, pas une erreur.
 */
export function validerHoraires(ouverture: Heure, fermeture: Heure): string | null {
  const aOuverture = ouverture !== '';
  const aFermeture = fermeture !== '';

  if (!aOuverture && !aFermeture) return null;
  if (aOuverture !== aFermeture) return 'Indiquez l’ouverture et la fermeture, ou aucune des deux.';

  const debut = minutesDe(ouverture);
  const fin = minutesDe(fermeture);
  if (debut === null || fin === null) return 'Heure invalide.';

  // Une fermeture antérieure à l'ouverture décrirait une nuit à cheval sur
  // deux jours. Aucun atelier de couture ne fonctionne ainsi, et l'accepter
  // rendrait toute durée calculée négative.
  if (fin <= debut) return 'La fermeture doit venir après l’ouverture.';

  return null;
}

/** « 08h00 — 18h00 », ou un tiret tant que rien n'est posé. */
export function libelleHoraires(
  ouverture: Heure | null | undefined,
  fermeture: Heure | null | undefined,
): string {
  if (!ouverture || !fermeture) return '—';
  if (minutesDe(ouverture) === null || minutesDe(fermeture) === null) return '—';
  return `${formaterHeure(ouverture)} — ${formaterHeure(fermeture)}`;
}

/** Durée d'ouverture en heures, arrondie à la demie — « 9,5 h par jour ». */
export function dureeOuverture(ouverture: Heure, fermeture: Heure): number | null {
  const debut = minutesDe(ouverture);
  const fin = minutesDe(fermeture);
  if (debut === null || fin === null || fin <= debut) return null;
  return (fin - debut) / 60;
}
