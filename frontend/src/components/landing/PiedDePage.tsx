import Link from 'next/link';
import { LogoAtelierPro } from '@/components/marque/LogoAtelierPro';
import { ANCRES } from '@/lib/landing-contenu';

const LIENS = [
  { href: '/legal/confidentialite', label: 'Confidentialité', interne: true },
  { href: '/legal/conditions', label: 'Conditions d’utilisation', interne: true },
  { href: `#${ANCRES.contact}`, label: 'Contact', interne: false },
];

/**
 * Pied de page.
 *
 * Centré avec des points de séparation sur téléphone (maquette mobile), réparti
 * sur une ligne à partir de `sm` (maquette desktop).
 *
 * Les deux liens légaux mènent à des pages réelles : un lien mort en pied de
 * page d'un produit payant est le premier signe qu'un visiteur méfiant va
 * chercher. Ces pages disent en toutes lettres que le document n'est pas
 * encore rédigé plutôt que d'afficher un texte juridique inventé.
 *
 * Le verrou de marque ferme la page. La ligne de copyright ne répète donc plus
 * « AtelierPro » : le logo le dit deux centimètres au-dessus, et un nom écrit
 * deux fois dans le même bloc se lit comme une coquille.
 */
export default function PiedDePage() {
  const annee = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface border-t px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-4 text-xs sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:text-sm">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <LogoAtelierPro taille={26} />
          <p>Fait pour l’Afrique de l’Ouest. © {annee}</p>
        </div>
        <nav aria-label="Liens de bas de page">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-6">
            {LIENS.map((l, i) => (
              <li key={l.href} className="flex items-center gap-x-3 sm:gap-x-6">
                {/* Le point de séparation de la maquette mobile disparaît dès
                    que les liens s'espacent, à partir de `sm`. */}
                {i > 0 && (
                  <span aria-hidden className="sm:hidden">
                    ·
                  </span>
                )}
                {l.interne ? (
                  <Link
                    href={l.href}
                    className="hover:text-foreground flex min-h-11 items-center transition-colors sm:min-h-0"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    className="hover:text-foreground flex min-h-11 items-center transition-colors sm:min-h-0"
                  >
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
