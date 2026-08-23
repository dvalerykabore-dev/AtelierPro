import type { Metadata } from 'next';
import { Save } from 'lucide-react';
import AppShell from '@/components/atelier/AppShell';
import Parametres from '@/components/atelier/Parametres';
import { atelier } from '@/lib/mock/atelier';

export const metadata: Metadata = {
  title: 'Paramètres — AtelierPro',
};

export default function ParametresPage() {
  return (
    <AppShell
      titre="Paramètres"
      sousTitre={atelier.nom}
      actions={
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-accent flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          <Save size={14} aria-hidden />
          Enregistrer les modifications
        </button>
      }
      actionsMobile={
        <button
          type="button"
          className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium"
        >
          <Save size={12} aria-hidden />
          Enregistrer
        </button>
      }
    >
      <Parametres />
    </AppShell>
  );
}
