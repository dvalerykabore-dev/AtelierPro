'use client';

import { BoutonAtelierPro, NomAtelierPro } from '@/components/marque/LogoAtelierPro';
import { useT } from '@/contexts/LangueContext';

/**
 * Carte de couverture du premier écran.
 *
 * Elle remplace le panneau d'attente qui alignait trois icônes d'appareils
 * faute de capture. Deux moitiés : le verrou de marque en haut, un pagne en
 * bas, séparés par un galon.
 *
 * Le pagne n'est pas un ornement pris sur étagère. C'est le bouton de la
 * marque répété en rosaces sur un tissage en losanges — le motif qu'un atelier
 * d'Afrique de l'Ouest coupe tous les jours, dessiné avec la seule forme que
 * le produit possède déjà. C'est ce qui rend cette page reconnaissable sans
 * qu'on ait à lire le nom, et ça ne coûte qu'un `<pattern>` SVG : rien à
 * télécharger, net à toutes les tailles.
 *
 * La carte reste bleu nuit et or dans les DEUX thèmes, via les variables
 * `--color-marque-*` que le bloc clair de globals.css ne redéfinit pas. C'est
 * délibéré : sur la page en thème clair, elle devient le seul aplat sombre et
 * porte à elle seule l'identité, comme un logo imprimé sur du papier blanc.
 * Corollaire, aucune classe de thème (`text-foreground`, `bg-surface`) ne doit
 * entrer ici — elle basculerait et laisserait du crème sur du blanc.
 */

/**
 * Côté de la tuile du pagne, dans le repère du SVG (1080 de large).
 *
 * 1080 / 224 donne un peu moins de cinq rosaces en largeur, quelle que soit la
 * taille réelle de la carte : le motif garde ses proportions du téléphone au
 * grand écran au lieu de devenir une mosaïque de confettis sur l'un et deux
 * gros ronds sur l'autre.
 */
const TUILE = 224;

/** Centre de la rosace dans sa tuile. */
const C = TUILE / 2;

/** Hauteur du galon : filet or plein, puis les dents. */
const OR = 7;
const DENTS = 17;
const HAUT_PAGNE = OR + DENTS;

/**
 * Hauteur totale du bandeau, dans le même repère de 1080 de large.
 *
 * Deux rangées de rosaces entières, puis la troisième coupée net par le bord :
 * un pagne est un coupon, il ne s'arrête pas sur une rangée complète. La
 * valeur vient du visuel de référence — galon à 24, champ jusqu'à 502.
 */
const HAUTEUR = 502;

/** Les quatre coins de la tuile — le petit bouton s'y pose et se raccorde seul. */
const COINS = [
  [0, 0],
  [TUILE, 0],
  [0, TUILE],
  [TUILE, TUILE],
] as const;

/** Les deux familles de diagonales du tissage, en ordonnées à l'origine. */
const MONTANTES = [-TUILE, -C, 0, C, TUILE];
const DESCENDANTES = [0, C, TUILE, TUILE + C, 2 * TUILE];

export default function VisuelHero() {
  const t = useT();
  return (
    <div className="border-marque-filet overflow-hidden rounded-2xl border">
      {/* Le verrou de marque */}
      <div
        className="flex flex-col items-center px-5 pt-4 pb-5 sm:px-8 sm:pt-6 sm:pb-7"
        style={{
          backgroundImage:
            'radial-gradient(95% 75% at 50% 26%, #1a2c49 0%, var(--color-marque-carte) 48%, var(--color-marque-nuit) 100%)',
        }}
      >
        <BoutonAtelierPro taille={152} className="text-marque-or h-28 w-28 sm:h-38 sm:w-38" />
        <NomAtelierPro
          classeAtelier="text-marque-creme"
          classePro="text-marque-or"
          className="mt-5 text-2xl sm:mt-6 sm:text-[2rem]"
        />
        <p
          className="text-marque-brume mt-3 font-mono text-xs uppercase sm:mt-4"
          style={{ letterSpacing: '0.26em' }}
        >
          {t('Du fil à la livraison')}
        </p>
      </div>

      {/* Le galon et le pagne. Tout est décoratif : la carte ne dit rien que le
          texte à gauche du hero ne dise déjà, et un lecteur d'écran n'a que
          faire d'un tissage. */}
      <svg
        viewBox={`0 0 1080 ${HAUTEUR}`}
        className="block w-full"
        aria-hidden
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Les dents du galon — un ruban de couturière. */}
          <pattern id="ap-galon" width="40" height={DENTS} patternUnits="userSpaceOnUse">
            <rect width="20" height={DENTS} fill="var(--color-marque-creme)" />
          </pattern>

          <pattern
            id="ap-pagne"
            x="0"
            y="0"
            width={TUILE}
            height={TUILE}
            patternUnits="userSpaceOnUse"
          >
            {/* Le tissage. Les diagonales sont posées de bord à bord et espacées
                d'une demi-tuile : le pavage les raboute sans couture visible. */}
            <g
              stroke="var(--color-marque-brume)"
              strokeOpacity="0.42"
              strokeWidth="1.6"
              fill="none"
            >
              {MONTANTES.map((c) => (
                <line key={`m${c}`} x1="0" y1={c} x2={TUILE} y2={c + TUILE} />
              ))}
              {DESCENDANTES.map((c) => (
                <line key={`d${c}`} x1="0" y1={c} x2={TUILE} y2={c - TUILE} />
              ))}
            </g>

            {/* La rosace. Le disque de fond masque le tissage sous les anneaux :
                sans lui, les diagonales traversent les creux et le motif se
                brouille au lieu de se détacher. */}
            <circle cx={C} cy={C} r="73" fill="var(--color-marque-nuit)" />
            <circle
              cx={C}
              cy={C}
              r="68"
              fill="none"
              stroke="var(--color-marque-creme)"
              strokeWidth="10"
            />
            <circle
              cx={C}
              cy={C}
              r="54"
              fill="none"
              stroke="var(--color-marque-or)"
              strokeWidth="9"
            />
            <circle
              cx={C}
              cy={C}
              r="40"
              fill="none"
              stroke="var(--color-marque-creme)"
              strokeWidth="8"
            />
            <circle cx={C} cy={C} r="26" fill="var(--color-marque-or)" />

            {/* Le petit bouton, en quinconce dans les intervalles. */}
            {COINS.map(([x, y]) => (
              <g key={`${x}:${y}`}>
                <circle cx={x} cy={y} r="23" fill="var(--color-marque-nuit)" />
                <circle
                  cx={x}
                  cy={y}
                  r="20.5"
                  fill="none"
                  stroke="var(--color-marque-or)"
                  strokeWidth="2.5"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="15"
                  fill="none"
                  stroke="var(--color-marque-creme)"
                  strokeWidth="6"
                />
                <circle cx={x} cy={y} r="8" fill="var(--color-marque-or)" />
              </g>
            ))}
          </pattern>
        </defs>

        <rect
          y={HAUT_PAGNE}
          width="1080"
          height={HAUTEUR - HAUT_PAGNE}
          fill="var(--color-marque-nuit)"
        />
        <rect y={HAUT_PAGNE} width="1080" height={HAUTEUR - HAUT_PAGNE} fill="url(#ap-pagne)" />

        <rect width="1080" height={OR} fill="var(--color-marque-or)" />
        <rect y={OR} width="1080" height={DENTS} fill="var(--color-marque-nuit)" />
        <rect y={OR} width="1080" height={DENTS} fill="url(#ap-galon)" />
      </svg>
    </div>
  );
}
