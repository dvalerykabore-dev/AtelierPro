import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import AppShell from '@/components/atelier/AppShell';
import Rapports from '@/components/atelier/Rapports';
import { ATELIER_NOM } from '@/lib/mock/atelier';

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
      sousTitre={ATELIER_NOM}
      actions={
        <button
          type="button"
          className="border-border text-foreground hover:bg-muted flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
        >
          <Download size={14} aria-hidden />
          Exporter PDF
        </button>
      }
    >
      <Rapports />
    </AppShell>
  );
}
