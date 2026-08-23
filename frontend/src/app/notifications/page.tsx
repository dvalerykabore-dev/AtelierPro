import type { Metadata } from 'next';
import AppShell from '@/components/atelier/AppShell';
import ListeNotifications from '@/components/atelier/ListeNotifications';
import { notifications } from '@/lib/mock/atelier';

export const metadata: Metadata = {
  title: 'Notifications — AtelierPro',
};

export default function NotificationsPage() {
  const nonLues = notifications.filter((n) => !n.lue).length;

  return (
    <AppShell
      titre="Notifications"
      sousTitre={`${nonLues} non lue${nonLues > 1 ? 's' : ''} sur ${notifications.length}`}
    >
      <ListeNotifications />
    </AppShell>
  );
}
