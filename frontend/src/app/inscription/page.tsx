import { Suspense } from 'react';
import FormulaireInscription from '@/components/auth/FormulaireInscription';
import TexteChargement from '@/components/ui/TexteChargement';

/**
 * Le formulaire lit `?plan=` — le plan choisi sur la page d'accueil — via
 * `useSearchParams`, qui impose une frontière `<Suspense>` : sans elle, Next
 * refuse de pré-rendre la page et bascule l'écran entier côté client.
 *
 * D'où ce composant serveur enveloppant, plutôt que le `'use client'` en tête
 * de page qui était là avant.
 */
export default function InscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <TexteChargement />
        </div>
      }
    >
      <FormulaireInscription />
    </Suspense>
  );
}
