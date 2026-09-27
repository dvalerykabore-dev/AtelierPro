import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const VARIANTES = {
  /** Action principale — or plein, comme les CTA des maquettes. */
  primaire: 'bg-primary text-primary-foreground hover:bg-accent disabled:hover:bg-primary',
  /** Action secondaire — contour discret sur fond sombre. */
  contour: 'border border-border text-foreground hover:bg-muted bg-transparent',
  /** Action tertiaire — texte seul. */
  fantome: 'text-muted-foreground hover:text-foreground bg-transparent',
  /** Action destructrice. */
  danger: 'border border-danger text-danger hover:bg-danger/10 bg-transparent',
} as const;

const TAILLES = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: keyof typeof VARIANTES;
  taille?: keyof typeof TAILLES;
  /** Occupe toute la largeur disponible — formulaires, écrans mobiles. */
  pleineLargeur?: boolean;
  children: ReactNode;
}

export default function Button({
  variante = 'primaire',
  taille = 'md',
  pleineLargeur = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTES[variante],
        TAILLES[taille],
        pleineLargeur && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
