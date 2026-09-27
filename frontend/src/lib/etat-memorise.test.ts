import { describe, expect, it, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { valeurInitiale, resoudre } from './etat-memorise';
import { getCache, setCache, invalidateCachePrefix } from './useApi';

describe('valeurInitiale', () => {
  it('part du défaut, à froid, quand le cache est vide', () => {
    expect(valeurInitiale<number[]>(null, [])).toEqual({ valeur: [], demarreChaud: false });
  });

  it('part de la valeur en cache, à chaud', () => {
    // C'est tout l'objet : au retour sur un écran, le contenu est là avant
    // qu'une requête soit partie.
    expect(valeurInitiale([1, 2], [])).toEqual({ valeur: [1, 2], demarreChaud: true });
  });

  it('traite un tableau vide en cache comme une vraie valeur, pas comme une absence', () => {
    // Un atelier sans aucune commande a légitimement une liste vide. La
    // confondre avec « rien en cache » lui remettrait un squelette à chaque
    // visite — précisément l'atelier qui débute, celui qu'on veut convaincre.
    expect(valeurInitiale<number[]>([], [0])).toEqual({ valeur: [], demarreChaud: true });
  });
});

describe('resoudre', () => {
  it('rend la valeur telle quelle', () => {
    expect(resoudre(5, 1)).toBe(5);
  });

  it('applique la forme fonctionnelle au précédent', () => {
    expect(resoudre((p: number) => p + 1, 41)).toBe(42);
  });

  it('enchaîne deux applications sans repasser par un rendu', () => {
    // Les bascules optimistes posent deux fois de suite : l'écriture puis son
    // annulation en cas d'échec. La seconde doit voir la première.
    let v = 0;
    v = resoudre((p: number) => p + 1, v);
    v = resoudre((p: number) => p + 1, v);
    expect(v).toBe(2);
  });
});

describe('contrat avec le cache de useApi', () => {
  beforeEach(() => invalidateCachePrefix('/api/'));

  it('une valeur écrite se relit à l’identique', () => {
    setCache('/api/clients', [{ id: 'c1' }]);
    expect(valeurInitiale(getCache('/api/clients'), [])).toEqual({
      valeur: [{ id: 'c1' }],
      demarreChaud: true,
    });
  });

  it('la déconnexion efface l’état mémorisé', () => {
    // Garde de confidentialité : un poste d'atelier est partagé. Si cette
    // assertion tombe, le compte suivant voit les clients du précédent.
    setCache('/api/clients', [{ id: 'c1' }]);
    invalidateCachePrefix('/api/');
    expect(valeurInitiale(getCache('/api/clients'), [])).toEqual({
      valeur: [],
      demarreChaud: false,
    });
  });

  it('deux clés ne se mélangent pas', () => {
    setCache('/api/a', 'valeur-a');
    setCache('/api/b', 'valeur-b');
    expect(getCache('/api/a')).toBe('valeur-a');
    expect(getCache('/api/b')).toBe('valeur-b');
  });
});

describe('garde-fou : toutes les clés sont sous /api/', () => {
  it('aucun appel n’utilise une clé qui survivrait à la déconnexion', () => {
    // `invalidateCachePrefix('/api/')` est la seule chose qui vide ce cache à la
    // déconnexion. Une clé hors préfixe n'est pas un défaut d'affichage, c'est
    // une fuite entre deux comptes sur la même machine.
    const racine = path.resolve(__dirname, '..');
    const fichiers: string[] = [];
    const parcourir = (dir: string): void => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) parcourir(p);
        else if (/\.tsx?$/.test(e.name) && !e.name.includes('.test.')) fichiers.push(p);
      }
    };
    parcourir(racine);

    const fautifs: string[] = [];
    for (const f of fichiers) {
      const src = fs.readFileSync(f, 'utf8');
      for (const m of src.matchAll(/useEtatMemorise(?:<[^>]*>)?\(\s*(['"`])([^'"`]*)\1/g)) {
        if (!m[2]?.startsWith('/api/')) fautifs.push(`${path.basename(f)} → « ${m[2]} »`);
      }
    }
    expect(fautifs).toEqual([]);
  });
});
