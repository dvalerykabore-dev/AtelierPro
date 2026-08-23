'use client';

import { Mars, Venus } from 'lucide-react';
import { GENRES, type Genre } from '@/lib/mock/atelier';
import { cn } from '@/lib/utils';

const ICONES = { Femme: Venus, Homme: Mars } as const;

export interface GenreToggleProps {
  valeur: Genre;
  onChange: (genre: Genre) => void;
  /** `sm` pour les formulaires, `md` pour l'en-tête de la prise de mesures. */
  taille?: 'sm' | 'md';
  /** Libellé de groupe annoncé aux lecteurs d'écran. */
  label?: string;
  className?: string;
}

/**
 * Sélecteur Femme / Homme.
 *
 * Bouton segmenté plutôt que liste déroulante : deux choix seulement, et le
 * geste doit rester immédiat en atelier, souvent au doigt. Le choix conditionne
 * la palette de mesures présentée — c'est donc une décision structurante, pas
 * un champ administratif : il mérite d'être visible en permanence.
 *
 * Sémantique `radiogroup` : les lecteurs d'écran annoncent bien un choix
 * exclusif, et les flèches du clavier suffisent à naviguer.
 */
export default function GenreToggle({
  valeur,
  onChange,
  taille = 'sm',
  label = 'Genre du client',
  className,
}: GenreToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('border-border bg-input inline-flex rounded-md border p-0.5', className)}
    >
      {GENRES.map((g) => {
        const Icone = ICONES[g];
        const actif = g === valeur;
        return (
          <button
            key={g}
            type="button"
            role="radio"
            aria-checked={actif}
            onClick={() => onChange(g)}
            className={cn(
              'flex items-center gap-1.5 rounded-sm font-medium transition-colors',
              taille === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
              actif
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icone size={taille === 'sm' ? 13 : 15} aria-hidden />
            {g}
          </button>
        );
      })}
    </div>
  );
}
