'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
import { messageErreur } from '@/lib/message-erreur';
import { jourIso } from '@/lib/tresorerie';

export interface Mouvement {
  id: string;
  direction: 'IN' | 'OUT';
  amount: number;
  /** « AAAA-MM-JJ » — le jour du mouvement, pas celui de la saisie. */
  occurredAt: string;
  category: string | null;
  method: string;
  label: string;
  notes: string | null;
  /** Ligne reconstituée depuis un acompte antérieur au journal : date approximative. */
  backfilled: boolean;
  commande: { numero: number; client: string } | null;
}

export interface Charge {
  id: string;
  label: string;
  category: string;
  amount: number;
  dayOfMonth: number;
  active: boolean;
}

export interface Tresorerie {
  solde: number;
  moisCourant: { cle: string; recettes: number; depenses: number; resultat: number };
  mois: {
    cle: string;
    recettes: number;
    depenses: number;
    resultat: number;
    soldeFin: number;
    courant: boolean;
  }[];
  repartition: { poste: string; montant: number; pourcentage: number }[];
  totalRepartition: number;
  prevision: {
    mois: {
      cle: string;
      encaissements: number;
      charges: number;
      resultat: number;
      soldeProjete: number;
      /** Mois en cours : seules les échéances restantes sont projetées. */
      partiel: boolean;
    }[];
    chargesMensuelles: number;
    charges: Charge[];
    attendus: {
      id: string;
      numero: number;
      client: string;
      tenue: string;
      montant: number;
      echeance: string | null;
      livree: boolean;
    }[];
    sansEcheance: { nombre: number; montant: number };
    enRetard: { nombre: number; montant: number };
  };
  reprises: number;
}

/** Contrat commun aux formulaires de l'atelier : `null` si tout va bien. */
type Retour = Promise<string | null>;

/**
 * Le tableau de trésorerie.
 *
 * Aucun repli sur des données d'exemple, pour la même raison que les rapports :
 * un solde de caisse est soit exact, soit absent. Afficher « 185 000 F » sur un
 * jeu de démonstration serait le mensonge le plus coûteux de cette interface —
 * on prend des décisions d'achat avec ce chiffre.
 */
export function useTresorerie() {
  const [donnees, setDonnees] = useState<Tresorerie | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [session, setSession] = useState(true);
  const [rafraichissement, setRafraichissement] = useState(0);

  useEffect(() => {
    let annule = false;
    void (async () => {
      try {
        const res = await avecReessai401<Tresorerie>('/api/tresorerie');
        if (annule) return;
        setDonnees(res);
        setSession(true);
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) setSession(false);
        else setErreur(messageErreur(err, 'Trésorerie indisponible.'));
      } finally {
        if (!annule) setChargement(false);
      }
    })();
    return () => {
      annule = true;
    };
  }, [rafraichissement]);

  const recharger = useCallback(() => {
    setChargement(true);
    setRafraichissement((n) => n + 1);
  }, []);

  return { donnees, chargement, erreur, session, recharger };
}

export interface FiltresMouvements {
  /** « AAAA-MM ». Absent = tout l'historique. */
  mois?: string;
  sens?: 'IN' | 'OUT';
  poste?: string;
  /** Identifiant de commande — le journal d'un encaissement précis. */
  commande?: string;
}

/**
 * Le journal de caisse, filtrable.
 *
 * `ajouter` et `supprimer` renvoient `null` en cas de succès, sinon le message
 * à afficher — même contrat que `useClients.ajouter`, pour que tous les
 * formulaires de l'atelier se traitent de la même façon.
 */
export function useMouvements(filtres: FiltresMouvements = {}) {
  const [mouvements, setMouvements] = useState<Mouvement[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [session, setSession] = useState(true);

  const { mois, sens, poste, commande } = filtres;

  const charger = useCallback(async (): Promise<Mouvement[] | null> => {
    const params = new URLSearchParams();
    if (mois) params.set('mois', mois);
    if (sens) params.set('sens', sens);
    if (poste) params.set('poste', poste);
    if (commande) params.set('commande', commande);
    const suffixe = params.toString();

    const res = await avecReessai401<{ mouvements: Mouvement[] }>(
      `/api/tresorerie/mouvements${suffixe ? `?${suffixe}` : ''}`,
    );
    return res.mouvements;
  }, [mois, sens, poste, commande]);

  useEffect(() => {
    let annule = false;
    setChargement(true);
    void (async () => {
      try {
        const liste = await charger();
        if (annule || liste === null) return;
        setMouvements(liste);
        setSession(true);
        setErreur(null);
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) setSession(false);
        else setErreur(messageErreur(err, 'Journal indisponible.'));
      } finally {
        if (!annule) setChargement(false);
      }
    })();
    return () => {
      annule = true;
    };
  }, [charger]);

  const ajouter = useCallback(
    async (entree: {
      direction: 'IN' | 'OUT';
      amount: number;
      occurredAt: string;
      category?: string;
      method: string;
      label: string;
      notes?: string;
      tailoringOrderId?: string;
    }): Retour => {
      try {
        // `api()` sérialise lui-même : lui passer une chaîne déjà encodée
        // enverrait un JSON contenant une chaîne.
        const res = await api<{ mouvement: Mouvement }>('/api/tresorerie/mouvements', {
          method: 'POST',
          body: entree,
        });
        // On réinsère en tête si la ligne appartient à la fenêtre affichée ;
        // sinon un rechargement complet la ferait apparaître puis disparaître.
        const dansLaFenetre =
          (!mois || res.mouvement.occurredAt.startsWith(mois)) &&
          (!sens || res.mouvement.direction === sens) &&
          (!poste || res.mouvement.category === poste);
        if (dansLaFenetre) {
          setMouvements((prec) =>
            [res.mouvement, ...prec].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
          );
        }
        return null;
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          return 'Session expirée — reconnectez-vous.';
        }
        return messageErreur(err, 'Impossible d’enregistrer l’écriture.');
      }
    },
    [mois, sens, poste],
  );

  const supprimer = useCallback(
    async (id: string): Retour => {
      const precedent = mouvements;
      setMouvements((prec) => prec.filter((m) => m.id !== id));
      try {
        await api(`/api/tresorerie/mouvements/${id}`, { method: 'DELETE' });
        return null;
      } catch (err) {
        // Retour à l'état antérieur : une ligne de caisse qui disparaît de
        // l'écran sans avoir été supprimée en base fausserait toute lecture.
        setMouvements(precedent);
        return messageErreur(err, 'Suppression impossible.');
      }
      // `mouvements` est lu pour le retour arrière : la dépendance est voulue.
    },
    [mouvements],
  );

  return { mouvements, chargement, erreur, session, ajouter, supprimer };
}

/** Les charges fixes déclarées — la base de la prévision des sorties. */
export function useCharges() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [session, setSession] = useState(true);

  useEffect(() => {
    let annule = false;
    void (async () => {
      try {
        const res = await avecReessai401<{ charges: Charge[] }>('/api/tresorerie/charges');
        if (annule) return;
        setCharges(res.charges);
        setSession(true);
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) setSession(false);
        else setErreur(messageErreur(err, 'Charges indisponibles.'));
      } finally {
        if (!annule) setChargement(false);
      }
    })();
    return () => {
      annule = true;
    };
  }, []);

  const ajouter = useCallback(
    async (entree: {
      label: string;
      category: string;
      amount: number;
      dayOfMonth?: number;
    }): Retour => {
      try {
        const res = await api<{ charge: Charge }>('/api/tresorerie/charges', {
          method: 'POST',
          body: entree,
        });
        setCharges((prec) => [...prec, res.charge].sort((a, b) => a.dayOfMonth - b.dayOfMonth));
        return null;
      } catch (err) {
        return messageErreur(err, 'Impossible d’enregistrer la charge.');
      }
    },
    [],
  );

  /** Active ou suspend une charge — un abonnement résilié cesse d'être projeté. */
  const basculer = useCallback(async (id: string, active: boolean): Retour => {
    setCharges((prec) => prec.map((c) => (c.id === id ? { ...c, active } : c)));
    try {
      await api(`/api/tresorerie/charges/${id}`, { method: 'PATCH', body: { active } });
      return null;
    } catch (err) {
      setCharges((prec) => prec.map((c) => (c.id === id ? { ...c, active: !active } : c)));
      return messageErreur(err, 'Modification impossible.');
    }
  }, []);

  const supprimer = useCallback(
    async (id: string): Retour => {
      const precedent = charges;
      setCharges((prec) => prec.filter((c) => c.id !== id));
      try {
        await api(`/api/tresorerie/charges/${id}`, { method: 'DELETE' });
        return null;
      } catch (err) {
        setCharges(precedent);
        return messageErreur(err, 'Suppression impossible.');
      }
    },
    [charges],
  );

  return { charges, chargement, erreur, session, ajouter, basculer, supprimer };
}

/** Le jour du jour, au format attendu par les champs `<input type="date">`. */
export function aujourdhuiIso(): string {
  return jourIso(new Date());
}
