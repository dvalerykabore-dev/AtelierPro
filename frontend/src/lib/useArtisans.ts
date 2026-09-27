'use client';

import { useCallback, useEffect, useState } from 'react';
import { useEtatMemorise } from '@/lib/etat-memorise';
import { api, ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
import { messageErreur } from '@/lib/message-erreur';
import { artisans as artisansSimules } from '@/lib/mock/atelier';

export interface Artisan {
  id: string;
  nom: string;
  role: string;
  initiales: string;
  /** Capacité quotidienne en heures. */
  capacite: number;
  actif: boolean;
  /** Numéro international, ou chaîne vide. Facultatif : tous n’en laissent pas un. */
  telephone: string;
  /** Heures déjà engagées aujourd'hui, calculées depuis les tâches du jour. */
  heuresAujourdhui: number;
}

interface ArtisanApi {
  id: string;
  name: string;
  role: string;
  initials: string;
  dailyHours: number;
  active: boolean;
  phone: string | null;
  heuresAujourdhui: number;
}

export type SourceArtisans = 'serveur' | 'demonstration';

function versUI(a: ArtisanApi): Artisan {
  return {
    id: a.id,
    nom: a.name,
    role: a.role,
    initiales: a.initials,
    capacite: a.dailyHours,
    actif: a.active,
    telephone: a.phone ?? '',
    heuresAujourdhui: a.heuresAujourdhui,
  };
}

/**
 * Ce que l'écran doit avoir sous la main pour se peindre : la liste et sa
 * provenance. Les deux sont mémorisés ensemble — restituer la liste sans la
 * provenance ferait passer un jeu d'exemple pour de vraies données le temps
 * d'un aller-retour.
 */
interface EtatArtisans {
  artisans: Artisan[];
  source: SourceArtisans;
}

/**
 * L'équipe de l'atelier.
 *
 * Jusqu'ici les cinq artisans étaient codés en dur : un atelier qui venait
 * d'ouvrir voyait le personnel de quelqu'un d'autre, et ne pouvait pas le
 * corriger. Le repli sur le jeu d'exemple ne subsiste que hors session, et
 * `source` permet à l'écran de le dire.
 */
export function useArtisans() {
  const [etat, poserEtat, dejaCharge] = useEtatMemorise<EtatArtisans>('/api/artisans', {
    artisans: [],
    source: 'serveur',
  });
  const { artisans, source } = etat;
  // Au retour sur l'écran, la liste est déjà là : on revalide en silence plutôt
  // que de remettre un squelette devant des données correctes.
  const [chargement, setChargement] = useState(!dejaCharge);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    void (async () => {
      try {
        const res = await avecReessai401<{ artisans: ArtisanApi[] }>('/api/artisans');
        if (annule) return;
        poserEtat({ artisans: res.artisans.map(versUI), source: 'serveur' });
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) {
          poserEtat({
            artisans: artisansSimules.map((a) => ({
              id: a.id,
              nom: a.nom,
              role: a.role,
              initiales: a.initiales,
              capacite: a.heuresTotal,
              actif: true,
              telephone: '',
              heuresAujourdhui: a.heuresUtilisees,
            })),
            source: 'demonstration',
          });
        } else {
          setErreur(messageErreur(err, 'Impossible de charger l’équipe.'));
        }
      } finally {
        if (!annule) setChargement(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, [poserEtat]);

  /** Renvoie `null` en cas de succès, sinon le message à afficher. */
  const ajouter = useCallback(
    async (nouveau: {
      nom: string;
      role: string;
      capacite: number;
      telephone?: string;
    }): Promise<string | null> => {
      if (source === 'demonstration') {
        return 'Connectez-vous pour composer votre équipe.';
      }
      try {
        const res = await api<{ artisan: ArtisanApi }>('/api/artisans', {
          method: 'POST',
          body: {
            name: nouveau.nom,
            role: nouveau.role,
            dailyHours: nouveau.capacite,
            // Absent plutôt que vide : la route distingue « pas fourni » de
            // « effacé », et une création n’a rien à effacer.
            ...(nouveau.telephone ? { phone: nouveau.telephone } : {}),
          },
        });
        poserEtat((prec) => ({ ...prec, artisans: [...prec.artisans, versUI(res.artisan)] }));
        return null;
      } catch (err) {
        if (err instanceof ApiError && err.code === 'ARTISAN_ALREADY_EXISTS') {
          return 'Un artisan porte déjà ce nom.';
        }
        return messageErreur(err, 'Impossible d’ajouter cet artisan.');
      }
    },
    [source, poserEtat],
  );

  /** Active ou désactive un artisan. Renvoie `null` en cas de succès. */
  const basculer = useCallback(
    async (id: string): Promise<string | null> => {
      const actuel = artisans.find((a) => a.id === id);
      if (!actuel) return null;

      const bascule = (etatActif: boolean) =>
        poserEtat((prec) => ({
          ...prec,
          artisans: prec.artisans.map((a) => (a.id === id ? { ...a, actif: etatActif } : a)),
        }));

      if (source === 'demonstration') {
        bascule(!actuel.actif);
        return null;
      }

      // Bascule optimiste : l'interrupteur doit répondre au doigt. En cas
      // d'échec on revient à l'état précédent plutôt que de laisser l'écran
      // affirmer une modification que le serveur a refusée.
      bascule(!actuel.actif);

      try {
        await api<{ artisan: ArtisanApi }>(`/api/artisans/${id}`, {
          method: 'PATCH',
          body: { active: !actuel.actif },
        });
        return null;
      } catch (err) {
        bascule(actuel.actif);
        return messageErreur(err, 'Modification non enregistrée.');
      }
    },
    [artisans, source, poserEtat],
  );

  return { artisans, source, chargement, erreur, ajouter, basculer };
}
