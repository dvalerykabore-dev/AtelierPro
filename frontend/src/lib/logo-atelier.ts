/**
 * Logo de l'atelier.
 *
 * La pastille affichait un « A » figé sur fond or, identique pour tous les
 * comptes. Chaque atelier pose maintenant le sien : le fichier part par
 * `POST /api/upload` (Cloudinary, contrôle des octets côté serveur), et c'est
 * l'URL de livraison renvoyée par cette route qu'on enregistre.
 *
 * Seules ces URL-là sont acceptées. Le logo finit dans un `<img src>` chargé
 * par chaque écran de l'atelier : une adresse quelconque ferait partir une
 * requête vers un tiers à chaque affichage, qui verrait passer l'adresse IP de
 * l'atelier sans que personne ne l'ait voulu. On reste donc sur le stockage où
 * la route d'envoi a effectivement écrit le fichier.
 */

/** Hôte de livraison Cloudinary — celui que renvoie `secure_url`. */
export const HOTE_LOGO = 'res.cloudinary.com';

/**
 * `true` si l'URL désigne bien une image de notre stockage.
 *
 * Volontairement strict : HTTPS et cet hôte exactement. Un sous-domaine
 * ressemblant (`res.cloudinary.com.exemple.net`) doit être refusé, ce qu'une
 * comparaison de fin de chaîne laisserait passer.
 */
export function estUrlLogo(url: string): boolean {
  let analysee: URL;
  try {
    analysee = new URL(url);
  } catch {
    return false;
  }
  return analysee.protocol === 'https:' && analysee.hostname === HOTE_LOGO;
}

/**
 * Contrôle d'une valeur saisie. Rend le message à afficher, ou `null`.
 *
 * La chaîne vide est valide et signifie « retirer le logo » : on revient alors
 * aux initiales, comme avant tout envoi.
 */
export function validerLogo(url: string): string | null {
  if (url === '') return null;
  if (!estUrlLogo(url)) return 'Ce logo ne provient pas d’un envoi de l’application.';
  return null;
}
