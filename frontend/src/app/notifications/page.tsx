import type { Metadata } from 'next';
import AppShell from '@/components/atelier/AppShell';
import ListeNotifications from '@/components/atelier/ListeNotifications';

export const metadata: Metadata = {
  title: 'Notifications — AtelierPro',
};

/**
 * Coquille serveur.
 *
 * Le sous-titre annonçait « N non lues sur M », calculé sur le jeu simulé : il
 * affirmait dix notifications à un compte qui n'en avait aucune. Le compte réel
 * vit maintenant dans les onglets de filtre, à côté de ce qu'il décrit.
 */
export default function NotificationsPage() {
  return (
    <AppShell titre="Notifications">
      <ListeNotifications />
    </AppShell>
  );
}
