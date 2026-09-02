/**
 * Langue de l'interface — logique pure, sans React ni DOM implicite.
 *
 * Calquée sur `lib/theme.ts` : le stockage et l'élément racine sont passés en
 * paramètre plutôt que lus dans les globales, ce qui rend le module testable
 * dans l'environnement `node` de Vitest.
 *
 * Le choix est mémorisé sur l'appareil, pas sur le compte. Ce n'est pas un
 * raccourci : l'écran de connexion doit déjà être dans la bonne langue, et à
 * ce moment-là aucune session n'existe pour porter la préférence.
 */

export const LANGUES = ['fr', 'en', 'ar'] as const;
export type Langue = (typeof LANGUES)[number];

/** Le français reste le défaut : c'est la langue dans laquelle l'atelier a été écrit. */
export const LANGUE_DEFAUT: Langue = 'fr';

/**
 * Nom de chaque langue dans cette langue.
 *
 * Jamais traduits : quelqu'un qui cherche l'arabe cherche « العربية », pas
 * « Arabe » — surtout s'il est tombé sur une interface qu'il ne lit pas.
 */
export const NOMS_LANGUES: Record<Langue, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

/** Sens d'écriture. L'arabe se lit de droite à gauche et retourne la mise en page. */
export const SENS: Record<Langue, 'ltr' | 'rtl'> = {
  fr: 'ltr',
  en: 'ltr',
  ar: 'rtl',
};

/**
 * Étiquette de formatage passée à `Intl`.
 *
 * `ar-u-nu-latn` et non `ar` : par défaut, l'arabe rend les chiffres en
 * indo-arabes (٢٥٠٠٠). Un atelier qui lit un montant en francs CFA, une
 * référence de commande ou un numéro de téléphone attend les chiffres qu'il a
 * saisis — le reste de la chaîne d'outils, factures comprises, est en chiffres
 * latins.
 */
export const ETIQUETTE_INTL: Record<Langue, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
  ar: 'ar-u-nu-latn',
};

export const CLE_STOCKAGE = 'atelierpro-langue';

/** Sous-ensemble de `Storage` réellement utilisé — facilite l'injection. */
export type StockageLangue = Pick<Storage, 'getItem' | 'setItem'>;

/** Cible minimale de `appliquerLangue` — `document.documentElement` s'y conforme. */
export type RacineLangue = Pick<Element, 'setAttribute'>;

export function estLangue(valeur: unknown): valeur is Langue {
  return typeof valeur === 'string' && (LANGUES as readonly string[]).includes(valeur);
}

/**
 * Lit la langue mémorisée. À défaut, le français.
 *
 * On n'interroge PAS `navigator.languages`. L'atelier est francophone : un
 * client de passage sur un téléphone réglé en anglais verrait sinon la vitrine
 * dans une langue que l'atelier n'a pas choisie, et il faudrait la corriger à
 * chaque appareil. Le français est le défaut, les deux autres langues sont un
 * choix explicite — que le sélecteur rend disponible dès la page d'accueil.
 *
 * Toute anomalie — pas de stockage (rendu serveur), accès refusé (Safari en
 * navigation privée), valeur corrompue — retombe sur ce même défaut : une
 * langue n'est jamais une raison de casser la page.
 */
export function lireLangue(stockage: StockageLangue | null | undefined): Langue {
  if (!stockage) return LANGUE_DEFAUT;
  try {
    const brut = stockage.getItem(CLE_STOCKAGE);
    return estLangue(brut) ? brut : LANGUE_DEFAUT;
  } catch {
    return LANGUE_DEFAUT;
  }
}

/** Persiste le choix. Un stockage plein ou bloqué ne doit pas annuler le changement. */
export function ecrireLangue(stockage: StockageLangue | null | undefined, langue: Langue): void {
  if (!stockage) return;
  try {
    stockage.setItem(CLE_STOCKAGE, langue);
  } catch {
    // La langue reste appliquée pour la session en cours, simplement pas mémorisée.
  }
}

/**
 * Pose la langue sur la racine : `lang` ET `dir`.
 *
 * Les deux ensemble, toujours. `lang` seul laisserait l'arabe s'afficher de
 * gauche à droite ; `dir` seul priverait les lecteurs d'écran et la césure de
 * l'information de langue.
 */
export function appliquerLangue(racine: RacineLangue, langue: Langue): void {
  racine.setAttribute('lang', langue);
  racine.setAttribute('dir', SENS[langue]);
}

/**
 * Script injecté brut dans <head>, exécuté avant le premier rendu.
 *
 * Indispensable ici, plus encore que pour le thème : sans lui, un utilisateur
 * en arabe verrait la page se construire de gauche à droite puis se retourner
 * entièrement à l'hydratation. Volontairement autonome (aucun import), il ne
 * dépend que de deux globales. Les constantes sont interpolées pour qu'il ne
 * puisse pas diverger du module.
 */
export const SCRIPT_ANTI_FLASH_LANGUE = [
  'try{',
  `var L=${JSON.stringify(LANGUES)};`,
  `var l=localStorage.getItem(${JSON.stringify(CLE_STOCKAGE)});`,
  `if(L.indexOf(l)<0)l=${JSON.stringify(LANGUE_DEFAUT)};`,
  'document.documentElement.setAttribute("lang",l);',
  `document.documentElement.setAttribute("dir",l===${JSON.stringify('ar' satisfies Langue)}?"rtl":"ltr")`,
  '}catch(e){',
  `document.documentElement.setAttribute("lang",${JSON.stringify(LANGUE_DEFAUT)});`,
  'document.documentElement.setAttribute("dir","ltr")',
  '}',
].join('');
