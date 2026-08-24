import { describe, expect, it } from 'vitest';
import { initialesAtelierDe, nomAtelierDe, NOM_ATELIER_DEFAUT } from '@/lib/atelier-identite';

describe('nomAtelierDe', () => {
  it('rend le nom renseigné par le compte', () => {
    expect(nomAtelierDe({ workshopName: 'Atelier Zongo', email: 'a@b.co' })).toBe('Atelier Zongo');
  });

  it('retombe sur un nom neutre quand rien n’est renseigné', () => {
    expect(nomAtelierDe({ workshopName: null, email: 'a@b.co' })).toBe(NOM_ATELIER_DEFAUT);
    expect(nomAtelierDe({ workshopName: '   ', email: 'a@b.co' })).toBe(NOM_ATELIER_DEFAUT);
    expect(nomAtelierDe(null)).toBe(NOM_ATELIER_DEFAUT);
  });

  it('n’affiche jamais l’adresse e-mail', () => {
    // Un sous-titre de trésorerie exposerait l'adresse à qui regarde
    // par-dessus l'épaule, en atelier.
    expect(nomAtelierDe({ workshopName: null, email: 'valery@example.com' })).not.toContain('@');
  });
});

describe('initialesAtelierDe', () => {
  it('prend la première lettre des deux premiers mots du nom', () => {
    expect(initialesAtelierDe({ workshopName: 'Atelier Zongo', email: 'a@b.co' })).toBe('AZ');
  });

  it('garde deux lettres sur un nom en un seul mot', () => {
    expect(initialesAtelierDe({ workshopName: 'Couture', email: 'a@b.co' })).toBe('CO');
  });

  it('se rabat sur l’adresse quand le nom manque', () => {
    expect(initialesAtelierDe({ workshopName: null, email: 'valery@example.com' })).toBe('VA');
  });

  it('n’emprunte les initiales de personne quand rien n’est chargé', () => {
    expect(initialesAtelierDe(null)).toBe('··');
    expect(initialesAtelierDe({ workshopName: null, email: '' })).toBe('··');
  });
});
