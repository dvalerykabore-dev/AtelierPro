'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Trash2, UserPlus } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { useAuth } from '@/contexts/AuthContext';
import {
  atelier,
  equipeParametres,
  preferencesNotifications,
  tarifs as tarifsInitiaux,
  type Tarif,
} from '@/lib/mock/atelier';
import { cn, formatPrice } from '@/lib/utils';

const ONGLETS = ['Atelier', 'Équipe', 'Tarification', 'Notifications', 'Compte'] as const;
type Onglet = (typeof ONGLETS)[number];

/** Champ en lecture seule — la maquette ne prévoit pas de saisie active. */
function Champ({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div>
      <span className="text-muted-foreground mb-1 block text-xs">{label}</span>
      <div className="bg-input border-border rounded-md border px-3 py-2.5">
        <span className="text-foreground text-sm">{valeur}</span>
      </div>
    </div>
  );
}

/** Interrupteur binaire, réellement actionnable. */
function Interrupteur({
  actif,
  onChange,
  label,
}: {
  actif: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative h-6 w-11 flex-shrink-0 rounded-full transition-colors',
        actif ? 'bg-primary' : 'bg-muted border-border border',
      )}
    >
      <span
        className={cn(
          'absolute top-1 h-4 w-4 rounded-full transition-all',
          actif ? 'bg-primary-foreground left-6' : 'bg-muted-foreground left-1',
        )}
      />
    </button>
  );
}

/**
 * Paramètres de l'atelier, organisés en onglets.
 * Source Banani : screens/new_screen6.jsx (« Paramètres — AtelierPro »).
 */
export default function Parametres() {
  const router = useRouter();
  const { logout, loggingOut } = useAuth();

  const [onglet, setOnglet] = useState<Onglet>('Atelier');
  const [equipe, setEquipe] = useState(equipeParametres);
  const [preferences, setPreferences] = useState(preferencesNotifications);
  const [tarifs, setTarifs] = useState<Tarif[]>(tarifsInitiaux);

  // Formulaire de tarif — création et édition partagent la même fenêtre.
  const [tarifOuvert, setTarifOuvert] = useState(false);
  const [tarifEdite, setTarifEdite] = useState<Tarif | null>(null);
  const [nomTenue, setNomTenue] = useState('');
  const [prix, setPrix] = useState('');

  function basculerMembre(id: string) {
    setEquipe((prec) => prec.map((m) => (m.id === id ? { ...m, actif: !m.actif } : m)));
  }

  function basculerPreference(id: string) {
    setPreferences((prec) => prec.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  }

  function ouvrirTarif(t?: Tarif) {
    setTarifEdite(t ?? null);
    setNomTenue(t?.tenue ?? '');
    setPrix(t ? String(t.prix) : '');
    setTarifOuvert(true);
  }

  function enregistrerTarif(e: FormEvent) {
    e.preventDefault();
    const montant = Number.parseInt(prix, 10);
    if (!nomTenue.trim() || Number.isNaN(montant)) return;

    const ligne: Tarif = { tenue: nomTenue.trim(), prix: montant, unite: 'façon' };
    setTarifs((prec) =>
      tarifEdite ? prec.map((t) => (t.tenue === tarifEdite.tenue ? ligne : t)) : [...prec, ligne],
    );
    setTarifOuvert(false);
  }

  function supprimerTarif(tenue: string) {
    setTarifs((prec) => prec.filter((t) => t.tenue !== tenue));
  }

  async function seDeconnecter() {
    await logout();
    router.push('/connexion');
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Onglets */}
      <div className="border-border bg-background flex overflow-x-auto border-b px-4 lg:px-8">
        {ONGLETS.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOnglet(o)}
            aria-current={onglet === o ? 'true' : undefined}
            className={cn(
              'flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              onglet === o
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent',
            )}
          >
            {o}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
        {/* ---------- Atelier ---------- */}
        {onglet === 'Atelier' && (
          <section className="bg-surface border-border rounded-lg border p-5">
            <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
              Informations de l’atelier
            </h2>

            <div className="mb-4 flex flex-col gap-5 sm:flex-row">
              <div className="bg-muted border-border flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-lg border">
                <span className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
                  <span className="text-primary-foreground font-headings text-lg font-bold">A</span>
                </span>
                <span className="text-muted-foreground text-xs">Logo</span>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <Champ label="Nom de l’atelier" valeur={atelier.nom} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Champ label="Téléphone" valeur={atelier.telephone} />
                  <Champ label="Ville" valeur={atelier.ville} />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Champ label="Adresse" valeur={atelier.adresse} />
              <Champ label="Horaires" valeur={atelier.heuresOuverture} />
              <Champ label="Devise" valeur={atelier.devise} />
            </div>
          </section>
        )}

        {/* ---------- Équipe ---------- */}
        {onglet === 'Équipe' && (
          <section className="bg-surface border-border overflow-hidden rounded-lg border">
            <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
              <h2 className="font-headings text-foreground text-sm font-bold">
                Équipe ({equipe.filter((m) => m.actif).length} actifs sur {equipe.length})
              </h2>
              <button
                type="button"
                className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
              >
                <UserPlus size={12} aria-hidden />
                Ajouter
              </button>
            </div>

            <ul>
              {equipe.map((m) => (
                <li key={m.id} className="border-border flex items-center gap-3 border-b px-5 py-3">
                  <Avatar initiales={m.initiales} taille="md" />
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">{m.nom}</div>
                    <div className="text-muted-foreground text-xs">
                      {m.role} · {m.capacite} h / jour
                    </div>
                  </div>
                  <span
                    className={cn(
                      'hidden text-xs font-medium sm:block',
                      m.actif ? 'text-success' : 'text-muted-foreground',
                    )}
                  >
                    {m.actif ? 'Actif' : 'Inactif'}
                  </span>
                  <Interrupteur
                    actif={m.actif}
                    onChange={() => basculerMembre(m.id)}
                    label={`Activer ${m.nom}`}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Tarification ---------- */}
        {onglet === 'Tarification' && (
          <section className="bg-surface border-border overflow-hidden rounded-lg border">
            <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
              <h2 className="font-headings text-foreground text-sm font-bold">Grille tarifaire</h2>
              <button
                type="button"
                onClick={() => ouvrirTarif()}
                className="text-primary border-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors"
              >
                <Plus size={11} aria-hidden />
                Ajouter un tarif
              </button>
            </div>

            <ul>
              {tarifs.map((t) => (
                <li
                  key={t.tenue}
                  className="border-border flex items-center gap-3 border-b px-5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">{t.tenue}</div>
                    <div className="text-muted-foreground text-xs">Prix de {t.unite}</div>
                  </div>
                  <span className="text-foreground text-sm font-medium">
                    {formatPrice(t.prix, 'F')}
                  </span>
                  <button
                    type="button"
                    onClick={() => ouvrirTarif(t)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil size={13} aria-hidden />
                    <span className="sr-only">Modifier le tarif {t.tenue}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => supprimerTarif(t.tenue)}
                    className="text-muted-foreground hover:text-danger"
                  >
                    <Trash2 size={13} aria-hidden />
                    <span className="sr-only">Supprimer le tarif {t.tenue}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Notifications ---------- */}
        {onglet === 'Notifications' && (
          <section className="bg-surface border-border overflow-hidden rounded-lg border">
            <div className="border-border border-b px-5 py-3">
              <h2 className="font-headings text-foreground text-sm font-bold">
                Rappels automatiques
              </h2>
            </div>

            <ul>
              {preferences.map((p) => (
                <li
                  key={p.id}
                  className="border-border flex items-center gap-4 border-b px-5 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground text-sm font-medium">{p.label}</div>
                    <div className="text-muted-foreground text-xs">{p.description}</div>
                  </div>
                  <Interrupteur
                    actif={p.active}
                    onChange={() => basculerPreference(p.id)}
                    label={p.label}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Compte ---------- */}
        {onglet === 'Compte' && (
          <section className="bg-surface border-border rounded-lg border p-5">
            <h2 className="font-headings text-foreground mb-4 text-sm font-bold">Votre compte</h2>

            <div className="mb-5 flex items-center gap-4">
              <Avatar initiales="MK" taille="lg" className="h-12 w-12 text-base" accentue />
              <div>
                <div className="text-foreground text-sm font-medium">Moussa Koné</div>
                <div className="text-muted-foreground text-xs">Propriétaire · Tailleur senior</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Champ label="Adresse e-mail" valeur="moussa.kone@atelierpro.bf" />
              <Champ label="Téléphone" valeur="+226 70 12 34 56" />
            </div>

            <div className="border-border mt-5 flex flex-wrap gap-2 border-t pt-5">
              <button
                type="button"
                className="border-border text-foreground hover:bg-muted rounded-md border px-3 py-2 text-sm transition-colors"
              >
                Changer le mot de passe
              </button>
              <Button variante="danger" onClick={seDeconnecter} disabled={loggingOut}>
                {loggingOut ? 'Déconnexion…' : 'Se déconnecter'}
              </Button>
            </div>
          </section>
        )}
      </div>

      {/* Création / édition d'un tarif — écran absent des maquettes Banani. */}
      <Modal
        ouvert={tarifOuvert}
        onFermer={() => setTarifOuvert(false)}
        titre={tarifEdite ? 'Modifier le tarif' : 'Nouveau tarif'}
        description="Prix de façon appliqué par défaut à ce type de tenue."
        pied={
          <>
            <Button variante="fantome" onClick={() => setTarifOuvert(false)}>
              Annuler
            </Button>
            <Button type="submit" form="formulaire-tarif">
              {tarifEdite ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </>
        }
      >
        <form id="formulaire-tarif" onSubmit={enregistrerTarif} className="flex flex-col gap-4">
          <Field
            label="Type de tenue"
            required
            autoFocus
            placeholder="Boubou bazin brodé"
            value={nomTenue}
            onChange={(e) => setNomTenue(e.target.value)}
          />
          <Field
            label="Prix de façon"
            type="number"
            required
            min={0}
            step={500}
            placeholder="25000"
            aide="En francs CFA, sans décimales."
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
