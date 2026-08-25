'use client';

import { useCallback, useRef, useState } from 'react';
import { getCache, setCache } from '@/lib/useApi';

/**
 * Décide de quoi part un écran : la dernière valeur connue, ou le défaut.
 *
 * Extrait du hook pour être testable sans moteur de rendu — le projet n'a pas
 * de bibliothèque de test React, et cette décision est la seule chose du
 * mécanisme qui puisse se tromper.
 */
export function valeurInitiale<T>(
  enCache: T | null,
  defaut: T,
): { valeur: T; demarreChaud: boolean } {
  // `null` signifie « absent » dans le cache de `useApi` — jamais une valeur
  // légitime : les hooks de l'atelier stockent des tableaux ou des objets.
  if (enCache === null) return { valeur: defaut, demarreChaud: false };
  return { valeur: enCache, demarreChaud: true };
}

/** Applique la forme fonctionnelle de `poser`, comme le ferait `setState`. */
export function resoudre<T>(valeur: T | ((precedent: T) => T), precedent: T): T {
  return typeof valeur === 'function' ? (valeur as (precedent: T) => T)(precedent) : valeur;
}

/**
 * État d'écran conservé d'une visite à l'autre.
 *
 * Chaque hook de l'atelier repartait de zéro à chaque navigation : squelette,
 * aller-retour jusqu'à Neon, puis affichage. Mesuré depuis un poste d'atelier,
 * ce trajet coûte environ 1,3 s par appel — et on le repayait à chaque clic sur
 * le rail, y compris pour revenir sur un écran quitté trois secondes plus tôt.
 *
 * On rend donc la dernière valeur connue tout de suite, et on revalide derrière.
 * Ce qui s'affiche reste une réponse du serveur : ce n'est pas un repli sur le
 * jeu d'exemple, seulement une réponse d'il y a un instant.
 *
 * ⚠️ La clé DOIT commencer par `/api/`. La déconnexion vide le cache par ce
 * préfixe (`invalidateCachePrefix('/api/')` dans AuthContext) ; une clé en
 * dehors survivrait à la déconnexion et laisserait les commandes, les clients
 * et la caisse d'un atelier visibles au compte suivant sur la même machine.
 * Un test de garde vérifie ce préfixe sur tous les appels du dépôt.
 *
 * Le stockage est celui de `useApi` : en mémoire, perdu au rechargement de
 * l'onglet et évincé au bout de quelques minutes. Rien ne touche au disque —
 * un poste d'atelier est souvent partagé.
 */
export function useEtatMemorise<T>(
  cle: string,
  defaut: T,
): [T, (valeur: T | ((precedent: T) => T)) => void, boolean] {
  const depart = valeurInitiale(getCache<T>(cle), defaut);

  const [valeur, setValeur] = useState<T>(depart.valeur);

  // `useState` n'évalue son argument qu'au premier rendu : ce booléen dit qu'on
  // a démarré chaud, pas que le cache est rempli maintenant. C'est bien la
  // question que pose l'écran — « dois-je montrer un squelette ? » — et elle ne
  // se pose qu'une fois. S'il basculait en cours de route, l'écran retirerait
  // son squelette au milieu du premier chargement.
  const [demarreChaud] = useState(depart.demarreChaud);

  // La forme fonctionnelle doit voir la valeur courante sans que `poser` change
  // d'identité à chaque rendu : les hooks appelants le placent dans des
  // dépendances de `useCallback`. Une ref plutôt que `setValeur(fn)`, parce que
  // le cache doit être écrit tout de suite, pas au prochain rendu.
  const refValeur = useRef(valeur);
  refValeur.current = valeur;

  const poser = useCallback(
    (v: T | ((precedent: T) => T)) => {
      const suivant = resoudre(v, refValeur.current);
      refValeur.current = suivant;
      setCache(cle, suivant);
      setValeur(suivant);
    },
    [cle],
  );

  return [valeur, poser, demarreChaud];
}
