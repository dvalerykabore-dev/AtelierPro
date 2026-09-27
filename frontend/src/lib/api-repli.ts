import { api, ApiError } from '@/lib/api';

/** Délai laissé au rafraîchissement de jeton en vol avant de retenter. */
const ATTENTE_MS = 500;

/**
 * Rejoue une requête une seule fois lorsqu'elle échoue en 401.
 *
 * Pourquoi : chaque hook monte sa propre requête. Quand le jeton d'accès vient
 * d'expirer, la première déclenche le rafraîchissement de `lib/api.ts` — qui
 * est à verrou unique — et les autres, parties en même temps, peuvent recevoir
 * leur 401 avant que ce rafraîchissement n'aboutisse. Chacune bascule alors sur
 * ses données d'exemple, définitivement, car aucun hook ne retente.
 *
 * Le symptôme observé : un tableau de bord affichant « 1 commande active »
 * au-dessus d'une liste de dix commandes d'exemple — deux instances du même
 * hook, deux verdicts opposés sur la même session.
 *
 * Une seule reprise suffit : à cet instant le rafraîchissement est terminé, et
 * `api()` repart avec le jeton neuf. Si le 401 persiste, la session est
 * réellement close et le repli est légitime.
 *
 * Ce correctif vit ici plutôt que dans `lib/api.ts`, fichier protégé du
 * starter.
 */
export async function avecReessai401<T>(chemin: string): Promise<T> {
  try {
    return await api<T>(chemin);
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401) throw err;
    await new Promise((r) => setTimeout(r, ATTENTE_MS));
    return api<T>(chemin);
  }
}
