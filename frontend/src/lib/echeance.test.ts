// Échéance d'une commande.
//
// Ces cas existent parce que le formulaire de nouvelle commande affichait une
// date de livraison — constante, tirée du jeu d'exemple — sans jamais en
// envoyer une au serveur. Les six commandes en base ont toutes une échéance
// nulle : aucune ne peut être signalée en retard, et le planning n'a rien à
// quoi se raccrocher. Rien ne le disait, parce que rien ne le testait.
import { describe, it, expect } from 'vitest';
import {
  aujourdhuiISO,
  delaiEnJours,
  joursEntre,
  libelleEcheance,
  validerEcheance,
  versISO,
} from './echeance';

const LUNDI_31_AOUT = '2026-08-31';

describe('aujourdhuiISO', () => {
  it('rend le jour local au format du champ date', () => {
    expect(aujourdhuiISO(new Date(2026, 7, 31, 23, 30))).toBe('2026-08-31');
  });

  it('ne recule pas d’un jour en fin de soirée', () => {
    // Passer par toISOString() ferait basculer un 31 août 23 h 30 (UTC+0 et
    // au-delà) sur le 1er septembre, ou l'inverse à l'ouest.
    expect(aujourdhuiISO(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01');
  });
});

describe('versISO', () => {
  it('convertit à midi UTC, pas à minuit', () => {
    // À minuit UTC, un atelier situé à l'ouest voit la date reculer d'un jour
    // à la relecture. Midi laisse douze heures de marge de chaque côté.
    expect(versISO(LUNDI_31_AOUT)).toBe('2026-08-31T12:00:00.000Z');
  });

  it('refuse une date qui n’existe pas', () => {
    // `Date.UTC` accepte le 31 février et le décale en silence au 3 mars.
    expect(versISO('2026-02-31')).toBeNull();
    expect(versISO('2026-13-01')).toBeNull();
  });

  it('refuse ce qui n’est pas un jour', () => {
    expect(versISO('')).toBeNull();
    expect(versISO('31/08/2026')).toBeNull();
    expect(versISO('2026-8-3')).toBeNull();
  });
});

describe('joursEntre', () => {
  it('compte les jours entiers', () => {
    expect(joursEntre('2026-08-31', '2026-09-05')).toBe(5);
    expect(joursEntre('2026-08-31', '2026-08-31')).toBe(0);
  });

  it('rend un nombre négatif pour une date passée', () => {
    expect(joursEntre('2026-08-31', '2026-08-28')).toBe(-3);
  });

  it('franchit un changement d’heure sans se décaler', () => {
    // Le passage à l'heure d'hiver rend une journée de 25 h : compter en
    // millisecondes locales donnerait 30,96 jours, arrondis à 31.
    expect(joursEntre('2026-10-01', '2026-11-01')).toBe(31);
  });

  it('franchit une année bissextile', () => {
    expect(joursEntre('2028-02-28', '2028-03-01')).toBe(2);
  });
});

describe('validerEcheance', () => {
  it('accepte une date à venir', () => {
    expect(validerEcheance('2026-09-05', LUNDI_31_AOUT)).toBeNull();
  });

  it('accepte le jour même — une tenue peut être promise pour le soir', () => {
    expect(validerEcheance(LUNDI_31_AOUT, LUNDI_31_AOUT)).toBeNull();
  });

  it('refuse une date passée', () => {
    // Une commande créée avec une échéance passée naîtrait en retard, et le
    // passage quotidien la signalerait dès le lendemain matin.
    expect(validerEcheance('2026-08-28', LUNDI_31_AOUT)).toContain('déjà passée');
  });

  it('accepte l’absence de date', () => {
    // Toutes les commandes n'ont pas de date promise ; bloquer la saisie ferait
    // perdre la commande entière.
    expect(validerEcheance('', LUNDI_31_AOUT)).toBeNull();
  });

  it('refuse une date impossible', () => {
    expect(validerEcheance('2026-02-31', LUNDI_31_AOUT)).toBe('Date invalide.');
  });
});

describe('libelleEcheance', () => {
  it('donne le jour de la semaine, qui compte autant que la date en atelier', () => {
    expect(libelleEcheance('2026-08-31')).toBe('lundi 31 août');
  });

  it('ne se décale pas d’un jour', () => {
    // Le piège classique : construire la date sans forcer l'heure, et voir le
    // 1er du mois s'afficher comme le dernier du mois précédent.
    expect(libelleEcheance('2026-01-01')).toBe('jeudi 1 janvier');
    expect(libelleEcheance('2026-12-31')).toBe('jeudi 31 décembre');
  });

  it('rend un tiret plutôt que « Invalid Date »', () => {
    expect(libelleEcheance('n’importe quoi')).toBe('—');
  });
});

describe('delaiEnJours', () => {
  it('dit le délai en clair', () => {
    expect(delaiEnJours('2026-09-05', LUNDI_31_AOUT)).toBe('dans 5 jours');
  });

  it('nomme aujourd’hui et demain', () => {
    expect(delaiEnJours(LUNDI_31_AOUT, LUNDI_31_AOUT)).toBe('aujourd’hui');
    expect(delaiEnJours('2026-09-01', LUNDI_31_AOUT)).toBe('demain');
  });

  it('dit le retard au lieu d’un nombre négatif', () => {
    // `Intl` nomme les jours proches plutôt que de les compter : « avant-hier »
    // et « hier » plutôt que « il y a 2 jours ». C'est ce que dirait l'artisan.
    expect(delaiEnJours('2026-08-29', LUNDI_31_AOUT)).toBe('avant-hier');
    expect(delaiEnJours('2026-08-30', LUNDI_31_AOUT)).toBe('hier');
    expect(delaiEnJours('2026-08-25', LUNDI_31_AOUT)).toBe('il y a 6 jours');
  });

  it('suit la langue demandée', () => {
    expect(delaiEnJours('2026-09-05', LUNDI_31_AOUT, 'en')).toBe('in 5 days');
    expect(delaiEnJours('2026-09-01', LUNDI_31_AOUT, 'ar')).toBe('غدًا');
  });
});

describe('libelleEcheance · langues', () => {
  it('nomme le jour et le mois dans la langue demandée', () => {
    expect(libelleEcheance('2026-09-08', 'en')).toBe('Tuesday 8 September');
    // Les chiffres restent latins : un montant ou une date doivent se relire
    // à l'identique sur la facture, quelle que soit la langue de l'écran.
    expect(libelleEcheance('2026-09-08', 'ar')).toContain('8');
  });
});
