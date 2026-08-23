import type { StatutCommande } from '@/lib/mock/atelier';
import { cn } from '@/lib/utils';

/**
 * Couleur associée à chaque statut de commande.
 *
 * Les deux maquettes Banani divergeaient : le desktop peignait « En cours » en
 * `warning` et « Essayage » en `primary`, le mobile l'inverse. Cette table
 * unifie les deux écrans sur la version mobile, sémantiquement plus lisible
 * (progression → or, essayage → or clair, livraison → vert, retard → rouge).
 */
const COULEURS: Record<StatutCommande, { pastille: string; texte: string }> = {
  'En cours': { pastille: 'bg-primary', texte: 'text-primary' },
  Essayage: { pastille: 'bg-accent', texte: 'text-accent' },
  Livraison: { pastille: 'bg-success', texte: 'text-success' },
  'En retard': { pastille: 'bg-danger', texte: 'text-danger' },
  // Commande close : volontairement éteinte, elle ne doit plus attirer l'œil
  // dans la liste (source : écran « Liste commandes »).
  Livré: { pastille: 'bg-muted-foreground', texte: 'text-muted-foreground' },
};

export function couleurStatut(statut: StatutCommande) {
  return COULEURS[statut];
}

export interface StatusBadgeProps {
  statut: StatutCommande;
  /** Masque le libellé pour ne garder que la pastille (colonne étroite). */
  pastilleSeule?: boolean;
  className?: string;
}

export default function StatusBadge({
  statut,
  pastilleSeule = false,
  className,
}: StatusBadgeProps) {
  const { pastille, texte } = COULEURS[statut];

  if (pastilleSeule) {
    return (
      <span
        className={cn('block h-2 w-2 flex-shrink-0 rounded-full', pastille, className)}
        title={statut}
      />
    );
  }

  return (
    <span className={cn('flex items-center gap-1 text-xs font-medium', texte, className)}>
      <span className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', pastille)} aria-hidden />
      {statut}
    </span>
  );
}
