import type { Metadata } from 'next';
import AppShell from '@/components/atelier/AppShell';
import CarnetClients from '@/components/atelier/CarnetClients';

export const metadata: Metadata = {
  title: 'Clients — AtelierPro',
};

export default function ClientsPage() {
  // Pas de compteur dans le sous-titre : il serait rendu côté serveur, avant que
  // la liste ne soit chargée depuis /api/clients, et afficherait donc un chiffre
  // faux. Le décompte réel vit au-dessus de la liste, dans CarnetClients.
  return (
    <AppShell titre="Carnet clients" sousTitre="Fiches, mesures et tissus">
      <CarnetClients />
    </AppShell>
  );
}
