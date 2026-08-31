import { api } from '@/lib/api';
import { jetonCsrf } from '@/lib/jeton-csrf';

/**
 * Envoi d'un fichier vers `POST /api/upload`.
 *
 * Un `FormData` ne passe pas par le wrapper `api()`, qui sérialise en JSON :
 * les envois se font donc en `fetch` direct. Ils perdaient du même coup le
 * rafraîchissement automatique du jeton d'accès que le wrapper assure — et ce
 * jeton ne vit que quinze minutes.
 *
 * Conséquence observée : au bout d'un quart d'heure de session, choisir une
 * image répondait « Session expirée, reconnectez-vous » alors que la session
 * était parfaitement valide et que le jeton de rafraîchissement attendait dans
 * les cookies. Un atelier qui prend des photos de mesures pendant une heure
 * tombait dessus à chaque fois.
 *
 * On rejoue donc l'envoi une fois après avoir rafraîchi la session. Rejouer un
 * POST est d'ordinaire proscrit — c'est l'invariant du wrapper — mais la règle
 * vise les erreurs réseau, dont l'issue est inconnue : le serveur a peut-être
 * traité la requête. Un 401 est le cas inverse : la route refuse AVANT tout
 * effet, rien n'a été écrit, et rejouer ne peut pas produire de doublon.
 */

export type ResultatEnvoi =
  | { ok: true; id: string; url: string; nomFichier: string }
  | { ok: false; statut: number };

interface CorpsEnvoi {
  id: string;
  url: string;
  filename: string;
}

function tenter(fichier: File): Promise<Response> {
  const donnees = new FormData();
  donnees.append('file', fichier);

  const entetes: Record<string, string> = {};
  // Relu à chaque tentative : le rafraîchissement en émet un nouveau, et
  // rejouer avec l'ancien se ferait refuser en 403.
  const csrf = jetonCsrf();
  if (csrf) entetes['x-csrf-token'] = csrf;

  return fetch('/api/upload', {
    method: 'POST',
    body: donnees,
    credentials: 'include',
    headers: entetes,
  });
}

export async function envoyerFichier(fichier: File): Promise<ResultatEnvoi> {
  let rep = await tenter(fichier);

  if (rep.status === 401) {
    // N'importe quelle requête passée par `api()` déclenche son
    // rafraîchissement à verrou unique ; `/api/auth/me` est la moins chère.
    // Si elle échoue, la session est réellement finie.
    try {
      await api('/api/auth/me');
    } catch {
      return { ok: false, statut: 401 };
    }
    rep = await tenter(fichier);
  }

  if (!rep.ok) return { ok: false, statut: rep.status };

  const corps = (await rep.json()) as CorpsEnvoi;
  return { ok: true, id: corps.id, url: corps.url, nomFichier: corps.filename };
}
