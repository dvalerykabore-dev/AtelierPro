'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BasculeTheme from '@/components/ui/BasculeTheme';
import SelecteurLangue from '@/components/ui/SelecteurLangue';
import { Menu, X } from 'lucide-react';
import { BoutonAtelierPro, NomAtelierPro } from '@/components/marque/LogoAtelierPro';
import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/contexts/LangueContext';
import { ANCRES, TEMOIGNAGES } from '@/lib/landing-contenu';

/**
 * Liens d'ancre de la barre.
 *
 * « Témoignages » n'apparaît que si la section existe : `SectionTemoignages` se
 * retire quand aucun témoignage n'est publié, et un lien de navigation qui ne
 * mène nulle part est pire que pas de lien du tout.
 */
const LIENS = [
  { href: `#${ANCRES.fonctionnalites}`, label: 'Fonctionnalités' },
  { href: `#${ANCRES.tarifs}`, label: 'Tarifs' },
  ...(TEMOIGNAGES.length > 0 ? [{ href: `#${ANCRES.temoignages}`, label: 'Témoignages' }] : []),
  { href: `#${ANCRES.faq}`, label: 'Questions' },
];

/**
 * Barre de navigation de la page d'accueil.
 *
 * Composant client pour trois raisons, toutes fonctionnelles : le tiroir a un
 * état, la touche Échap le referme, et les boutons de droite dépendent de la
 * session. Ce dernier point est le seul lien entre cette page et le backend —
 * un atelier déjà connecté n'a que faire d'un bouton « Essai gratuit » ni d'un
 * lien « Se connecter » : la barre ne lui montre plus que la navigation.
 *
 * ⚠️ Écart avec la maquette mobile, délibéré : elle ne montre que le logo et le
 * bouton d'essai, sans aucun lien de navigation. Les quatre ancres — dont les
 * tarifs et la FAQ — deviendraient alors inatteignables au doigt, alors que la
 * page fait plus de 7 000 px de haut sur un téléphone. Le hamburger est donc
 * conservé À CÔTÉ du bouton de la maquette, plutôt qu'à sa place.
 */
export default function BarreNavigation() {
  const { user, loading } = useAuth();
  const t = useT();
  const [ouvert, setOuvert] = useState(false);

  // Échap referme le tiroir : sur mobile il couvre l'écran, il faut une sortie
  // au clavier pour les navigateurs de bureau réduits à cette largeur.
  useEffect(() => {
    if (!ouvert) return;
    function surTouche(e: KeyboardEvent) {
      if (e.key === 'Escape') setOuvert(false);
    }
    document.addEventListener('keydown', surTouche);
    // Le fond ne doit pas défiler derrière le tiroir.
    const overflowInitial = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', surTouche);
      document.body.style.overflow = overflowInitial;
    };
  }, [ouvert]);

  // `loading` reste vrai le temps de `/api/auth/me`. On affiche l'état
  // déconnecté par défaut plutôt qu'un bouton vide : c'est le cas de très loin
  // le plus fréquent sur une page publique, et AuthContext saute même l'appel
  // quand aucun cookie CSRF n'est présent.
  const connecte = !loading && user !== null;

  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label={t('Navigation principale')}
      >
        {/* `min-h-11` (44px) : le logo est aussi un lien tapé au doigt, il doit
            offrir la même surface que les autres. */}
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 lg:gap-2.5"
          aria-label={t('AtelierPro, accueil')}
        >
          <BoutonAtelierPro taille={28} className="text-primary h-7 w-7 lg:h-8 lg:w-8" />
          <NomAtelierPro className="text-base lg:text-lg" />
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden items-center gap-6 md:flex">
            {LIENS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t(l.label)}
              </a>
            ))}
            {connecte ? null : (
              <Link
                href="/connexion"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('Se connecter')}
              </Link>
            )}
          </div>

          {/* Langue et thème — les visiteurs non connectés y ont droit aussi,
              c'est leur seul point d'accès à ces réglages. Le sélecteur de
              langue précède la bascule : quelqu'un qui ne lit pas le français
              cherche d'abord à changer de langue. */}
          <SelecteurLangue className="hidden sm:flex" />
          <BasculeTheme />

          {/* Bouton d'essai — présent dans les deux maquettes. La hauteur
              minimale de 44px prime sur le `py-1.5` de la maquette mobile, qui
              donnerait une cible de 27px : trop petite pour l'action principale
              d'une page consultée au doigt.

              Il s'efface pour un atelier déjà connecté : lui proposer un essai
              gratuit n'aurait pas de sens, et la page publique n'a pas vocation
              à servir de porte d'entrée vers l'application. */}
          {connecte ? null : (
            <Link
              href="/inscription"
              className="bg-primary text-primary-foreground hover:bg-accent flex min-h-11 items-center rounded-md px-3 text-xs font-medium transition-colors md:px-4 md:text-sm"
            >
              {t('Essai gratuit')}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOuvert((o) => !o)}
            className="text-foreground -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label={t(ouvert ? 'Fermer le menu' : 'Ouvrir le menu')}
          >
            {ouvert ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Tiroir mobile — rendu conditionnel plutôt que masqué en CSS : masqué,
          ses liens resteraient dans l'ordre de tabulation. */}
      {ouvert && (
        <div id="menu-mobile" className="border-border bg-background border-t px-4 pb-2 md:hidden">
          {/* Le sélecteur est masqué dans la barre sous 640px : sans cette
              copie, la langue deviendrait inatteignable sur un téléphone. */}
          <div className="border-border flex min-h-12 items-center border-b sm:hidden">
            <SelecteurLangue />
          </div>
          <ul className="flex flex-col">
            {LIENS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOuvert(false)}
                  className="text-foreground border-border flex min-h-12 items-center border-b text-sm"
                >
                  {t(l.label)}
                </a>
              </li>
            ))}
            {connecte ? null : (
              <li>
                <Link
                  href="/connexion"
                  onClick={() => setOuvert(false)}
                  className="text-foreground flex min-h-12 items-center text-sm"
                >
                  {t('Se connecter')}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
