'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { avecReessai401 } from '@/lib/api-repli';
import { useLangue } from '@/contexts/LangueContext';

/**
 * Cloche de notifications avec son compteur réel.
 *
 * Le nombre était une constante à 5 : la pastille rouge annonçait cinq
 * messages non lus à tous les ateliers, en permanence, y compris à un compte
 * qui n'en a jamais reçu un seul. Une pastille d'alerte qui ne bouge jamais
 * cesse d'être lue au bout de deux jours, et le jour où une vraie alerte
 * arrive, personne ne la voit.
 *
 * Composant client parce que le tableau de bord est rendu côté serveur, et
 * appuyé sur `/api/notifications/count` plutôt que sur la liste complète : une
 * pastille n'a besoin que d'un nombre.
 */
export default function ClocheNotifications() {
  const { t, tp } = useLangue();
  const [nonLues, setNonLues] = useState(0);

  useEffect(() => {
    let annule = false;
    void (async () => {
      try {
        const res = await avecReessai401<{ count: number }>('/api/notifications/count');
        if (!annule) setNonLues(res.count);
      } catch {
        // Hors session ou serveur muet : on n'affiche pas de pastille plutôt
        // que d'en inventer une. Rien n'est plus trompeur qu'un compteur qui
        // se rabat sur une valeur par défaut.
      }
    })();
    return () => {
      annule = true;
    };
  }, []);

  return (
    <Link href="/notifications" className="relative" title={t('Notifications')}>
      <span className="bg-background/10 text-background flex h-9 w-9 items-center justify-center rounded-full">
        <Bell size={18} aria-hidden />
      </span>
      {nonLues > 0 && (
        <span className="bg-danger text-background absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
          {nonLues > 9 ? '9+' : nonLues}
        </span>
      )}
      <span className="sr-only">
        {nonLues === 0
          ? t('Aucune notification non lue')
          : tp('{n} notification non lue', '{n} notifications non lues', nonLues)}
      </span>
    </Link>
  );
}
