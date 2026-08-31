// Fil d'étapes du formulaire de nouvelle commande.
//
// Il affichait « Client ✓ · Modèle ✓ · Mesures (en cours) · Planning » sur un
// formulaire vierge, et n'avait jamais bougé : les états venaient du jeu
// d'exemple et l'étape courante était figée au numéro 3.
import { describe, it, expect } from 'vitest';
import { etapesDe } from './etapes-commande';

const RIEN = { client: false, modele: false, mesures: false, planning: false };
const TOUT = { client: true, modele: true, mesures: true, planning: true };

describe('etapesDe', () => {
  it('rend les quatre étapes dans l’ordre', () => {
    expect(etapesDe(RIEN).map((e) => e.label)).toEqual(['Client', 'Modèle', 'Mesures', 'Planning']);
  });

  it('ne coche rien sur un formulaire vierge', () => {
    // Le défaut d'origine : deux étapes s'affichaient terminées d'emblée.
    expect(etapesDe(RIEN).every((e) => !e.terminee)).toBe(true);
  });

  it('rend active la PREMIÈRE étape non terminée', () => {
    // Et non un numéro fixe : c'est elle qui indique où reprendre.
    expect(etapesDe(RIEN).find((e) => e.active)?.label).toBe('Client');
    expect(etapesDe({ ...RIEN, client: true }).find((e) => e.active)?.label).toBe('Modèle');
  });

  it('saute par-dessus une étape déjà faite pour désigner celle qui manque', () => {
    // On peut renseigner la date avant les mesures : l'étape active doit
    // pointer ce qui reste, pas suivre un ordre imposé.
    const etat = { client: true, modele: true, mesures: false, planning: true };
    expect(etapesDe(etat).find((e) => e.active)?.label).toBe('Mesures');
  });

  it('n’a plus aucune étape active quand tout est fait', () => {
    // L'absence de repère marque que le formulaire est complet ; garder une
    // étape allumée laisserait croire qu'il reste quelque chose à saisir.
    expect(etapesDe(TOUT).some((e) => e.active)).toBe(false);
    expect(etapesDe(TOUT).every((e) => e.terminee)).toBe(true);
  });

  it('reflète exactement l’état fourni', () => {
    const etat = { client: true, modele: false, mesures: true, planning: false };
    expect(etapesDe(etat).map((e) => e.terminee)).toEqual([true, false, true, false]);
  });
});
