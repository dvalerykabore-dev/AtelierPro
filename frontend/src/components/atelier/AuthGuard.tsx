'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { TriangleAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Mode démonstration : laisse consulter l'atelier sans compte.
 *
 * Nécessaire en développement local — les e-mails de vérification partent par
 * la file d'attente, drainée par un cron Vercel qui ne tourne pas sur une
 * machine de dev : sans ce contournement, personne ne peut recevoir son code
 * et donc franchir l'inscription.
 *
 * Désactivé dès que la variable est absente ou différente de « 1 ». Quand il
 * est actif, un bandeau permanent l'annonce : impossible de le laisser traîner
 * en production sans le voir.
 */
const MODE_DEMO = process.env.NEXT_PUBLIC_ATELIER_DEMO === '1';

function BandeauDemo() {
  return (
    <div className="bg-warning text-primary-foreground flex items-center justify-center gap-2 px-4 py-1.5 text-center text-xs font-medium">
      <TriangleAlert size={13} aria-hidden />
      Mode démonstration — pages accessibles sans connexion. Retirez
      <code className="font-mono">NEXT_PUBLIC_ATELIER_DEMO</code> avant toute mise en ligne.
    </div>
  );
}

/**
 * Second rideau d'authentification des écrans de l'atelier.
 *
 * ⚠️ Ce composant s'exécute dans le navigateur : le HTML de la page a déjà été
 * transmis quand il redirige. Il ne protège donc pas les données, il évite
 * seulement d'afficher une interface inutilisable.
 *
 * La vraie protection est `frontend/middleware.ts`, qui bloque la requête
 * côté serveur avant tout rendu — activée en renseignant
 * `AUTH_PROTECTED_PREFIXES` dans l'environnement (voir frontend/.env).
 * Les deux se complètent : le middleware ferme la porte, celui-ci évite un
 * écran vide si la session expire pendant la navigation.
 */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // La redirection est écrite ici plutôt que déléguée au hook `useUser` : celui-ci
  // redirige inconditionnellement, donc il s'exécutait AUSSI en mode démonstration
  // et faisait fuir la page aussitôt affichée. Un hook ne pouvant pas être appelé
  // conditionnellement, c'est la condition qui doit vivre dans l'effet.
  useEffect(() => {
    if (MODE_DEMO) return;
    if (!loading && !user) router.replace('/connexion');
  }, [loading, user, router]);

  if (MODE_DEMO) {
    return (
      <>
        <BandeauDemo />
        {children}
      </>
    );
  }

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <span className="text-muted-foreground text-sm">Chargement de l’atelier…</span>
      </div>
    );
  }

  // La redirection est en vol : on n'affiche rien entre-temps plutôt que de
  // laisser entrevoir des données privées.
  if (!user) return null;

  return <>{children}</>;
}
