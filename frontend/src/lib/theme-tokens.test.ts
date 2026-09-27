// Tripwire de thème — dans l'esprit de runtime-enforcement.test.ts.
//
// Le thème clair fonctionne parce que ~1 400 utilitaires passent tous par les
// jetons sémantiques (bg-surface, text-foreground…), redéfinis sous
// [data-theme='light'] dans globals.css. Une couleur Tailwind brute (bg-white,
// text-gray-600…) ne bascule pas : elle reste identique dans les deux thèmes.
//
// C'est invisible pendant le développement — on travaille dans un seul thème à
// la fois — et ça donne du texte blanc sur blanc en production. Ce test attrape
// la régression au commit plutôt qu'en atelier.
import { describe, expect, it } from 'vitest';
import fg from 'fast-glob';
import { readFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';

const ROOT = resolve(__dirname, '../..');

const PALETTE_BRUTE =
  /\b(?:bg|text|border|from|via|to|ring|fill|stroke|divide|placeholder|decoration|outline|caret|shadow)-(?:white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?(?:\/\d{1,3})?\b/g;

/**
 * Fichiers autorisés à figer une couleur, avec la raison. N'ajoutez une entrée
 * que si la couleur doit rester identique dans les deux thèmes (logo d'une
 * marque tierce, par exemple) — pas pour faire taire le test.
 */
const DEROGATIONS: Record<string, string> = {};

describe('jetons de thème : aucune couleur Tailwind brute dans les composants', () => {
  const fichiers = fg.sync('src/**/*.tsx', { cwd: ROOT, absolute: true });

  it('a bien trouvé des composants à inspecter', () => {
    expect(fichiers.length).toBeGreaterThan(0);
  });

  for (const fichier of fichiers) {
    const rel = relative(ROOT, fichier).split(sep).join('/');

    it(`${rel} n’utilise que des jetons sémantiques`, () => {
      const trouvailles = [...readFileSync(fichier, 'utf8').matchAll(PALETTE_BRUTE)].map(
        ([m]) => m,
      );
      const derogation = DEROGATIONS[rel];
      if (derogation) {
        expect(trouvailles.length, `${rel} : dérogation inutile — ${derogation}`).toBeGreaterThan(
          0,
        );
        return;
      }
      expect(
        [...new Set(trouvailles)],
        `${rel} fige des couleurs qui ne basculeront pas en thème clair : ` +
          `${[...new Set(trouvailles)].join(', ')}. Utilisez les jetons ` +
          `(bg-surface, text-foreground, border-border, text-danger…) ou ajoutez ` +
          `une dérogation motivée dans DEROGATIONS.`,
      ).toEqual([]);
    });
  }
});
