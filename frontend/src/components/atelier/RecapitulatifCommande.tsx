import { Phone } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import MeasureRow from '@/components/ui/MeasureRow';
import { dateComplete, initialesDe, libelleRang, mesuresResumeesDe } from '@/lib/commande-fiche';
import { paletteDe, type Client, type Commande } from '@/lib/mock/atelier';
import type { ReleveCharge } from '@/lib/useReleveMesures';
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
 *
 * Le client, le relevé et le rang viennent de la fiche parente : elle les a
 * déjà chargés pour son onglet « Suivi », les redemander ici doublerait les
 * appels pour les mêmes lignes.
 */
export default function RecapitulatifCommande({
  commande,
  client,
  releve,
  rang,
}: {
  commande: Commande;
  client: Client | undefined;
  releve: ReleveCharge | null;
  rang: number;
}) {
  const encaisse = commande.encaisse ?? 0;
  const resteAPayer = commande.montant - encaisse;
  // Le récapitulatif montre le relevé entier, pas l'extrait de la colonne
  // latérale : c'est l'écran qu'on ouvre avant de tailler.
  const mesures = releve ? mesuresResumeesDe(paletteDe(releve.genre), releve.valeurs, 99) : [];

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
            <Ligne label="Tissu">{commande.tissu ?? 'Non renseigné'}</Ligne>
            <Ligne label="Assigné à">
              {commande.assignee === '—' ? (
                <span className="text-muted-foreground">Non assigné</span>
              ) : (
                <>
                  <Avatar
                    initiales={initialesDe(commande.assignee)}
                    taille="sm"
                    className="h-5 w-5"
                  />
                  {commande.assignee}
                </>
              )}
            </Ligne>
            <Ligne label="Date de création">{dateComplete(commande.creeLe) || '—'}</Ligne>
            <Ligne label="Livraison prévue">{commande.livraison}</Ligne>
            <Ligne label="Statut">{commande.statut}</Ligne>
          </div>

          <div className="mt-4">
            <span className="text-muted-foreground mb-1 block text-xs">Instructions</span>
            <p className="bg-muted text-foreground rounded-md px-3 py-2.5 text-sm">
              {commande.notes ?? 'Aucune consigne particulière n’a été saisie.'}
            </p>
          </div>
        </section>

        <section className="bg-surface border-border overflow-hidden rounded-lg border">
          <div className="border-border border-b px-5 py-3">
            <h2 className="font-headings text-foreground text-sm font-bold">Mesures</h2>
          </div>
          {mesures.length > 0 ? (
            <div className="grid sm:grid-cols-2">
              {mesures.map((m, i) => (
                <MeasureRow
                  key={m.label + i}
                  label={m.label}
                  valeur={m.valeur}
                  unite={m.unite}
                  contraste={i % 4 >= 2}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground px-5 py-4 text-sm">
              Aucune mesure n’a été relevée pour {commande.client}.
            </p>
          )}
        </section>
      </div>

      {/* Client + tarification */}
      <aside className="border-border flex w-full flex-shrink-0 flex-col gap-5 border-t py-6 lg:w-80 lg:border-t-0">
        <div className="px-4 lg:px-6">
          <h2 className="font-headings text-foreground mb-3 text-sm font-bold">Client</h2>
          <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
            <Avatar initiales={initialesDe(commande.client)} taille="lg" />
            <div className="min-w-0">
              <div className="text-foreground truncate text-sm font-medium">{commande.client}</div>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <Phone size={11} aria-hidden />
                {client?.telephone || 'Téléphone non renseigné'}
              </div>
              <div className="text-muted-foreground text-xs">{libelleRang(rang)}</div>
            </div>
          </div>
        </div>

        <div className="bg-border mx-4 h-px lg:mx-6" />

        <div className="px-4 lg:px-6">
          <h2 className="font-headings text-foreground mb-3 text-sm font-bold">Tarification</h2>
          {/* Deux lignes, pas une grille tarifaire : le détail par poste
              (façon, tissu, broderie) n'existe pas en base — une commande porte
              un prix et ce qui a été encaissé. */}
          <dl className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 text-xs">
              <dt className="text-muted-foreground">Montant de la commande</dt>
              <dd className="text-foreground">{formatPrice(commande.montant, 'F')}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <dt className="text-muted-foreground">Déjà encaissé</dt>
              <dd className={encaisse > 0 ? 'text-success' : 'text-muted-foreground'}>
                {encaisse > 0 ? '− ' : ''}
                {formatPrice(encaisse, 'F')}
              </dd>
            </div>
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
