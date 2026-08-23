import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronsUpDown, Plus, Search } from 'lucide-react';
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
      actions={
        <>
          <span className="bg-input border-border flex w-56 items-center gap-2 rounded-md border px-3 py-2">
            <Search size={13} className="text-muted-foreground" aria-hidden />
            <span className="text-muted-foreground text-sm">Rechercher…</span>
          </span>
          <span className="bg-input border-border flex w-36 items-center justify-between rounded-md border px-3 py-2">
            <span className="text-foreground text-sm">Livraison</span>
            <ChevronsUpDown size={13} className="text-muted-foreground" aria-hidden />
          </span>
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
