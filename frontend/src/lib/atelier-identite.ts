/**
 * Identité affichée de l'atelier connecté.
 *
 * Le nom était une constante — « Atelier Koné » s'affichait sur le tableau de
 * bord, les rapports, la trésorerie et les dépenses, quel que soit le compte.
 * Il vient maintenant du compte lui-même.
 */

export interface CompteAtelier {
  workshopName: string | null;
  email: string;
}

/**
 * Nom du produit, affiché là où aucune session n'existe encore — les écrans
 * d'authentification. Ne pas confondre avec le nom de l'atelier, qui appartient
 * au compte : avant de se connecter, personne ne sait de quel atelier il s'agit.
 */
export const NOM_PRODUIT = 'AtelierPro';

/** Nom neutre tant que le compte n'a rien renseigné — jamais une raison sociale inventée. */
export const NOM_ATELIER_DEFAUT = 'Mon atelier';

/**
 * Nom à afficher.
 *
 * On ne se rabat pas sur l'adresse e-mail : « dvalerykabore@gmail.com » en
 * sous-titre d'un écran de trésorerie n'apprend rien et expose une adresse à
 * qui regarde par-dessus l'épaule, en atelier.
 */
export function nomAtelierDe(compte: CompteAtelier | null | undefined): string {
  const nom = compte?.workshopName?.trim();
  return nom ? nom : NOM_ATELIER_DEFAUT;
}

/**
 * Initiales de la pastille du rail de navigation.
 *
 * Le nom de l'atelier d'abord, l'adresse e-mail à défaut : ici une lettre
 * tirée de l'adresse reste discrète et vaut mieux qu'un « MK » qui désignait
 * un artisan fictif.
 */
export function initialesAtelierDe(compte: CompteAtelier | null | undefined): string {
  const nom = compte?.workshopName?.trim();
  if (nom) {
    const mots = nom.split(' ').filter(Boolean);
    if (mots.length === 1) return (mots[0] ?? '').slice(0, 2).toUpperCase();
    return mots
      .slice(0, 2)
      .map((m) => m[0] ?? '')
      .join('')
      .toUpperCase();
  }

  const email = compte?.email?.trim();
  if (email) return email.slice(0, 2).toUpperCase();

  // Aucun compte chargé : deux points valent mieux que des initiales
  // empruntées à quelqu'un.
  return '··';
}
