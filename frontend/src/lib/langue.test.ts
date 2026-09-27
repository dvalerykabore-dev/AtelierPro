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
  ecrireLangue,
  estLangue,
  lireLangue,
} from './langue';

function stockage(valeur: string | null) {
  return { getItem: vi.fn(() => valeur), setItem: vi.fn() };
}

describe('estLangue', () => {
  it('reconnaît chaque langue déclarée', () => {
    expect(LANGUES.every(estLangue)).toBe(true);
  });

  it('refuse le reste', () => {
    // « de » plutôt que « es » : l'espagnol servait ici d'exemple de code non
    // pris en charge, et l'ajouter a fait échouer ce cas — ce qui est le
    // comportement voulu, mais il faut alors un code réellement absent.
    expect(estLangue('de')).toBe(false);
    expect(estLangue('FR')).toBe(false);
    expect(estLangue(null)).toBe(false);
    expect(estLangue(undefined)).toBe(false);
  });
});

describe('lireLangue', () => {
  it('rend la langue mémorisée', () => {
    expect(lireLangue(stockage('ar'))).toBe('ar');
  });

  it('rend le français quand rien n’est mémorisé', () => {
    // On n'interroge pas le navigateur : l'atelier est francophone, et un
    // client de passage sur un téléphone en anglais verrait sinon la vitrine
    // dans une langue que l'atelier n'a pas choisie.
    expect(lireLangue(stockage(null))).toBe('fr');
  });

  it('ignore une valeur corrompue', () => {
    expect(lireLangue(stockage('klingon'))).toBe(LANGUE_DEFAUT);
  });

  it('survit à un stockage absent ou refusé', () => {
    // Safari en navigation privée lève à la lecture.
    expect(lireLangue(null)).toBe(LANGUE_DEFAUT);
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
    expect(SENS.es).toBe('ltr');
    expect(SENS.pt).toBe('ltr');
  });
});

describe('noms des langues', () => {
  it('nomme chaque langue dans sa propre langue', () => {
    // Quelqu'un qui cherche l'arabe cherche « العربية », pas « Arabe » —
    // surtout s'il est tombé sur une interface qu'il ne lit pas.
    expect(NOMS_LANGUES.ar).toBe('العربية');
    expect(NOMS_LANGUES.en).toBe('English');
    expect(NOMS_LANGUES.fr).toBe('Français');
    expect(NOMS_LANGUES.pt).toBe('Português');
    expect(NOMS_LANGUES.es).toBe('Español');
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
    expect(executer('pt', [])).toEqual({ lang: 'pt', dir: 'ltr' });
    expect(executer('es', [])).toEqual({ lang: 'es', dir: 'ltr' });
  });

  it('rend le français à la première visite, sans consulter le navigateur', () => {
    expect(executer(null, ['ar-MA', 'fr'])).toEqual({ lang: 'fr', dir: 'ltr' });
  });

  it('ignore une valeur corrompue en stockage', () => {
    expect(executer('klingon', ['en-US'])).toEqual({ lang: 'fr', dir: 'ltr' });
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
