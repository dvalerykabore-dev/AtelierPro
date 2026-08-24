import type { Metadata } from 'next';
import AppShell from '@/components/atelier/AppShell';
import Depenses from '@/components/atelier/Depenses';
import { NomAtelier } from '@/components/atelier/IdentiteAtelier';

export const metadata: Metadata = {
  title: 'Dépenses — AtelierPro',
};

/**
 * Coquille serveur — la saisie et le journal vivent dans le composant client,
 * qui lit `/api/tresorerie/mouvements`. `AppShell` porte déjà `AuthGuard`.
 */
export default function DepensesPage() {
  return (
    <AppShell titre="Dépenses" sousTitre={<NomAtelier />}>
      <Depenses />
    </AppShell>
  );
}
