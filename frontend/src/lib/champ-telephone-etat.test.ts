// Saisie du champ téléphone : choisir un pays, taper, coller.
//
// Ces cas existent à cause d'un défaut signalé à l'usage : dérouler la liste et
// choisir un pays ne faisait rien. Le composant déduisait le pays du numéro
// composé, et un numéro vide ne peut porter aucun pays — le menu revenait sur
// le Burkina avant même qu'on relâche la souris. Le code se relisait sans que
// rien ne saute aux yeux ; il fallait s'en servir. D'où ces tests.
import { describe, it, expect } from 'vitest';
import {
  choisirPays,
  etatInitial,
  nettoyerSaisie,
  resynchroniser,
  taper,
  type EtatSaisie,
} from './champ-telephone-etat';

const VIDE: EtatSaisie = { codePays: 'BF', saisie: '' };

describe('etatInitial', () => {
  it('part du pays par défaut quand il n’y a pas de numéro', () => {
    expect(etatInitial('')).toEqual({ codePays: 'BF', saisie: '' });
  });

  it('retrouve le pays d’un numéro enregistré', () => {
    expect(etatInitial('+221771234567')).toEqual({ codePays: 'SN', saisie: '771234567' });
  });
});

describe('choisirPays', () => {
  it('retient le pays choisi sur un champ VIDE', () => {
    // Le défaut d'origine, tel qu'on le rencontre : on déroule l'indicatif
    // AVANT de taper le numéro, et rien ne se passait.
    const { etat } = choisirPays('SN', VIDE);
    expect(etat.codePays).toBe('SN');
  });

  it('ne remonte aucune valeur tant qu’aucun chiffre n’est saisi', () => {
    // « +221 » seul n'est pas un numéro : l'enregistrer donnerait une fiche
    // client avec un téléphone qui ne sonne nulle part.
    const { valeur } = choisirPays('SN', VIDE);
    expect(valeur).toBe('');
  });

  it('le pays choisi survit à la resynchronisation qui suit', () => {
    // C'est l'enchaînement exact qui cassait : on choisit, le parent renvoie
    // une valeur vide, et l'arbitre doit laisser l'état tranquille.
    const { etat, valeur } = choisirPays('SN', VIDE);
    expect(resynchroniser(valeur, etat)).toBeNull();
  });

  it('change l’indicatif d’un numéro déjà tapé', () => {
    const depart = { codePays: 'BF', saisie: '70123456' };
    const { valeur } = choisirPays('ML', depart);
    expect(valeur).toBe('+22370123456');
  });
});

describe('taper', () => {
  it('affiche le zéro de tête au moment où on le tape', () => {
    // En France le zéro disparaît du numéro international. Le retirer DE
    // L'AFFICHAGE faisait qu'appuyer sur « 0 » ne produisait rien à l'écran.
    const { etat } = taper('0', { codePays: 'FR', saisie: '' });
    expect(etat.saisie).toBe('0');
  });

  it('mais ne le remonte pas dans la valeur enregistrée', () => {
    // Ce qui s'affiche et ce qui s'enregistre diffèrent, et c'est voulu.
    const { valeur } = taper('0612345678', { codePays: 'FR', saisie: '' });
    expect(valeur).toBe('+33612345678');
  });

  it('garde le zéro dans la valeur là où il appartient au numéro', () => {
    const { valeur } = taper('0123456789', { codePays: 'CI', saisie: '' });
    expect(valeur).toBe('+2250123456789');
  });

  it('conserve les espaces de frappe', () => {
    // On tape « 70 12 34 56 » ; les manger en direct fait sauter le curseur.
    const { etat } = taper('70 12 34 56', VIDE);
    expect(etat.saisie).toBe('70 12 34 56');
  });

  it('écarte les lettres', () => {
    expect(nettoyerSaisie('70a12b34')).toBe('701234');
  });

  it('range un numéro international collé dans les deux cases', () => {
    // Geste courant : on recopie depuis un message. Sans ce traitement, on
    // obtenait +226 226 70 12 34 56 — un double indicatif qui ne sonne nulle part.
    const { etat, valeur } = taper('+221 77 123 45 67', VIDE);
    expect(etat.codePays).toBe('SN');
    expect(etat.saisie).toBe('771234567');
    expect(valeur).toBe('+221771234567');
  });

  it('reconnaît aussi la forme 00 collée', () => {
    const { etat } = taper('0022670123456', VIDE);
    expect(etat.codePays).toBe('BF');
    expect(etat.saisie).toBe('70123456');
  });

  it('vider le champ ne remonte rien plutôt qu’un indicatif orphelin', () => {
    const { etat, valeur } = taper('', { codePays: 'SN', saisie: '771234567' });
    expect(valeur).toBe('');
    // Le pays reste choisi : effacer le numéro n'est pas changer de pays.
    expect(etat.codePays).toBe('SN');
  });
});

describe('resynchroniser', () => {
  it('ne touche à rien quand la valeur reçue est celle qu’on produit', () => {
    // Le garde-fou : sans lui, chaque frappe réécrirait la saisie par sa
    // version normalisée, et le zéro de tête s'effacerait sous les doigts.
    const etat = { codePays: 'FR', saisie: '0612345678' };
    expect(resynchroniser('+33612345678', etat)).toBeNull();
  });

  it('réécrit quand la valeur vient vraiment d’ailleurs', () => {
    // Arrivée du serveur, ou formulaire remis à zéro après enregistrement.
    const etat = { codePays: 'BF', saisie: '70123456' };
    expect(resynchroniser('+221771234567', etat)).toEqual({
      codePays: 'SN',
      saisie: '771234567',
    });
  });

  it('remet à zéro quand le formulaire est vidé après enregistrement', () => {
    const etat = { codePays: 'SN', saisie: '771234567' };
    expect(resynchroniser('', etat)).toEqual({ codePays: 'BF', saisie: '' });
  });
});

describe('parcours complet', () => {
  it('choisir le Sénégal puis taper produit un numéro sénégalais', () => {
    // Le parcours signalé comme cassé, joué de bout en bout.
    let etat = etatInitial('');
    let valeur = '';

    const apresPays = choisirPays('SN', etat);
    etat = apresPays.etat;
    valeur = apresPays.valeur;
    expect(resynchroniser(valeur, etat)).toBeNull();

    for (const touche of ['7', '7', '1', '2', '3', '4', '5', '6', '7']) {
      const t = taper(etat.saisie + touche, etat);
      etat = t.etat;
      valeur = t.valeur;
      // À chaque frappe, l'arbitre doit laisser l'état en place.
      expect(resynchroniser(valeur, etat)).toBeNull();
    }

    expect(etat.codePays).toBe('SN');
    expect(valeur).toBe('+221771234567');
  });

  it('taper un numéro français caractère par caractère garde le zéro visible', () => {
    let etat: EtatSaisie = { codePays: 'FR', saisie: '' };
    let valeur = '';
    for (const touche of ['0', '6', '1', '2', '3', '4', '5', '6', '7', '8']) {
      const t = taper(etat.saisie + touche, etat);
      etat = t.etat;
      valeur = t.valeur;
      expect(resynchroniser(valeur, etat)).toBeNull();
    }
    expect(etat.saisie).toBe('0612345678');
    expect(valeur).toBe('+33612345678');
  });
});
