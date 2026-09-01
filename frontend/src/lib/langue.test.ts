// Langue de l'interface.
//
// Mêmes exigences que le thème — mémorisation, absence de clignotement,
// tolérance à un stockage refusé — plus une qui lui est propre : l'arabe
// retourne la mise en page, donc `dir` doit être posé avant le premier pixel.
import { describe, it, expect, vi } from 'vitest';
import {
  CLE_STOCKAGE,
  LANGUES,
  LANGUE_DEFAUT,
  NOMS_LANGUES,
  SCRIPT_ANTI_FLASH_LANGUE,
  SENS,
  appliquerLangue,
  detecterLangue,
  ecrireLangue,
  estLangue,
  lireLangue,
} from './langue';

function stockage(valeur: string | null) {
  return { getItem: vi.fn(() => valeur), setItem: vi.fn() };
}

describe('estLangue', () => {
  it('reconnaît les trois langues', () => {
    expect(LANGUES.every(estLangue)).toBe(true);
  });

  it('refuse le reste', () => {
    expect(estLangue('es')).toBe(false);
    expect(estLangue('FR')).toBe(false);
    expect(estLangue(null)).toBe(false);
    expect(estLangue(undefined)).toBe(false);
  });
});

describe('detecterLangue', () => {
  it('retient la première langue que nous parlons', () => {
    expect(detecterLangue(['es-ES', 'ar-MA', 'fr'])).toBe('ar');
  });

  it('ignore la région', () => {
    // Un arabophone du Maroc et un du Tchad lisent la même interface.
    expect(detecterLangue(['ar-MA'])).toBe('ar');
    expect(detecterLangue(['en-US'])).toBe('en');
  });

  it('retombe sur le français, pas sur l’anglais', () => {
    // L'anglais par défaut serait un choix ; le français est la langue dans
    // laquelle l'atelier a été écrit.
    expect(detecterLangue(['es-ES', 'de'])).toBe('fr');
    expect(detecterLangue([])).toBe('fr');
    expect(detecterLangue(undefined)).toBe('fr');
  });
});

describe('lireLangue', () => {
  it('rend la langue mémorisée', () => {
    expect(lireLangue(stockage('ar'))).toBe('ar');
  });

  it('devine d’après le navigateur quand rien n’est mémorisé', () => {
    expect(lireLangue(stockage(null), ['en-US'])).toBe('en');
  });

  it('préfère le choix mémorisé à la langue du navigateur', () => {
    // Quelqu'un qui a explicitement choisi le français sur un téléphone en
    // anglais ne doit pas le voir revenir à l'anglais au rechargement.
    expect(lireLangue(stockage('fr'), ['en-US'])).toBe('fr');
  });

  it('ignore une valeur corrompue', () => {
    expect(lireLangue(stockage('klingon'), ['ar'])).toBe('ar');
  });

  it('survit à un stockage absent ou refusé', () => {
    // Safari en navigation privée lève à la lecture.
    expect(lireLangue(null, ['ar'])).toBe('ar');
    const casse = {
      getItem: () => {
        throw new Error('refusé');
      },
      setItem: vi.fn(),
    };
    expect(lireLangue(casse)).toBe(LANGUE_DEFAUT);
  });
});

describe('ecrireLangue', () => {
  it('persiste le choix sous la clé attendue', () => {
    const s = stockage(null);
    ecrireLangue(s, 'ar');
    expect(s.setItem).toHaveBeenCalledWith(CLE_STOCKAGE, 'ar');
  });

  it('n’explose pas sur un stockage plein', () => {
    const plein = {
      getItem: vi.fn(),
      setItem: () => {
        throw new Error('plein');
      },
    };
    expect(() => ecrireLangue(plein, 'en')).not.toThrow();
  });
});

describe('appliquerLangue', () => {
  it('pose lang ET dir', () => {
    // `lang` seul laisserait l'arabe s'afficher de gauche à droite ; `dir`
    // seul priverait les lecteurs d'écran de l'information de langue.
    const racine = { setAttribute: vi.fn() };
    appliquerLangue(racine, 'ar');
    expect(racine.setAttribute).toHaveBeenCalledWith('lang', 'ar');
    expect(racine.setAttribute).toHaveBeenCalledWith('dir', 'rtl');
  });

  it('remet ltr en quittant l’arabe', () => {
    // L'attribut est toujours écrit, jamais omis : sinon un passage arabe →
    // français laisserait la page retournée.
    const racine = { setAttribute: vi.fn() };
    appliquerLangue(racine, 'fr');
    expect(racine.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
  });
});

describe('sens d’écriture', () => {
  it('ne déclare rtl que pour l’arabe', () => {
    expect(SENS.ar).toBe('rtl');
    expect(SENS.fr).toBe('ltr');
    expect(SENS.en).toBe('ltr');
  });
});

describe('noms des langues', () => {
  it('nomme chaque langue dans sa propre langue', () => {
    // Quelqu'un qui cherche l'arabe cherche « العربية », pas « Arabe » —
    // surtout s'il est tombé sur une interface qu'il ne lit pas.
    expect(NOMS_LANGUES.ar).toBe('العربية');
    expect(NOMS_LANGUES.en).toBe('English');
    expect(NOMS_LANGUES.fr).toBe('Français');
  });
});

describe('SCRIPT_ANTI_FLASH_LANGUE', () => {
  /** Exécute le script dans un faux document et rend les attributs posés. */
  function executer(stocke: string | null, navigateur: string[]) {
    const poses: Record<string, string> = {};
    const document = {
      documentElement: { setAttribute: (k: string, v: string) => (poses[k] = v) },
    };
    const localStorage = { getItem: () => stocke };
    const navigator = { languages: navigateur, language: navigateur[0] };
    new Function('document', 'localStorage', 'navigator', SCRIPT_ANTI_FLASH_LANGUE)(
      document,
      localStorage,
      navigator,
    );
    return poses;
  }

  it('pose la langue mémorisée avant le premier pixel', () => {
    expect(executer('ar', ['fr'])).toEqual({ lang: 'ar', dir: 'rtl' });
  });

  it('retourne la page pour l’arabe, et elle seule', () => {
    // Sans lui, un utilisateur en arabe verrait la page se construire de
    // gauche à droite puis se retourner entièrement à l'hydratation.
    expect(executer('en', [])).toEqual({ lang: 'en', dir: 'ltr' });
    expect(executer('fr', [])).toEqual({ lang: 'fr', dir: 'ltr' });
  });

  it('devine d’après le navigateur à la première visite', () => {
    expect(executer(null, ['ar-MA', 'fr'])).toEqual({ lang: 'ar', dir: 'rtl' });
  });

  it('ignore une valeur corrompue en stockage', () => {
    expect(executer('klingon', ['en-US'])).toEqual({ lang: 'en', dir: 'ltr' });
  });

  it('retombe sur le français quand le navigateur ne nous parle pas', () => {
    expect(executer(null, ['es-ES'])).toEqual({ lang: 'fr', dir: 'ltr' });
  });

  it('pose quand même les attributs si le stockage lève', () => {
    const poses: Record<string, string> = {};
    const document = {
      documentElement: { setAttribute: (k: string, v: string) => (poses[k] = v) },
    };
    const localStorage = {
      getItem: () => {
        throw new Error('refusé');
      },
    };
    new Function('document', 'localStorage', 'navigator', SCRIPT_ANTI_FLASH_LANGUE)(
      document,
      localStorage,
      { languages: ['ar'] },
    );
    expect(poses).toEqual({ lang: 'fr', dir: 'ltr' });
  });

  it('reste synchronisé avec les constantes du module', () => {
    // Le script est écrit à la main : ces assertions le rattachent au module
    // pour qu'ajouter une langue sans le mettre à jour se voie.
    expect(SCRIPT_ANTI_FLASH_LANGUE).toContain(JSON.stringify(CLE_STOCKAGE));
    expect(SCRIPT_ANTI_FLASH_LANGUE).toContain(JSON.stringify(LANGUES));
  });
});
