// Envoi d'un fichier vers /api/upload.
//
// Ces cas existent parce que l'envoi du logo refusait un compte parfaitement
// connecté : un `FormData` ne passe pas par le wrapper `api()`, donc l'envoi
// n'héritait pas de son rafraîchissement automatique, et le jeton d'accès ne
// vit que quinze minutes. Au-delà, choisir une image répondait « Session
// expirée » avec un jeton de rafraîchissement valide dans les cookies.
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api', () => ({ api: vi.fn() }));
vi.mock('@/lib/jeton-csrf', () => ({ jetonCsrf: vi.fn(() => 'jeton') }));

import { api } from '@/lib/api';
import { envoyerFichier } from './envoi-fichier';

const mockApi = vi.mocked(api);
const fichier = new File([new Uint8Array([1, 2, 3])], 'logo.png', { type: 'image/png' });

function reponse(statut: number, corps?: unknown): Response {
  return {
    ok: statut >= 200 && statut < 300,
    status: statut,
    json: async () => corps,
  } as Response;
}

const OK = { id: 'up-1', url: 'https://res.cloudinary.com/x/a.png', filename: 'logo.png' };

beforeEach(() => {
  vi.clearAllMocks();
  mockApi.mockResolvedValue({} as never);
});

describe('envoyerFichier', () => {
  it('rend l’URL du fichier envoyé', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reponse(201, OK)));
    const r = await envoyerFichier(fichier);
    expect(r).toEqual({ ok: true, id: 'up-1', url: OK.url, nomFichier: 'logo.png' });
  });

  it('rafraîchit la session puis rejoue une fois après un 401', async () => {
    // Le défaut d'origine : ce 401 remontait tel quel à l'écran, sous la forme
    // d'un « reconnectez-vous » que rien ne justifiait.
    const faux = vi
      .fn()
      .mockResolvedValueOnce(reponse(401))
      .mockResolvedValueOnce(reponse(201, OK));
    vi.stubGlobal('fetch', faux);

    const r = await envoyerFichier(fichier);

    expect(mockApi).toHaveBeenCalledWith('/api/auth/me');
    expect(faux).toHaveBeenCalledTimes(2);
    expect(r).toEqual({ ok: true, id: 'up-1', url: OK.url, nomFichier: 'logo.png' });
  });

  it('ne rejoue qu’une seule fois', async () => {
    // Sinon un compte réellement déconnecté renverrait l'écran en boucle.
    const faux = vi.fn().mockResolvedValue(reponse(401));
    vi.stubGlobal('fetch', faux);

    const r = await envoyerFichier(fichier);

    expect(faux).toHaveBeenCalledTimes(2);
    expect(r).toEqual({ ok: false, statut: 401 });
  });

  it('abandonne sans rejouer quand le rafraîchissement échoue', async () => {
    // La session est alors réellement finie : rejouer ne ferait qu'ajouter une
    // requête inutile avant le même refus.
    const faux = vi.fn().mockResolvedValue(reponse(401));
    vi.stubGlobal('fetch', faux);
    mockApi.mockRejectedValueOnce(new Error('401'));

    const r = await envoyerFichier(fichier);

    expect(faux).toHaveBeenCalledTimes(1);
    expect(r).toEqual({ ok: false, statut: 401 });
  });

  it('ne rejoue PAS les autres refus', async () => {
    // Un fichier trop lourd ou d'un format refusé le restera : rejouer
    // renverrait le même octet contre le même mur.
    for (const statut of [413, 415, 503]) {
      const faux = vi.fn().mockResolvedValue(reponse(statut));
      vi.stubGlobal('fetch', faux);

      const r = await envoyerFichier(fichier);

      expect(faux).toHaveBeenCalledTimes(1);
      expect(mockApi).not.toHaveBeenCalled();
      expect(r).toEqual({ ok: false, statut });
    }
  });

  it('remonte le statut du refus pour que l’écran sache quoi dire', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reponse(413)));
    const r = await envoyerFichier(fichier);
    expect(r).toEqual({ ok: false, statut: 413 });
  });
});
