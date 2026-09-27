'use client';

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

/** Habillage commun aux champs — reprend `bg-input` + `border-border` des maquettes. */
const CHAMP =
  'bg-input border-border text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none disabled:opacity-50';

interface Commun {
  label: string;
  /**
   * Message d'erreur — colore la bordure et s'annonce aux lecteurs d'écran.
   *
   * `| undefined` explicite : le projet active `exactOptionalPropertyTypes`,
   * qui distingue « prop absente » de « prop passée à undefined ». Sans cela,
   * l'écriture naturelle `erreur={condition ? 'msg' : undefined}` est rejetée.
   */
  erreur?: string | undefined;
  /** Texte d'aide affiché sous le champ. */
  aide?: ReactNode | undefined;
}

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>, Commun {}

export function Field({ label, erreur, aide, className, ...props }: FieldProps) {
  const id = useId();
  const idAide = `${id}-aide`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-muted-foreground text-xs">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={erreur || aide ? idAide : undefined}
        className={cn(CHAMP, erreur && 'border-danger', className)}
        {...props}
      />
      {(erreur || aide) && (
        <p id={idAide} className={cn('text-xs', erreur ? 'text-danger' : 'text-muted-foreground')}>
          {erreur ?? aide}
        </p>
      )}
    </div>
  );
}

export interface TextareaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>, Commun {}

export function TextareaField({ label, erreur, aide, className, ...props }: TextareaFieldProps) {
  const id = useId();
  const idAide = `${id}-aide`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-muted-foreground text-xs">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={erreur || aide ? idAide : undefined}
        className={cn(CHAMP, 'min-h-24 resize-y', erreur && 'border-danger', className)}
        {...props}
      />
      {(erreur || aide) && (
        <p id={idAide} className={cn('text-xs', erreur ? 'text-danger' : 'text-muted-foreground')}>
          {erreur ?? aide}
        </p>
      )}
    </div>
  );
}

export interface SelectFieldProps
  extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'id'>, Commun {
  children: ReactNode;
}

export function SelectField({
  label,
  erreur,
  aide,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const id = useId();
  const idAide = `${id}-aide`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-muted-foreground text-xs">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={erreur || aide ? idAide : undefined}
        className={cn(CHAMP, erreur && 'border-danger', className)}
        {...props}
      >
        {children}
      </select>
      {(erreur || aide) && (
        <p id={idAide} className={cn('text-xs', erreur ? 'text-danger' : 'text-muted-foreground')}>
          {erreur ?? aide}
        </p>
      )}
    </div>
  );
}
