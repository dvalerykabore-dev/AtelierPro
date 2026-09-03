'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { useLangue } from '@/contexts/LangueContext';
import { LANGUES, NOMS_LANGUES, SENS, type Langue } from '@/lib/langue';
import { cn } from '@/lib/utils';

/**
 * Sélecteur de langue des barres de navigation.
 *
 * Sa place la plus importante est la page d'accueil : c'est le premier écran
 * qu'un visiteur voit, et le seul endroit où quelqu'un qui ne lit pas le
 * français peut changer de langue sans traverser une inscription.
 *
 * ── Pourquoi ce n'est plus un `<select>` ───────────────────────────────────
 *
 * La version précédente en utilisait un, pour de bonnes raisons : clavier,
 * lecteurs d'écran et plein écran sur téléphone sans une ligne d'ARIA. Mais la
 * liste déroulante d'un `<select>` est dessinée par le système, pas par la
 * page : aucune règle CSS ne l'atteint. Sur une page en bleu nuit et or, elle
 * s'ouvrait en fenêtre grise du système, et le déclencheur — un mot sans
 * bordure ni chevron — n'annonçait même pas qu'il s'ouvrait.
 *
 * D'où cette liste maison, qui reprend à sa charge ce que le natif offrait :
 * motif `listbox` de l'ARIA APG (`aria-activedescendant`, le focus DOM restant
 * sur la liste), flèches, Origine/Fin, Échap, saisie au clavier des premières
 * lettres, fermeture au clic extérieur, retour du focus sur le déclencheur.
 *
 * ── Détails qui comptent ───────────────────────────────────────────────────
 *
 * · Chaque nom est écrit dans SA langue et porte `lang` + `dir` : « العربية »
 *   doit se lire de droite à gauche même quand l'interface autour est encore
 *   en français, et `[lang='ar']` lui applique Noto Sans Arabic — Space
 *   Grotesk ne dessine aucun caractère arabe.
 * · Le code ISO à droite sert d'ancre à qui ne reconnaît pas une écriture :
 *   « AR » se repère quand « العربية » n'est qu'une forme.
 * · Le panneau s'ancre sur `end-0`, propriété logique : il reste du bon côté
 *   quand la page est retournée.
 */
export default function SelecteurLangue({ className }: { className?: string }) {
  const { langue, definir, t } = useLangue();
  const [ouvert, setOuvert] = useState(false);
  // Ligne survolée au clavier. Distincte de la langue retenue : on parcourt la
  // liste sans rien changer tant qu'on n'a pas validé.
  const [active, setActive] = useState<Langue>(langue);
  // Panneau accroché par son bord de début plutôt que de fin — voir plus bas.
  const [versDebut, setVersDebut] = useState(false);

  const identifiant = useId();
  const conteneur = useRef<HTMLDivElement>(null);
  const declencheur = useRef<HTMLButtonElement>(null);
  const liste = useRef<HTMLUListElement>(null);
  const saisie = useRef({ texte: '', horodatage: 0 });

  const idOption = (l: Langue) => `${identifiant}-${l}`;

  function ouvrir() {
    setActive(langue);
    setOuvert(true);
  }

  /** Ferme et rend le focus au déclencheur — sinon il retombe sur le <body>. */
  function fermer() {
    setOuvert(false);
    setVersDebut(false);
    declencheur.current?.focus();
  }

  function choisir(l: Langue) {
    definir(l);
    fermer();
  }

  // Le focus part sur la liste elle-même : avec `aria-activedescendant`, c'est
  // elle qui reçoit les touches, et l'option courante est seulement désignée.
  useEffect(() => {
    if (ouvert) liste.current?.focus();
  }, [ouvert]);

  /**
   * Retourne le panneau du côté opposé quand il sort de l'écran.
   *
   * Le panneau s'accroche par défaut au bord de FIN du déclencheur, ce qui
   * convient dans la barre haute, où le sélecteur est proche du bord droit :
   * la liste se déploie vers l'intérieur de la page. Mais le même composant
   * vit aussi dans le tiroir mobile, où le déclencheur est collé au bord de
   * DÉBUT — la liste partait alors hors de l'écran, à moitié coupée.
   *
   * On mesure donc après le montage, et on bascule sur l'autre bord si ça
   * dépasse. `useLayoutEffect` et non `useEffect` : la correction doit être
   * appliquée avant que le navigateur ne peigne, sinon le panneau apparaît
   * une image au mauvais endroit.
   */
  useLayoutEffect(() => {
    if (!ouvert) return;
    const boite = liste.current?.getBoundingClientRect();
    if (!boite) return;
    const marge = 8;
    if (boite.left < marge || boite.right > window.innerWidth - marge) setVersDebut(true);
  }, [ouvert]);

  useEffect(() => {
    if (!ouvert) return;

    // `pointerdown` et non `click` : un clic sur le déclencheur alors que le
    // menu est ouvert déclencherait la fermeture ici PUIS la réouverture par
    // son propre `onClick`, et le menu paraîtrait ne pas se fermer.
    const surClicExterieur = (e: PointerEvent) => {
      if (!conteneur.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener('pointerdown', surClicExterieur);
    return () => document.removeEventListener('pointerdown', surClicExterieur);
  }, [ouvert]);

  /** Déplace la sélection de `pas` positions, sans sortir de la liste. */
  function deplacer(pas: number) {
    const i = LANGUES.indexOf(active);
    const suivant = Math.min(Math.max(i + pas, 0), LANGUES.length - 1);
    setActive(LANGUES[suivant] as Langue);
  }

  /**
   * Saisie des premières lettres — « es » amène à « Español ».
   *
   * Les frappes rapprochées se cumulent, une pause d'une seconde repart de
   * zéro : c'est le comportement d'un `<select>` natif, et le seul moyen
   * d'atteindre une langue sans la parcourir touche à touche.
   */
  function rechercher(lettre: string) {
    const maintenant = Date.now();
    const texte =
      maintenant - saisie.current.horodatage > 1000 ? lettre : saisie.current.texte + lettre;
    saisie.current = { texte, horodatage: maintenant };

    const trouve = LANGUES.find(
      (l) => NOMS_LANGUES[l].toLowerCase().startsWith(texte) || l.startsWith(texte),
    );
    if (trouve) setActive(trouve);
  }

  function surTouche(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        deplacer(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        deplacer(-1);
        break;
      case 'Home':
        e.preventDefault();
        setActive(LANGUES[0] as Langue);
        break;
      case 'End':
        e.preventDefault();
        setActive(LANGUES[LANGUES.length - 1] as Langue);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choisir(active);
        break;
      case 'Escape':
        e.preventDefault();
        fermer();
        break;
      case 'Tab':
        // Tabulation : on quitte le menu, mais sans voler le focus au
        // déclencheur — l'utilisateur veut aller plus loin dans la page.
        setOuvert(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          rechercher(e.key.toLowerCase());
        }
    }
  }

  return (
    <div ref={conteneur} className={cn('relative', className)}>
      <button
        ref={declencheur}
        type="button"
        onClick={() => (ouvert ? fermer() : ouvrir())}
        onKeyDown={(e) => {
          // Les flèches ouvrent le menu, comme sur un `<select>`.
          if (!ouvert && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            ouvrir();
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-controls={ouvert ? identifiant : undefined}
        title={t('Langue de l’interface')}
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-sm transition-colors',
          ouvert
            ? 'border-primary/50 bg-muted text-foreground'
            : 'border-border/60 text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground',
        )}
      >
        <Languages size={15} aria-hidden className="flex-shrink-0" />
        {/*
          Le nom accessible se compose du texte, il n'est PAS imposé par un
          `aria-label`. Avec un `aria-label`, un lecteur d'écran annonçait
          « Langue de l'interface, bouton » — le rôle du bouton, mais jamais la
          langue en cours. Ici il lit « Langue de l'interface Français », soit
          exactement ce que l'œil voit.
        */}
        <span className="sr-only">{t('Langue de l’interface')}</span>
        <span lang={langue} dir={SENS[langue]} className="font-medium">
          {NOMS_LANGUES[langue]}
        </span>
        <ChevronDown
          size={13}
          aria-hidden
          className={cn('flex-shrink-0 transition-transform duration-200', ouvert && 'rotate-180')}
        />
      </button>

      {/*
        Le panneau ne coupe PAS l'anneau de focus global (`:focus-visible`, or,
        posé dans globals.css). C'est la liste qui porte le focus DOM — le motif
        `aria-activedescendant` veut ça — et l'anneau est donc le seul repère
        disant « le clavier est ici ». Il ne se montre qu'après une frappe :
        ouvert à la souris, le menu reste net.
      */}
      {ouvert && (
        <ul
          ref={liste}
          id={identifiant}
          role="listbox"
          tabIndex={-1}
          aria-label={t('Langue de l’interface')}
          aria-activedescendant={idOption(active)}
          onKeyDown={surTouche}
          className={cn(
            'animate-menu-surgir bg-surface border-border absolute top-[calc(100%+0.5rem)] z-50',
            'shadow-menu w-60 max-w-[calc(100vw-1rem)] origin-top rounded-xl border p-2',
            versDebut ? 'start-0' : 'end-0',
          )}
        >
          {/*
            Filet or en tête de panneau — le même repère de marque que la carte
            de couverture et le pied de page. Il donne au menu une arête nette
            là où la bordure seule le laissait flotter sur le fond.

            Rentré de part et d'autre (`inset-x-4`) : mené jusqu'aux bords, il
            dépasserait des angles arrondis et se verrait comme deux moignons.
          */}
          <span
            aria-hidden
            className="via-primary/70 absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
          />

          <li
            aria-hidden
            className="text-muted-foreground px-2.5 pt-1.5 pb-2.5 text-[10px] font-medium tracking-[0.14em] uppercase"
          >
            {t('Langue de l’interface')}
          </li>

          {LANGUES.map((l, i) => {
            const retenue = l === langue;
            return (
              <li
                key={l}
                id={idOption(l)}
                role="option"
                aria-selected={retenue}
                onClick={() => choisir(l)}
                // Garde d'égalité : sans elle, chaque pixel parcouru par la
                // souris repasse par `setState` et rejoue le rendu du menu.
                onPointerMove={() => active !== l && setActive(l)}
                style={{ animationDelay: `${30 + i * 25}ms` }}
                className={cn(
                  'animate-menu-ligne flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors',
                  // Le survol clavier et le survol souris partagent le même
                  // fond : une seule ligne est mise en avant à la fois, d'où
                  // que vienne le geste.
                  active === l ? 'bg-muted' : 'bg-transparent',
                )}
              >
                {/*
                  Colonne de coche à largeur fixe, présente même sans coche :
                  sans elle, les noms se décaleraient d'un cran au changement
                  de langue et toute la liste sauterait.
                */}
                <span className="flex w-4 flex-shrink-0 justify-center">
                  {retenue && <Check size={14} aria-hidden className="text-primary" />}
                </span>

                {/*
                  Le nom n'est PAS étiré sur la largeur restante : « العربية »
                  porte `dir="rtl"`, et une boîte étirée alignerait donc son
                  texte à droite pendant que les quatre autres restent à
                  gauche — une ligne de travers au milieu de la liste. Réduit à
                  son contenu, il se pose au même endroit que les autres, sans
                  rien perdre du sens de lecture propre à sa langue.
                */}
                <span
                  lang={l}
                  dir={SENS[l]}
                  className={cn(
                    'truncate text-sm',
                    retenue ? 'text-foreground font-semibold' : 'text-foreground/85',
                  )}
                >
                  {NOMS_LANGUES[l]}
                </span>

                <span
                  aria-hidden
                  className={cn(
                    'ms-auto flex-shrink-0 text-[10px] font-semibold tracking-wider uppercase',
                    retenue ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {l}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
