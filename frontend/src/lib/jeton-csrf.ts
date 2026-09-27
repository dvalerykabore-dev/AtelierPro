import { COOKIE_PREFIX } from '@/lib/constants';

/**
 * Jeton CSRF du projet, relu depuis le stockage puis le cookie.
 *
 * `getCsrfToken` n'est pas exporté par `lib/api.ts`, fichier protégé par le
 * CLAUDE.md : on relit donc le jeton ici plutôt que de le modifier. Même
 * source, même nom — seul le point de lecture change.
 *
 * Nécessaire dès qu'une requête n'emprunte pas le wrapper `api()` : les envois
 * de fichiers passent par `fetch` avec un `FormData`, que le wrapper ne
 * sérialise pas.
 */
export function jetonCsrf(): string | null {
  if (typeof window === 'undefined') return null;
  const cle = `${COOKIE_PREFIX}-csrf`;
  const depuisStockage = localStorage.getItem(cle);
  if (depuisStockage) return depuisStockage;
  const echappe = cle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const trouve = document.cookie.match(new RegExp(`(?:^|;\\s*)${echappe}=([^;]*)`));
  return trouve && trouve[1] ? decodeURIComponent(trouve[1]) : null;
}
