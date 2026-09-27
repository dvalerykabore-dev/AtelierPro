'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const ONGLETS = ['Suivi', 'Récapitulatif'] as const;
type Onglet = (typeof ONGLETS)[number];

export interface OngletsFicheProps {
  /** Vue « Fiche commande détail » : avancement, notes, paiements, rappels. */
  suivi: ReactNode;
  /** Vue « Fiche commande » : modèle, instructions, mesures, tarification. */
  recapitulatif: ReactNode;
}

/**
 * Bascule entre les deux écrans Banani consacrés à une même commande.
 *
 * La maquette en livre deux (`new_screen11` pour le suivi, `new_screen4` pour
 * le récapitulatif) sans indiquer comment on passe de l'un à l'autre : des
 * onglets évitent d'inventer une seconde URL pour la même ressource.
 *
 * Les deux vues sont rendues côté serveur puis passées en `props` — ce composant
 * ne fait que choisir laquelle afficher.
 */
export default function OngletsFiche({ suivi, recapitulatif }: OngletsFicheProps) {
  const [actif, setActif] = useState<Onglet>('Suivi');

  return (
    <>
      <div className="border-border bg-background flex border-b px-4 lg:px-8">
        {ONGLETS.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setActif(o)}
            aria-current={actif === o ? 'true' : undefined}
            className={cn(
              'border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              actif === o
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent',
            )}
          >
            {o}
          </button>
        ))}
      </div>

      {actif === 'Suivi' ? suivi : recapitulatif}
    </>
  );
}
