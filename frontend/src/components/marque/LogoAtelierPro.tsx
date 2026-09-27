import { cn } from '@/lib/utils';

/**
 * Marque du produit — à ne pas confondre avec le logo de l'atelier connecté,
 * qui appartient au compte et vit dans `lib/logo-atelier.ts`. Celle-ci est
 * AtelierPro lui-même : elle s'affiche là où aucune session n'existe encore
 * (accueil, connexion, pages légales) et en tête du rail de navigation.
 *
 * Le signe est un bouton de couture vu de face : un contour, une rainure, et
 * quatre trous. C'est l'objet que tout atelier a par centaines dans un bocal,
 * et il tient à 16 px là où une machine à coudre ou un mannequin deviennent
 * une tache.
 */

/** En dessous de ce diamètre, la rainure se referme sur le contour. */
const SEUIL_COMPACT = 40;

/** Au-dessus, le bouton est une enseigne : le contour peut redevenir un filet. */
const SEUIL_MONUMENTAL = 96;

export interface BoutonAtelierProProps {
  /** Diamètre en pixels. Le tracé est vectoriel, tout suit. */
  taille?: number;
  className?: string;
}

/**
 * Le signe seul, sans le nom.
 *
 * Tout est en `currentColor` : une seule classe de couleur sur l'élément
 * suffit, ce qui laisse le même composant servir en or sur le bleu nuit, en
 * bleu nuit sur l'or, ou en crème sur une photo.
 *
 * Sous 40 px la rainure intérieure disparaît et les trous grossissent. Sans ça
 * les deux cercles concentriques se touchent et le bouton se lit comme un
 * anneau épais — c'est l'arbitrage qu'un graveur fait entre un poinçon et une
 * enseigne.
 *
 * Le contour suit le même raisonnement en sens inverse. Une épaisseur unique
 * ne peut pas convenir aux deux bouts de l'échelle : le filet qui donne sa
 * finesse au bouton de 152 px tombe sous le pixel à 28 px et disparaît. Trois
 * paliers, donc, comme une fonte a ses tailles optiques.
 *
 * `taille` ne fixe que les attributs `width`/`height`. Une classe de taille
 * passée par `className` (`h-28 w-28 sm:h-38 sm:w-38`) les emporte, ce qui
 * permet un signe responsive sans que les paliers ne dépendent du point de
 * rupture.
 */
export function BoutonAtelierPro({ taille = 32, className }: BoutonAtelierProProps) {
  const compact = taille < SEUIL_COMPACT;
  const ecart = compact ? 5 : 4.1;
  const trou = compact ? 3.8 : 3.15;
  const contour = compact ? 1.8 : taille >= SEUIL_MONUMENTAL ? 0.7 : 1.2;

  return (
    <svg
      viewBox="0 0 48 48"
      width={taille}
      height={taille}
      fill="none"
      aria-hidden
      focusable="false"
      className={cn('shrink-0', className)}
    >
      <circle cx="24" cy="24" r="22.4" stroke="currentColor" strokeWidth={contour} />
      {!compact && (
        <circle
          cx="24"
          cy="24"
          r="19.1"
          stroke="currentColor"
          strokeWidth={contour * 0.7}
          opacity="0.35"
        />
      )}
      {[-1, 1].map((y) =>
        [-1, 1].map((x) => (
          <circle
            key={`${x}:${y}`}
            cx={24 + x * ecart}
            cy={24 + y * ecart}
            r={trou}
            fill="currentColor"
          />
        )),
      )}
    </svg>
  );
}

export interface NomAtelierProProps {
  /** Corps du nom en pixels. Omis, la taille vient de `className`. */
  taille?: number;
  /** Couleur de « Atelier ». Sur fond de marque figé, passer `text-marque-creme`. */
  classeAtelier?: string;
  /** Couleur de « Pro ». Sur fond de marque figé, passer `text-marque-or`. */
  classePro?: string;
  className?: string;
}

/**
 * Le nom seul.
 *
 * Il reste du texte, pas un tracé : il se sélectionne, se lit à la synthèse
 * vocale, et suit la police déjà chargée par la page — un logo vectorisé
 * imposerait un second téléchargement pour dessiner dix lettres.
 *
 * La coupure crème / or n'est pas décorative : c'est la seule chose qui
 * distingue la marque du nom commun « atelier pro », que les clients écrivent
 * en deux mots. Elle est donc définie ici une fois, et pas recopiée à chaque
 * endroit où le nom apparaît.
 */
export function NomAtelierPro({
  taille,
  classeAtelier = 'text-foreground',
  classePro = 'text-primary',
  className,
}: NomAtelierProProps) {
  return (
    <span
      className={cn('font-headings leading-none font-bold tracking-tight', className)}
      {...(taille === undefined ? {} : { style: { fontSize: taille } })}
    >
      <span className={classeAtelier}>Atelier</span>
      <span className={classePro}>Pro</span>
    </span>
  );
}

export interface LogoAtelierProProps {
  /** Diamètre du bouton. Le nom se met à l'échelle avec lui. */
  taille?: number;
  /** Ligne de rappel sous le nom — « Gestion d'atelier ». Absente par défaut. */
  baseline?: string;
  className?: string;
}

/** Le verrou horizontal : bouton + nom, aux couleurs du thème courant. */
export function LogoAtelierPro({ taille = 32, baseline, className }: LogoAtelierProProps) {
  return (
    <span className={cn('inline-flex items-center', className)} style={{ gap: taille * 0.34 }}>
      <BoutonAtelierPro taille={taille} className="text-primary" />
      <span className="flex flex-col justify-center" style={{ gap: taille * 0.11 }}>
        <NomAtelierPro taille={taille * 0.56} />
        {baseline && (
          <span
            className="text-muted-foreground font-mono leading-none uppercase"
            style={{ fontSize: Math.max(9, taille * 0.2), letterSpacing: '0.18em' }}
          >
            {baseline}
          </span>
        )}
      </span>
    </span>
  );
}
