import type { Metadata } from 'next';
import AppShell from '@/components/atelier/AppShell';
import ExigePalier from '@/components/atelier/ExigePalier';
import Rapports from '@/components/atelier/Rapports';
import BoutonImprimer from '@/components/atelier/BoutonImprimer';
import { NomAtelier } from '@/components/atelier/IdentiteAtelier';

export const metadata: Metadata = {
  title: 'Rapports — AtelierPro',
};

/**
 * Coquille serveur — les indicateurs se calculent depuis `/api/rapports`,
 * côté navigateur, dans le composant client.
 */
export default function RapportsPage() {
  return (
    <AppShell
      titre="Rapports"
      sousTitre={<NomAtelier />}
      // Le bouton était inerte : aucun gestionnaire, aucune destination. Il
      // passe par la boîte d'impression du navigateur, dont « Enregistrer au
      // format PDF » donne exactement ce que le libellé promet.
      actions={<BoutonImprimer />}
    >
      <ExigePalier capacite="rapports">
        <Rapports />
      </ExigePalier>
    </AppShell>
  );
}
