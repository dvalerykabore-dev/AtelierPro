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

const CIBLES: Langue[] = ['en', 'ar'];

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

  it('l’arabe décline autant ou plus que l’anglais', () => {
    // L'arabe a six catégories là où l'anglais en a deux. Une entrée déclinée
    // en anglais mais plate en arabe produirait « 2 طلب » au lieu de « طلبان ».
    const en = DICTIONNAIRES.en as Dictionnaire;
    const ar = DICTIONNAIRES.ar as Dictionnaire;
    const plates: string[] = [];
    for (const [cle, valeur] of Object.entries(en)) {
      if (typeof valeur === 'object' && typeof ar[cle] === 'string') plates.push(cle);
    }
    expect(plates).toEqual([]);
  });
});
