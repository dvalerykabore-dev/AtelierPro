'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useT } from '@/contexts/LangueContext';
import { cn } from '@/lib/utils';

/**
 * Bascule sombre/clair. Sans libellé visible (elle vit dans des barres denses),
 * donc l'intitulé accessible porte l'action à venir et `aria-pressed` porte
 * l'état courant — un lecteur d'écran annonce les deux.
 */
export default function BasculeTheme({ className }: { className?: string }) {
  const { theme, basculer } = useTheme();
  const t = useT();
  const versClair = theme === 'dark';
  const libelle = t(versClair ? 'Activer le thème clair' : 'Activer le thème sombre');

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={libelle}
      aria-pressed={theme === 'light'}
      title={libelle}
      className={cn(
        'text-muted-foreground hover:text-foreground hover:bg-muted flex h-9 w-9 flex-shrink-0',
        'items-center justify-center rounded-md transition-colors',
        className,
      )}
    >
      {versClair ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );
}
