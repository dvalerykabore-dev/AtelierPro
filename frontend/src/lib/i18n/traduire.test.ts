// Moteur de traduction.
//
// La clé est le texte français lui-même : une traduction manquante doit donc
// rendre une phrase lisible, jamais un identifiant. C'est la propriété qui
// permet de traduire l'application écran par écran sans jamais la casser, et
// c'est celle que ces cas verrouillent en premier.
import { describe, it, expect } from 'vitest';
import {
  categorieDe,
  formaterNombre,
  traduire,
  traduirePluriel,
  type Dictionnaire,
} from './traduire';

const EN: Dictionnaire = {
  Enregistrer: 'Save',
  'Reste à payer : {montant}': 'Balance due: {montant}',
  '{n} commandes': { one: '{n} order', other: '{n} orders' },
  Vide: '',
};

describe('traduire', () => {
  it('rend la traduction quand elle existe', () => {
    expect(traduire(EN, 'Enregistrer')).toBe('Save');
  });

  it('rend le français quand la traduction manque', () => {
    // La propriété centrale : un écran non repris reste lisible.
    expect(traduire(EN, 'Nouvelle commande')).toBe('Nouvelle commande');
  });

  it('rend le français sans dictionnaire du tout', () => {
    expect(traduire(null, 'Nouvelle commande')).toBe('Nouvelle commande');
    expect(traduire(undefined, 'Nouvelle commande')).toBe('Nouvelle commande');
  });

  it('traite une entrée vide comme absente', () => {
    // Une chaîne vide dans un dictionnaire est un oubli de traducteur, pas un
    // choix : l'afficher effacerait le texte de l'écran.
    expect(traduire(EN, 'Vide')).toBe('Vide');
  });

  it('interpole les paramètres', () => {
    expect(traduire(EN, 'Reste à payer : {montant}', { montant: '25 000 F' })).toBe(
      'Balance due: 25 000 F',
    );
  });

  it('interpole aussi le repli français', () => {
    // Sinon un écran non traduit afficherait « Bonjour {nom} » en clair.
    expect(traduire(EN, 'Bonjour {nom}', { nom: 'Awa' })).toBe('Bonjour Awa');
  });

  it('laisse le marqueur visible quand le paramètre manque', () => {
    // Visible vaut mieux que silencieux : un trou dans une phrase se remarque
    // à la relecture, une chaîne vide passe inaperçue.
    expect(traduire(EN, 'Bonjour {nom}')).toBe('Bonjour {nom}');
  });

  it('accepte un nombre comme paramètre', () => {
    expect(traduire(EN, 'Il reste {n}', { n: 3 })).toBe('Il reste 3');
  });

  it('prend la forme générique d’une entrée déclinée appelée sans compte', () => {
    expect(traduire(EN, '{n} commandes', { n: 5 })).toBe('5 orders');
  });
});

describe('traduirePluriel', () => {
  const UN = '{n} commande';
  const AUTRE = '{n} commandes';

  it('décline en anglais selon la catégorie', () => {
    expect(traduirePluriel(EN, 'en', UN, AUTRE, 1)).toBe('1 order');
    expect(traduirePluriel(EN, 'en', UN, AUTRE, 5)).toBe('5 orders');
  });

  it('range 0 et 1 au singulier en français', () => {
    // Le français écrit « 0 commande », l'anglais « 0 orders » : la règle est
    // celle de la langue affichée, pas une convention unique.
    expect(traduirePluriel(null, 'fr', UN, AUTRE, 0)).toBe('0 commande');
    expect(traduirePluriel(null, 'fr', UN, AUTRE, 1)).toBe('1 commande');
    expect(traduirePluriel(null, 'fr', UN, AUTRE, 2)).toBe('2 commandes');
  });

  it('met 0 au pluriel en anglais', () => {
    expect(traduirePluriel(EN, 'en', UN, AUTRE, 0)).toBe('0 orders');
  });

  it('couvre les six formes de l’arabe', () => {
    // L'arabe distingue zéro, un, deux, le petit nombre et le grand : un
    // tableau à deux cases aurait produit des phrases fausses.
    const ar: Dictionnaire = {
      '{n} commandes': {
        zero: 'لا توجد طلبات',
        one: 'طلب واحد',
        two: 'طلبان',
        few: '{n} طلبات',
        many: '{n} طلبًا',
        other: '{n} طلب',
      },
    };
    expect(traduirePluriel(ar, 'ar', UN, AUTRE, 0)).toBe('لا توجد طلبات');
    expect(traduirePluriel(ar, 'ar', UN, AUTRE, 1)).toBe('طلب واحد');
    expect(traduirePluriel(ar, 'ar', UN, AUTRE, 2)).toBe('طلبان');
    expect(traduirePluriel(ar, 'ar', UN, AUTRE, 3)).toBe('3 طلبات');
    expect(traduirePluriel(ar, 'ar', UN, AUTRE, 11)).toBe('11 طلبًا');
  });

  it('retombe sur « other » quand la catégorie manque au dictionnaire', () => {
    const partiel: Dictionnaire = { '{n} commandes': { other: '{n} orders' } };
    expect(traduirePluriel(partiel, 'en', UN, AUTRE, 1)).toBe('1 orders');
  });

  it('rend le français correct sans dictionnaire', () => {
    expect(traduirePluriel(null, 'fr', UN, AUTRE, 7)).toBe('7 commandes');
  });

  it('injecte n automatiquement et accepte d’autres paramètres', () => {
    expect(
      traduirePluriel(null, 'fr', '{n} actif sur {total}', '{n} actifs sur {total}', 3, {
        total: 5,
      }),
    ).toBe('3 actifs sur 5');
  });

  it('traite un nombre négatif par sa valeur absolue', () => {
    // « il y a 1 jour » et non « il y a 1 jours ».
    expect(traduirePluriel(null, 'fr', 'il y a {n} jour', 'il y a {n} jours', -1)).toBe(
      'il y a -1 jour',
    );
  });
});

describe('categorieDe', () => {
  it('donne deux catégories aux langues qui en ont deux', () => {
    expect(categorieDe('en', 1)).toBe('one');
    expect(categorieDe('en', 2)).toBe('other');
  });

  it('donne à l’arabe ses catégories propres', () => {
    expect(categorieDe('ar', 0)).toBe('zero');
    expect(categorieDe('ar', 2)).toBe('two');
    expect(categorieDe('ar', 3)).toBe('few');
    expect(categorieDe('ar', 11)).toBe('many');
  });
});

describe('formaterNombre', () => {
  it('groupe les milliers selon la langue', () => {
    expect(formaterNombre(25000, 'fr')).toBe('25 000');
    expect(formaterNombre(25000, 'en')).toBe('25,000');
  });

  it('rend l’arabe en chiffres latins', () => {
    // Un montant en francs CFA doit rester lisible par tout l'atelier, et
    // correspondre à ce qui figure sur la facture.
    expect(formaterNombre(25000, 'ar')).toMatch(/^25[\s,.٬]?000$/);
    expect(formaterNombre(25000, 'ar')).not.toMatch(/[٠-٩]/);
  });

  it('n’utilise pas d’espace insécable', () => {
    // Elles cassent les retours à la ligne et les comparaisons.
    expect(formaterNombre(25000, 'fr')).not.toContain(' ');
  });
});
