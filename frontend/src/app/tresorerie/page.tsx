import type { Metadata } from 'next';
import AppShell from '@/components/atelier/AppShell';
import Tresorerie from '@/components/atelier/Tresorerie';
import { NomAtelier } from '@/components/atelier/IdentiteAtelier';

export const metadata: Metadata = {
  title: 'Trésorerie — AtelierPro',
};

/**
 * Coquille serveur — le recoupement se calcule dans `/api/tresorerie` et
 * s'affiche côté navigateur. `AppShell` porte déjà `AuthGuard`.
 */
export default function TresoreriePage() {
  return (
    <AppShell titre="Trésorerie" sousTitre={<NomAtelier />}>
      <Tresorerie />
    </AppShell>
  );
}
