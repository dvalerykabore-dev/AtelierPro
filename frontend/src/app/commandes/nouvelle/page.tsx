import type { Metadata } from 'next';
import Link from 'next/link';
import AppShell from '@/components/atelier/AppShell';
import FormulaireNouvelleCommande from '@/components/atelier/FormulaireNouvelleCommande';

export const metadata: Metadata = {
  title: 'Nouvelle commande — AtelierPro',
};

export default function NouvelleCommandePage() {
  return (
    <AppShell
      titre="Nouvelle commande"
      sousTitre="Modèle, artisan, tarif et échéance"
      actions={
        <Link
          href="/commandes"
          className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm"
        >
          Annuler
        </Link>
      }
      actionsMobile={
        <Link href="/commandes" className="text-muted-foreground text-xs">
          Annuler
        </Link>
      }
    >
      <FormulaireNouvelleCommande />
    </AppShell>
  );
}
