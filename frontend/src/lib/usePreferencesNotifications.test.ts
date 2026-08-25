// L'écran des rappels lit le même contrat que le serveur — ou il ment.
//
// `isChannelEnabled` est `server-only` : un composant ne peut pas l'importer,
// donc `rappelActif` le réimplémente. Ce double est le vrai risque : si le
// contrat d'opt-out s'inversait côté serveur, l'interrupteur continuerait
// d'afficher « actif » pour un rappel qui ne part plus, et personne ne s'en
// apercevrait avant d'attendre une alerte de retard qui n'arrive jamais.
import { describe, it, expect } from 'vitest';
import { rappelActif, ALERTES, type Reglages } from './usePreferencesNotifications';
import { isChannelEnabled } from '@/lib/server/notifications/prefs-merge';

const CAS: { nom: string; reglages: Reglages | null; type: string }[] = [
  { nom: 'aucun réglage enregistré', reglages: null, type: 'COMMANDE_EN_RETARD' },
  { nom: 'table vide', reglages: {}, type: 'COMMANDE_EN_RETARD' },
  { nom: 'refus explicite', reglages: { COMMANDE_EN_RETARD: { inApp: false } }, type: 'COMMANDE_EN_RETARD' }, // prettier-ignore
  { nom: 'accord explicite', reglages: { COMMANDE_EN_RETARD: { inApp: true } }, type: 'COMMANDE_EN_RETARD' }, // prettier-ignore
  { nom: 'un autre type réglé', reglages: { LIVRAISON_DEMAIN: { inApp: false } }, type: 'COMMANDE_EN_RETARD' }, // prettier-ignore
  { nom: 'type connu, canal absent', reglages: { COMMANDE_EN_RETARD: { email: false } }, type: 'COMMANDE_EN_RETARD' }, // prettier-ignore
  {
    nom: 'type inconnu de l’écran',
    reglages: { AUTRE_CHOSE: { inApp: false } },
    type: 'AUTRE_CHOSE',
  },
];

describe('rappelActif suit le contrat du serveur', () => {
  for (const cas of CAS) {
    it(`accorde avec isChannelEnabled — ${cas.nom}`, () => {
      expect(rappelActif(cas.reglages, cas.type)).toBe(
        isChannelEnabled(cas.reglages, cas.type, 'inApp'),
      );
    });
  }

  it('un rappel jamais réglé est actif : on ne demande pas d’activer avant de recevoir', () => {
    expect(rappelActif({}, 'COMMANDE_EN_RETARD')).toBe(true);
  });

  it('seul un `false` explicite coupe le rappel', () => {
    expect(rappelActif({ COMMANDE_EN_RETARD: { inApp: false } }, 'COMMANDE_EN_RETARD')).toBe(false);
  });
});

describe('ALERTES', () => {
  it('n’énumère que des rappels réellement émis par le passage quotidien', () => {
    // La liste précédente proposait des SMS au client, une alerte de saturation
    // et un récapitulatif du lundi — aucun de ces envois n'existe dans le code.
    // Un interrupteur pour un envoi qui n'a jamais lieu se coupe sans rien
    // changer, et c'est en cas de panne qu'on s'en aperçoit.
    expect(ALERTES.map((a) => a.type)).toEqual(['COMMANDE_EN_RETARD', 'LIVRAISON_DEMAIN']);
  });

  it('ne promet aucun envoi SMS', () => {
    const texte = ALERTES.map((a) => `${a.label} ${a.description}`)
      .join(' ')
      .toLowerCase();
    expect(texte).not.toContain('sms');
  });
});
