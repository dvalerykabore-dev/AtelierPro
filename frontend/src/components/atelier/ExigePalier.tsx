'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  aAcces,
  definitionDe,
  palierRequis,
  prixDe,
  formaterFcfa,
  type Capacite,
} from '@/lib/plans';
import { useLangue } from '@/contexts/LangueContext';

/**
 * Porte d'écran : le contenu, ou une invitation à monter de palier.
 *
 * Sans elle, un atelier au gratuit qui ouvrait la Trésorerie voyait un bandeau
 * rouge avec une icône d'alerte. Le message était juste, mais il présentait une
 * fonction à vendre comme une panne — et il ne menait nulle part. Le 402 du
 * serveur portait pourtant déjà `requiredPlan` ; personne ne le lisait.
 *
 * Elle ne protège rien, et ce n'est pas son rôle : les gardes de route sont la
 * seule autorité. Elle évite un aller-retour réseau voué au refus, et remplace
 * une erreur par une porte.
 */
export default function ExigePalier({
  capacite,
  children,
}: {
  capacite: Capacite;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const { t } = useLangue();

  // Tant que la session charge, on ne montre rien plutôt qu'une invitation qui
  // disparaîtrait aussitôt — un clignotement dirait à un abonné qu'il ne l'est
  // pas.
  if (!user) return null;
  if (aAcces(user.plan, capacite)) return <>{children}</>;

  const requis = definitionDe(palierRequis(capacite));
  const aPartirDe = formaterFcfa(prixDe(requis.cle, 'mois'));

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-12 text-center lg:px-6 lg:py-20">
      <span className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full">
        <Lock size={20} aria-hidden />
      </span>

      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-headings text-foreground text-lg font-bold sm:text-xl">
          {t('Inclus à partir du palier {palier}', { palier: t(requis.nom) })}
        </h2>
        <p className="text-muted-foreground text-sm">{t(requis.these)}</p>
      </div>

      <Link
        href={`/#tarifs`}
        className="bg-primary text-primary-foreground hover:bg-accent flex min-h-11 items-center justify-center rounded-lg px-6 text-sm font-bold transition-colors"
      >
        {t('Voir les paliers')}
      </Link>

      <p className="text-muted-foreground text-xs">
        {t('À partir de {prix} par mois', { prix: aPartirDe })}
      </p>
    </div>
  );
}
