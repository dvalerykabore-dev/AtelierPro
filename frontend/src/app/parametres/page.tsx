import type { Metadata } from 'next';
import AppShell from '@/components/atelier/AppShell';
import Parametres from '@/components/atelier/Parametres';
import { atelier } from '@/lib/mock/atelier';

export const metadata: Metadata = {
  title: 'Paramètres — AtelierPro',
};

/**
 * Coquille des paramètres.
 *
 * La barre haute portait un « Enregistrer les modifications » sans gestionnaire.
 * Il n'a pas été recâblé mais retiré : l'écran n'a rien à enregistrer en bloc.
 * Chaque réglage part au serveur au moment où on le pose — le nom de l'atelier
 * a son propre bouton, les artisans, les tarifs et les rappels s'écrivent à
 * l'interaction. Un bouton d'enregistrement global laisserait croire l'inverse,
 * c'est-à-dire qu'il faut le presser pour ne rien perdre, et on fermerait
 * l'onglet en croyant avoir perdu ce qui était déjà en base.
 */
export default function ParametresPage() {
  return (
    <AppShell titre="Paramètres" sousTitre={atelier.nom}>
      <Parametres />
    </AppShell>
  );
}
