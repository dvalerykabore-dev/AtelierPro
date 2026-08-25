import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AppShell from '@/components/atelier/AppShell';
import ListeCommandes from '@/components/atelier/ListeCommandes';

export const metadata: Metadata = {
  title: 'Commandes — AtelierPro',
};

export default function CommandesPage() {
  return (
    <AppShell
      titre="Commandes"
      sousTitre="Suivi de confection"
      /*
       * Un champ « Rechercher… » et un sélecteur « Livraison » figuraient ici,
       * en <span> stylés comme des contrôles : bordure, fond et rembourrage
       * d'un champ de saisie, mais inertes. La vraie recherche vit dans
       * ListeCommandes, juste en dessous — l'utilisateur cliquait donc
       * d'abord sur le leurre et concluait qu'elle était cassée.
       *
       * Retirés plutôt que réimplémentés : dupliquer la recherche en tête
       * poserait la question de laquelle fait autorité.
       */
      actions={
        <>
          <Link
            href="/commandes/nouvelle"
            className="bg-primary text-primary-foreground hover:bg-accent flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus size={14} aria-hidden />
            Nouvelle commande
          </Link>
        </>
      }
      actionsMobile={
        <Link
          href="/commandes/nouvelle"
          className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium"
        >
          <Plus size={12} aria-hidden />
          Nouvelle
        </Link>
      }
    >
      <ListeCommandes />
    </AppShell>
  );
}
