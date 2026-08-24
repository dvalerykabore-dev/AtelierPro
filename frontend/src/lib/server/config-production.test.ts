import { describe, expect, it } from 'vitest';
import { anomaliesProduction } from './config-production';

/** Environnement de production sans défaut — sert de point de départ à chaque cas. */
function prodSaine(): NodeJS.ProcessEnv {
  return {
    NODE_ENV: 'production',
    APP_URL: 'https://atelierpro.example',
    EMAIL_FROM: 'contact@atelierpro.example',
    AUTH_PROTECTED_PREFIXES: '/dashboard,/commandes',
  } as NodeJS.ProcessEnv;
}

function variables(env: NodeJS.ProcessEnv): string[] {
  return anomaliesProduction(env).map((a) => a.variable);
}

describe('anomaliesProduction — hors production', () => {
  it('ne dit rien en développement, même sur une configuration de dev complète', () => {
    // Localhost et l'expéditeur de test sont la normale en local : les
    // signaler à chaque démarrage apprendrait à ignorer l'avertissement.
    const dev = {
      NODE_ENV: 'development',
      APP_URL: 'http://localhost:3000',
      EMAIL_FROM: 'onboarding@resend.dev',
      NEXT_PUBLIC_ATELIER_DEMO: '1',
    } as NodeJS.ProcessEnv;
    expect(anomaliesProduction(dev)).toEqual([]);
  });

  it('ne dit rien en test', () => {
    expect(anomaliesProduction({ NODE_ENV: 'test' } as NodeJS.ProcessEnv)).toEqual([]);
  });
});

describe('anomaliesProduction — APP_URL', () => {
  it('accepte une URL publique', () => {
    expect(variables(prodSaine())).not.toContain('APP_URL');
  });

  it('refuse localhost et 127.0.0.1', () => {
    expect(variables({ ...prodSaine(), APP_URL: 'http://localhost:3000' })).toContain('APP_URL');
    expect(variables({ ...prodSaine(), APP_URL: 'http://127.0.0.1:3000' })).toContain('APP_URL');
  });

  it('refuse une valeur absente', () => {
    const sans = prodSaine();
    delete sans.APP_URL;
    expect(variables(sans)).toContain('APP_URL');
  });
});

describe('anomaliesProduction — EMAIL_FROM', () => {
  it('accepte un domaine vérifié', () => {
    expect(variables(prodSaine())).not.toContain('EMAIL_FROM');
  });

  it('refuse les expéditeurs de bac à sable', () => {
    // Ils ne délivrent qu'au propriétaire du compte : personne d'autre ne
    // reçoit son code, donc personne ne peut s'inscrire.
    expect(variables({ ...prodSaine(), EMAIL_FROM: 'onboarding@resend.dev' })).toContain(
      'EMAIL_FROM',
    );
    expect(variables({ ...prodSaine(), EMAIL_FROM: 'no-reply@example.com' })).toContain(
      'EMAIL_FROM',
    );
  });

  it('ne se laisse pas berner par un domaine qui contient le suffixe ailleurs', () => {
    expect(
      variables({ ...prodSaine(), EMAIL_FROM: 'contact@resend.dev.atelier.io' }),
    ).not.toContain('EMAIL_FROM');
  });
});

describe('anomaliesProduction — mode démonstration', () => {
  it('signale la variable dès qu’elle est posée, quelle que soit sa valeur', () => {
    expect(variables({ ...prodSaine(), NEXT_PUBLIC_ATELIER_DEMO: '1' })).toContain(
      'NEXT_PUBLIC_ATELIER_DEMO',
    );
    expect(variables({ ...prodSaine(), NEXT_PUBLIC_ATELIER_DEMO: '0' })).toContain(
      'NEXT_PUBLIC_ATELIER_DEMO',
    );
  });

  it('se tait quand elle est absente', () => {
    expect(variables(prodSaine())).not.toContain('NEXT_PUBLIC_ATELIER_DEMO');
  });
});

describe('anomaliesProduction — pages protégées', () => {
  it('signale une liste vide ou en espaces', () => {
    expect(variables({ ...prodSaine(), AUTH_PROTECTED_PREFIXES: '' })).toContain(
      'AUTH_PROTECTED_PREFIXES',
    );
    expect(variables({ ...prodSaine(), AUTH_PROTECTED_PREFIXES: '   ' })).toContain(
      'AUTH_PROTECTED_PREFIXES',
    );
  });
});

describe('anomaliesProduction — forme du rapport', () => {
  it('donne un correctif actionnable pour chaque anomalie', () => {
    const nue = { NODE_ENV: 'production' } as NodeJS.ProcessEnv;
    const anomalies = anomaliesProduction(nue);
    expect(anomalies.length).toBeGreaterThan(0);
    for (const a of anomalies) {
      expect(a.probleme.length).toBeGreaterThan(0);
      // Un avertissement qui ne dit pas quoi faire se relit deux fois puis
      // s'ignore.
      expect(a.correctif.length).toBeGreaterThan(20);
    }
  });

  it('cumule les défauts au lieu de s’arrêter au premier', () => {
    const nue = { NODE_ENV: 'production' } as NodeJS.ProcessEnv;
    expect(variables(nue).sort()).toEqual(['APP_URL', 'AUTH_PROTECTED_PREFIXES', 'EMAIL_FROM']);
  });
});
