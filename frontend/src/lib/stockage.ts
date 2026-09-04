/**
 * Ce qui a le droit de finir dans un `src` d'image.
 *
 * Toute image affichée par l'application est d'abord passée par
 * `POST /api/upload` : contrôle des octets côté serveur, dépôt sur notre
 * stockage, et c'est l'URL de livraison renvoyée par cette route qu'on
 * enregistre. Ce module dit si une URL vient bien de là.
 *
 * Pourquoi c'est une règle et pas une préférence : ces URL finissent dans des
 * `<img src>` — et dans un `next/image` marqué `unoptimized`, ce qui revient au
 * même. Le navigateur va donc chercher l'adresse **telle quelle**. Une adresse
 * quelconque ferait partir une requête vers un tiers à chaque affichage, qui
 * verrait passer l'adresse IP de l'atelier sans que personne ne l'ait voulu.
 *
 * Le raisonnement était écrit pour le logo et appliqué au seul logo ; les
 * photos de tissu et de modèle passaient à travers. Il vit ici désormais, au
 * singulier, pour que la prochaine image ajoutée hérite du contrôle au lieu de
 * le redécouvrir.
 */

/** Hôte de livraison Cloudinary — celui que renvoie `secure_url`. */
export const HOTE_STOCKAGE = 'res.cloudinary.com';

/**
 * `true` si l'URL désigne bien une image de notre stockage.
 *
 * Volontairement strict : HTTPS et cet hôte exactement. Un sous-domaine
 * ressemblant (`res.cloudinary.com.exemple.net`) doit être refusé, ce qu'une
 * comparaison de fin de chaîne laisserait passer.
 */
export function estUrlStockage(url: string): boolean {
  let analysee: URL;
  try {
    analysee = new URL(url);
  } catch {
    return false;
  }
  return analysee.protocol === 'https:' && analysee.hostname === HOTE_STOCKAGE;
}
