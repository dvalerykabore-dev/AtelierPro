import { PAYS_DEFAUT, composer, decomposer } from '@/lib/indicatifs';

/**
 * Ce que le champ téléphone affiche : un pays choisi et un numéro tel qu'il a
 * été tapé — pas sa version normalisée.
 */
export interface EtatSaisie {
  codePays: string;
  /** Ce que la personne voit dans le champ, zéro de tête et espaces compris. */
  saisie: string;
}

export interface Transition {
  etat: EtatSaisie;
  /** Numéro international à remonter au formulaire. Vide s'il n'y a pas de numéro. */
  valeur: string;
}

/**
 * Logique de saisie du champ téléphone, sortie du composant pour être testable.
 *
 * Elle y est arrivée après coup, et à cause d'un défaut que personne n'aurait
 * vu en relisant le code : le composant déduisait le pays de la valeur remontée,
 * si bien que choisir un pays avant de taper le numéro ne tenait pas une
 * milliseconde — sans chiffres, le numéro composé est vide, et un pays n'a
 * nulle part où vivre dans une chaîne vide. Le menu retombait sur le Burkina à
 * chaque tentative. C'est pourtant l'ordre naturel : on déroule l'indicatif,
 * puis on tape.
 *
 * Rien ici ne touche au DOM : ces trois fonctions se testent seules.
 */

/** Point de départ : ce qu'on affiche pour une valeur déjà enregistrée. */
export function etatInitial(valeur: string, codeDefaut = PAYS_DEFAUT): EtatSaisie {
  const d = decomposer(valeur, codeDefaut);
  return { codePays: d.codePays, saisie: d.national };
}

/**
 * La valeur a changé côté formulaire : faut-il réécrire ce qu'on affiche ?
 *
 * Rend `null` quand il n'y a rien à faire. C'est le cas important : si la
 * valeur reçue est exactement ce que l'état courant produit, la réécrire
 * remplacerait la saisie par sa version normalisée, et le zéro de tête que la
 * personne vient de taper disparaîtrait sous ses doigts.
 */
export function resynchroniser(
  valeur: string,
  etat: EtatSaisie,
  codeDefaut = PAYS_DEFAUT,
): EtatSaisie | null {
  if (composer(etat.codePays, etat.saisie) === valeur) return null;
  return etatInitial(valeur, codeDefaut);
}

/**
 * On déroule un indicatif.
 *
 * Le pays est retenu même sans numéro : c'est tout l'objet de l'état local. La
 * valeur remontée reste vide tant qu'aucun chiffre n'est saisi — « +226 » seul
 * n'est pas un numéro et ne doit pas s'enregistrer comme tel.
 */
export function choisirPays(code: string, etat: EtatSaisie): Transition {
  const suivant = { codePays: code, saisie: etat.saisie };
  return { etat: suivant, valeur: composer(code, etat.saisie) };
}

/** Ne garde que ce qui a un sens dans un numéro tapé à la main. */
export function nettoyerSaisie(brut: string): string {
  return [...brut].filter((c) => (c >= '0' && c <= '9') || c === ' ').join('');
}

/**
 * On tape, ou on colle.
 *
 * Un numéro international collé dans le champ du numéro est rangé dans les deux
 * cases. C'est le geste courant — on recopie depuis un message WhatsApp — et
 * sans ce traitement il produirait un numéro à double indicatif, du genre
 * +226 226 70 12 34 56, qui ne sonne nulle part.
 */
export function taper(brut: string, etat: EtatSaisie): Transition {
  const nu = brut.trim();
  if (nu.startsWith('+') || nu.startsWith('00')) {
    const d = decomposer(nu, etat.codePays);
    const suivant = { codePays: d.codePays, saisie: d.national };
    return { etat: suivant, valeur: composer(d.codePays, d.national) };
  }
  const propre = nettoyerSaisie(brut);
  const suivant = { codePays: etat.codePays, saisie: propre };
  return { etat: suivant, valeur: composer(etat.codePays, propre) };
}
