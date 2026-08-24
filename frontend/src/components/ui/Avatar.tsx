import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const TAILLES = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-xs',
  lg: 'w-10 h-10 text-sm',
} as const;

export interface AvatarProps {
  /** Initiales affichées (2 lettres) — un noeud, pour les cas où elles viennent de la session. */
  initiales: ReactNode;
  taille?: keyof typeof TAILLES;
  /** Bordure or — utilisée pour l'utilisateur connecté dans le rail latéral. */
  accentue?: boolean;
  className?: string;
}

/**
 * Pastille d'initiales.
 *
 * Remplace le composant `UserAvatar` des maquettes Banani, qui affiche des
 * photographies que le MCP ne fournit pas. Les initiales sont déjà la
 * convention retenue par la maquette desktop, l'ensemble reste donc cohérent.
 */
export default function Avatar({
  initiales,
  taille = 'md',
  accentue = false,
  className,
}: AvatarProps) {
  return (
    <span
      className={cn(
        'bg-secondary inline-flex flex-shrink-0 items-center justify-center rounded-full border font-bold',
        accentue ? 'border-primary text-primary' : 'border-border text-primary',
        TAILLES[taille],
        className,
      )}
    >
      {initiales}
    </span>
  );
}
