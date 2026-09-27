'use client';

import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/contexts/LangueContext';
import { initialesAtelierDe, nomAtelierDe } from '@/lib/atelier-identite';

/**
 * Nom de l'atelier connecté, affiché en sous-titre des écrans métier.
 *
 * Composant plutôt que valeur : les pages sont des coquilles serveur et le nom
 * dépend de la session, qui ne se lit que dans le navigateur.
 */
export function NomAtelier() {
  const { user } = useAuth();
  return <>{nomAtelierDe(user)}</>;
}

/** Initiales de la pastille du rail de navigation. */
export function InitialesAtelier() {
  const { user } = useAuth();
  return <>{initialesAtelierDe(user)}</>;
}

/**
 * Pastille de l'atelier : son logo s'il en a posé un, ses initiales sinon.
 *
 * Le logo se règle dans Paramètres › Atelier, mais c'est ici qu'il sert — le
 * rail, l'en-tête du tableau de bord, la signature d'une note. Le poser sans
 * qu'il n'apparaisse nulle part n'aurait été qu'une vignette de plus dans un
 * écran de réglages.
 */
export function PastilleAtelier({
  taille = 'md',
  accentue = false,
  className,
}: {
  taille?: 'sm' | 'md' | 'lg';
  accentue?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const t = useT();
  return (
    <Avatar
      initiales={initialesAtelierDe(user)}
      image={user?.workshopLogoUrl ?? null}
      imageAlt={
        user?.workshopLogoUrl ? t('Logo de {atelier}', { atelier: nomAtelierDe(user) }) : ''
      }
      taille={taille}
      accentue={accentue}
      {...(className === undefined ? {} : { className })}
    />
  );
}
