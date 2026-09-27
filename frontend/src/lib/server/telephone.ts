import 'server-only';
import { z } from 'zod';
import { validerInternational } from '@/lib/indicatifs';

/**
 * Numéro de téléphone tel qu'il s'enregistre : international, sans espaces.
 *
 * Le même jugement qu'à l'écran, par le même module — un numéro accepté par le
 * formulaire ne doit pas être refusé par la route, sinon on retape sans
 * comprendre. La route reste nécessaire malgré tout : rien ne garantit que la
 * requête vienne du formulaire.
 *
 * La chaîne vide est valide et signifie « pas de numéro ». Tous les clients
 * n'en laissent pas un, et refuser la fiche entière pour ça ferait perdre le
 * nom et les mesures avec.
 */
export const zTelephone = z
  .string()
  .trim()
  .max(24)
  .refine((v) => validerInternational(v) === null, {
    message: 'Numéro de téléphone invalide.',
  });
