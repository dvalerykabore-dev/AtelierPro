'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { PAYS, drapeau, nomPays, paysDe, valider } from '@/lib/indicatifs';
import {
  choisirPays as transitionPays,
  etatInitial,
  resynchroniser,
  taper as transitionFrappe,
} from '@/lib/champ-telephone-etat';
import { useLangue } from '@/contexts/LangueContext';
import { cn } from '@/lib/utils';

export interface ChampTelephoneProps {
  label: string;
  /** Numéro international complet — `+22670123456` — ou chaîne vide. */
  valeur: string;
  /** Reçoit le numéro international recomposé à chaque frappe. */
  onChange: (valeur: string) => void;
  /** Texte sous le champ. Un défaut est fourni si absent. */
  aide?: string;
  /** Affiche l'erreur de longueur pendant la saisie. Sinon, au moment d'enregistrer. */
  erreur?: string | undefined;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Indicatif au menu déroulant, numéro à côté.
 *
 * Le pays et le numéro tapé sont tenus ICI, en état local, et non déduits de la
 * valeur remontée. La première version les déduisait, et deux choses ne
 * marchaient pas — les deux invisibles à la relecture du code, évidentes dès
 * qu'on se sert du champ :
 *
 *   - choisir un pays AVANT de taper le numéro ne tenait pas. Sans chiffres,
 *     `composer` rend une chaîne vide ; le pays n'avait nulle part où vivre et
 *     le menu retombait aussitôt sur le Burkina. C'est pourtant l'ordre naturel :
 *     on déroule l'indicatif, puis on tape.
 *   - le zéro de tête disparaissait sous les doigts. En France il est retiré à
 *     la composition, donc taper « 0 » ne produisait rien à l'écran.
 *
 * La valeur remontée reste le numéro international normalisé ; ce que l'on
 * affiche est ce que la personne a tapé. Les deux ne coïncident pas toujours,
 * et c'est le but.
 *
 * `<select>` natif volontairement : liste système sur téléphone, navigation aux
 * flèches, sans une ligne d'ARIA à maintenir.
 */
export default function ChampTelephone({
  label,
  valeur,
  onChange,
  aide,
  erreur,
  required,
  autoFocus,
  className,
}: ChampTelephoneProps) {
  const { t, langue } = useLangue();
  const id = useId();
  const idAide = `${id}-aide`;

  // L'état de départ ne se recalcule pas : la suite est pilotée par les
  // transitions, et repartir de `valeur` à chaque rendu ramènerait le défaut.
  const [etat, setEtat] = useState(useRef(etatInitial(valeur)).current);

  /**
   * La valeur a changé côté formulaire — arrivée du serveur, ou remise à zéro
   * après enregistrement. `resynchroniser` rend `null` quand il n'y a rien à
   * faire, ce qui est le cas de chaque frappe.
   */
  useEffect(() => {
    setEtat((courant) => resynchroniser(valeur, courant) ?? courant);
  }, [valeur]);

  function appliquer(t: { etat: typeof etat; valeur: string }) {
    setEtat(t.etat);
    onChange(t.valeur);
  }

  const pays = paysDe(etat.codePays);
  const probleme = erreur ?? valider(etat.codePays, etat.saisie);
  const aAfficher = probleme && etat.saisie.trim() !== '' ? probleme : null;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-muted-foreground text-xs">
        {label}
      </label>

      <div
        className={cn(
          'bg-input border-border focus-within:border-primary flex overflow-hidden rounded-md border transition-colors',
          aAfficher && 'border-danger',
        )}
      >
        {/*
          Drapeau + indicatif, sans le nom du pays.
          L'indicatif reste écrit : sous Windows, qui ne livre pas les glyphes
          de drapeau, la paire de lettres s'affiche telle quelle (« BF ») et la
          ligne doit rester lisible sans lui.
        */}
        <select
          aria-label={t('Indicatif du pays')}
          value={etat.codePays}
          onChange={(e) => appliquer(transitionPays(e.target.value, etat))}
          className="text-foreground border-border w-[6.5rem] flex-shrink-0 border-r bg-transparent py-2.5 pr-1 pl-3 text-sm focus:outline-none"
        >
          {PAYS.map((p) => (
            <option key={p.code} value={p.code}>
              {drapeau(p.code)} +{p.indicatif}
            </option>
          ))}
        </select>

        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          autoFocus={autoFocus}
          aria-invalid={aAfficher ? true : undefined}
          aria-describedby={idAide}
          placeholder={pays?.exemple ?? ''}
          value={etat.saisie}
          onChange={(e) => appliquer(transitionFrappe(e.target.value, etat))}
          className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none"
        />
      </div>

      {/*
        Le nom du pays a quitté la liste : il se lit ici. Sans lui, on ne sait
        plus lequel on a sélectionné dès que le drapeau ne s'affiche pas, ou
        qu'on hésite entre deux drapeaux voisins.
      */}
      <p id={idAide} className={cn('text-xs', aAfficher ? 'text-danger' : 'text-muted-foreground')}>
        {/* `valider` compose en français, comme le serveur : la phrase reste la
            clé, et c'est ici — au moment de l'afficher — qu'on la traduit. */}
        {(aAfficher !== null ? t(aAfficher) : null) ?? (
          <>
            {pays && (
              <span className="text-foreground font-medium">{nomPays(pays.code, langue)}</span>
            )}
            {pays && ' — '}
            {aide ??
              (pays
                ? t('exemple : {exemple}', { exemple: pays.exemple })
                : t('Choisissez un pays.'))}
          </>
        )}
      </p>
    </div>
  );
}
