'use client';

import { useAuth } from '@/contexts/AuthContext';
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
