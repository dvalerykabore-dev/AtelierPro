// Garde-fous sur les dictionnaires eux-mêmes.
//
// Ils vont grossir à chaque écran repris, sur trois fichiers, et la plupart
// des défauts qu'on y glisse sont invisibles à l'exécution : une entrée vide
// efface un texte, un `{nom}` oublié laisse un trou dans une phrase, une clé
// en double est écrasée en silence par la dernière. Ces cas les attrapent.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { DICTIONNAIRES } from './dictionnaires';
import { LANGUES, type Langue } from '@/lib/langue';
import type { CategoriePluriel, Dictionnaire } from './traduire';

const CIBLES: Langue[] = ['en', 'es', 'pt', 'ar'];

/** Tous les marqueurs `{nom}` d'une chaîne, en ensemble. */
function marqueurs(s: string): Set<string> {
  return new Set([...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1] as string));
}

/** Les chaînes d'une entrée — une seule, ou une par catégorie de pluriel. */
function formes(entree: Dictionnaire[string]): string[] {
  return typeof entree === 'string' ? [entree] : Object.values(entree).filter(Boolean);
}

describe('dictionnaires', () => {
  it('le français n’a pas de dictionnaire — ses clés sont ses phrases', () => {
    // Un fichier où chaque entrée se recopie elle-même ne serait jamais relu,
    // et finirait par diverger du code.
    expect(DICTIONNAIRES.fr).toBeNull();
  });

  it('couvre chaque langue déclarée', () => {
    // Ajouter une langue sans son dictionnaire donnerait une interface
    // entièrement française sous un nom de langue étranger.
    expect(Object.keys(DICTIONNAIRES).sort()).toEqual([...LANGUES].sort());
  });

  for (const langue of CIBLES) {
    describe(langue, () => {
      const dict = DICTIONNAIRES[langue] as Dictionnaire;

      it('ne contient aucune entrée vide', () => {
        // Une chaîne vide est un oubli de traducteur, pas un choix : elle
        // effacerait le texte de l'écran.
        const vides = Object.entries(dict)
          .filter(([, v]) => formes(v).some((f) => f.trim() === ''))
          .map(([k]) => k);
        expect(vides).toEqual([]);
      });

      it('conserve les marqueurs de la clé française', () => {
        // `t('Bonjour {nom}')` traduit en « Hello » sans `{nom}` perd le nom
        // sans rien signaler. L'inverse — un marqueur inventé — laisse
        // « {prenom} » en clair à l'écran.
        const fautifs: string[] = [];
        for (const [cle, valeur] of Object.entries(dict)) {
          const attendus = marqueurs(cle);
          for (const forme of formes(valeur)) {
            for (const m of marqueurs(forme)) {
              // `n` est injecté par `traduirePluriel` : il n'a pas à figurer
              // dans la clé, qui peut être la forme singulière.
              if (!attendus.has(m) && m !== 'n') fautifs.push(`${cle} → {${m}}`);
            }
          }
          const rendus = new Set(formes(valeur).flatMap((f) => [...marqueurs(f)]));
          for (const m of attendus) {
            if (!rendus.has(m)) fautifs.push(`${cle} : {${m}} manquant`);
          }
        }
        expect(fautifs).toEqual([]);
      });

      it('déclare « other » sur chaque entrée déclinée', () => {
        // C'est la forme de repli du moteur quand la catégorie exacte manque ;
        // sans elle, un nombre inattendu rendrait la clé française.
        const sansOther = Object.entries(dict)
          .filter(([, v]) => typeof v === 'object' && !(v as Record<string, string>).other)
          .map(([k]) => k);
        expect(sansOther).toEqual([]);
      });

      it('n’utilise que des catégories de pluriel valides', () => {
        const connues: CategoriePluriel[] = ['zero', 'one', 'two', 'few', 'many', 'other'];
        const inconnues: string[] = [];
        for (const [cle, valeur] of Object.entries(dict)) {
          if (typeof valeur === 'object') {
            for (const c of Object.keys(valeur)) {
              if (!connues.includes(c as CategoriePluriel)) inconnues.push(`${cle} → ${c}`);
            }
          }
        }
        expect(inconnues).toEqual([]);
      });

      it('ne déclare pas deux fois la même clé', () => {
        // TypeScript le signale, mais seulement pour les clés littéralement
        // identiques dans un même littéral d'objet : on relit la source pour
        // couvrir aussi les formes citées différemment.
        const source = fs.readFileSync(path.join(__dirname, `${langue}.ts`), 'utf8');
        const cles = [...source.matchAll(/^ {2}(?:'((?:[^'\\]|\\.)*)'|([A-Za-zÀ-ÿ_]\w*)):/gm)].map(
          (m) => m[1] ?? m[2],
        );
        const vus = new Set<string>();
        const doublons = cles.filter((c) =>
          vus.has(c as string) ? true : (vus.add(c as string), false),
        );
        expect(doublons).toEqual([]);
      });
    });
  }

  it('décline partout où l’anglais décline', () => {
    // L'anglais est le plancher : il ne distingue que deux formes, là où le
    // portugais en distingue deux aussi et l'arabe six. Une entrée déclinée en
    // anglais mais plate ailleurs produirait « 2 طلب » au lieu de « طلبان », ou
    // « 2 encomenda » au lieu de « 2 encomendas ».
    const en = DICTIONNAIRES.en as Dictionnaire;
    const plates: string[] = [];
    for (const langue of CIBLES.filter((l) => l !== 'en')) {
      const cible = DICTIONNAIRES[langue] as Dictionnaire;
      for (const [cle, valeur] of Object.entries(en)) {
        if (typeof valeur === 'object' && typeof cible[cle] === 'string') {
          plates.push(`${langue} : ${cle}`);
        }
      }
    }
    expect(plates).toEqual([]);
  });
});

/**
 * Chaînes citées en français dans le code et volontairement laissées telles
 * quelles. Ce sont des exemples locaux — un nom, une ville, une adresse, un
 * modèle de tenue — affichés en `placeholder` d'un champ vide, plus le nom d'un
 * fournisseur. Les traduire ne rendrait service à personne : un atelier de
 * Ouagadougou saisit ses vrais clients par-dessus.
 */
const HORS_DICTIONNAIRE = new Set([
  'Aminata Ouédraogo',
  'Moussa Koné',
  'Ouagadougou',
  'Secteur 15, rue 15.42',
  'Boubou bazin brodé',
  'Google',
]);

/**
 * Retire commentaires de bloc et de ligne, en gardant les retours à la ligne.
 *
 * Sans ça, un `tp('{n} commande', '{n} commandes', 3)` cité en exemple dans une
 * JSDoc compte comme un appel réel. C'est exactement ce qui est arrivé :
 * `'{n} commandes'` a été rangé parmi les exclusions comme « exemple de doc »,
 * alors que c'est la clé sous laquelle `traduirePluriel` cherche VRAIMENT, à
 * chaque compteur de commandes de l'application. Le test se taisait pendant que
 * tous ces compteurs restaient en français.
 */
function sansCommentaires(s: string): string {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/^\s*\/\/.*$/gm, '');
}

/** Tous les `.ts`/`.tsx` du projet, tests exclus. */
function sources(racine: string, acc: string[] = []): string[] {
  for (const e of fs.readdirSync(racine, { withFileTypes: true })) {
    const p = path.join(racine, e.name);
    if (e.isDirectory()) sources(p, acc);
    else if (/\.tsx?$/.test(e.name) && !/\.test\./.test(e.name)) acc.push(p);
  }
  return acc;
}

describe('couverture des dictionnaires', () => {
  // Le vrai défaut que ce test attrape n'est pas une faute de traduction : c'est
  // un écran qui appelle `t('…')` sur une phrase absente des dictionnaires. Rien
  // ne casse — le moteur rend le français — et l'écran reste donc en français au
  // milieu d'une interface arabe, sans la moindre erreur pour le signaler.
  const utilisees = new Set<string>();
  for (const f of sources('src')) {
    const s = sansCommentaires(fs.readFileSync(f, 'utf8'));
    for (const m of s.matchAll(/\bt\(\s*'((?:[^'\\]|\\.)*)'/g)) utilisees.add(m[1] as string);
    for (const m of s.matchAll(/\btp\(\s*'(?:[^'\\]|\\.)*'\s*,\s*'((?:[^'\\]|\\.)*)'/g))
      utilisees.add(m[1] as string);
    // Les modules hors composant n'ont pas de hook : ils appellent `traduire`
    // directement, et leurs clés comptent tout autant.
    for (const m of s.matchAll(/\btraduire\([^,]+,\s*'((?:[^'\\]|\\.)*)'/g))
      utilisees.add(m[1] as string);
    // `t(condition ? 'A' : 'B')` — deux clés dans un seul appel. Sans ce cas,
    // la moitié des libellés d'état passaient au travers.
    for (const m of s.matchAll(
      /\bt\(\s*[^)'"]*\?\s*'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'/g,
    )) {
      utilisees.add(m[1] as string);
      utilisees.add(m[2] as string);
    }
    // `<Traduction cle="…">` — la clé est un attribut JSX, pas un appel. Sans
    // ce cas, une phrase à éléments pourrait n'exister dans aucun dictionnaire
    // et rester française partout sans que rien ne le signale.
    for (const m of s.matchAll(/\bcle="([^"]*)"/g)) utilisees.add(m[1] as string);
  }

  it('trouve bien les appels à traduire', () => {
    // Garde-fou du garde-fou : si l'extraction cassait, le test ci-dessous
    // passerait sur un ensemble vide sans rien vérifier.
    expect(utilisees.size).toBeGreaterThan(200);
  });

  for (const langue of CIBLES) {
    it(`déclare en ${langue} chaque phrase que le code demande`, () => {
      const dictionnaire = DICTIONNAIRES[langue] as Dictionnaire;
      const manquantes = [...utilisees]
        .filter((cle) => !HORS_DICTIONNAIRE.has(cle))
        .filter((cle) => dictionnaire[cle] === undefined)
        .sort();
      expect(manquantes).toEqual([]);
    });
  }
});
