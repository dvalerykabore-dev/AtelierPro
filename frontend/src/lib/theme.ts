/**
 * Sélecteur de thème — logique pure, sans React ni DOM implicite.
 *
 * Le stockage et l'élément racine sont passés en paramètre plutôt que lus dans
 * les globales : ça rend le module testable dans l'environnement `node` de
 * Vitest, et ça évite un `typeof window === 'undefined'` disséminé partout.
 *
 * Le couplage avec le CSS tient à une seule chose : `ATTRIBUT_THEME` sur
 * <html>, que globals.css lit via le sélecteur [data-theme='light'].
 */

export const THEMES = ['dark', 'light'] as const;
export type Theme = (typeof THEMES)[number];

/**
 * Le sombre est le défaut délibérément : c'est l'identité visuelle de la
 * vitrine. On n'interroge pas `prefers-color-scheme` — un visiteur dont le
 * téléphone est en clair verrait une première impression différente de celle
 * qui a été conçue.
 */
export const THEME_DEFAUT: Theme = 'dark';

export const CLE_STOCKAGE = 'atelierpro-theme';
export const ATTRIBUT_THEME = 'data-theme';

/** Sous-ensemble de `Storage` réellement utilisé — facilite l'injection. */
export type StockageTheme = Pick<Storage, 'getItem' | 'setItem'>;

/** Cible minimale de `appliquerTheme` — `document.documentElement` s'y conforme. */
export type RacineTheme = Pick<Element, 'setAttribute'>;

export function estTheme(valeur: unknown): valeur is Theme {
  return typeof valeur === 'string' && (THEMES as readonly string[]).includes(valeur);
}

/**
 * Lit le thème mémorisé. Toute anomalie — pas de stockage (rendu serveur),
 * accès refusé (Safari en navigation privée), valeur corrompue — retombe
 * silencieusement sur le défaut : un thème n'est jamais une raison de casser
 * la page.
 */
export function lireTheme(stockage: StockageTheme | null | undefined): Theme {
  if (!stockage) return THEME_DEFAUT;
  try {
    const brut = stockage.getItem(CLE_STOCKAGE);
    return estTheme(brut) ? brut : THEME_DEFAUT;
  } catch {
    return THEME_DEFAUT;
  }
}

/** Persiste le choix. Un stockage plein ou bloqué ne doit pas annuler la bascule. */
export function ecrireTheme(stockage: StockageTheme | null | undefined, theme: Theme): void {
  if (!stockage) return;
  try {
    stockage.setItem(CLE_STOCKAGE, theme);
  } catch {
    // Le thème reste appliqué pour la session en cours, simplement pas mémorisé.
  }
}

/** Pose le thème sur la racine. Le sombre est écrit explicitement, jamais omis :
 *  un attribut absent et un attribut « dark » doivent rester indiscernables. */
export function appliquerTheme(racine: RacineTheme, theme: Theme): void {
  racine.setAttribute(ATTRIBUT_THEME, theme);
}

export function themeSuivant(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}

/**
 * Script injecté brut dans <head>, exécuté avant le premier rendu.
 *
 * Sans lui, React ne pose `data-theme` qu'après l'hydratation : un utilisateur
 * en thème clair verrait un flash bleu nuit à chaque chargement de page. Il est
 * volontairement autonome (pas d'import) et ne dépend que de deux globales.
 * Les constantes sont interpolées pour qu'il ne puisse pas diverger du module.
 */
export const SCRIPT_ANTI_FLASH = [
  'try{',
  `var t=localStorage.getItem(${JSON.stringify(CLE_STOCKAGE)});`,
  `document.documentElement.setAttribute(${JSON.stringify(ATTRIBUT_THEME)},`,
  `t===${JSON.stringify('light' satisfies Theme)}?${JSON.stringify('light' satisfies Theme)}:${JSON.stringify(THEME_DEFAUT)})`,
  '}catch(e){',
  `document.documentElement.setAttribute(${JSON.stringify(ATTRIBUT_THEME)},${JSON.stringify(THEME_DEFAUT)})`,
  '}',
].join('');
