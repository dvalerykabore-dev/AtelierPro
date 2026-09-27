import { ApiError } from '@/lib/api';

/**
 * Message affichable pour une erreur d'API.
 *
 * `ApiError.message` vaut toujours le champ `error` de la réponse — c'est-à-dire
 * le CODE (« DAY_CAPACITY_EXCEEDED », « VALIDATION_FAILED »). Utile pour brancher
 * du code, illisible pour un couturier. Le texte destiné à l'écran vit dans
 * `body.message`, ou à défaut dans la première entrée de `body.issues`.
 *
 * `lib/api.ts` est un fichier protégé du starter : on ne corrige pas la
 * construction du message à la source, on l'interprète ici.
 */
export function messageErreur(err: unknown, repli: string): string {
  if (!(err instanceof ApiError)) return repli;

  const message = err.body['message'];
  if (typeof message === 'string' && message.trim()) return message;

  const issues = err.body['issues'];
  const premiere = Array.isArray(issues) ? issues[0] : undefined;
  if (premiere && typeof premiere === 'object' && 'message' in premiere) {
    const texte = (premiere as { message: unknown }).message;
    if (typeof texte === 'string' && texte.trim()) return texte;
  }

  // Reste le code brut : mieux vaut un repli en français qu'une constante
  // d'API sous les yeux de l'utilisateur.
  return repli;
}
