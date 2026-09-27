// Logo de l'atelier.
//
// Le logo est chargé par un `<img src>` sur chaque écran : accepter une
// adresse quelconque ferait partir une requête vers un tiers à chaque
// affichage. On n'accepte donc que le stockage où la route d'envoi écrit.
import { describe, it, expect } from 'vitest';
import { estUrlLogo, validerLogo } from './logo-atelier';

const VRAIE = 'https://res.cloudinary.com/demo/image/upload/v1/abc/def.png';

describe('estUrlLogo', () => {
  it('accepte une URL de livraison du stockage', () => {
    expect(estUrlLogo(VRAIE)).toBe(true);
  });

  it('refuse un autre hôte', () => {
    expect(estUrlLogo('https://exemple.net/logo.png')).toBe(false);
  });

  it('refuse un sous-domaine qui ressemble', () => {
    // Le piège d'une comparaison de fin de chaîne : ce domaine appartient à
    // exemple.net, pas à Cloudinary.
    expect(estUrlLogo('https://res.cloudinary.com.exemple.net/logo.png')).toBe(false);
  });

  it('refuse le HTTP en clair', () => {
    expect(estUrlLogo('http://res.cloudinary.com/demo/image/upload/a.png')).toBe(false);
  });

  it('refuse les schémas qui ne chargent pas une image distante', () => {
    expect(estUrlLogo('data:image/png;base64,iVBORw0KGgo=')).toBe(false);
    expect(estUrlLogo('javascript:alert(1)')).toBe(false);
    expect(estUrlLogo('blob:https://res.cloudinary.com/abc')).toBe(false);
  });

  it('refuse ce qui n’est pas une URL', () => {
    expect(estUrlLogo('')).toBe(false);
    expect(estUrlLogo('res.cloudinary.com/logo.png')).toBe(false);
  });
});

describe('validerLogo', () => {
  it('laisse passer une URL du stockage', () => {
    expect(validerLogo(VRAIE)).toBeNull();
  });

  it('accepte la chaîne vide — c’est le retrait du logo', () => {
    expect(validerLogo('')).toBeNull();
  });

  it('explique le refus au lieu de rester muet', () => {
    expect(validerLogo('https://exemple.net/logo.png')).toContain('envoi de l’application');
  });
});
