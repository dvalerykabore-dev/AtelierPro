'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/contexts/LangueContext';
import { initialesAtelierDe, nomAtelierDe } from '@/lib/atelier-identite';
import { envoyerFichier } from '@/lib/envoi-fichier';
import { messageErreur } from '@/lib/message-erreur';

const MIMES_ACCEPTES = 'image/jpeg,image/png,image/webp,image/heic,image/heif';

/**
 * Logo de l'atelier, dans Paramètres › Atelier.
 *
 * La vignette affichait un « A » sur fond or, identique pour tous les comptes,
 * avec la mention « Logo » dessous — un emplacement qui avait l'air d'attendre
 * quelque chose sans jamais rien accepter.
 *
 * L'envoi se fait en deux temps : le fichier part vers `POST /api/upload`
 * (contrôle de taille et d'octets côté serveur), puis l'URL rendue est
 * enregistrée sur le compte par `PATCH /api/atelier`. Rien n'est posé
 * localement en attendant — un logo qui s'afficherait avant d'être enregistré
 * ferait croire l'affaire réglée, et il ne réapparaîtrait pas au rechargement.
 *
 * À défaut de logo, on retombe sur les initiales du nom de l'atelier, comme
 * partout ailleurs dans l'application.
 */
export default function LogoAtelier() {
  const { user, refresh } = useAuth();
  const t = useT();
  const champ = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const logo = user?.workshopLogoUrl ?? null;
  const nom = nomAtelierDe(user);

  /** Enregistre l'URL sur le compte, puis relit la session — seule source. */
  async function poser(url: string) {
    await api('/api/atelier', { method: 'PATCH', body: { logoUrl: url } });
    await refresh();
  }

  async function envoyer(fichiers: FileList | null) {
    const fichier = fichiers?.[0];
    if (!fichier) return;

    setEnvoi(true);
    setErreur(null);
    try {
      const resultat = await envoyerFichier(fichier);
      if (!resultat.ok) {
        setErreur(messageEnvoi(t, resultat.statut, fichier.name));
        return;
      }
      await poser(resultat.url);
    } catch (err) {
      setErreur(messageErreur(err, t('Le logo n’a pas pu être envoyé.')));
    } finally {
      setEnvoi(false);
      // Vider le champ permet de renvoyer le même fichier après un échec :
      // sans cela, `change` ne se déclenche pas une seconde fois.
      if (champ.current) champ.current.value = '';
    }
  }

  async function retirer() {
    setEnvoi(true);
    setErreur(null);
    try {
      await poser('');
    } catch (err) {
      setErreur(messageErreur(err, t('Le logo n’a pas pu être retiré.')));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-2">
      <div className="bg-muted border-border relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border">
        {logo ? (
          // `<img>` et non `next/image` : les URL du stockage ne sont pas
          // déclarées dans `next.config`, et l'optimiseur les refuserait.
          <img
            src={logo}
            alt={t('Logo de {atelier}', { atelier: nom })}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
            <span className="text-primary-foreground font-headings text-lg font-bold">
              {initialesAtelierDe(user).slice(0, 1)}
            </span>
          </span>
        )}

        {envoi && (
          <span className="bg-background/70 absolute inset-0 flex items-center justify-center">
            <Loader2 size={18} className="text-primary animate-spin" aria-hidden />
          </span>
        )}
      </div>

      <input
        ref={champ}
        id="logo-atelier"
        type="file"
        accept={MIMES_ACCEPTES}
        disabled={envoi}
        onChange={(e: ChangeEvent<HTMLInputElement>) => void envoyer(e.target.files)}
        className="sr-only"
      />

      <div className="flex flex-col items-center gap-0.5">
        <label
          htmlFor="logo-atelier"
          className="text-primary hover:text-primary/80 flex cursor-pointer items-center gap-1 text-xs font-medium"
        >
          <ImagePlus size={11} aria-hidden />
          {t(logo ? 'Changer' : 'Ajouter')}
        </label>

        {logo && (
          <button
            type="button"
            onClick={() => void retirer()}
            disabled={envoi}
            className="text-muted-foreground hover:text-danger flex items-center gap-1 text-xs disabled:opacity-50"
          >
            <Trash2 size={11} aria-hidden />
            {t('Retirer')}
          </button>
        )}
      </div>

      {erreur && (
        <p role="alert" className="text-danger max-w-[10rem] text-center text-xs">
          {t(erreur)}
        </p>
      )}
    </div>
  );
}

/**
 * Traduit le refus de la route d'envoi.
 *
 * Chaque code dit ce qu'il faut faire ensuite — réduire l'image, en choisir
 * une autre, prévenir l'hébergeur. Un « échec de l'envoi » unique laisserait
 * l'atelier réessayer le même fichier trop lourd indéfiniment.
 */
function messageEnvoi(
  t: (cle: string, params?: Record<string, string | number>) => string,
  statut: number,
  nomFichier: string,
): string {
  if (statut === 401 || statut === 403)
    return t('Session expirée — reconnectez-vous pour enregistrer le logo.');
  if (statut === 413)
    return t('« {fichier} » est trop lourd — réduisez l’image et réessayez.', {
      fichier: nomFichier,
    });
  if (statut === 415) return t('Format refusé — choisissez une image JPEG, PNG ou WebP.');
  if (statut === 503) return t('Le stockage d’images n’est pas configuré sur ce serveur.');
  return t('L’envoi a échoué — le logo n’a pas été enregistré.');
}
