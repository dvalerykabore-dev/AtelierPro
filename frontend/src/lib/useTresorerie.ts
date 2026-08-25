'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useEtatMemorise } from '@/lib/etat-memorise';
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
  const [donnees, poserDonnees, dejaCharge] = useEtatMemorise<Tresorerie | null>(
    '/api/tresorerie',
    null,
  );
  const [chargement, setChargement] = useState(!dejaCharge);
  /**
   * Vrai tant qu'on revalide un solde déjà affiché.
   *
   * Les autres écrans peuvent revalider en silence. Pas celui-ci : un solde de
   * caisse se lit comme le solde de l'instant, et sert à décider d'un achat.
   * Montrer sans rien dire un chiffre vieux de trois minutes, c'est répondre à
   * une question qu'on n'a pas posée. L'écran affiche donc une mention
   * discrète — pas un squelette, qui reprendrait le chiffre pour rien.
   */
  const [revalidation, setRevalidation] = useState(dejaCharge);
  const [erreur, setErreur] = useState<string | null>(null);
  const [session, setSession] = useState(true);
  const [rafraichissement, setRafraichissement] = useState(0);

  useEffect(() => {
    let annule = false;
    void (async () => {
      try {
        const res = await avecReessai401<Tresorerie>('/api/tresorerie');
        if (annule) return;
        poserDonnees(res);
        setSession(true);
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) {
          // Session finie : on efface le solde mémorisé plutôt que de le
          // laisser sur un poste que quelqu'un d'autre peut reprendre.
          poserDonnees(null);
          setSession(false);
        } else setErreur(messageErreur(err, 'Trésorerie indisponible.'));
      } finally {
        if (!annule) {
          setChargement(false);
          setRevalidation(false);
        }
      }
    })();
    return () => {
      annule = true;
    };
  }, [rafraichissement, poserDonnees]);

  const recharger = useCallback(() => {
    setChargement(true);
    setRafraichissement((n) => n + 1);
  }, []);

  return { donnees, chargement, revalidation, erreur, session, recharger };
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
interface EtatMouvements {
  mouvements: Mouvement[];
  /**
   * Filtres que décrit la liste. Peindre une liste mémorisée sous d'autres
   * filtres montrerait précisément les écritures que l'utilisateur vient
   * d'exclure — le contraire de ce qu'il a demandé.
   */
  signature: string;
}

const MOUVEMENTS_VIDES: EtatMouvements = { mouvements: [], signature: 'rien-en-memoire' };

export function useMouvements(filtres: FiltresMouvements = {}) {
  const { mois, sens, poste, commande } = filtres;
  const signature = [mois, sens, poste, commande].map((f) => f ?? '').join('|');

  const [memorise, poserEtat, dejaCharge] = useEtatMemorise<EtatMouvements>(
    '/api/tresorerie/mouvements',
    MOUVEMENTS_VIDES,
  );
  const mouvements = memorise.signature === signature ? memorise.mouvements : [];

  // Figé au premier rendu : « ai-je de quoi peindre tout de suite ? ». La
  // question ne se pose qu'une fois, et la réponse ne doit pas changer au
  // milieu d'un chargement.
  const [demarreChaud] = useState(dejaCharge && memorise.signature === signature);
  const [chargement, setChargement] = useState(!demarreChaud);
  const [erreur, setErreur] = useState<string | null>(null);
  const [session, setSession] = useState(true);
  const premierPassage = useRef(true);

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
    // Un changement de filtre est une demande explicite : le squelette est
    // attendu. Le premier affichage d'une liste déjà connue, lui, ne doit rien
    // clignoter.
    if (!(premierPassage.current && demarreChaud)) setChargement(true);
    premierPassage.current = false;
    void (async () => {
      try {
        const liste = await charger();
        if (annule || liste === null) return;
        poserEtat({ mouvements: liste, signature });
        setSession(true);
        setErreur(null);
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) {
          poserEtat(MOUVEMENTS_VIDES);
          setSession(false);
        } else setErreur(messageErreur(err, 'Journal indisponible.'));
      } finally {
        if (!annule) setChargement(false);
      }
    })();
    return () => {
      annule = true;
    };
  }, [charger, poserEtat, signature, demarreChaud]);

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
          poserEtat((prec) => ({
            ...prec,
            mouvements: [res.mouvement, ...prec.mouvements].sort((a, b) =>
              b.occurredAt.localeCompare(a.occurredAt),
            ),
          }));
        }
        return null;
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          return 'Session expirée — reconnectez-vous.';
        }
        return messageErreur(err, 'Impossible d’enregistrer l’écriture.');
      }
    },
    [mois, sens, poste, poserEtat],
  );

  const supprimer = useCallback(
    async (id: string): Retour => {
      const precedent = mouvements;
      poserEtat((prec) => ({ ...prec, mouvements: prec.mouvements.filter((m) => m.id !== id) }));
      try {
        await api(`/api/tresorerie/mouvements/${id}`, { method: 'DELETE' });
        return null;
      } catch (err) {
        // Retour à l'état antérieur : une ligne de caisse qui disparaît de
        // l'écran sans avoir été supprimée en base fausserait toute lecture.
        poserEtat((prec) => ({ ...prec, mouvements: precedent }));
        return messageErreur(err, 'Suppression impossible.');
      }
      // `mouvements` est lu pour le retour arrière : la dépendance est voulue.
    },
    [mouvements, poserEtat],
  );

  return { mouvements, chargement, erreur, session, ajouter, supprimer };
}

/** Les charges fixes déclarées — la base de la prévision des sorties. */
export function useCharges() {
  const [charges, poserCharges, dejaCharge] = useEtatMemorise<Charge[]>(
    '/api/tresorerie/charges',
    [],
  );
  const [chargement, setChargement] = useState(!dejaCharge);
  const [erreur, setErreur] = useState<string | null>(null);
  const [session, setSession] = useState(true);

  useEffect(() => {
    let annule = false;
    void (async () => {
      try {
        const res = await avecReessai401<{ charges: Charge[] }>('/api/tresorerie/charges');
        if (annule) return;
        poserCharges(res.charges);
        setSession(true);
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) {
          poserCharges([]);
          setSession(false);
        } else setErreur(messageErreur(err, 'Charges indisponibles.'));
      } finally {
        if (!annule) setChargement(false);
      }
    })();
    return () => {
      annule = true;
    };
  }, [poserCharges]);

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
        poserCharges((prec) => [...prec, res.charge].sort((a, b) => a.dayOfMonth - b.dayOfMonth));
        return null;
      } catch (err) {
        return messageErreur(err, 'Impossible d’enregistrer la charge.');
      }
    },
    [poserCharges],
  );

  /** Active ou suspend une charge — un abonnement résilié cesse d'être projeté. */
  const basculer = useCallback(
    async (id: string, active: boolean): Retour => {
      poserCharges((prec) => prec.map((c) => (c.id === id ? { ...c, active } : c)));
      try {
        await api(`/api/tresorerie/charges/${id}`, { method: 'PATCH', body: { active } });
        return null;
      } catch (err) {
        poserCharges((prec) => prec.map((c) => (c.id === id ? { ...c, active: !active } : c)));
        return messageErreur(err, 'Modification impossible.');
      }
    },
    [poserCharges],
  );

  const supprimer = useCallback(
    async (id: string): Retour => {
      const precedent = charges;
      poserCharges((prec) => prec.filter((c) => c.id !== id));
      try {
        await api(`/api/tresorerie/charges/${id}`, { method: 'DELETE' });
        return null;
      } catch (err) {
        poserCharges(precedent);
        return messageErreur(err, 'Suppression impossible.');
      }
    },
    [charges, poserCharges],
  );

  return { charges, chargement, erreur, session, ajouter, basculer, supprimer };
}

/** Le jour du jour, au format attendu par les champs `<input type="date">`. */
export function aujourdhuiIso(): string {
  return jourIso(new Date());
}
