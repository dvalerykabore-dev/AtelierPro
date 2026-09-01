'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { BoutonAtelierPro, NomAtelierPro } from '@/components/marque/LogoAtelierPro';
import { useT } from '@/contexts/LangueContext';

export interface AuthCardProps {
  titre: string;
  sousTitre?: ReactNode;
  children: ReactNode;
  /** Lien secondaire en pied de carte (« Pas encore de compte ? »). */
  pied?: ReactNode;
}

/**
 * Coquille commune aux écrans d'authentification.
 *
 * Banani ne fournit aucun écran de connexion : cette mise en page est déduite du
 * reste du système de design — fond `background`, carte `surface` bordée, verrou
 * de marque en tête, filet doré emprunté à la colonne capacité du tableau de
 * bord, titres en Space Grotesk.
 *
 * La marque y est empilée plutôt qu'en ligne : c'est le seul écran où elle est
 * le sujet et non un repère de navigation, personne n'étant encore connecté.
 */
export default function AuthCard({ titre, sousTitre, children, pied }: AuthCardProps) {
  const t = useT();
  return (
    <main className="bg-background font-body flex min-h-screen flex-col items-center justify-center px-4 py-10">
      {/* Marque */}
      <div className="mb-7 flex flex-col items-center gap-3">
        <BoutonAtelierPro taille={48} className="text-primary" />
        <NomAtelierPro className="text-xl" />
      </div>

      <section className="bg-surface border-border w-full max-w-md rounded-xl border p-6 sm:p-8">
        <h1 className="font-headings text-foreground text-xl font-bold">{t(titre)}</h1>
        {sousTitre && (
          <p className="text-muted-foreground mt-1 text-sm">
            {typeof sousTitre === 'string' ? t(sousTitre) : sousTitre}
          </p>
        )}

        {/* Filet or — même signature visuelle que la colonne capacité */}
        <div className="bg-primary/40 my-5 h-px" />

        {children}
      </section>

      {pied && <div className="text-muted-foreground mt-5 text-sm">{pied}</div>}

      <p className="text-muted-foreground mt-8 text-xs">
        <Link href="/dashboard" className="hover:text-foreground">
          {t('Retour à l’atelier')}
        </Link>
      </p>
    </main>
  );
}
