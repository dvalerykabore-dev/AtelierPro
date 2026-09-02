import { describe, expect, it } from 'vitest';
import {
  apparenceDe,
  lienDe,
  momentRelatif,
  versUI,
  type NotificationApi,
} from '@/lib/notifications';

function notif(partiel: Partial<NotificationApi>): NotificationApi {
  return {
    id: 'n1',
    type: 'WELCOME',
    title: 'Bienvenue',
    body: 'Contenu',
    data: null,
    readAt: null,
    createdAt: '2026-08-24T10:00:00.000Z',
    ...partiel,
  };
}

describe('apparenceDe', () => {
  it('range les paiements dans leur catégorie', () => {
    expect(apparenceDe('PAYMENT_RECEIVED').categorie).toBe('Paiements');
    expect(apparenceDe('WITHDRAWAL_REQUESTED').categorie).toBe('Paiements');
  });

  it('donne une apparence lisible à un type inconnu', () => {
    // Un type émis par une version plus récente ne doit pas casser la liste.
    const a = apparenceDe('COMMANDE_EN_RETARD');
    expect(a.categorie).toBe('Atelier');
    expect(a.icone).toBe('message');
    expect(a.couleurIcone).not.toBe('');
  });
});

describe('lienDe', () => {
  it('suit une commande de l’atelier', () => {
    expect(lienDe({ commandeId: 'abc' })).toBe('/commandes/abc');
  });

  it('ignore l’orderId générique du starter', () => {
    // `Order` n'est pas `TailoringOrder` : le lien mènerait à une 404.
    expect(lienDe({ orderId: 'abc', amount: 1000 })).toBeNull();
  });

  it('encaisse les données absentes ou mal formées', () => {
    expect(lienDe(null)).toBeNull();
    expect(lienDe('abc')).toBeNull();
    expect(lienDe({ commandeId: 42 })).toBeNull();
    expect(lienDe({ commandeId: '' })).toBeNull();
  });
});

describe('momentRelatif', () => {
  const maintenant = new Date('2026-08-24T12:00:00.000Z');

  it('résume la dernière minute', () => {
    expect(momentRelatif('2026-08-24T11:59:30.000Z', maintenant)).toBe('À l’instant');
  });

  it('compte les minutes puis les heures', () => {
    expect(momentRelatif('2026-08-24T11:42:00.000Z', maintenant)).toBe('Il y a 18 min');
    expect(momentRelatif('2026-08-24T09:00:00.000Z', maintenant)).toBe('Il y a 3 h');
  });

  it('dit « Hier » plutôt que « Il y a 1 j »', () => {
    expect(momentRelatif('2026-08-23T10:00:00.000Z', maintenant)).toBe('Hier');
  });

  it('bascule sur la date au-delà d’une semaine', () => {
    expect(momentRelatif('2026-08-12T10:00:00.000Z', maintenant)).toBe('12 août');
  });

  it('ne produit jamais de durée négative', () => {
    // Horloge du navigateur en avance sur celle du serveur.
    expect(momentRelatif('2026-08-24T12:05:00.000Z', maintenant)).toBe('À l’instant');
  });

  it('rend une chaîne vide sur une date illisible', () => {
    expect(momentRelatif('jamais', maintenant)).toBe('');
  });
});

describe('versUI', () => {
  const maintenant = new Date('2026-08-24T12:00:00.000Z');

  it('reprend le titre et le corps du serveur sans les réécrire', () => {
    const ui = versUI(notif({ title: 'Acompte reçu', body: '10 000 F' }), maintenant);
    expect(ui.titre).toBe('Acompte reçu');
    expect(ui.corps).toBe('10 000 F');
  });

  it('déduit l’état lu de readAt', () => {
    expect(versUI(notif({ readAt: null }), maintenant).lue).toBe(false);
    expect(versUI(notif({ readAt: '2026-08-24T11:00:00.000Z' }), maintenant).lue).toBe(true);
  });

  it('n’ajoute une action que lorsqu’une cible existe', () => {
    const sans = versUI(notif({ data: { orderId: 'x' } }), maintenant);
    expect(sans.action).toBeUndefined();
    expect(sans.href).toBeUndefined();

    const avec = versUI(notif({ data: { commandeId: 'c1' } }), maintenant);
    expect(avec.action).toBe('Voir la commande');
    expect(avec.href).toBe('/commandes/c1');
  });

  const alerte = notif({
    type: 'LIVRAISON_DEMAIN',
    title: 'Livraison demain — Mariam C.',
    body: 'Robe wax (#007) est attendue demain.',
    data: { commandeId: 'c1', reference: '#007', client: 'Mariam C.', tenue: 'Robe wax' },
  });

  it('rejoue la phrase dans la langue du lecteur', () => {
    const ui = versUI(alerte, maintenant, 'en');
    expect(ui.titre).toBe('Delivery tomorrow — Mariam C.');
    expect(ui.corps).toBe('Robe wax (#007) is expected tomorrow.');
  });

  it('garde la phrase du serveur quand les éléments manquent', () => {
    // Cas des notifications écrites avant que le serveur ne range les éléments
    // dans `data` : mieux vaut une phrase française qu'une ligne vide.
    const ancienne = notif({
      type: 'LIVRAISON_DEMAIN',
      title: 'Livraison demain — Mariam C.',
      body: 'Robe wax (#007) est attendue demain.',
      data: { commandeId: 'c1', sequence: 7 },
    });
    const ui = versUI(ancienne, maintenant, 'en');
    expect(ui.titre).toBe('Livraison demain — Mariam C.');
    expect(ui.corps).toBe('Robe wax (#007) est attendue demain.');
  });

  it('formate l’échéance d’un retard dans la langue demandée', () => {
    const retard = notif({
      type: 'COMMANDE_EN_RETARD',
      title: 'Commande #007 en retard — Mariam C.',
      body: 'Robe wax devait être livrée le 20 août.',
      data: {
        commandeId: 'c1',
        reference: '#007',
        client: 'Mariam C.',
        tenue: 'Robe wax',
        echeance: '2026-08-20T12:00:00.000Z',
      },
    });
    expect(versUI(retard, maintenant, 'en').corps).toBe(
      'Robe wax was due for delivery on 20 August.',
    );
  });
});
