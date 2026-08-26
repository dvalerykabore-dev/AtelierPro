'use client';

import { useId, useMemo } from 'react';
import { PAYS, PAYS_DEFAUT, composer, decomposer, paysDe, valider } from '@/lib/indicatifs';
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
 * Le champ précédent était un `<input type="tel">` libre où l'on tapait ce
 * qu'on voulait : on y trouve aujourd'hui « 752000 » aussi bien que
 * « +226 70 12 34 56 ». Un numéro sans indicatif ne se compose pas depuis
 * l'étranger et ouvre un lien WhatsApp mort — or c'est par là que l'atelier
 * prévient un client que sa tenue est prête.
 *
 * `<select>` natif volontairement : il descend en liste système sur téléphone,
 * se navigue aux flèches et se cherche en tapant les premières lettres, sans
 * une ligne de code ARIA à maintenir. Une liste déroulante maison ferait moins
 * bien pour beaucoup plus cher.
 *
 * La valeur remontée est toujours le numéro international complet ; le
 * découpage pays/national ne vit que le temps de l'affichage.
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
  const id = useId();
  const idAide = `${id}-aide`;

  const { codePays, national } = useMemo(() => decomposer(valeur, PAYS_DEFAUT), [valeur]);
  const pays = paysDe(codePays);

  // Erreur imposée par l'appelant, sinon celle que la longueur révèle.
  const probleme = erreur ?? valider(codePays, national);
  const aAfficher = probleme && national !== '' ? probleme : null;

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
        <select
          aria-label="Indicatif du pays"
          value={codePays}
          onChange={(e) => onChange(composer(e.target.value, national))}
          className="text-foreground border-border max-w-[9.5rem] border-r bg-transparent py-2.5 pr-1 pl-3 text-sm focus:outline-none"
        >
          {PAYS.map((p) => (
            <option key={p.code} value={p.code}>
              +{p.indicatif} {p.nom}
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
          value={national}
          onChange={(e) => onChange(composer(codePays, e.target.value))}
          className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none"
        />
      </div>

      <p id={idAide} className={cn('text-xs', aAfficher ? 'text-danger' : 'text-muted-foreground')}>
        {aAfficher ??
          aide ??
          (pays ? `Sans le 0 de tête — exemple : ${pays.exemple}.` : 'Choisissez un pays.')}
      </p>
    </div>
  );
}
