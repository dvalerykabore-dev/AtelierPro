'use client';

import { Languages } from 'lucide-react';
import { useLangue } from '@/contexts/LangueContext';
import { LANGUES, NOMS_LANGUES, SENS } from '@/lib/langue';
import { cn } from '@/lib/utils';

/**
 * Choix de la langue de l'interface.
 *
 * Radios natives plutôt que `role="radio"`, comme pour le thème juste
 * au-dessus : la navigation aux flèches vient gratuitement et sans code ARIA à
 * maintenir.
 *
 * Chaque langue est écrite dans sa propre langue, et son étiquette porte
 * `lang` + `dir` : « العربية » doit s'afficher de droite à gauche même quand
 * l'interface autour est encore en français, sans quoi le nom de la langue
 * qu'on cherche s'affiche à l'envers.
 */
export default function ChoixLangue() {
  const { langue, definir, t } = useLangue();

  return (
    <div className="border-border mt-5 border-t pt-5">
      <h3 className="font-headings text-foreground flex items-center gap-2 text-sm font-bold">
        <Languages size={14} aria-hidden />
        {t('Langue')}
      </h3>
      <p className="text-muted-foreground mt-1 mb-3 text-xs">
        {t('Mémorisé sur cet appareil, pas sur votre compte.')}
      </p>

      <div
        role="radiogroup"
        aria-label={t('Langue de l’interface')}
        className="flex flex-wrap gap-2"
      >
        {LANGUES.map((valeur) => {
          const actif = langue === valeur;
          return (
            <label
              key={valeur}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                'has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2',
                actif
                  ? 'border-primary bg-muted text-foreground font-medium'
                  : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              <input
                type="radio"
                name="langue-interface"
                value={valeur}
                checked={actif}
                onChange={() => definir(valeur)}
                className="sr-only"
              />
              {/* Le nom de la langue n'est jamais traduit : quelqu'un qui
                  cherche l'arabe cherche « العربية », pas « Arabe ». */}
              <span lang={valeur} dir={SENS[valeur]}>
                {NOMS_LANGUES[valeur]}
              </span>
            </label>
          );
        })}
      </div>

      {langue === 'ar' && (
        <p className="text-muted-foreground mt-2 text-xs">
          {t('L’arabe se lit de droite à gauche : l’interface se retourne entièrement.')}
        </p>
      )}
    </div>
  );
}
