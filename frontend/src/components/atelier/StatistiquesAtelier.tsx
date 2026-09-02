'use client';

import { AlertCircle, AlertTriangle, Package, Shirt, Users, type LucideIcon } from 'lucide-react';
import StatTile from '@/components/ui/StatTile';
import { useClients } from '@/lib/useClients';
import { useCommandes } from '@/lib/useCommandes';
import { cn } from '@/lib/utils';
import { useT } from '@/contexts/LangueContext';

export interface StatistiquesAtelierProps {
  /**
   * `bandeau` : la rangée compacte de l'en-tête mobile.
   * `tuiles`  : les quatre tuiles du tableau de bord desktop.
   */
  variante: 'bandeau' | 'tuiles';
}

interface Chiffre {
  id: string;
  label: string;
  labelCourt: string;
  valeur: string;
  icone: LucideIcon;
  /** Visible dans le bandeau compact mobile (3 sur 4). */
  surMobile: boolean;
}

/** Minuit local du jour — les échéances se comparent à la journée, pas à l'instant. */
function debutDeJournee(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/**
 * Les quatre chiffres clés de l'atelier.
 *
 * Ils étaient figés (« 24 commandes actives », « +3 ») au-dessus d'une liste
 * qui en montrait une seule : le premier écran du produit se contredisait
 * lui-même. Tout se dérive maintenant des commandes et du carnet déjà chargés
 * — aucun appel supplémentaire, et surtout aucune divergence possible avec la
 * liste affichée juste en dessous.
 *
 * Les tendances (« +3 » depuis la veille) ont disparu : rien en base ne permet
 * de les calculer, et un écart inventé serait pire qu'une absence.
 */
export default function StatistiquesAtelier({ variante }: StatistiquesAtelierProps) {
  const t = useT();
  const { commandes, source: sourceCommandes, chargement: chargementCommandes } = useCommandes();
  const { clients, source: sourceClients, chargement: chargementClients } = useClients();

  // Si l’une des deux sources est en repli, les chiffres décrivent le jeu
  // d’exemple et doivent le dire. Sans cela, une tuile « 3 en retard » calculée
  // sur des exemples voisinerait une liste étiquetée « exemples » : le lecteur
  // croirait le chiffre réel.
  const surExemples = sourceCommandes === 'demonstration' || sourceClients === 'demonstration';

  const aujourdhui = debutDeJournee();
  const debutDuMois = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1);

  const actives = commandes.filter((c) => c.statut !== 'Livré');
  // « Livraison » et « En retard » sont des statuts que l'atelier pose lui-même ;
  // on les lit tels quels plutôt que de recalculer une échéance que l'écran de
  // la commande n'affiche pas forcément de la même façon.
  const aLivrer = actives.filter((c) => c.statut === 'Livraison').length;
  const enRetard = actives.filter((c) => c.statut === 'En retard').length;
  const clientsDuMois = clients.filter((c) => {
    if (!c.creeLe) return false;
    const d = new Date(c.creeLe);
    return d >= debutDuMois;
  }).length;

  const chargement = chargementCommandes || chargementClients;

  const chiffres: Chiffre[] = [
    {
      id: 's1',
      label: 'Commandes actives',
      labelCourt: 'Commandes',
      valeur: String(actives.length),
      icone: Shirt,
      surMobile: true,
    },
    {
      id: 's2',
      label: 'À livrer',
      labelCourt: 'À livrer',
      valeur: String(aLivrer),
      icone: Package,
      surMobile: true,
    },
    {
      id: 's3',
      label: 'En retard',
      labelCourt: 'En retard',
      valeur: String(enRetard),
      icone: enRetard > 0 ? AlertTriangle : AlertCircle,
      surMobile: true,
    },
    {
      id: 's4',
      label: 'Clients ce mois',
      labelCourt: 'Clients',
      valeur: String(clientsDuMois),
      icone: Users,
      surMobile: false,
    },
  ];

  if (variante === 'bandeau') {
    return (
      <>
        {chiffres.map((s, i) => {
          const Icone = s.icone;
          return (
            <div
              key={s.id}
              className={cn(
                'border-border flex flex-1 flex-col items-center gap-0.5 py-3',
                i < chiffres.length - 1 && 'border-r',
                !s.surMobile && 'hidden sm:flex',
              )}
            >
              <Icone size={14} className="text-muted-foreground" aria-hidden />
              <span className="font-headings text-foreground text-lg font-bold">
                {chargement ? '—' : s.valeur}
              </span>
              <span className="text-muted-foreground text-[10px]">
                {t(s.labelCourt)}
                {surExemples && !chargement && <span className="text-warning"> · ex.</span>}
              </span>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      {chiffres.map((s) => {
        const alerte = s.id === 's3' && enRetard > 0 && !chargement;
        return (
          <StatTile
            key={s.id}
            label={t(s.label)}
            valeur={chargement ? '—' : s.valeur}
            icone={s.icone}
            // Une tendance neutre : aucun historique en base ne permet d'affirmer
            // une hausse ou une baisse. Seul le retard mérite du rouge.
            tendance={
              chargement
                ? 'chargement…'
                : surExemples
                  ? 'exemples'
                  : alerte
                    ? 'à traiter'
                    : 'aujourd’hui'
            }
            enHausse={alerte ? false : null}
          />
        );
      })}
    </>
  );
}
