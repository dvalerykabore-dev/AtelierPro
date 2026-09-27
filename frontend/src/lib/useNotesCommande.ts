'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
import { messageErreur } from '@/lib/message-erreur';
import { initialesDe } from '@/lib/commande-fiche';
import { DICTIONNAIRES } from '@/lib/i18n/dictionnaires';
import { traduire } from '@/lib/i18n/traduire';
import { ETIQUETTE_INTL, LANGUE_DEFAUT, type Langue } from '@/lib/langue';
import { useLangue } from '@/contexts/LangueContext';

export interface NoteCommande {
  id: string;
  auteur: string;
  initiales: string;
  /** Date déjà mise en forme pour l'affichage — « 24 août », « à l'instant ». */
  date: string;
  texte: string;
}

interface NoteApi {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

/**
 * Date courte d'une note.
 *
 * Le jour et le mois suffisent : sur une commande en cours, personne ne se
 * demande l'année. Les notes du jour affichent « aujourd'hui » — plus utile
 * qu'une date qu'il faut comparer mentalement à celle du jour.
 */
export function dateNote(
  iso: string,
  maintenant = new Date(),
  langue: Langue = LANGUE_DEFAUT,
): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const memeJour =
    d.getFullYear() === maintenant.getFullYear() &&
    d.getMonth() === maintenant.getMonth() &&
    d.getDate() === maintenant.getDate();
  if (memeJour) return traduire(DICTIONNAIRES[langue], 'aujourd’hui');
  return new Intl.DateTimeFormat(ETIQUETTE_INTL[langue], {
    day: 'numeric',
    month: 'short',
  }).format(d);
}

export function versUI(n: NoteApi, langue: Langue = LANGUE_DEFAUT): NoteCommande {
  return {
    id: n.id,
    auteur: n.author,
    initiales: initialesDe(n.author),
    date: dateNote(n.createdAt, undefined, langue),
    texte: n.body,
  };
}

/**
 * Les notes datées d'une commande.
 *
 * Elles vivaient dans l'état du composant, amorcées par un jeu d'exemple : un
 * artisan écrivait « manches plus courtes », fermait l'onglet, et l'information
 * n'existait plus — après que le formulaire eut confirmé l'enregistrement.
 *
 * Aucun repli sur des notes d'exemple ici, contrairement aux clients ou aux
 * commandes. Une consigne de couture inventée serait suivie.
 */
export function useNotesCommande(commandeId: string | null) {
  const { langue } = useLangue();
  const [notes, setNotes] = useState<NoteCommande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [session, setSession] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!commandeId) {
      setNotes([]);
      setChargement(false);
      return;
    }

    let annule = false;
    setChargement(true);

    void (async () => {
      try {
        const res = await avecReessai401<{ notes: NoteApi[] }>(
          `/api/commandes/${commandeId}/notes`,
        );
        if (annule) return;
        setNotes(res.notes.map((n) => versUI(n, langue)));
        setSession(true);
        setErreur(null);
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) {
          setNotes([]);
          setSession(false);
        } else {
          setErreur(messageErreur(err, 'Notes indisponibles.'));
        }
      } finally {
        if (!annule) setChargement(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, [commandeId, langue]);

  /** Renvoie `null` en cas de succès, sinon le message à afficher. */
  const ajouter = useCallback(
    async (texte: string): Promise<string | null> => {
      if (!commandeId) return 'Commande inconnue.';
      const propre = texte.trim();
      if (!propre) return null;

      try {
        const res = await api<{ note: NoteApi }>(`/api/commandes/${commandeId}/notes`, {
          method: 'POST',
          body: { body: propre },
        });
        // Rien n'est posé avant la réponse : une note qui apparaît puis
        // disparaît au rechargement est pire que deux secondes d'attente,
        // parce qu'on l'a crue enregistrée.
        setNotes((prec) => [versUI(res.note, langue), ...prec]);
        return null;
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          return 'Session expirée — reconnectez-vous pour écrire une note.';
        }
        return messageErreur(err, 'Note non enregistrée.');
      }
    },
    [commandeId, langue],
  );

  return { notes, chargement, session, erreur, ajouter };
}
