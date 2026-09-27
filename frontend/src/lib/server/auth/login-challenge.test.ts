// Cycle de vie du code de connexion.
//
// C'est ici que vivent les invariants qui font qu'un second facteur en est un :
// usage unique, expiration, invalidation des codes précédents, et le garde de
// concurrence sans lequel un code à usage unique en devient un à double usage.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '@/test-utils/prisma-mock';
import { ouvrirDefi, consommerDefi, TYPE_DEFI, TTL_MS, MAX_TENTATIVES } from './login-challenge';

const MAINTENANT = new Date('2026-08-25T10:00:00.000Z');
const CODE = 'ABCD2345';

function ligneDefi(surcharge: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'vc1',
    code: CODE,
    expiresAt: new Date(MAINTENANT.getTime() + TTL_MS),
    attempts: 0,
    ...surcharge,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.verificationCode.updateMany.mockResolvedValue({ count: 1 } as never);
  prismaMock.verificationCode.create.mockResolvedValue({ id: 'vc1' } as never);
  prismaMock.verificationCode.findFirst.mockResolvedValue(ligneDefi() as never);
});

describe('ouvrirDefi', () => {
  it('invalide les codes précédents AVANT d’en créer un nouveau', async () => {
    // L'ordre compte : invalider après création effacerait le code qu'on vient
    // d'émettre, et plus personne ne pourrait se connecter.
    const ordre: string[] = [];
    prismaMock.verificationCode.updateMany.mockImplementation((() => {
      ordre.push('invalidation');
      return Promise.resolve({ count: 2 });
    }) as never);
    prismaMock.verificationCode.create.mockImplementation((() => {
      ordre.push('creation');
      return Promise.resolve({ id: 'vc1' });
    }) as never);

    await ouvrirDefi(prismaMock, 'u1', MAINTENANT);

    expect(ordre).toEqual(['invalidation', 'creation']);
  });

  it('n’invalide que les codes de connexion de cet utilisateur', async () => {
    // Emporter les codes de vérification d'e-mail ou de réinitialisation
    // casserait deux autres parcours, et le lien serait difficile à faire.
    await ouvrirDefi(prismaMock, 'u1', MAINTENANT);

    expect(prismaMock.verificationCode.updateMany).toHaveBeenCalledWith({
      where: { userId: 'u1', type: TYPE_DEFI, usedAt: null },
      data: { usedAt: MAINTENANT },
    });
  });

  it('rend un code de 8 caractères sans I, L, O ni 0 ni 1', async () => {
    // L'alphabet évite les caractères qu'on confond en recopiant depuis un
    // e-mail sur un téléphone, en atelier.
    const { code } = await ouvrirDefi(prismaMock, 'u1', MAINTENANT);
    expect(code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/);
  });

  it('date l’expiration depuis l’instant fourni', async () => {
    const { expiresAt } = await ouvrirDefi(prismaMock, 'u1', MAINTENANT);
    expect(expiresAt.getTime()).toBe(MAINTENANT.getTime() + TTL_MS);
  });

  it('expire plus vite qu’un code d’inscription — on est devant l’écran', () => {
    const ttlVerification = Number(process.env.AUTH_VERIFICATION_TTL_MIN ?? 15) * 60 * 1000;
    expect(TTL_MS).toBeLessThanOrEqual(ttlVerification);
  });

  it('enregistre le code sous son type propre', async () => {
    await ouvrirDefi(prismaMock, 'u1', MAINTENANT);
    expect(prismaMock.verificationCode.create.mock.calls[0]?.[0]?.data).toMatchObject({
      userId: 'u1',
      type: TYPE_DEFI,
    });
  });
});

describe('consommerDefi', () => {
  it('accepte un code valide et le marque consommé', async () => {
    const r = await consommerDefi(prismaMock, 'u1', CODE, MAINTENANT);

    expect(r).toEqual({ ok: true });
    expect(prismaMock.verificationCode.updateMany).toHaveBeenCalledWith({
      where: { id: 'vc1', usedAt: null },
      data: { usedAt: MAINTENANT },
    });
  });

  it('cherche le code sur le bon type — un code d’inscription n’ouvre pas de session', async () => {
    await consommerDefi(prismaMock, 'u1', CODE, MAINTENANT);

    expect(prismaMock.verificationCode.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'u1', code: CODE, type: TYPE_DEFI, usedAt: null },
      }),
    );
  });

  it('refuse un code inconnu', async () => {
    prismaMock.verificationCode.findFirst.mockResolvedValue(null as never);

    const r = await consommerDefi(prismaMock, 'u1', 'ZZZZ9999', MAINTENANT);

    expect(r).toEqual({ ok: false, motif: 'INVALIDE' });
  });

  it('compte la tentative même sur un code inconnu', async () => {
    // Sans cela, essayer 10 000 codes faux ne coûterait rien : chaque essai
    // sortirait par la branche « inconnu » et le compteur resterait à zéro.
    prismaMock.verificationCode.findFirst.mockResolvedValue(null as never);

    await consommerDefi(prismaMock, 'u1', 'ZZZZ9999', MAINTENANT);

    expect(prismaMock.verificationCode.updateMany).toHaveBeenCalledWith({
      where: { userId: 'u1', type: TYPE_DEFI, usedAt: null },
      data: { attempts: { increment: 1 } },
    });
  });

  it('refuse un code expiré, et le distingue d’un code faux', async () => {
    // La différence est utile à l'écran : « demandez-en un nouveau » plutôt que
    // « vérifiez votre saisie », qui ferait recompter les caractères pour rien.
    prismaMock.verificationCode.findFirst.mockResolvedValue(
      ligneDefi({ expiresAt: new Date(MAINTENANT.getTime() - 1) }) as never,
    );

    const r = await consommerDefi(prismaMock, 'u1', CODE, MAINTENANT);

    expect(r).toEqual({ ok: false, motif: 'EXPIRE' });
  });

  it('n’ouvre pas la session sur un code expiré', async () => {
    prismaMock.verificationCode.findFirst.mockResolvedValue(
      ligneDefi({ expiresAt: new Date(MAINTENANT.getTime() - 1) }) as never,
    );

    await consommerDefi(prismaMock, 'u1', CODE, MAINTENANT);

    expect(prismaMock.verificationCode.updateMany).not.toHaveBeenCalledWith(
      expect.objectContaining({ data: { usedAt: MAINTENANT } }),
    );
  });

  it('brûle le code au-delà des tentatives tolérées', async () => {
    prismaMock.verificationCode.findFirst.mockResolvedValue(
      ligneDefi({ attempts: MAX_TENTATIVES }) as never,
    );

    const r = await consommerDefi(prismaMock, 'u1', CODE, MAINTENANT);

    expect(r).toEqual({ ok: false, motif: 'TROP_DE_TENTATIVES' });
    // Brûlé veut dire consommé : même la bonne saisie ne le rouvre plus.
    expect(prismaMock.verificationCode.updateMany).toHaveBeenCalledWith({
      where: { id: 'vc1', usedAt: null },
      data: { usedAt: MAINTENANT },
    });
  });

  it('refuse quand une requête concurrente a consommé le code la première', async () => {
    // La lecture puis l'écriture ne sont pas atomiques : deux requêtes portant
    // le même code passent toutes deux le `findFirst`. Le garde `usedAt: null`
    // dans l'`updateMany` fait que la seconde ne touche aucune ligne — sans
    // lui, un code à usage unique en devient un à double usage.
    prismaMock.verificationCode.updateMany.mockResolvedValue({ count: 0 } as never);

    const r = await consommerDefi(prismaMock, 'u1', CODE, MAINTENANT);

    expect(r).toEqual({ ok: false, motif: 'INVALIDE' });
  });

  it('ne cherche jamais un code déjà consommé', async () => {
    // `usedAt: null` dans la clause : c'est ce qui rend l'usage unique effectif
    // et ce qui fait qu'un code remplacé ne fonctionne plus.
    await consommerDefi(prismaMock, 'u1', CODE, MAINTENANT);

    const where = prismaMock.verificationCode.findFirst.mock.calls[0]?.[0]?.where;
    expect(where).toMatchObject({ usedAt: null });
  });
});
