import type { Metadata } from 'next';
import AppShell from '@/components/atelier/AppShell';
import LienAction from '@/components/atelier/LienAction';
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
        <LienAction
          href="/commandes"
          label="Annuler"
          className="text-muted-foreground hover:text-foreground px-3 py-2 text-sm"
        />
      }
      actionsMobile={
        <LienAction href="/commandes" label="Annuler" className="text-muted-foreground text-xs" />
      }
    >
      <FormulaireNouvelleCommande />
    </AppShell>
  );
}
