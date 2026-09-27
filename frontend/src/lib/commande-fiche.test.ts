import { describe, expect, it } from 'vitest';
import {
  dateComplete,
  etapeSuivante,
  etapesDe,
  initialesDe,
  numeroWhatsApp,
  libelleRang,
  mesuresResumeesDe,
  rangCommande,
  dateCourte,
} from '@/lib/commande-fiche';
import { paletteDe, type Commande } from '@/lib/mock/atelier';

function commande(partiel: Partial<Commande>): Commande {
  return {
    id: 'x',
    reference: '#001',
    sequence: 1,
    client: 'Cliente',
    clientId: 'cl1',
    tenue: 'Robe',
    tissu: null,
    statut: 'En cours',
    livraison: '—',
    assignee: '—',
    urgent: false,
    montant: 10000,
    acompte: false,
    notes: null,
    creeLe: '2025-01-10T00:00:00.000Z',
    ...partiel,
  };
}

describe('initialesDe', () => {
  it('prend la première lettre des deux premiers mots', () => {
    expect(initialesDe('Mariam Coulibaly')).toBe('MC');
    expect(initialesDe('Salimata Zongo')).toBe('SZ');
  });

  it('garde deux lettres quand le champ contient déjà des initiales', () => {
    // Le champ « assigné » est libre : « MK » ne doit pas devenir « M ».
    expect(initialesDe('MK')).toBe('MK');
    expect(initialesDe('mk')).toBe('MK');
  });

  it('ignore les espaces superflus', () => {
    expect(initialesDe('  Awa   Traoré  ')).toBe('AT');
  });

  it('ne casse pas sur une chaîne vide', () => {
    expect(initialesDe('')).toBe('');
    expect(initialesDe('   ')).toBe('');
  });

  it('s’arrête aux deux premiers mots', () => {
    expect(initialesDe('Marie Claire Ouédraogo')).toBe('MC');
  });
});

describe('etapeSuivante', () => {
  it('enchaîne les trois jalons dans l’ordre', () => {
    expect(etapeSuivante('En cours')?.suivant).toBe('Essayage');
    expect(etapeSuivante('Essayage')?.suivant).toBe('Livraison');
    expect(etapeSuivante('Livraison')?.suivant).toBe('Livré');
  });

  it('traite « En retard » comme « En cours »', () => {
    // Le retard est une alerte de délai, pas un jalon de fabrication.
    expect(etapeSuivante('En retard')).toEqual(etapeSuivante('En cours'));
  });

  it('ne propose plus rien une fois livrée', () => {
    expect(etapeSuivante('Livré')).toBeNull();
  });

  it('nomme l’action, pas l’état visé', () => {
    expect(etapeSuivante('Essayage')?.libelle).toBe('Valider l’essayage');
    expect(etapeSuivante('Livraison')?.libelle).toBe('Marquer livrée');
  });
});

describe('numeroWhatsApp', () => {
  it('ne garde que les chiffres, indicatif compris', () => {
    expect(numeroWhatsApp('+226 78 12 34 56')).toBe('22678123456');
    expect(numeroWhatsApp('00226-70-11-22-33')).toBe('0022670112233');
  });

  it('refuse ce qui ne permet pas de composer', () => {
    // Un wa.me tronqué ouvre une conversation vide, ou avec le mauvais numéro.
    expect(numeroWhatsApp(undefined)).toBeNull();
    expect(numeroWhatsApp('')).toBeNull();
    expect(numeroWhatsApp('non renseigné')).toBeNull();
    expect(numeroWhatsApp('+226 78')).toBeNull();
  });
});

describe('rangCommande', () => {
  const liste = [
    commande({ id: 'a', sequence: 12, clientId: 'cl1' }),
    commande({ id: 'b', sequence: 7, clientId: 'cl1' }),
    commande({ id: 'c', sequence: 9, clientId: 'cl2' }),
    commande({ id: 'd', sequence: 3, clientId: 'cl1' }),
  ];

  it('compte les commandes du même client jusqu’à celle-ci', () => {
    expect(rangCommande(liste, liste[0]!)).toBe(3);
    expect(rangCommande(liste, liste[1]!)).toBe(2);
    expect(rangCommande(liste, liste[3]!)).toBe(1);
  });

  it('ignore les commandes des autres clients', () => {
    // #009 de cl2 est plus récente que #007 de cl1 : elle ne doit pas compter.
    expect(rangCommande(liste, liste[2]!)).toBe(1);
  });

  it('rend 1 pour une commande absente de la liste chargée', () => {
    const isolee = commande({ id: 'z', sequence: 99, clientId: 'cl9' });
    expect(rangCommande([...liste, isolee], isolee)).toBe(1);
  });
});

describe('libelleRang', () => {
  it('accorde la première au féminin', () => {
    expect(libelleRang(1)).toBe('1ʳᵉ commande');
  });

  it('utilise l’exposant ordinal ensuite', () => {
    expect(libelleRang(2)).toBe('2ᵉ commande');
    expect(libelleRang(6)).toBe('6ᵉ commande');
  });

  it('ne descend jamais sous la première', () => {
    // Un rang 0 signalerait une liste incomplète — mieux vaut « 1ʳᵉ » qu'« 0ᵉ ».
    expect(libelleRang(0)).toBe('1ʳᵉ commande');
  });
});

describe('etapesDe', () => {
  it('marque l’enregistrement acquis et la confection en cours', () => {
    const etapes = etapesDe('En cours', '2025-01-10T00:00:00.000Z', '24 janv.');
    expect(etapes.map((e) => [e.terminee, e.active])).toEqual([
      [true, false],
      [false, true],
      [false, false],
      [false, false],
    ]);
  });

  it('place une commande en retard au même jalon qu’une commande en cours', () => {
    // Le retard est une alerte de délai, pas une étape de fabrication.
    const retard = etapesDe('En retard', '2025-01-10T00:00:00.000Z', '24 janv.');
    const cours = etapesDe('En cours', '2025-01-10T00:00:00.000Z', '24 janv.');
    expect(retard.map((e) => e.active)).toEqual(cours.map((e) => e.active));
  });

  it('termine tous les jalons une fois livrée', () => {
    const etapes = etapesDe('Livré', '2025-01-10T00:00:00.000Z', '24 janv.');
    expect(etapes.every((e) => e.terminee)).toBe(true);
    expect(etapes.some((e) => e.active)).toBe(false);
  });

  it('n’affiche aucune date là où il n’y en a pas', () => {
    const etapes = etapesDe('Essayage', '2025-01-10T00:00:00.000Z', '—');
    expect(etapes[0]!.date).toBe('10 janv.');
    expect(etapes[1]!.date).toBe('');
    expect(etapes[2]!.date).toBe('');
    // Échéance inconnue : la case reste vide plutôt que d'afficher « — ».
    expect(etapes[3]!.date).toBe('');
  });
});

describe('dateCourte', () => {
  it('rend une chaîne vide sur une date illisible', () => {
    expect(dateCourte('pas une date')).toBe('');
    expect(dateCourte('')).toBe('');
  });
});

describe('dateComplete', () => {
  it('écrit le mois en toutes lettres avec l’année', () => {
    expect(dateComplete('2025-01-10T00:00:00.000Z')).toBe('10 janvier 2025');
  });

  it('rend une chaîne vide sur une date illisible', () => {
    expect(dateComplete('jamais')).toBe('');
  });
});

describe('mesuresResumeesDe', () => {
  const palette = paletteDe('Femme');

  it('ne rend rien quand aucun relevé n’existe', () => {
    expect(mesuresResumeesDe(palette, null)).toEqual([]);
  });

  it('écarte les champs vides ou en espaces', () => {
    const resume = mesuresResumeesDe(palette, {
      'Haut::1': '138',
      'Haut::2': '   ',
      'Haut::3': '96',
      'Haut::4': '',
    });
    expect(resume).toEqual([
      { label: 'Longueur habit', valeur: '138', unite: 'cm' },
      { label: 'Poitrine', valeur: '96', unite: 'cm' },
    ]);
  });

  it('suit l’ordre du carnet et plafonne à six lignes', () => {
    const valeurs: Record<string, string> = {};
    for (let n = 1; n <= 17; n += 1) valeurs[`Haut::${n}`] = String(80 + n);
    const resume = mesuresResumeesDe(palette, valeurs);
    expect(resume).toHaveLength(6);
    expect(resume[0]!.label).toBe('Longueur habit');
    expect(resume[5]!.label).toBe('Hauteur épaules-longueur finie');
  });

  it('traverse les sections pour compléter l’extrait', () => {
    const resume = mesuresResumeesDe(palette, { 'Haut::3': '96', 'Bas::18': '78' });
    expect(resume.map((m) => m.label)).toEqual(['Poitrine', 'Ceinture']);
  });

  it('lit la palette masculine avec ses propres libellés', () => {
    const resume = mesuresResumeesDe(paletteDe('Homme'), { 'Haut::1': '41', 'Bas::16': '104' });
    expect(resume).toEqual([
      { label: 'Tour de cou', valeur: '41', unite: 'cm' },
      { label: 'Longueur pantalon', valeur: '104', unite: 'cm' },
    ]);
  });
});
