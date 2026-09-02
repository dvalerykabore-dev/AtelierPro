'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { ANCRES, WHATSAPP } from '@/lib/landing-contenu';
import { useT } from '@/contexts/LangueContext';

/** `+226 70 00 00 00` → `22670000000`, format attendu par wa.me. */
function pourWaMe(numero: string): string {
  return numero.replace(/[^\d]/g, '');
}

/**
 * Dernier appel à l'action, et point de contact.
 *
 * Les maquettes affichaient « WhatsApp nous » (desktop : « +226 XXXXXXXXX »).
 * Un numéro fictif sur une page publique promet un canal qui ne répondra
 * jamais : tant que `NEXT_PUBLIC_ATELIER_WHATSAPP` est vide, la ligne n'est pas
 * rendue du tout.
 */
export default function SectionAppelFinal() {
  const t = useT();
  const numero = pourWaMe(WHATSAPP);

  return (
    <section
      id={ANCRES.contact}
      className="bg-foreground text-background scroll-mt-20 px-4 py-8 text-center sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="font-headings mb-3 text-2xl font-bold sm:text-3xl lg:mb-4 lg:text-4xl">
          {t('Prêt à mettre votre atelier au clair ?')}
        </h2>
        <p className="text-background/70 mb-4 text-xs sm:text-base lg:mb-8 lg:text-lg">
          {t(
            'Trente jours gratuits, sans moyen de paiement. La première commande se saisit en deux minutes.',
          )}
        </p>

        {/* Pleine largeur sur téléphone (maquette mobile), bouton centré ensuite. */}
        <Link
          href="/inscription"
          className="bg-primary text-primary-foreground hover:bg-accent flex min-h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors sm:mx-auto sm:min-h-12 sm:w-auto sm:px-8 sm:text-base"
        >
          {t('Créer mon atelier')}
        </Link>

        {numero && (
          <p className="text-background/60 mt-3 text-xs sm:mt-6 sm:text-sm">
            <a
              href={`https://wa.me/${numero}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold underline"
            >
              <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
              {t('Une question ? Écrivez-nous sur WhatsApp')}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
