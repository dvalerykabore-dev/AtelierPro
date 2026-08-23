'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { messageErreur } from '@/lib/message-erreur';
import {
  STATUTS_TACHE,
  artisans,
  semainePlanning,
  taches as tachesExemple,
  type StatutTache,
} from '@/lib/mock/atelier';

/** Statuts côté serveur, dans le même ordre que les libellés affichés. */
const STATUTS_API = ['DONE', 'IN_PROGRESS', 'FITTING', 'PLANNED', 'BLOCKED'] as const;
export type StatutTacheApi = (typeof STATUTS_API)[number];

const VERS_FRANCAIS: Record<StatutTacheApi, StatutTache> = {
  DONE: 'Terminé',
  IN_PROGRESS: 'En cours',
  FITTING: 'Essayage',
  PLANNED: 'Planifié',
  BLOCKED: 'Bloqué',
};

const VERS_API = Object.fromEntries(
  (Object.keys(VERS_FRANCAIS) as StatutTacheApi[]).map((k) => [VERS_FRANCAIS[k], k]),
) as Record<StatutTache, StatutTacheApi>;

/** Un jour de la grille, tel que le serveur le date. */
export interface JourSemaine {
  /** « AAAA-MM-JJ » — l'identité du jour, indépendante de tout fuseau. */
  iso: string;
  /** Quantième affiché en gros dans l'entête (« 21 »). */
  date: string;
  /** Abréviation française (« Lun »). */
  jour: string;
  aujourdhui: boolean;
}

export interface TachePlanifiee {
  id: string;
  /** Initiales de l'artisan. */
  assignee: string;
  iso: string;
  duree: number;
  label: string;
  statut: StatutTache;
}

interface ReponsePlanning {
  semaine: { iso: string; aujourdhui: boolean }[];
  taches: {
    id: string;
    assignee: string;
    day: string;
    hours: number;
    label: string;
    status: string;
  }[];
}

export type SourcePlanning = 'serveur' | 'demonstration';

const ABREVIATIONS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

/** Étiquettes d'affichage d'un jour ISO, sans dépendre de la locale du poste. */
function decore(iso: string, aujourdhui: boolean): JourSemaine {
  const [, , j] = iso.split('-');
  const indexJour = new Date(`${iso}T00:00:00Z`).getUTCDay();
  return {
    iso,
    // Sans zéro initial : la maquette affiche « 3 », pas « 03 ».
    date: String(Number(j ?? '1')),
    jour: ABREVIATIONS[indexJour] ?? '?',
    aujourdhui,
  };
}

function estStatutApi(v: string): v is StatutTacheApi {
  return (STATUTS_API as readonly string[]).includes(v);
}

/**
 * Semaine d'exemple : la grille mock est indexée par colonne (0 à 5), on lui
 * fabrique des dates pour que le composant n'ait qu'une seule forme à traiter.
 */
function semaineExemple(): { semaine: JourSemaine[]; taches: TachePlanifiee[] } {
  const semaine = semainePlanning.map((j, i) => ({
    iso: `exemple-${i}`,
    date: j.date,
    jour: j.jour,
    aujourdhui: j.aujourdhui,
  }));

  const taches = tachesExemple.map((t, i) => ({
    id: `exemple-${i}`,
    assignee: artisans[t.artisanIndex]?.initiales ?? '??',
    iso: semaine[t.jourIndex]?.iso ?? 'exemple-0',
    duree: t.duree,
    label: t.label,
    statut: t.statut,
  }));

  return { semaine, taches };
}

/**
 * Planning hebdomadaire de l'atelier.
 *
 * Comme les clients et les commandes, l'écran retombe sur la semaine d'exemple
 * hors session — mais `source` le dit, et l'interface l'affiche. Les rapports
 * sont le seul écran à refuser ce repli : un chiffre faux y serait plus grave
 * qu'une grille vide.
 */
export function usePlanning() {
  const [semaine, setSemaine] = useState<JourSemaine[]>([]);
  const [taches, setTaches] = useState<TachePlanifiee[]>([]);
  const [source, setSource] = useState<SourcePlanning>('serveur');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  /** Lundi demandé au serveur ; `null` = semaine courante, selon son horloge. */
  const [debut, setDebut] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    void (async () => {
      try {
        const res = await api<ReponsePlanning>(
          debut ? `/api/planning?debut=${debut}` : '/api/planning',
        );
        if (annule) return;
        setSemaine(res.semaine.map((j) => decore(j.iso, j.aujourdhui)));
        setTaches(
          res.taches.map((t) => ({
            id: t.id,
            assignee: t.assignee,
            iso: t.day,
            duree: t.hours,
            label: t.label,
            statut: estStatutApi(t.status) ? VERS_FRANCAIS[t.status] : 'Planifié',
          })),
        );
        setSource('serveur');
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) {
          const exemple = semaineExemple();
          setSemaine(exemple.semaine);
          setTaches(exemple.taches);
          setSource('demonstration');
        } else {
          setErreur(messageErreur(err, 'Planning indisponible.'));
        }
      } finally {
        if (!annule) setChargement(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, [debut]);

  /**
   * Décale la fenêtre de `semaines` (négatif = passé). Le calcul part du lundi
   * renvoyé par le serveur, pas de l'horloge du navigateur : c'est le serveur
   * qui fait autorité sur la semaine affichée.
   */
  const decaler = useCallback(
    (semaines: number) => {
      const lundi = semaine[0]?.iso;
      if (!lundi || lundi.startsWith('exemple-')) return;
      const d = new Date(`${lundi}T00:00:00Z`);
      d.setUTCDate(d.getUTCDate() + semaines * 7);
      setChargement(true);
      setDebut(d.toISOString().slice(0, 10));
    },
    [semaine],
  );

  const revenirAujourdhui = useCallback(() => {
    setChargement(true);
    setDebut(null);
  }, []);

  /**
   * Affecte une tâche. Renvoie `null` en cas de succès, sinon le message à
   * afficher — même contrat que `useClients.ajouter`, pour que les formulaires
   * de l'atelier se traitent tous de la même façon.
   */
  const affecter = useCallback(
    async (entree: {
      assignee: string;
      iso: string;
      duree: number;
      label: string;
      statut: StatutTache;
    }): Promise<string | null> => {
      if (source === 'demonstration') {
        setTaches((prec) => [...prec, { id: `local-${Date.now()}`, ...entree }]);
        return null;
      }

      try {
        // `api()` sérialise lui-même : lui passer une chaîne déjà encodée
        // enverrait un JSON contenant une chaîne, et le serveur répondrait
        // « expected object, received string ».
        const res = await api<{ tache: ReponsePlanning['taches'][number] }>('/api/planning', {
          method: 'POST',
          body: {
            assignee: entree.assignee,
            day: entree.iso,
            hours: entree.duree,
            label: entree.label,
            status: VERS_API[entree.statut],
          },
        });
        const t = res.tache;
        setTaches((prec) => [
          ...prec,
          {
            id: t.id,
            assignee: t.assignee,
            iso: t.day,
            duree: t.hours,
            label: t.label,
            statut: estStatutApi(t.status) ? VERS_FRANCAIS[t.status] : 'Planifié',
          },
        ]);
        return null;
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          return 'Session expirée — reconnectez-vous.';
        }
        return messageErreur(err, 'Impossible d’enregistrer la tâche.');
      }
    },
    [source],
  );

  return {
    semaine,
    taches,
    source,
    chargement,
    erreur,
    affecter,
    decaler,
    revenirAujourdhui,
    /** Vrai quand la fenêtre affichée n'est pas la semaine en cours. */
    decale: debut !== null,
  };
}

export { STATUTS_TACHE };
