import { describe, expect, it } from 'vitest';

import {
  CAPACITES,
  DEFINITIONS,
  FORMULES,
  MOIS_COUVERTS,
  PLANS,
  aAcces,
  capacitesDe,
  definitionDe,
  estPlan,
  formaterFcfa,
  moisOfferts,
  palierRequis,
  peutAjouterArtisan,
  prixDe,
  prixMensuelEquivalent,
  rangDe,
  reporterEcheance,
  type Capacite,
} from './plans';

describe('estPlan', () => {
  it('reconnaît les quatre paliers', () => {
    for (const p of PLANS) expect(estPlan(p)).toBe(true);
  });

  it('refuse une valeur inconnue ou d’un autre type', () => {
    // Les anciennes clés de la grille à trois paliers ne doivent plus passer :
    // un `?plan=atelier` en signet ne doit pas ouvrir un abonnement fantôme.
    expect(estPlan('atelier')).toBe(false);
    expect(estPlan('decouverte')).toBe(false);
    expect(estPlan('')).toBe(false);
    expect(estPlan(null)).toBe(false);
    expect(estPlan(3)).toBe(false);
  });
});

describe('l’échelle', () => {
  it('va du gratuit au plus cher, sans trou de rang', () => {
    expect(DEFINITIONS.map((d) => d.cle)).toEqual(['freemium', 'essentiel', 'pro', 'premium']);
    expect(rangDe('freemium')).toBe(0);
    expect(rangDe('premium')).toBe(3);
  });

  it('a des prix strictement croissants', () => {
    const prix = DEFINITIONS.map((d) => d.prixMensuel);
    for (let i = 1; i < prix.length; i++) {
      expect(prix[i]!).toBeGreaterThan(prix[i - 1]!);
    }
  });

  it('n’annonce que des montants entiers — le franc CFA n’a pas de décimales', () => {
    for (const d of DEFINITIONS) expect(Number.isInteger(d.prixMensuel)).toBe(true);
  });

  it('desserre le plafond d’artisans à chaque palier', () => {
    expect(definitionDe('freemium').artisans).toBe(2);
    expect(definitionDe('essentiel').artisans).toBe(5);
    expect(definitionDe('pro').artisans).toBe(15);
    expect(definitionDe('premium').artisans).toBeNull();
  });
});

describe('capacitesDe', () => {
  it('ne donne rien au gratuit', () => {
    expect(capacitesDe('freemium').size).toBe(0);
  });

  it('cumule les paliers précédents', () => {
    expect([...capacitesDe('essentiel')].sort()).toEqual(['alertes', 'envoiFichier', 'planning']);
    expect([...capacitesDe('pro')].sort()).toEqual([
      'alertes',
      'envoiFichier',
      'planning',
      'rapports',
      'tresorerie',
    ]);
    expect(capacitesDe('premium').size).toBe(CAPACITES.length);
  });

  it('n’ôte jamais une capacité en montant d’un palier', () => {
    for (let i = 1; i < PLANS.length; i++) {
      const bas = capacitesDe(PLANS[i - 1]!);
      const haut = capacitesDe(PLANS[i]!);
      for (const c of bas) expect(haut.has(c)).toBe(true);
    }
  });

  it('couvre toutes les capacités déclarées, sans doublon entre paliers', () => {
    const vues = DEFINITIONS.flatMap((d) => [...d.ajoute]);
    expect(new Set(vues).size).toBe(vues.length);
    expect(vues.sort()).toEqual([...CAPACITES].sort());
  });
});

describe('aAcces', () => {
  it('ferme la trésorerie sous Pro et l’ouvre à partir de Pro', () => {
    expect(aAcces('freemium', 'tresorerie')).toBe(false);
    expect(aAcces('essentiel', 'tresorerie')).toBe(false);
    expect(aAcces('pro', 'tresorerie')).toBe(true);
    expect(aAcces('premium', 'tresorerie')).toBe(true);
  });

  it('réserve le mannequin à Premium', () => {
    expect(aAcces('pro', 'mannequin')).toBe(false);
    expect(aAcces('premium', 'mannequin')).toBe(true);
  });

  it('ferme tout envoi de fichier au gratuit — photos comme logo', () => {
    expect(aAcces('freemium', 'envoiFichier')).toBe(false);
    expect(aAcces('essentiel', 'envoiFichier')).toBe(true);
  });
});

describe('palierRequis', () => {
  it('rend le palier le moins cher qui débloque la capacité', () => {
    const attendu: Record<Capacite, string> = {
      planning: 'essentiel',
      envoiFichier: 'essentiel',
      alertes: 'essentiel',
      tresorerie: 'pro',
      rapports: 'pro',
      mannequin: 'premium',
    };
    for (const c of CAPACITES) expect(palierRequis(c)).toBe(attendu[c]);
  });
});

describe('peutAjouterArtisan', () => {
  it('bloque à la limite du palier, pas avant', () => {
    expect(peutAjouterArtisan('freemium', 1)).toBe(true);
    expect(peutAjouterArtisan('freemium', 2)).toBe(false);
    expect(peutAjouterArtisan('essentiel', 4)).toBe(true);
    expect(peutAjouterArtisan('essentiel', 5)).toBe(false);
  });

  it('ne borne jamais Premium', () => {
    expect(peutAjouterArtisan('premium', 0)).toBe(true);
    expect(peutAjouterArtisan('premium', 900)).toBe(true);
  });
});

describe('prixDe', () => {
  it('reproduit exactement la grille publiée', () => {
    expect(prixDe('essentiel', 'mois')).toBe(2000);
    expect(prixDe('essentiel', 'trimestre')).toBe(5000);
    expect(prixDe('essentiel', 'annee')).toBe(18000);

    expect(prixDe('pro', 'mois')).toBe(5000);
    expect(prixDe('pro', 'trimestre')).toBe(12500);
    expect(prixDe('pro', 'annee')).toBe(45000);

    expect(prixDe('premium', 'mois')).toBe(10000);
    expect(prixDe('premium', 'trimestre')).toBe(25000);
    expect(prixDe('premium', 'annee')).toBe(90000);
  });

  it('laisse le gratuit à zéro sur toutes les formules', () => {
    for (const f of FORMULES) expect(prixDe('freemium', f)).toBe(0);
  });

  it('ne produit que des entiers — rien à encaisser en centimes', () => {
    for (const p of PLANS) {
      for (const f of FORMULES) expect(Number.isInteger(prixDe(p, f))).toBe(true);
    }
  });

  it('tient la règle annoncée : un demi-mois offert au trimestre, trois à l’année', () => {
    expect(moisOfferts('mois')).toBe(0);
    expect(moisOfferts('trimestre')).toBe(0.5);
    expect(moisOfferts('annee')).toBe(3);

    // La règle doit être vraie en francs, pas seulement en mois : c'est ce que
    // le client vérifie.
    for (const p of PLANS) {
      const mensuel = definitionDe(p).prixMensuel;
      for (const f of FORMULES) {
        expect(prixDe(p, f)).toBe(mensuel * MOIS_COUVERTS[f] - mensuel * moisOfferts(f));
      }
    }
  });

  it('rend un prépayé toujours moins cher au mois que le mensuel', () => {
    for (const p of PLANS.filter((x) => x !== 'freemium')) {
      expect(prixMensuelEquivalent(p, 'trimestre')).toBeLessThan(prixDe(p, 'mois'));
      expect(prixMensuelEquivalent(p, 'annee')).toBeLessThan(prixMensuelEquivalent(p, 'trimestre'));
    }
    expect(prixMensuelEquivalent('pro', 'annee')).toBe(3750);
  });
});

describe('reporterEcheance', () => {
  const maintenant = new Date('2026-09-03T10:00:00.000Z');

  it('part de maintenant quand aucun abonnement ne court', () => {
    expect(reporterEcheance(null, 'mois', maintenant).toISOString()).toBe(
      '2026-10-03T10:00:00.000Z',
    );
    expect(reporterEcheance(null, 'annee', maintenant).toISOString()).toBe(
      '2027-09-03T10:00:00.000Z',
    );
  });

  it('empile sur l’échéance en cours — renouveler en avance ne perd aucun jour', () => {
    const court = new Date('2026-11-03T10:00:00.000Z');
    expect(reporterEcheance(court, 'trimestre', maintenant).toISOString()).toBe(
      '2027-02-03T10:00:00.000Z',
    );
  });

  it('repart de maintenant quand l’échéance est passée', () => {
    const expire = new Date('2026-06-03T10:00:00.000Z');
    expect(reporterEcheance(expire, 'mois', maintenant).toISOString()).toBe(
      '2026-10-03T10:00:00.000Z',
    );
  });

  it('ne modifie pas la date qu’on lui passe', () => {
    const echeance = new Date('2026-11-03T10:00:00.000Z');
    reporterEcheance(echeance, 'annee', maintenant);
    expect(echeance.toISOString()).toBe('2026-11-03T10:00:00.000Z');
  });
});

describe('formaterFcfa', () => {
  it('sépare les milliers par une espace simple', () => {
    // `toLocaleString('fr-FR')` pose une espace insécable étroite selon la
    // version d'ICU : on la ramène à une espace ordinaire, sinon la même somme
    // s'affiche différemment d'un environnement à l'autre.
    expect(formaterFcfa(12500)).toBe('12 500 F');
    expect(formaterFcfa(0)).toBe('0 F');
    expect(formaterFcfa(90000)).toBe('90 000 F');
  });
});
