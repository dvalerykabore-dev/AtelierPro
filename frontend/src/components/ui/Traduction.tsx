'use client';

import { Fragment, type ReactNode } from 'react';
import { useLangue } from '@/contexts/LangueContext';
import type { Parametres } from '@/lib/i18n/traduire';

export interface TraductionProps {
  /** Phrase française, marqueurs compris : `'… {encaisse} … {rapports} …'`. */
  cle: string;
  /** Valeurs textuelles, interpolées avant le découpage. */
  params?: Parametres;
  /** Éléments React substitués aux marqueurs restants. */
  elements: Record<string, ReactNode>;
}

/**
 * Une phrase traduite dont certains mots sont des éléments — un lien, un mot en
 * gras — et non du texte.
 *
 * Le réflexe est de couper la phrase autour de l'élément et de traduire les
 * morceaux : « Le chiffre d'affaires des », puis le lien, puis « compte
 * l'argent… ». Ça marche en français, et seulement en français. Chaque langue
 * place ses mots à sa façon, l'arabe les place en plus de droite à gauche, et
 * un traducteur à qui l'on ne donne que « Le chiffre d'affaires des » n'a aucun
 * moyen de savoir ce qui suit. Les morceaux se rassemblent alors dans un ordre
 * que personne n'a choisi.
 *
 * Ici la phrase reste entière dans le dictionnaire, marqueurs compris. Le
 * traducteur les déplace où sa langue l'exige ; on ne fait que substituer.
 * `dictionnaires.test.ts` vérifie qu'aucune traduction n'en perd un — sans quoi
 * le lien disparaîtrait de l'écran sans rien casser.
 */
export default function Traduction({ cle, params, elements }: TraductionProps) {
  const { t } = useLangue();

  // `split` avec un groupe capturant conserve les séparateurs : on récupère en
  // alternance du texte et des marqueurs.
  const morceaux = t(cle, params).split(/(\{\w+\})/g);

  return (
    <>
      {morceaux.map((morceau, i) => {
        const nom = /^\{(\w+)\}$/.exec(morceau)?.[1];
        const element = nom === undefined ? undefined : elements[nom];
        // Un marqueur sans élément correspondant reste visible tel quel — même
        // parti pris que `traduire`, qui préfère un trou voyant à un texte
        // amputé en silence.
        return <Fragment key={i}>{element ?? morceau}</Fragment>;
      })}
    </>
  );
}
