'use client';

import { useCallback, useEffect, useState } from 'react';
import { useEtatMemorise } from '@/lib/etat-memorise';
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
interface EtatClients {
  clients: Client[];
  source: SourceDonnees;
}

export function useClients() {
  const [etat, poserEtat, dejaCharge] = useEtatMemorise<EtatClients>('/api/clients', {
    clients: clientsSimules,
    source: 'demonstration',
  });
  const { clients, source } = etat;
  const [chargement, setChargement] = useState(!dejaCharge);
  const [erreur, setErreur] = useState<string | null>(null);

  // `silencieux` distingue les deux façons d'arriver ici. Au montage sur un
  // écran déjà visité, on revalide sans squelette. Un rechargement demandé à la
  // main, lui, doit se voir : sinon le bouton semble n'avoir rien fait.
  const recharger = useCallback(
    async (silencieux = false) => {
      if (!silencieux) setChargement(true);
      setErreur(null);
      try {
        const res = await avecReessai401<{ clients: ClientApi[] }>('/api/clients');
        poserEtat({ clients: res.clients.map(versUI), source: 'serveur' });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          poserEtat({ clients: clientsSimules, source: 'demonstration' });
        } else {
          setErreur(messageErreur(err, 'Impossible de joindre le serveur.'));
        }
      } finally {
        setChargement(false);
      }
    },
    [poserEtat],
  );

  useEffect(() => {
    void recharger(dejaCharge);
    // `dejaCharge` est figé au premier rendu : le relire ici ne relance rien.
  }, [recharger, dejaCharge]);

  /**
   * Enregistre un client. Renvoie `null` en cas de succès, sinon le message à
   * afficher. Hors session, l'ajout reste local — annoncé par la source.
   */
  const ajouter = useCallback(
    async (nouveau: NouveauClient): Promise<string | null> => {
      const localement = (): null => {
        poserEtat((prec) => ({
          ...prec,
          clients: [
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
            ...prec.clients,
          ],
        }));
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
        poserEtat((prec) => ({ ...prec, clients: [versUI(res.client), ...prec.clients] }));
        return null;
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.code === 'CUSTOMER_ALREADY_EXISTS') return 'Un client porte déjà ce nom.';
          if (err.status === 401) return localement();
        }
        return messageErreur(err, 'Impossible de joindre le serveur.');
      }
    },
    [source, poserEtat],
  );

  return { clients, source, chargement, erreur, ajouter, recharger };
}
