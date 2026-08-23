'use client';

import { useState, type FormEvent } from 'react';
import { Check, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Field, SelectField } from '@/components/ui/Field';
import { paiements as paiementsInitiaux, type Paiement } from '@/lib/mock/atelier';
import { cn, formatPrice } from '@/lib/utils';

const MODES = ['Mobile Money', 'Espèces', 'Virement', 'Carte'] as const;

/**
 * Suivi des encaissements d'une commande.
 *
 * La maquette Banani affiche le bouton « Enregistrer paiement » sans écran de
 * destination : la fenêtre de saisie est déduite du reste du système.
 */
export default function PaiementsCommande() {
  const [paiements, setPaiements] = useState<Paiement[]>(paiementsInitiaux);
  const [ouvert, setOuvert] = useState(false);
  const [montant, setMontant] = useState('');
  const [mode, setMode] = useState<string>(MODES[0]);

  const total = paiements.reduce((s, p) => s + p.montant, 0);
  const encaisse = paiements.filter((p) => p.regle).reduce((s, p) => s + p.montant, 0);
  const pourcentage = total > 0 ? Math.round((encaisse / total) * 100) : 0;
  const restant = total - encaisse;

  function enregistrer(e: FormEvent) {
    e.preventDefault();
    const valeur = Number.parseInt(montant, 10);
    if (Number.isNaN(valeur) || valeur <= 0) return;

    setPaiements((prec) => {
      // Un encaissement couvrant tout le solde règle la ligne « Solde restant »
      // au lieu d'ajouter une ligne en double.
      const solde = prec.find((p) => !p.regle);
      if (solde && valeur >= solde.montant) {
        return prec.map((p) =>
          p === solde ? { ...p, regle: true, mode, date: "Aujourd'hui" } : p,
        );
      }
      return [
        ...prec,
        {
          label: 'Versement complémentaire',
          montant: valeur,
          date: "Aujourd'hui",
          mode,
          regle: true,
        },
      ];
    });

    setMontant('');
    setOuvert(false);
  }

  return (
    <section className="border-border border-b px-4 py-5 lg:px-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-headings text-foreground text-sm font-bold">Paiements</h2>
        <span className="text-muted-foreground text-xs">{formatPrice(total, 'F')} total</span>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Encaissé</span>
          <span className="text-success text-xs font-medium">{formatPrice(encaisse, 'F')}</span>
        </div>
        <div
          className="bg-border h-2 overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={pourcentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Part du montant encaissée"
        >
          <div className="bg-success h-full rounded-full" style={{ width: `${pourcentage}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {paiements.map((p, i) => (
          <div
            key={`${p.label}-${i}`}
            className={cn(
              'border-border flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5',
              p.regle ? 'bg-surface' : 'bg-muted',
            )}
          >
            <div className="min-w-0">
              <div className="text-foreground text-xs font-medium">{p.label}</div>
              <div className="text-muted-foreground text-xs">
                {p.date} · {p.mode}
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-1">
              <span className="text-foreground text-sm font-bold">
                {formatPrice(p.montant, 'F')}
              </span>
              {p.regle ? (
                <span className="text-success flex items-center gap-1 text-xs font-medium">
                  <Check size={10} aria-hidden />
                  Payé
                </span>
              ) : (
                <span className="text-muted-foreground text-xs">En attente</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        variante="contour"
        taille="sm"
        pleineLargeur
        className="mt-3"
        onClick={() => {
          setMontant(restant > 0 ? String(restant) : '');
          setOuvert(true);
        }}
      >
        <Plus size={12} aria-hidden />
        Enregistrer paiement
      </Button>

      <Modal
        ouvert={ouvert}
        onFermer={() => setOuvert(false)}
        titre="Enregistrer un paiement"
        description={
          restant > 0
            ? `Reste à encaisser : ${formatPrice(restant, 'F CFA')}.`
            : 'Cette commande est entièrement réglée.'
        }
        pied={
          <>
            <Button variante="fantome" onClick={() => setOuvert(false)}>
              Annuler
            </Button>
            <Button type="submit" form="formulaire-paiement">
              Enregistrer
            </Button>
          </>
        }
      >
        <form id="formulaire-paiement" onSubmit={enregistrer} className="flex flex-col gap-4">
          <Field
            label="Montant reçu"
            type="number"
            required
            min={1}
            step={500}
            autoFocus
            aide="En francs CFA, sans décimales."
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
          <SelectField
            label="Moyen de paiement"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </SelectField>
        </form>
      </Modal>
    </section>
  );
}
