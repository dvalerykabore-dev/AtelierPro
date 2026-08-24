/**
 * Vocabulaire de la trésorerie — partagé entre le serveur et les écrans.
 *
 * Aucun import `server-only` ici : les mêmes libellés servent à valider une
 * requête et à remplir un menu déroulant. Deux listes finiraient par diverger,
 * et un poste accepté par l'API mais absent du formulaire est invisible.
 */

/** Sens d'un mouvement de caisse. */
export const SENS = ['IN', 'OUT'] as const;
export type Sens = (typeof SENS)[number];

/**
 * Postes de dépense.
 *
 * Le regroupement initialement proposé — « loyer, électricité, eau » en une
 * seule ligne — a été éclaté : une facture d'électricité qui double se voit
 * seulement si elle n'est pas noyée dans le loyer. Le prix à payer est un choix
 * de plus à la saisie, ce qui reste moins coûteux qu'une dépense qu'on ne peut
 * pas expliquer en fin de mois.
 */
export const POSTES = [
  { cle: 'TISSUS', label: 'Tissus et fournitures' },
  { cle: 'SALAIRES', label: 'Salaires et main-d’œuvre' },
  { cle: 'BRODERIE', label: 'Broderie et façon' },
  { cle: 'COMMISSION', label: 'Commissions' },
  { cle: 'LOYER', label: 'Loyer' },
  { cle: 'ENERGIE', label: 'Électricité et eau' },
  { cle: 'INTERNET', label: 'Internet et téléphone' },
  { cle: 'MACHINES', label: 'Machines et entretien' },
  { cle: 'TRANSPORT', label: 'Transport et livraison' },
  { cle: 'TAXES', label: 'Taxes et patente' },
  { cle: 'PUBLICITE', label: 'Publicité' },
  { cle: 'DIVERS', label: 'Divers' },
] as const;

export type PosteCle = (typeof POSTES)[number]['cle'];

export const CLES_POSTES = POSTES.map((p) => p.cle) as [PosteCle, ...PosteCle[]];

/** Libellé lisible d'un poste ; renvoie la clé brute si elle est inconnue. */
export function libellePoste(cle: string | null | undefined): string {
  if (!cle) return 'Sans poste';
  return POSTES.find((p) => p.cle === cle)?.label ?? cle;
}

/** Modes de règlement — ceux qu'un atelier ouest-africain rencontre. */
export const MODES = [
  { cle: 'ESPECES', label: 'Espèces' },
  { cle: 'MOBILE_MONEY', label: 'Mobile Money' },
  { cle: 'VIREMENT', label: 'Virement' },
  { cle: 'CARTE', label: 'Carte' },
] as const;

export type ModeCle = (typeof MODES)[number]['cle'];

export const CLES_MODES = MODES.map((m) => m.cle) as [ModeCle, ...ModeCle[]];

export function libelleMode(cle: string | null | undefined): string {
  if (!cle) return '—';
  return MODES.find((m) => m.cle === cle)?.label ?? cle;
}

/** « 2026-08-23 » — le jour, sans dépendre du fuseau du navigateur. */
export function jourIso(d: Date): string {
  const mois = String(d.getMonth() + 1).padStart(2, '0');
  const jour = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mois}-${jour}`;
}

/** « 2026-08 » — clé de regroupement mensuel. */
export function moisIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const MOIS_LONGS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

/** « 2026-08 » → « août 2026 ». */
export function libelleMois(cle: string): string {
  const [annee, mois] = cle.split('-');
  const index = Number(mois) - 1;
  return `${MOIS_LONGS[index] ?? '?'} ${annee}`;
}

/** « 2026-08 » → « Août », pour les axes de graphique. */
export function libelleMoisCourt(cle: string): string {
  const mois = MOIS_LONGS[Number(cle.split('-')[1]) - 1];
  return mois ? mois.charAt(0).toUpperCase() + mois.slice(1, 4) : '?';
}
