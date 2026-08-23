'use client';

import { useCallback, useEffect, useState } from 'react';
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
    heuresAujourdhui: a.heuresAujourdhui,
  };
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
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [source, setSource] = useState<SourceArtisans>('serveur');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    void (async () => {
      try {
        const res = await avecReessai401<{ artisans: ArtisanApi[] }>('/api/artisans');
        if (annule) return;
        setArtisans(res.artisans.map(versUI));
        setSource('serveur');
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) {
          setArtisans(
            artisansSimules.map((a) => ({
              id: a.id,
              nom: a.nom,
              role: a.role,
              initiales: a.initiales,
              capacite: a.heuresTotal,
              actif: true,
              heuresAujourdhui: a.heuresUtilisees,
            })),
          );
          setSource('demonstration');
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
  }, []);

  /** Renvoie `null` en cas de succès, sinon le message à afficher. */
  const ajouter = useCallback(
    async (nouveau: { nom: string; role: string; capacite: number }): Promise<string | null> => {
      if (source === 'demonstration') {
        return 'Connectez-vous pour composer votre équipe.';
      }
      try {
        const res = await api<{ artisan: ArtisanApi }>('/api/artisans', {
          method: 'POST',
          body: { name: nouveau.nom, role: nouveau.role, dailyHours: nouveau.capacite },
        });
        setArtisans((prec) => [...prec, versUI(res.artisan)]);
        return null;
      } catch (err) {
        if (err instanceof ApiError && err.code === 'ARTISAN_ALREADY_EXISTS') {
          return 'Un artisan porte déjà ce nom.';
        }
        return messageErreur(err, 'Impossible d’ajouter cet artisan.');
      }
    },
    [source],
  );

  /** Active ou désactive un artisan. Renvoie `null` en cas de succès. */
  const basculer = useCallback(
    async (id: string): Promise<string | null> => {
      const actuel = artisans.find((a) => a.id === id);
      if (!actuel) return null;

      if (source === 'demonstration') {
        setArtisans((prec) => prec.map((a) => (a.id === id ? { ...a, actif: !a.actif } : a)));
        return null;
      }

      // Bascule optimiste : l'interrupteur doit répondre au doigt. En cas
      // d'échec on revient à l'état précédent plutôt que de laisser l'écran
      // affirmer une modification que le serveur a refusée.
      setArtisans((prec) => prec.map((a) => (a.id === id ? { ...a, actif: !a.actif } : a)));

      try {
        await api<{ artisan: ArtisanApi }>(`/api/artisans/${id}`, {
          method: 'PATCH',
          body: { active: !actuel.actif },
        });
        return null;
      } catch (err) {
        setArtisans((prec) => prec.map((a) => (a.id === id ? { ...a, actif: actuel.actif } : a)));
        return messageErreur(err, 'Modification non enregistrée.');
      }
    },
    [artisans, source],
  );

  return { artisans, source, chargement, erreur, ajouter, basculer };
}
