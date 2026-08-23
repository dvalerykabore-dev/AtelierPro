'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  ouvert: boolean;
  onFermer: () => void;
  titre: string;
  description?: string;
  children: ReactNode;
  /** Boutons alignés à droite en pied de fenêtre. */
  pied?: ReactNode;
  taille?: 'md' | 'lg';
}

/**
 * Fenêtre modale au thème de l'atelier.
 *
 * Banani ne dessine aucune modale : la mise en page est déduite du reste du
 * système — carte `surface` bordée, filet or, titres en Space Grotesk.
 *
 * Accessibilité : fermeture à la touche Échap et au clic sur le fond, focus
 * déplacé dans la fenêtre à l'ouverture, défilement de la page bloqué pendant
 * l'affichage.
 */
export default function Modal({
  ouvert,
  onFermer,
  titre,
  description,
  children,
  pied,
  taille = 'md',
}: ModalProps) {
  const carte = useRef<HTMLDivElement>(null);

  // `onFermer` est presque toujours une fonction fléchée écrite sur place par
  // l'appelant : son identité change à CHAQUE rendu du parent. La garder dans
  // les dépendances de l'effet ci-dessous rejouait celui-ci à chaque frappe —
  // et `carte.focus()` arrachait alors le curseur du champ en cours de saisie.
  // La référence donne à l'effet une dépendance stable.
  const fermerRef = useRef(onFermer);
  useEffect(() => {
    fermerRef.current = onFermer;
  });

  useEffect(() => {
    if (!ouvert) return;

    const surEchap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fermerRef.current();
    };
    document.addEventListener('keydown', surEchap);

    const debordementInitial = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Déplace le focus dans la fenêtre : sans cela, la navigation au clavier
    // resterait derrière le fond assombri. Ne s'exécute plus qu'à l'ouverture.
    carte.current?.focus();

    return () => {
      document.removeEventListener('keydown', surEchap);
      document.body.style.overflow = debordementInitial;
    };
  }, [ouvert]);

  if (!ouvert) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={onFermer}
    >
      <div
        ref={carte}
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'bg-surface border-border max-h-[90vh] w-full overflow-y-auto rounded-t-xl border focus:outline-none sm:rounded-xl',
          taille === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-md',
        )}
      >
        <div className="border-border flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-headings text-foreground text-base font-bold">{titre}</h2>
            {description && <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer"
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="px-5 py-5">{children}</div>

        {pied && (
          <div className="border-border flex items-center justify-end gap-2 border-t px-5 py-4">
            {pied}
          </div>
        )}
      </div>
    </div>
  );
}
