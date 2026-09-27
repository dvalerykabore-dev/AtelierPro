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
  /**
   * Image à la place des initiales — le logo de l'atelier.
   *
   * Les initiales restent rendues en dessous : si l'URL ne répond pas, le
   * navigateur laisse un cadre vide, alors qu'un atelier reconnaît toujours
   * ses propres initiales.
   */
  image?: string | null | undefined;
  /** Texte alternatif de l'image — obligatoire dès que `image` est fourni. */
  imageAlt?: string;
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
  image,
  imageAlt = '',
  className,
}: AvatarProps) {
  return (
    <span
      className={cn(
        'bg-secondary relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full border font-bold',
        accentue ? 'border-primary text-primary' : 'border-border text-primary',
        TAILLES[taille],
        className,
      )}
    >
      {initiales}
      {image && (
        // Image de fond plutôt que `<img>` : si l'URL ne répond pas, rien ne
        // se peint et les initiales rendues dessous réapparaissent d'elles-
        // mêmes — sans gestionnaire d'erreur, donc sans rendre ce composant
        // client alors qu'il est utilisé depuis des pages serveur.
        <span
          role={imageAlt ? 'img' : undefined}
          aria-label={imageAlt || undefined}
          aria-hidden={imageAlt ? undefined : true}
          style={{ backgroundImage: `url("${encodeURI(image)}")` }}
          className="absolute inset-0 bg-cover bg-center"
        />
      )}
    </span>
  );
}
