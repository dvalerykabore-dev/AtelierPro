import { cn } from '@/lib/utils';

export interface MeasureRowProps {
  label: string;
  valeur: string;
  unite?: string;
  /** Fond alterné pour lire les lignes plus facilement sur deux colonnes. */
  contraste?: boolean;
}

/**
 * Une mesure : libellé à gauche, valeur et unité à droite.
 * Source Banani : /components/MeasureRow.jsx
 */
export default function MeasureRow({
  label,
  valeur,
  unite = 'cm',
  contraste = false,
}: MeasureRowProps) {
  return (
    <div
      className={cn(
        'border-border flex items-center justify-between gap-3 border-b px-4 py-2.5',
        contraste && 'bg-muted',
      )}
    >
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex flex-shrink-0 items-center gap-1">
        <span className="text-foreground text-sm font-medium">{valeur}</span>
        <span className="text-muted-foreground text-xs">{unite}</span>
      </div>
    </div>
  );
}
