'use client';

import { useT } from '@/contexts/LangueContext';
import { cn } from '@/lib/utils';

/**
 * « Chargement… », traduit.
 *
 * Existe parce que les `fallback` de `<Suspense>` vivent souvent dans une page
 * serveur — celle d'inscription l'est délibérément, pour que Next puisse
 * pré-rendre autour du formulaire. Un composant serveur n'a pas de hook, donc
 * pas de langue : le mot restait français quelle que soit celle choisie.
 */
export default function TexteChargement({ className }: { className?: string }) {
  const t = useT();
  return <span className={cn('text-muted-foreground text-sm', className)}>{t('Chargement…')}</span>;
}
