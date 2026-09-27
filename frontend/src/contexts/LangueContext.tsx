'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  LANGUE_DEFAUT,
  appliquerLangue,
  ecrireLangue,
  lireLangue,
  type Langue,
} from '@/lib/langue';
import { DICTIONNAIRES } from '@/lib/i18n/dictionnaires';
import { formaterNombre, traduire, traduirePluriel, type Parametres } from '@/lib/i18n/traduire';

export interface LangueContextValue {
  langue: Langue;
  definir: (langue: Langue) => void;
  /** Traduit une phrase française. `t('Bonjour {nom}', { nom })`. */
  t: (cle: string, params?: Parametres) => string;
  /** Décline selon un nombre. `tp('{n} commande', '{n} commandes', 3)`. */
  tp: (un: string, autre: string, n: number, params?: Parametres) => string;
  /** Formate un nombre dans la langue courante. */
  n: (valeur: number) => string;
}

const LangueContext = createContext<LangueContextValue | null>(null);

/**
 * Fournit la langue courante et la fonction de traduction.
 *
 * L'état démarre sur LANGUE_DEFAUT plutôt que sur la valeur stockée, pour la
 * même raison que le thème : le rendu serveur ne connaît pas le localStorage,
 * et un état initial divergent provoquerait une erreur d'hydratation. Le
 * sens de lecture, lui, est déjà correct au premier pixel —
 * SCRIPT_ANTI_FLASH_LANGUE a posé `lang` et `dir` sur <html> avant que React
 * ne démarre. On rattrape ici l'état React après montage.
 *
 * Conséquence assumée : pendant un instant après le chargement, un utilisateur
 * en arabe voit une page déjà retournée mais dont les mots sont encore
 * français. C'est le compromis inverse du texte anglais sur mise en page
 * retournée, qui aurait été plus déroutant.
 */
export function LangueProvider({ children }: { children: ReactNode }) {
  const [langue, setLangue] = useState<Langue>(LANGUE_DEFAUT);
  const [monte, setMonte] = useState(false);

  useEffect(() => {
    setLangue(lireLangue(window.localStorage));
    setMonte(true);
  }, []);

  // Synchronise DOM + stockage à chaque changement, jamais avant le montage :
  // écrire pendant le premier rendu écraserait le choix mémorisé par le défaut.
  useEffect(() => {
    if (!monte) return;
    appliquerLangue(document.documentElement, langue);
    ecrireLangue(window.localStorage, langue);
  }, [monte, langue]);

  const valeur = useMemo<LangueContextValue>(() => {
    const dictionnaire = DICTIONNAIRES[langue];
    return {
      langue,
      definir: setLangue,
      t: (cle, params) => traduire(dictionnaire, cle, params),
      tp: (un, autre, nombre, params) =>
        traduirePluriel(dictionnaire, langue, un, autre, nombre, params),
      n: (v) => formaterNombre(v, langue),
    };
  }, [langue]);

  return <LangueContext.Provider value={valeur}>{children}</LangueContext.Provider>;
}

/**
 * Accès à la traduction.
 *
 * Hors provider — un test unitaire, un composant isolé — le hook rend le
 * français plutôt que de lever : une traduction absente ne doit jamais faire
 * tomber un écran.
 */
export function useLangue(): LangueContextValue {
  const ctx = useContext(LangueContext);
  return ctx ?? SANS_PROVIDER;
}

/** Repli hors provider : tout reste en français, rien ne lève. */
const SANS_PROVIDER: LangueContextValue = {
  langue: LANGUE_DEFAUT,
  definir: () => {},
  t: (cle, params) => traduire(null, cle, params),
  tp: (un, autre, nombre, params) =>
    traduirePluriel(null, LANGUE_DEFAUT, un, autre, nombre, params),
  n: (v) => formaterNombre(v, LANGUE_DEFAUT),
};

/** Raccourci pour les composants qui ne traduisent que du texte simple. */
export function useT(): (cle: string, params?: Parametres) => string {
  return useLangue().t;
}

/** `useCallback` inutile ici : `definir` est stable, `setLangue` l'étant déjà. */
export function useDefinirLangue(): (langue: Langue) => void {
  const { definir } = useLangue();
  return useCallback((l: Langue) => definir(l), [definir]);
}
