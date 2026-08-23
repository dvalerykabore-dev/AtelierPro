import Link from 'next/link';
import type { ReactNode } from 'react';
import { ATELIER_NOM } from '@/lib/mock/atelier';

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
 * reste du système de design — fond `background`, carte `surface` bordée, logo
 * or repris du rail latéral, filet doré emprunté à la colonne capacité du
 * tableau de bord, titres en Space Grotesk.
 */
export default function AuthCard({ titre, sousTitre, children, pied }: AuthCardProps) {
  return (
    <main className="bg-background font-body flex min-h-screen flex-col items-center justify-center px-4 py-10">
      {/* Marque */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <span className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
          <span className="text-primary-foreground font-headings text-2xl font-bold">A</span>
        </span>
        <span className="text-muted-foreground text-xs tracking-widest uppercase">
          {ATELIER_NOM}
        </span>
      </div>

      <section className="bg-surface border-border w-full max-w-md rounded-xl border p-6 sm:p-8">
        <h1 className="font-headings text-foreground text-xl font-bold">{titre}</h1>
        {sousTitre && <p className="text-muted-foreground mt-1 text-sm">{sousTitre}</p>}

        {/* Filet or — même signature visuelle que la colonne capacité */}
        <div className="bg-primary/40 my-5 h-px" />

        {children}
      </section>

      {pied && <div className="text-muted-foreground mt-5 text-sm">{pied}</div>}

      <p className="text-muted-foreground mt-8 text-xs">
        <Link href="/dashboard" className="hover:text-foreground">
          Retour à l’atelier
        </Link>
      </p>
    </main>
  );
}
