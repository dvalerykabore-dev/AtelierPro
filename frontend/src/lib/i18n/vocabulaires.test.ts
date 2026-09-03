// Les vocabulaires des modules de données sont-ils tous traduits ?
//
// Le test voisin (`dictionnaires.test.ts`) relit les `t('…')` écrits en toutes
// lettres. Il ne peut rien pour `t(section.titre)` ou `t(s.label)` : la clé
// n'est pas dans l'appel, elle est dans un tableau, à l'autre bout du fichier.
// C'est précisément par là que le tableau de bord et le planning ont gardé leurs
// libellés français — rien ne cassait, l'écran affichait simplement « Commandes
// actives » au milieu d'une interface arabe.
//
// Ici on ne devine pas : on importe les tableaux et on demande au dictionnaire
// s'il connaît chacune de leurs chaînes affichées.
import { describe, it, expect } from 'vitest';
import { DICTIONNAIRES } from './dictionnaires';
import type { Dictionnaire } from './traduire';
import {
  GENRES,
  STATUTS,
  STATUTS_TACHE,
  paletteFemme,
  paletteHomme,
  type SectionMesures,
} from '@/lib/mock/atelier';
import { MODES, POSTES } from '@/lib/tresorerie';
import {
  CAS_USAGE,
  CHIFFRES_CLES,
  FONCTIONNALITES,
  PLANS_TARIFAIRES,
  QUESTIONS,
} from '@/lib/landing-contenu';
import { DEFINITIONS } from '@/lib/plans';

const CIBLES = ['en', 'es', 'pt', 'ar'] as const;

function champsDe(palettes: SectionMesures[]): string[] {
  return palettes.flatMap((s) => [s.titre, s.precision, ...s.champs.map((c) => c.label)]);
}

/**
 * Tout ce qu'un écran affiche depuis un module de données.
 *
 * Les montants, les codes et les identifiants n'y figurent pas : seules les
 * chaînes qu'un lecteur lit comme des mots.
 */
const VOCABULAIRES: Record<string, string[]> = {
  'statuts de commande': [...STATUTS],
  'statuts de tâche': [...STATUTS_TACHE],
  genres: [...GENRES],
  'palette masculine': champsDe(paletteHomme),
  'palette féminine': champsDe(paletteFemme),
  'postes de dépense': POSTES.map((p) => p.label),
  'modes de règlement': MODES.map((m) => m.label),
  'chiffres de la page publique': CHIFFRES_CLES.flatMap((c) => [c.valeur, c.label]),
  fonctionnalités: FONCTIONNALITES.flatMap((f) => [f.titre, f.description, f.lienLabel]),
  "cas d'usage": CAS_USAGE.flatMap((c) => [c.titre, c.description, c.resultat, c.mesure]),
  'questions fréquentes': QUESTIONS.flatMap((q) => [q.question, q.reponse]),
  // Le nom et la thèse de chaque palier viennent de lib/plans.ts, la source
  // unique ; la grille n'en garde que la formulation commerciale.
  'plans tarifaires': [
    ...DEFINITIONS.flatMap((d) => [d.nom, d.these]),
    ...PLANS_TARIFAIRES.flatMap((p) => [...(p.herite ? [p.herite] : []), ...p.inclus]),
  ],
};

/**
 * La chaîne contient-elle un mot, ou seulement un nombre ?
 *
 * « 8 », « 0 F » et « 2 000 F » n'ont rien à traduire — un montant en francs
 * CFA doit d'ailleurs se relire à l'identique dans les trois langues. Le seuil
 * est à deux lettres consécutives, et non à une : le « F » de « 2 000 F » est
 * un symbole monétaire, pas un mot.
 */
function porteDesMots(s: string): boolean {
  return /\p{Letter}{2}/u.test(s);
}

describe('vocabulaires des modules de données', () => {
  for (const langue of CIBLES) {
    const dictionnaire = DICTIONNAIRES[langue] as Dictionnaire;

    for (const [nom, chaines] of Object.entries(VOCABULAIRES)) {
      it(`traduit en ${langue} : ${nom}`, () => {
        const manquantes = [...new Set(chaines)]
          .filter(porteDesMots)
          .filter((c) => dictionnaire[c] === undefined)
          .sort();
        expect(manquantes).toEqual([]);
      });
    }
  }

  it('couvre bien quelque chose', () => {
    // Si un import changeait de forme et rendait des tableaux vides, tous les
    // cas ci-dessus passeraient sans rien vérifier.
    const total = Object.values(VOCABULAIRES).reduce((n, l) => n + l.length, 0);
    expect(total).toBeGreaterThan(120);
  });
});
