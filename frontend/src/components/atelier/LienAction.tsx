'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useT } from '@/contexts/LangueContext';

export interface LienActionProps {
  href: string;
  /** Libellé en français — c'est la clé du dictionnaire, traduite ici. */
  label: string;
  className?: string;
  /**
   * Icône déjà rendue, pas le composant.
   *
   * Une prop qui vaut `Plus` traverserait la frontière serveur → client comme
   * une fonction, ce que React refuse de sérialiser ; un `<Plus />` est un
   * élément, et passe. La distinction ne se voit pas au typage — seulement à
   * l'exécution, en 500.
   */
  icone?: ReactNode;
}

/**
 * Lien d'en-tête traduit, pour les actions passées à `AppShell`.
 *
 * Les pages qui exportent `metadata` doivent rester des composants serveur :
 * Next refuse `'use client'` sur un module qui exporte `metadata`, parce que
 * les métadonnées sont résolues avant le rendu. Elles ne peuvent donc pas
 * appeler `useT()` elles-mêmes. Plutôt que de dupliquer un fichier client par
 * page pour deux liens, ce composant porte la traduction : la page continue de
 * décrire son en-tête en JSX, en français, et le libellé se traduit ici.
 */
export default function LienAction({ href, label, className, icone }: LienActionProps) {
  const t = useT();
  return (
    <Link href={href} className={className}>
      {icone}
      {t(label)}
    </Link>
  );
}
