/**
 * Moteur de traduction — logique pure, sans React.
 *
 * La clé est le texte français lui-même, et non un identifiant inventé
 * (`atelier.commandes.titre`). Trois raisons, dans l'ordre d'importance :
 *
 * 1. Une traduction manquante affiche le français d'origine, pas une clé nue.
 *    Sur une interface de 3 000 chaînes, la couverture ne sera jamais totale
 *    du premier coup ; le pire moment pour s'en apercevoir est devant un
 *    client, et « atelier.commandes.titre » au milieu d'un écran est pire que
 *    la phrase française qui s'y trouvait avant.
 * 2. La phrase reste lisible dans le composant. Relire un écran ne demande
 *    plus d'aller chercher ce que vaut chaque clé.
 * 3. Rien à inventer, donc rien à faire diverger entre le code et le
 *    dictionnaire.
 *
 * Le prix : deux chaînes françaises identiques dans deux contextes différents
 * partagent leur traduction. En pratique le problème est rare, et il se règle
 * en désambiguïsant le français — ce qui améliore aussi le français.
 */

import { ETIQUETTE_INTL, LANGUE_DEFAUT, type Langue } from '@/lib/langue';

/** Catégories de pluriel d'`Intl.PluralRules`. L'arabe les utilise toutes les six. */
export type CategoriePluriel = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

/**
 * Une entrée de dictionnaire.
 *
 * Une chaîne dans le cas courant ; un objet par catégorie quand la langue
 * cible décline autrement que le français. Le français distingue deux formes,
 * l'anglais deux, l'arabe six — un tableau à deux cases ne pouvait pas suffire.
 */
export type Entree = string | Partial<Record<CategoriePluriel, string>>;

export type Dictionnaire = Record<string, Entree>;

export type Parametres = Record<string, string | number>;

const MOTIF = /\{(\w+)\}/g;

/** Remplace `{nom}` par sa valeur. Un paramètre absent laisse le marqueur visible. */
function interpoler(modele: string, params: Parametres | undefined): string {
  if (!params) return modele;
  return modele.replace(MOTIF, (entier, nom: string) => {
    const v = params[nom];
    return v === undefined ? entier : String(v);
  });
}

/**
 * Traduit une phrase française.
 *
 * L'absence de traduction n'est pas une erreur : c'est le cas nominal tant
 * qu'un écran n'a pas été repris. On rend alors la clé, qui EST la phrase
 * française.
 */
export function traduire(
  dictionnaire: Dictionnaire | null | undefined,
  cle: string,
  params?: Parametres,
): string {
  const entree = dictionnaire?.[cle];
  if (typeof entree === 'string' && entree !== '') return interpoler(entree, params);
  // Une entrée déclinée sans compte : on prend la forme générique plutôt que
  // de rendre la clé, qui serait la forme plurielle française.
  if (entree && typeof entree === 'object') {
    const generique = entree.other ?? entree.one;
    if (generique) return interpoler(generique, params);
  }
  return interpoler(cle, params);
}

/**
 * Choisit la forme correspondant au nombre, puis traduit.
 *
 * Les deux formes françaises sont passées telles quelles — `un` et `autre` —
 * pour que le repli reste du français correct même sans dictionnaire. C'est la
 * forme plurielle française qui sert de clé côté cible, parce qu'elle est la
 * plus discriminante : « 1 commande » et « 2 commandes » se ressemblent trop
 * pour distinguer deux entrées.
 *
 * `n` est injecté automatiquement sous le nom `n` : `tp('{n} commande',
 * '{n} commandes', 3)` suffit.
 */
export function traduirePluriel(
  dictionnaire: Dictionnaire | null | undefined,
  langue: Langue,
  un: string,
  autre: string,
  n: number,
  params?: Parametres,
): string {
  const avecN: Parametres = { n, ...params };
  const entree = dictionnaire?.[autre];

  if (entree && typeof entree === 'object') {
    const categorie = categorieDe(langue, n);
    const forme = entree[categorie] ?? entree.other ?? entree.one;
    if (forme) return interpoler(forme, avecN);
  }
  if (typeof entree === 'string' && entree !== '') {
    // Langue cible à forme unique pour cette phrase — l'anglais s'en contente
    // souvent (« 3 items » / « 1 item » diffèrent, mais « 3 h » ne varie pas).
    return interpoler(entree, avecN);
  }

  // Repli français. Le français range 0 et 1 au singulier, contrairement à
  // l'anglais : « 0 commande » et non « 0 commandes ».
  return interpoler(Math.abs(n) < 2 ? un : autre, avecN);
}

const regles = new Map<Langue, Intl.PluralRules>();

/** Catégorie de pluriel d'un nombre dans une langue. Six valeurs possibles en arabe. */
export function categorieDe(langue: Langue, n: number): CategoriePluriel {
  let r = regles.get(langue);
  if (!r) {
    r = new Intl.PluralRules(ETIQUETTE_INTL[langue]);
    regles.set(langue, r);
  }
  return r.select(n) as CategoriePluriel;
}

/**
 * Formate un nombre selon la langue.
 *
 * L'arabe est demandé en chiffres latins (voir `ETIQUETTE_INTL`) : un montant
 * en francs CFA, une référence de commande et un numéro de téléphone doivent
 * rester lisibles par tout l'atelier, y compris sur une facture.
 */
export function formaterNombre(n: number, langue: Langue = LANGUE_DEFAUT): string {
  // Les séparateurs insécables cassent les comparaisons de tests et les
  // retours à la ligne ; on les ramène à une espace ordinaire, comme le fait
  // déjà `formatPrice`.
  return n.toLocaleString(ETIQUETTE_INTL[langue]).replace(/\s/g, ' ');
}
