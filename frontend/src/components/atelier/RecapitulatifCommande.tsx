import { Phone } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import MeasureRow from '@/components/ui/MeasureRow';
import {
  clientPrincipal,
  mesuresCorporelles,
  recapitulatifCommande,
  tarificationCommande,
  type Commande,
} from '@/lib/mock/atelier';
import { formatPrice } from '@/lib/utils';

/** Ligne « libellé / valeur » du bloc de détails. */
function Ligne({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-muted-foreground mb-1 block text-xs">{label}</span>
      <span className="text-foreground flex items-center gap-2 text-sm">{children}</span>
    </div>
  );
}

/**
 * Récapitulatif d'une commande — modèle, instructions, mesures, tarification.
 * Source Banani : screens/new_screen4.jsx (« Fiche commande »).
 */
export default function RecapitulatifCommande({ commande }: { commande: Commande }) {
  const resteAPayer = tarificationCommande.reduce(
    (total, l) => total + (l.deduction ? -l.montant : l.montant),
    0,
  );

  return (
    <div className="flex min-w-0 flex-col lg:flex-row">
      {/* Détails + mesures */}
      <div className="border-border flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 lg:border-r lg:px-8">
        <section className="bg-surface border-border rounded-lg border p-5">
          <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
            Détails de la commande
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Ligne label="Type de tenue">{commande.tenue}</Ligne>
            <Ligne label="Tissu">{recapitulatifCommande.tissu}</Ligne>
            <Ligne label="Assigné à">
              <Avatar
                initiales={recapitulatifCommande.assigneInitiales}
                taille="sm"
                className="h-5 w-5"
              />
              {recapitulatifCommande.assigneNom}
            </Ligne>
            <Ligne label="Date de création">{recapitulatifCommande.dateCreation}</Ligne>
            <Ligne label="Livraison calculée">{recapitulatifCommande.livraisonCalculee}</Ligne>
            <Ligne label="Durée estimée">{recapitulatifCommande.dureeEstimee}</Ligne>
          </div>

          <div className="mt-4">
            <span className="text-muted-foreground mb-1 block text-xs">Instructions</span>
            <p className="bg-muted text-foreground rounded-md px-3 py-2.5 text-sm">
              {recapitulatifCommande.instructions}
            </p>
          </div>
        </section>

        <section className="bg-surface border-border overflow-hidden rounded-lg border">
          <div className="border-border border-b px-5 py-3">
            <h2 className="font-headings text-foreground text-sm font-bold">Mesures</h2>
          </div>
          <div className="grid sm:grid-cols-2">
            {mesuresCorporelles.map((m, i) => (
              <MeasureRow
                key={m.label}
                label={m.label}
                valeur={m.valeur}
                unite={m.unite}
                contraste={i % 4 >= 2}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Client + tarification */}
      <aside className="border-border flex w-full flex-shrink-0 flex-col gap-5 border-t py-6 lg:w-80 lg:border-t-0">
        <div className="px-4 lg:px-6">
          <h2 className="font-headings text-foreground mb-3 text-sm font-bold">Client</h2>
          <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
            <Avatar
              initiales={commande.client
                .split(' ')
                .slice(0, 2)
                .map((m) => m[0] ?? '')
                .join('')
                .toUpperCase()}
              taille="lg"
            />
            <div className="min-w-0">
              <div className="text-foreground truncate text-sm font-medium">{commande.client}</div>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Phone size={11} aria-hidden />
                {clientPrincipal.telephone}
              </div>
              <div className="text-muted-foreground text-xs">{clientPrincipal.rangCommande}</div>
            </div>
          </div>
        </div>

        <div className="bg-border mx-4 h-px lg:mx-6" />

        <div className="px-4 lg:px-6">
          <h2 className="font-headings text-foreground mb-3 text-sm font-bold">Tarification</h2>
          <dl className="flex flex-col gap-2">
            {tarificationCommande.map((l) => (
              <div key={l.label} className="flex items-center justify-between gap-3 text-xs">
                <dt className="text-muted-foreground">{l.label}</dt>
                <dd className={l.deduction ? 'text-success' : 'text-foreground'}>
                  {l.deduction ? '− ' : ''}
                  {formatPrice(l.montant, 'F')}
                </dd>
              </div>
            ))}
            <div className="bg-border my-1 h-px" />
            <div className="flex items-center justify-between gap-3 text-sm font-bold">
              <dt className="text-foreground">Reste à payer</dt>
              <dd className="text-primary">{formatPrice(resteAPayer, 'F CFA')}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
