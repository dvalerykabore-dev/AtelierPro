'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { messageErreur } from '@/lib/message-erreur';
import type { Genre } from '@/lib/mock/atelier';

interface PhotoApi {
  id: string;
  url: string;
  nomFichier?: string;
}

interface ReleveApi {
  id: string;
  gender: 'FEMALE' | 'MALE';
  values: Record<string, string>;
  notes: string | null;
  fabricPhotos: PhotoApi[] | null;
  modelPhoto: string | null;
  takenAt: string;
}

export interface ReleveAEnregistrer {
  genre: Genre;
  /** Valeurs indexées `section::numero`. */
  valeurs: Record<string, string>;
  notes: string;
  tissus: { id: string; url: string; nomFichier: string }[];
  modele: string | null;
}

export interface ReleveCharge {
  valeurs: Record<string, string>;
  notes: string;
  genre: Genre;
  dateReleve: string;
  /** Photos des tissus apportés par le client, telles qu'envoyées sur Cloudinary. */
  tissus: { id: string; url: string; nomFichier?: string }[];
  /** Photo du modèle choisi, le cas échéant. */
  modele: string | null;
}

/**
 * Dernier relevé d'un client, et enregistrement d'un nouveau.
 *
 * Rien n'est chargé tant qu'aucun client réel n'est sélectionné : en mode
 * démonstration les identifiants sont ceux du jeu simulé, l'API répondrait 404.
 */
export function useReleveMesures(clientId: string | null, actif: boolean) {
  const [charge, setCharge] = useState<ReleveCharge | null>(null);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (!actif || !clientId) {
      setCharge(null);
      return;
    }

    let annule = false;
    setChargement(true);

    void (async () => {
      try {
        const res = await api<{ releve: ReleveApi | null }>(`/api/clients/${clientId}/mesures`);
        if (annule) return;
        setCharge(
          res.releve
            ? {
                valeurs: res.releve.values,
                notes: res.releve.notes ?? '',
                genre: res.releve.gender === 'MALE' ? 'Homme' : 'Femme',
                dateReleve: new Date(res.releve.takenAt).toLocaleDateString('fr-FR'),
                tissus: res.releve.fabricPhotos ?? [],
                modele: res.releve.modelPhoto,
              }
            : null,
        );
      } catch {
        // Absence de relevé, session expirée ou serveur muet : l'écran reste
        // utilisable avec des champs vides, ce qui est le cas normal d'un
        // premier passage.
        if (!annule) setCharge(null);
      } finally {
        if (!annule) setChargement(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, [clientId, actif]);

  /** Renvoie `null` en cas de succès, sinon le message à afficher. */
  const enregistrer = useCallback(
    async (releve: ReleveAEnregistrer): Promise<string | null> => {
      if (!actif || !clientId) {
        // Mode démonstration : le client n'existe pas en base. On ne prétend
        // pas avoir enregistré.
        return 'demonstration';
      }

      try {
        await api(`/api/clients/${clientId}/mesures`, {
          method: 'POST',
          body: {
            gender: releve.genre === 'Homme' ? 'MALE' : 'FEMALE',
            values: releve.valeurs,
            notes: releve.notes || undefined,
            fabricPhotos: releve.tissus.length ? releve.tissus : undefined,
            modelPhoto: releve.modele ?? undefined,
          },
        });
        return null;
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.code === 'EMPTY_MEASUREMENT_SET') return 'Aucune mesure renseignée.';
          if (err.status === 401) return 'demonstration';
        }
        return messageErreur(err, 'Impossible de joindre le serveur.');
      }
    },
    [clientId, actif],
  );

  return { charge, chargement, enregistrer };
}
