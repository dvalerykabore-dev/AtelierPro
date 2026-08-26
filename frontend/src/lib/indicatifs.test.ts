// Indicatifs et longueurs nationales.
//
// Le risque de ce module n'est pas de laisser passer une faute de frappe :
// c'est de REFUSER un vrai numéro. Un client est au comptoir, son numéro est
// bon, et le formulaire dit non — on ne l'enregistre pas, ou on invente autre
// chose. La plupart des cas ci-dessous protègent contre ça.
import { describe, it, expect } from 'vitest';
import {
  PAYS,
  PAYS_DEFAUT,
  chiffres,
  composer,
  decomposer,
  formaterAffichage,
  paysDe,
  sansZeroInitial,
  valider,
  validerInternational,
} from './indicatifs';

describe('table des pays', () => {
  it('commence par le Burkina Faso — neuf saisies sur dix', () => {
    expect(PAYS[0]?.code).toBe('BF');
    expect(PAYS_DEFAUT).toBe('BF');
  });

  it('n’a aucun code ISO en double', () => {
    // Le code est la clé du menu : un doublon rendrait une ligne insélectionnable.
    const codes = PAYS.map((p) => p.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('autorise deux pays sur le même indicatif', () => {
    // +1 couvre les États-Unis et le Canada : c'est pour ça que la clé est le
    // code ISO et non l'indicatif.
    const un = PAYS.filter((p) => p.indicatif === '1').map((p) => p.code);
    expect(un).toEqual(['US', 'CA']);
  });

  it('a des bornes cohérentes, et aucune au-delà d’E.164', () => {
    for (const p of PAYS) {
      expect(p.min, p.nom).toBeLessThanOrEqual(p.max);
      expect(p.min, p.nom).toBeGreaterThan(0);
      // 15 chiffres au total, indicatif compris.
      expect(p.indicatif.length + p.max, p.nom).toBeLessThanOrEqual(15);
    }
  });

  it('donne un exemple dont la longueur tient dans ses propres bornes', () => {
    // Un exemple hors bornes afficherait un modèle que le champ refuse.
    for (const p of PAYS) {
      const n = chiffres(p.exemple).length;
      const utile = sansZeroInitial(chiffres(p.exemple), p.code).length;
      expect(n >= p.min || utile >= p.min, `${p.nom} — exemple trop court`).toBe(true);
      expect(utile, `${p.nom} — exemple trop long`).toBeLessThanOrEqual(p.max);
    }
  });

  it('n’a que des indicatifs faits de chiffres, sans « + »', () => {
    for (const p of PAYS) expect(p.indicatif, p.nom).toMatch(/^[0-9]{1,4}$/);
  });
});

describe('sansZeroInitial', () => {
  it('retire le zéro là où il est un préfixe interurbain', () => {
    // En France « 06 … » s'écrit « +33 6 … » : le zéro n'existe pas à
    // l'international.
    expect(sansZeroInitial('0612345678', 'FR')).toBe('612345678');
  });

  it('GARDE le zéro là où il appartient au numéro', () => {
    // C'est le défaut qu'un test a rattrapé : la troncature était appliquée
    // partout. Un numéro ivoirien y perdait son premier chiffre en silence,
    // passait la validation de longueur, et s'enregistrait faux — découvert
    // le jour où l'on cherche à joindre le client.
    expect(sansZeroInitial('0123456789', 'CI')).toBe('0123456789');
    expect(sansZeroInitial('0197123456', 'BJ')).toBe('0197123456');
  });

  it('ne touche à rien quand le pays est inconnu', () => {
    expect(sansZeroInitial('0712345678')).toBe('0712345678');
    expect(sansZeroInitial('0712345678', 'ZZ')).toBe('0712345678');
  });
});

describe('composer', () => {
  it('assemble sans espaces', () => {
    expect(composer('BF', '70 12 34 56')).toBe('+22670123456');
  });

  it('absorbe la ponctuation que les gens collent', () => {
    expect(composer('BF', '70-12.34 56')).toBe('+22670123456');
  });

  it('retire le zéro de tête en France', () => {
    expect(composer('FR', '06 12 34 56 78')).toBe('+33612345678');
  });

  it('conserve le zéro de tête en Côte d’Ivoire', () => {
    expect(composer('CI', '01 23 45 67 89')).toBe('+2250123456789');
  });

  it('rend une chaîne vide quand il n’y a pas de numéro', () => {
    // Un client sans téléphone est un cas normal ; « +226 » tout seul serait
    // un numéro faux enregistré comme s'il était vrai.
    expect(composer('BF', '')).toBe('');
    expect(composer('BF', '   ')).toBe('');
  });
});

describe('decomposer', () => {
  it('reconnaît un numéro international', () => {
    expect(decomposer('+22670123456')).toEqual({ codePays: 'BF', national: '70123456' });
  });

  it('accepte la forme 00 utilisée depuis un poste fixe', () => {
    expect(decomposer('0022670123456')).toEqual({ codePays: 'BF', national: '70123456' });
  });

  it('tolère les espaces d’un numéro déjà en base', () => {
    expect(decomposer('+226 70 12 34 56')).toEqual({ codePays: 'BF', national: '70123456' });
  });

  it('ne jette JAMAIS les chiffres d’un numéro qu’il ne sait pas lire', () => {
    // La base contient « 752000 », saisi avant l'existence de ce champ. Le
    // vider parce qu'on ne sait pas l'interpréter serait une perte de donnée
    // déguisée en migration.
    expect(decomposer('752000')).toEqual({ codePays: 'BF', national: '752000' });
  });

  it('ne devine pas d’indicatif sur un numéro qui ne s’annonce pas international', () => {
    // « 226123 » est un numéro local à six chiffres, pas le Burkina suivi de
    // « 123 » — le lire ainsi fabriquerait un numéro qui n'existe pas.
    expect(decomposer('226123')).toEqual({ codePays: 'BF', national: '226123' });
  });

  it('choisit le plus long indicatif qui correspond', () => {
    // Sans cela, « 1 » raflerait tout ce qui commence par 1.
    expect(decomposer('+22170123456').codePays).toBe('SN');
    expect(decomposer('+12025550148')).toEqual({ codePays: 'US', national: '2025550148' });
  });

  it('retombe sur le pays par défaut pour un indicatif hors liste', () => {
    const d = decomposer('+99912345678');
    expect(d.codePays).toBe('BF');
    expect(d.national).toBe('99912345678');
  });

  it('rend un pays valide même si on lui en demande un inconnu', () => {
    // Un code absent de la liste rendrait le menu vide, sans rien sélectionné.
    expect(decomposer('', 'ZZ').codePays).toBe('BF');
  });

  it('fait l’aller-retour avec composer', () => {
    for (const p of PAYS) {
      // Des « 1 » : aucun zéro de tête, donc rien à tronquer d'un pays à l'autre.
      const national = '1'.repeat(p.min);
      const { codePays, national: relu } = decomposer(composer(p.code, national));
      expect(paysDe(codePays)?.indicatif, p.nom).toBe(p.indicatif);
      expect(relu, p.nom).toBe(national);
    }
  });
});

describe('valider', () => {
  it('accepte un numéro burkinabè à 8 chiffres', () => {
    expect(valider('BF', '70123456')).toBeNull();
  });

  it('accepte le vide — tous les clients ne laissent pas un numéro', () => {
    // Refuser ici ferait perdre la fiche entière, nom et mesures compris.
    expect(valider('BF', '')).toBeNull();
  });

  it('dit combien de chiffres manquent, pas seulement que c’est faux', () => {
    const m = valider('BF', '752000');
    expect(m).toContain('2 chiffres');
    expect(m).toContain('Burkina Faso');
  });

  it('signale aussi les chiffres en trop', () => {
    expect(valider('BF', '701234567')).toContain('1 chiffre de trop');
  });

  it('accorde le singulier', () => {
    expect(valider('BF', '7012345')).toContain('Il manque 1 chiffre —');
  });

  it('accepte toute la plage d’un pays qui a changé de numérotation', () => {
    // La Côte d'Ivoire est passée de 8 à 10 chiffres : les deux circulent, et
    // le zéro de tête compte dans les deux.
    expect(valider('CI', '07123456')).toBeNull();
    expect(valider('CI', '0123456789')).toBeNull();
  });

  it('ignore le zéro de tête là où c’est un préfixe interurbain', () => {
    // « 06 12 34 56 78 » compte 10 chiffres pour un pays qui en attend 9 :
    // sans la troncature, un numéro français parfaitement valide serait refusé.
    expect(valider('FR', '0612345678')).toBeNull();
  });

  it('compte le zéro de tête là où il appartient au numéro', () => {
    // Dix chiffres en Côte d'Ivoire, zéro compris — pas neuf.
    expect(valider('CI', '0123456789')).toBeNull();
    expect(valider('CI', '012345678901')).toContain('de trop');
  });
});

describe('validerInternational', () => {
  it('accepte un numéro complet et bien formé', () => {
    expect(validerInternational('+22670123456')).toBeNull();
  });

  it('accepte le vide et le nul', () => {
    expect(validerInternational('')).toBeNull();
    expect(validerInternational(null)).toBeNull();
    expect(validerInternational(undefined)).toBeNull();
  });

  it('exige l’indicatif', () => {
    expect(validerInternational('70123456')).toContain('indicatif');
  });

  it('n’exige pas que le pays soit dans la liste', () => {
    // La liste ne prétend pas couvrir le monde ; un client peut appeler d'un
    // pays absent. Les bornes E.164 valent partout.
    expect(validerInternational('+99912345678')).toBeNull();
  });

  it('refuse au-delà des bornes E.164', () => {
    expect(validerInternational('+1234')).toContain('entre 7 et 15');
    expect(validerInternational(`+${'1'.repeat(16)}`)).toContain('entre 7 et 15');
  });

  it('applique la longueur du pays quand il est connu', () => {
    expect(validerInternational('+226752000')).toContain('Burkina Faso');
  });
});

describe('formaterAffichage', () => {
  it('regroupe pour la relecture', () => {
    expect(formaterAffichage('+22670123456')).toBe('+226 70 12 34 56');
  });

  it('rend le vide sur une valeur absente', () => {
    expect(formaterAffichage(null)).toBe('');
    expect(formaterAffichage('')).toBe('');
  });

  it('n’invente pas d’indicatif sur un numéro hérité', () => {
    // « 752000 » a été saisi avant l'existence de ce champ. L'afficher
    // « +226 752 000 » lui collerait un pays que personne n'a choisi et
    // présenterait comme joignable une ligne qui ne l'est pas. On le rend tel
    // quel : visiblement incomplet, donc corrigeable.
    expect(formaterAffichage('752000')).toBe('752000');
    expect(formaterAffichage('70 12 34 56')).toBe('70 12 34 56');
  });

  it('met en forme dès que l’indicatif est là', () => {
    expect(formaterAffichage('0022670123456')).toBe('+226 70 12 34 56');
  });
});
