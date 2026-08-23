'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
import { messageErreur } from '@/lib/message-erreur';
import { clients as clientsSimules, type Client, type Genre } from '@/lib/mock/atelier';

/** Forme renvoyée par `/api/clients` — genre en majuscules, comme en base. */
interface ClientApi {
  id: string;
  name: string;
  phone: string | null;
  gender: 'FEMALE' | 'MALE';
  loyal: boolean;
  notes: string | null;
  createdAt: string;
}

/** « Mariam Coulibaly » → « MC ». */
function initialesDe(nom: string): string {
  return nom
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((m) => m[0] ?? '')
    .join('')
    .toUpperCase();
}

function versUI(c: ClientApi): Client {
  return {
    id: c.id,
    nom: c.name,
    initiales: initialesDe(c.name),
    telephone: c.phone ?? '',
    genre: c.gender === 'MALE' ? 'Homme' : 'Femme',
    // Ces trois valeurs viendront des commandes quand `TailoringOrder` existera.
    nbCommandes: 0,
    derniereCommande: '—',
    fidele: c.loyal,
    totalFacture: 0,
    creeLe: c.createdAt,
  };
}

export interface NouveauClient {
  nom: string;
  telephone: string;
  genre: Genre;
}

export type SourceDonnees = 'serveur' | 'demonstration';

/**
 * Clients de l'atelier, lus depuis `/api/clients`.
 *
 * Repli assumé : sans session, l'API répond 401 et l'on retombe sur le jeu
 * simulé. Le mode démonstration doit rester consultable — mais l'écran annonce
 * la source, pour qu'on ne prenne jamais des données d'exemple pour de vraies.
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>(clientsSimules);
  const [source, setSource] = useState<SourceDonnees>('demonstration');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const recharger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const res = await avecReessai401<{ clients: ClientApi[] }>('/api/clients');
      setClients(res.clients.map(versUI));
      setSource('serveur');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setClients(clientsSimules);
        setSource('demonstration');
      } else {
        setErreur(messageErreur(err, 'Impossible de joindre le serveur.'));
      }
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void recharger();
  }, [recharger]);

  /**
   * Enregistre un client. Renvoie `null` en cas de succès, sinon le message à
   * afficher. Hors session, l'ajout reste local — annoncé par la source.
   */
  const ajouter = useCallback(
    async (nouveau: NouveauClient): Promise<string | null> => {
      const localement = (): null => {
        setClients((prec) => [
          {
            id: `local-${Date.now()}`,
            nom: nouveau.nom,
            initiales: initialesDe(nouveau.nom),
            telephone: nouveau.telephone,
            genre: nouveau.genre,
            nbCommandes: 0,
            derniereCommande: '—',
            fidele: false,
            totalFacture: 0,
          },
          ...prec,
        ]);
        return null;
      };

      if (source === 'demonstration') return localement();

      try {
        const res = await api<{ client: ClientApi }>('/api/clients', {
          method: 'POST',
          body: {
            name: nouveau.nom,
            phone: nouveau.telephone || undefined,
            gender: nouveau.genre === 'Homme' ? 'MALE' : 'FEMALE',
          },
        });
        setClients((prec) => [versUI(res.client), ...prec]);
        return null;
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.code === 'CUSTOMER_ALREADY_EXISTS') return 'Un client porte déjà ce nom.';
          if (err.status === 401) return localement();
        }
        return messageErreur(err, 'Impossible de joindre le serveur.');
      }
    },
    [source],
  );

  return { clients, source, chargement, erreur, ajouter, recharger };
}
