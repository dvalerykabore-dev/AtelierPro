import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export interface CapacityBarProps {
  nom: string;
  role: string;
  initiales: string;
  heuresUtilisees: number;
  heuresTotal: number;
}

/** Seuil à partir duquel un artisan est considéré « quasi-plein ». */
const SEUIL_ALERTE = 75;

export function chargeArtisan(utilisees: number, total: number) {
  const pourcentage = total > 0 ? Math.round((utilisees / total) * 100) : 0;
  const sature = pourcentage >= 100;
  const alerte = pourcentage >= SEUIL_ALERTE && !sature;
  return { pourcentage, sature, alerte };
}

/**
 * Barre de charge journalière d'un artisan (colonne capacité, desktop).
 * Source Banani : /components/CapacityBar.jsx
 */
export default function CapacityBar({
  nom,
  role,
  initiales,
  heuresUtilisees,
  heuresTotal,
}: CapacityBarProps) {
  const { pourcentage, sature, alerte } = chargeArtisan(heuresUtilisees, heuresTotal);

  const couleurBarre = sature ? 'bg-danger' : alerte ? 'bg-warning' : 'bg-success';
  const couleurTexte = sature ? 'text-danger' : alerte ? 'text-warning' : 'text-success';
  const libelle = sature ? 'Saturé' : alerte ? 'Quasi-plein' : 'Disponible';

  return (
    <div className="border-border flex items-center gap-4 border-b py-3">
      <Avatar initiales={initiales} taille="md" />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-foreground truncate text-sm font-medium">{nom}</span>
          <span className={cn('flex-shrink-0 text-xs font-medium', couleurTexte)}>{libelle}</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="bg-muted h-2 flex-1 overflow-hidden rounded-sm"
            role="progressbar"
            aria-valuenow={pourcentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Charge de ${nom}`}
          >
            {/* Largeur calculée à l'exécution : Tailwind ne peut pas générer une
                classe par pourcentage possible. Seul style en ligne conservé. */}
            <div
              className={cn('h-full rounded-sm', couleurBarre)}
              style={{ width: `${Math.min(pourcentage, 100)}%` }}
            />
          </div>
          <span className="text-muted-foreground flex-shrink-0 text-xs">
            {heuresUtilisees}/{heuresTotal}h
          </span>
        </div>

        <span className="text-muted-foreground text-xs">{role}</span>
      </div>
    </div>
  );
}
