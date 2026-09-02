// Ce qu'annonce la pastille de charge, dans la barre haute du tableau de bord.
//
// Elle tient en trois mots et se lit d'un coup d'œil avant de promettre un
// délai à un client au comptoir : chacun de ces mots doit être vrai.
import { describe, it, expect } from 'vitest';
import { libelleBadge } from './CapaciteEquipe';
import { traduirePluriel } from '@/lib/i18n/traduire';

const BASE = { chargement: false, effectif: 3, disponibles: 2, chargeGlobale: 60 };

describe('libelleBadge', () => {
  it('annonce le nombre de places, pas seulement leur existence', () => {
    // « Places disponibles » ne disait pas s'il en restait une ou quatre —
    // c'est pourtant ce qui décide du délai qu'on accepte de promettre.
    const libre = libelleBadge(BASE);
    expect(libre.n).toBe(2);
    expect(libre.cle).toBe('{n} place disponible');
    expect(libre.clePluriel).toBe('{n} places disponibles');
    expect(libre.alerte).toBe(false);
  });

  it('rend la phrase déclinée, singulier compris', () => {
    // L'accord ne se fait plus à la main ici : la fonction rend la paire, le
    // moteur choisit la forme. On vérifie le résultat de bout en bout, parce
    // que c'est lui qui se lit au comptoir.
    const decline = (disponibles: number) => {
      const l = libelleBadge({ ...BASE, disponibles });
      return traduirePluriel(null, 'fr', l.cle, l.clePluriel ?? l.cle, l.n ?? 0);
    };
    expect(decline(1)).toBe('1 place disponible');
    expect(decline(2)).toBe('2 places disponibles');
  });

  it('ne dit JAMAIS qu’il reste de la place quand l’atelier n’a aucun artisan', () => {
    // Le défaut d'origine : la condition de saturation exigeait un effectif non
    // nul, donc un atelier vide tombait dans la branche « il reste de la
    // place ». Personne pour coudre, et la barre haute annonçait des
    // disponibilités.
    const vide = libelleBadge({ chargement: false, effectif: 0, disponibles: 0, chargeGlobale: 0 });
    expect(vide.cle).toBe('Aucun artisan');
    expect(vide.cle).not.toMatch(/disponible/i);
    expect(vide.alerte).toBe(true);
  });

  it('passe en alerte dès 100 % de charge', () => {
    const plein = libelleBadge({ ...BASE, chargeGlobale: 100, disponibles: 0 });
    expect(plein.cle).toBe('Journée saturée');
    expect(plein.alerte).toBe(true);
  });

  it('sature aussi quand plus personne n’a d’heures libres sous les 100 %', () => {
    // Trois artisans à 7 h sur 8 font 87 % de charge globale, et pourtant plus
    // aucun ne peut prendre une tenue d'une journée. La moyenne masque le fait
    // qu'il ne reste que des miettes chez chacun.
    const miettes = libelleBadge({ ...BASE, disponibles: 0, chargeGlobale: 87 });
    expect(miettes.cle).toBe('Journée saturée');
    expect(miettes.alerte).toBe(true);
  });

  it('ne promet rien tant que le calcul n’a pas abouti', () => {
    // Afficher une disponibilité par défaut pendant le chargement ferait
    // annoncer un délai sur un chiffre pas encore lu.
    const attente = libelleBadge({ ...BASE, chargement: true });
    expect(attente.cle).toBe('Calcul…');
    expect(attente.alerte).toBe(false);
  });

  it('le chargement l’emporte sur un effectif encore vide', () => {
    // Au premier rendu l'équipe est vide parce qu'elle n'est pas arrivée, pas
    // parce qu'il n'y a personne : « Aucun artisan » clignoterait à chaque
    // ouverture du tableau de bord.
    expect(
      libelleBadge({ chargement: true, effectif: 0, disponibles: 0, chargeGlobale: 0 }).cle,
    ).toBe('Calcul…');
  });
});
