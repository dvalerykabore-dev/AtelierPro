// Tripwire + contrat du sélecteur de thème.
//
// La logique est volontairement pure (le stockage et le document sont injectés)
// pour rester testable dans l'environnement `node` de Vitest : le projet
// n'embarque ni jsdom ni testing-library, et ce module n'a pas besoin d'eux.
import { describe, expect, it } from 'vitest';
import {
  CLE_STOCKAGE,
  SCRIPT_ANTI_FLASH,
  THEME_DEFAUT,
  appliquerTheme,
  ecrireTheme,
  lireTheme,
  themeSuivant,
} from './theme';

/** Implémentation réelle et minimale de l'interface Storage, adossée à une Map. */
function stockageFactice(initial?: Record<string, string>) {
  const donnees = new Map(Object.entries(initial ?? {}));
  return {
    getItem: (k: string) => donnees.get(k) ?? null,
    setItem: (k: string, v: string) => void donnees.set(k, v),
    donnees,
  };
}

describe('lireTheme', () => {
  it('renvoie le thème sombre quand rien n’a jamais été choisi', () => {
    expect(lireTheme(stockageFactice())).toBe('dark');
  });

  it('renvoie le thème clair quand l’utilisateur l’a choisi précédemment', () => {
    expect(lireTheme(stockageFactice({ [CLE_STOCKAGE]: 'light' }))).toBe('light');
  });

  it('ignore une valeur stockée hors du domaine et retombe sur le défaut', () => {
    expect(lireTheme(stockageFactice({ [CLE_STOCKAGE]: 'fuchsia' }))).toBe('dark');
  });

  it('renvoie le défaut sans stockage disponible (rendu serveur)', () => {
    expect(lireTheme(null)).toBe('dark');
  });

  it('renvoie le défaut quand la lecture lève — Safari en navigation privée', () => {
    const hostile = {
      getItem: () => {
        throw new DOMException('accès refusé');
      },
      setItem: () => {},
    };
    expect(lireTheme(hostile)).toBe('dark');
  });
});

describe('ecrireTheme', () => {
  it('persiste le choix sous la clé attendue par le script anti-flash', () => {
    const stockage = stockageFactice();
    ecrireTheme(stockage, 'light');
    expect(stockage.donnees.get(CLE_STOCKAGE)).toBe('light');
  });

  it('n’interrompt pas la bascule quand l’écriture est refusée (quota dépassé)', () => {
    const plein = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('quota dépassé');
      },
    };
    expect(() => ecrireTheme(plein, 'light')).not.toThrow();
  });
});

describe('themeSuivant', () => {
  it('alterne entre les deux thèmes', () => {
    expect(themeSuivant('dark')).toBe('light');
    expect(themeSuivant('light')).toBe('dark');
  });
});

describe('SCRIPT_ANTI_FLASH', () => {
  // Ce script est injecté brut dans <head> et s'exécute avant le premier rendu.
  // On l'évalue ici avec un document et un stockage factices : c'est le seul
  // moyen de prouver qu'il pose vraiment le bon attribut — une régression ici
  // se traduit par un flash bleu nuit à chaque chargement de page en thème clair.
  function executer(stockage: { getItem: (k: string) => string | null }) {
    const attributs = new Map<string, string>();
    const document = {
      documentElement: {
        setAttribute: (nom: string, valeur: string) => void attributs.set(nom, valeur),
      },
    };
    new Function('localStorage', 'document', SCRIPT_ANTI_FLASH)(stockage, document);
    return attributs;
  }

  it('pose le thème clair avant le premier rendu quand il est mémorisé', () => {
    expect(executer(stockageFactice({ [CLE_STOCKAGE]: 'light' })).get('data-theme')).toBe('light');
  });

  it('pose le thème par défaut quand rien n’est mémorisé', () => {
    expect(executer(stockageFactice()).get('data-theme')).toBe(THEME_DEFAUT);
  });

  it('pose le thème par défaut plutôt que d’échouer quand le stockage est bloqué', () => {
    const hostile = {
      getItem: () => {
        throw new DOMException('accès refusé');
      },
    };
    expect(executer(hostile).get('data-theme')).toBe(THEME_DEFAUT);
  });
});

describe('appliquerTheme', () => {
  function racineFactice() {
    const attributs = new Map<string, string>();
    return {
      setAttribute: (nom: string, valeur: string) => void attributs.set(nom, valeur),
      attributs,
    };
  }

  it('écrit le thème sur l’élément racine, là où le CSS l’attend', () => {
    const racine = racineFactice();
    appliquerTheme(racine, 'light');
    expect(racine.attributs.get('data-theme')).toBe('light');
  });

  it('écrit aussi le thème sombre explicitement plutôt que de retirer l’attribut', () => {
    const racine = racineFactice();
    appliquerTheme(racine, 'dark');
    expect(racine.attributs.get('data-theme')).toBe('dark');
  });
});
