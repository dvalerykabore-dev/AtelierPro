'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PiedDePage from '@/components/landing/PiedDePage';
import { useT } from '@/contexts/LangueContext';

/**
 * Cadre commun des deux pages légales.
 *
 * Elles existent pour une seule raison : le pied de page les référence, et un
 * lien mort y serait le premier accroc de crédibilité d'un produit qui demande
 * un abonnement. Leur contenu dit franchement que le document reste à rédiger,
 * plutôt que d'inventer un texte juridique.
 *
 * Tailwind ne fournit pas `prose` sans le plugin typography : les marges de
 * lecture sont posées ici, une fois, au lieu d'être répétées dans chaque page.
 */
export default function PageLegale({ titre, children }: { titre: string; children: ReactNode }) {
  const t = useT();
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={15} aria-hidden />
          {t('Retour à l’accueil')}
        </Link>

        <h1 className="font-headings mb-8 text-2xl font-bold sm:text-3xl">{titre}</h1>

        <div className="text-muted-foreground flex flex-col gap-4 text-sm leading-relaxed [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
          {children}
        </div>
      </main>
      <PiedDePage />
    </>
  );
}
