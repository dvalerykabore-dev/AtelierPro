import type { Dictionnaire } from '@/lib/i18n/traduire';
import type { Langue } from '@/lib/langue';
import { en } from '@/lib/i18n/en';
import { es } from '@/lib/i18n/es';
import { pt } from '@/lib/i18n/pt';
import { ar } from '@/lib/i18n/ar';

/**
 * Dictionnaires par langue.
 *
 * Le français n'en a pas : ses clés SONT ses phrases, donc traduire vers le
 * français revient à rendre la clé. C'est le repli naturel du moteur, et ça
 * évite un fichier de 1 000 lignes où chaque entrée se recopie elle-même — un
 * fichier que personne ne relit et qui finit par diverger du code.
 *
 * Import statique et non dynamique : un `import()` ferait apparaître l'écran
 * en français pendant le chargement du dictionnaire, à chaque navigation. Le
 * texte pèse quelques dizaines de kilo-octets une fois compressé, ce qui ne
 * justifie pas ce clignotement.
 */
export const DICTIONNAIRES: Record<Langue, Dictionnaire | null> = {
  fr: null,
  en,
  es,
  pt,
  ar,
};
