// Heures d'ouverture de l'atelier.
//
// L'écran affichait « 08h00 — 18h00 » en dur pour tout le monde. Ces cas
// fixent ce qu'un atelier peut poser et ce qu'on refuse d'enregistrer.
import { describe, it, expect } from 'vitest';
import {
  CRENEAUX,
  dureeOuverture,
  formaterHeure,
  libelleHoraires,
  minutesDe,
  validerHoraires,
} from './horaires';

describe('CRENEAUX', () => {
  it('couvre la journée entière par demi-heures', () => {
    // 48 créneaux : un atelier qui livre un mariage travaille tard, et une
    // liste qui s'arrête à 20 h l'obligerait à mentir sur ses horaires.
    expect(CRENEAUX).toHaveLength(48);
    expect(CRENEAUX[0]).toBe('00:00');
    expect(CRENEAUX[CRENEAUX.length - 1]).toBe('23:30');
  });

  it('ne propose que des heures au format stocké', () => {
    expect(CRENEAUX.every((c) => minutesDe(c) !== null)).toBe(true);
  });

  it('inclut les demies, pas seulement les heures rondes', () => {
    expect(CRENEAUX).toContain('07:30');
    expect(CRENEAUX).toContain('18:30');
  });
});

describe('minutesDe', () => {
  it('compte depuis minuit', () => {
    expect(minutesDe('00:00')).toBe(0);
    expect(minutesDe('08:30')).toBe(510);
    expect(minutesDe('23:59')).toBe(1439);
  });

  it('refuse ce qui n’est pas une heure', () => {
    expect(minutesDe('24:00')).toBeNull();
    expect(minutesDe('08:60')).toBeNull();
    expect(minutesDe('8:30')).toBeNull();
    expect(minutesDe('')).toBeNull();
    expect(minutesDe('08h30')).toBeNull();
  });
});

describe('formaterHeure', () => {
  it('écrit à la française', () => {
    expect(formaterHeure('08:00')).toBe('08h00');
    expect(formaterHeure('18:30')).toBe('18h30');
  });

  it('rend un tiret plutôt qu’une heure inventée', () => {
    expect(formaterHeure('n’importe quoi')).toBe('—');
  });
});

describe('validerHoraires', () => {
  it('accepte une journée normale', () => {
    expect(validerHoraires('08:00', '18:00')).toBeNull();
  });

  it('accepte de tout vider — c’est un retrait volontaire', () => {
    expect(validerHoraires('', '')).toBeNull();
  });

  it('refuse une ouverture sans fermeture', () => {
    // S'afficherait « 08h00 — — », ce qui ne renseigne personne.
    expect(validerHoraires('08:00', '')).toContain('ou aucune des deux');
    expect(validerHoraires('', '18:00')).toContain('ou aucune des deux');
  });

  it('refuse une fermeture avant l’ouverture', () => {
    // Décrirait une nuit à cheval sur deux jours, et rendrait négative toute
    // durée calculée à partir de là.
    expect(validerHoraires('18:00', '08:00')).toContain('après l’ouverture');
  });

  it('refuse une fermeture à la même heure que l’ouverture', () => {
    expect(validerHoraires('08:00', '08:00')).toContain('après l’ouverture');
  });

  it('refuse une heure illisible', () => {
    expect(validerHoraires('08:00', '25:00')).toBe('Heure invalide.');
  });
});

describe('libelleHoraires', () => {
  it('joint les deux heures', () => {
    expect(libelleHoraires('08:00', '18:00')).toBe('08h00 — 18h00');
  });

  it('rend un tiret tant que rien n’est posé', () => {
    // Un atelier qui vient d'ouvrir n'a pas encore d'horaires : mieux vaut un
    // tiret que les 08h00 — 18h00 de quelqu'un d'autre.
    expect(libelleHoraires(null, null)).toBe('—');
    expect(libelleHoraires('08:00', null)).toBe('—');
    expect(libelleHoraires(undefined, undefined)).toBe('—');
  });

  it('rend un tiret sur une valeur abîmée en base', () => {
    expect(libelleHoraires('08h00', '18h00')).toBe('—');
  });
});

describe('dureeOuverture', () => {
  it('donne les heures, demies comprises', () => {
    expect(dureeOuverture('08:00', '18:00')).toBe(10);
    expect(dureeOuverture('08:30', '18:00')).toBe(9.5);
  });

  it('rend null quand l’intervalle n’a pas de sens', () => {
    expect(dureeOuverture('18:00', '08:00')).toBeNull();
    expect(dureeOuverture('08:00', '08:00')).toBeNull();
  });
});
