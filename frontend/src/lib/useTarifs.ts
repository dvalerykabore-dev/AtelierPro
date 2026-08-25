'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
import { messageErreur } from '@/lib/message-erreur';
import { useEtatMemorise } from '@/lib/etat-memorise';

export interface Tarif {
  id: string;
  tenue: string;
  prix: number;
  unite: string;
}

interface TarifApi {
  id: string;
  garment: string;
  price: number;
  unit: string;
}

function versUI(t: TarifApi): Tarif {
  return { id: t.id, tenue: t.garment, prix: t.price, unite: t.unit };
}

export type SourceTarifs = 'serveur' | 'demonstration';

/**
 * Exemple montré hors session, pour que l'écran de démonstration ne soit pas
 * vide. Sans identifiants : rien de ce qui est affiché ici n'est modifiable,
 * et `source` permet à l'écran de le dire.
 */
const TARIFS_EXEMPLE: Tarif[] = [
  { id: 'exemple-1', tenue: 'Boubou simple', prix: 15000, unite: 'façon' },
  { id: 'exemple-2', tenue: 'Boubou bazin brodé', prix: 35000, unite: 'façon' },
  { id: 'exemple-3', tenue: 'Robe wax cérémonie', prix: 25000, unite: 'façon' },
];

interface EtatTarifs {
  tarifs: Tarif[];
  source: SourceTarifs;
}

/**
 * La grille tarifaire de l'atelier.
 *
 * Elle était une constante partagée : tous les ateliers facturaient les mêmes
 * prix, et toute modification disparaissait au rechargement — y compris celles
 * déjà utilisées pour chiffrer une commande.
 *
 * Les trois mutations renvoient `null` en cas de succès, sinon le message à
 * afficher — même contrat que `useClients.ajouter`, pour que tous les
 * formulaires de l'atelier se traitent de la même façon.
 */
export function useTarifs() {
  const [etat, poserEtat, dejaCharge] = useEtatMemorise<EtatTarifs>('/api/tarifs', {
    tarifs: TARIFS_EXEMPLE,
    source: 'demonstration',
  });
  const { tarifs, source } = etat;
  const [chargement, setChargement] = useState(!dejaCharge);
  const [erreur, setErreur] = useState<string | null>(null);

  const recharger = useCallback(
    async (silencieux = false) => {
      if (!silencieux) setChargement(true);
      setErreur(null);
      try {
        const res = await avecReessai401<{ tarifs: TarifApi[] }>('/api/tarifs');
        poserEtat({ tarifs: res.tarifs.map(versUI), source: 'serveur' });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          poserEtat({ tarifs: TARIFS_EXEMPLE, source: 'demonstration' });
        } else {
          setErreur(messageErreur(err, 'Grille tarifaire indisponible.'));
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

  const ajouter = useCallback(
    async (entree: { tenue: string; prix: number; unite: string }): Promise<string | null> => {
      if (source === 'demonstration') return 'Connectez-vous pour composer votre grille.';
      try {
        const res = await api<{ tarif: TarifApi }>('/api/tarifs', {
          method: 'POST',
          body: { garment: entree.tenue, price: entree.prix, unit: entree.unite },
        });
        poserEtat((prec) => ({
          ...prec,
          tarifs: [...prec.tarifs, versUI(res.tarif)].sort((a, b) =>
            a.tenue.localeCompare(b.tenue, 'fr'),
          ),
        }));
        return null;
      } catch (err) {
        if (err instanceof ApiError && err.code === 'TARIF_ALREADY_EXISTS') {
          return 'Cette tenue figure déjà dans la grille.';
        }
        return messageErreur(err, 'Impossible d’enregistrer ce tarif.');
      }
    },
    [source, poserEtat],
  );

  const modifier = useCallback(
    async (
      id: string,
      entree: { tenue: string; prix: number; unite: string },
    ): Promise<string | null> => {
      if (source === 'demonstration') return 'Connectez-vous pour composer votre grille.';
      try {
        const res = await api<{ tarif: TarifApi }>(`/api/tarifs/${id}`, {
          method: 'PATCH',
          body: { garment: entree.tenue, price: entree.prix, unit: entree.unite },
        });
        poserEtat((prec) => ({
          ...prec,
          tarifs: prec.tarifs
            .map((t) => (t.id === id ? versUI(res.tarif) : t))
            .sort((a, b) => a.tenue.localeCompare(b.tenue, 'fr')),
        }));
        return null;
      } catch (err) {
        if (err instanceof ApiError && err.code === 'TARIF_ALREADY_EXISTS') {
          return 'Cette tenue figure déjà dans la grille.';
        }
        return messageErreur(err, 'Modification non enregistrée.');
      }
    },
    [source, poserEtat],
  );

  const supprimer = useCallback(
    async (id: string): Promise<string | null> => {
      if (source === 'demonstration') return 'Connectez-vous pour composer votre grille.';

      // Retrait optimiste : la ligne doit disparaître au clic. En cas d'échec
      // on la remet plutôt que de laisser l'écran affirmer une suppression que
      // le serveur a refusée.
      const precedent = tarifs;
      poserEtat((prec) => ({ ...prec, tarifs: prec.tarifs.filter((t) => t.id !== id) }));
      try {
        await api(`/api/tarifs/${id}`, { method: 'DELETE' });
        return null;
      } catch (err) {
        poserEtat((prec) => ({ ...prec, tarifs: precedent }));
        return messageErreur(err, 'Suppression impossible.');
      }
    },
    [source, tarifs, poserEtat],
  );

  return { tarifs, source, chargement, erreur, ajouter, modifier, supprimer, recharger };
}
