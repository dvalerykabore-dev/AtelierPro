'use client';

import { Languages } from 'lucide-react';
import { useLangue } from '@/contexts/LangueContext';
import { LANGUES, NOMS_LANGUES, SENS, estLangue } from '@/lib/langue';
import { cn } from '@/lib/utils';

/**
 * Sélecteur de langue compact, pour les barres de navigation.
 *
 * Sa place la plus importante est la page d'accueil : c'est le premier écran
 * qu'un visiteur voit, et jusqu'ici le seul moyen de changer de langue vivait
 * dans les réglages, derrière une connexion. Un arabophone devait donc
 * traverser une inscription en français pour atteindre le réglage qui lui
 * aurait permis de la lire.
 *
 * Liste déroulante native plutôt qu'un menu maison : elle s'ouvre en plein
 * écran sur téléphone, se navigue au clavier, et se lit par les lecteurs
 * d'écran sans une ligne d'ARIA à maintenir.
 *
 * Chaque option porte `lang` et `dir` : « العربية » doit s'afficher de droite à
 * gauche même quand l'interface autour est encore en français, sinon le nom de
 * la langue qu'on cherche apparaît à l'envers.
 */
export default function SelecteurLangue({ className }: { className?: string }) {
  const { langue, definir, t } = useLangue();

  return (
    <label
      className={cn(
        'text-muted-foreground hover:text-foreground relative flex items-center gap-1.5',
        'has-[:focus-visible]:ring-primary rounded-md transition-colors has-[:focus-visible]:ring-2',
        className,
      )}
      title={t('Langue de l’interface')}
    >
      <Languages size={16} aria-hidden className="pointer-events-none flex-shrink-0" />
      <span className="sr-only">{t('Langue de l’interface')}</span>
      <select
        value={langue}
        onChange={(e) => {
          // `estLangue` plutôt qu'un cast : la valeur vient du DOM, qu'une
          // extension de navigateur peut avoir modifié.
          if (estLangue(e.target.value)) definir(e.target.value);
        }}
        className="text-foreground cursor-pointer appearance-none bg-transparent py-2 pe-1 text-sm focus:outline-none"
      >
        {LANGUES.map((l) => (
          <option key={l} value={l} lang={l} dir={SENS[l]} className="bg-surface text-foreground">
            {NOMS_LANGUES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
