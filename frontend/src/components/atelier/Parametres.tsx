'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Moon, Pencil, Plus, Sun, Trash2, UserPlus } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import ChampTelephone from '@/components/ui/ChampTelephone';
import { formaterAffichage, validerInternational } from '@/lib/indicatifs';
import ChoixLangue from '@/components/atelier/ChoixLangue';
import { PastilleAtelier } from '@/components/atelier/IdentiteAtelier';
import LogoAtelier from '@/components/atelier/LogoAtelier';
import { useAuth } from '@/contexts/AuthContext';
import { useLangue } from '@/contexts/LangueContext';
import { api } from '@/lib/api';
import { NOM_ATELIER_DEFAUT } from '@/lib/atelier-identite';
import { CRENEAUX, formaterHeure, validerHoraires } from '@/lib/horaires';
import { messageErreur } from '@/lib/message-erreur';
import { useTheme } from '@/contexts/ThemeContext';
import { THEMES } from '@/lib/theme';
import { useArtisans } from '@/lib/useArtisans';
import { useTarifs, type Tarif } from '@/lib/useTarifs';
import { usePreferencesNotifications } from '@/lib/usePreferencesNotifications';
import { cn, formatPrice } from '@/lib/utils';

const ONGLETS = ['Atelier', 'Équipe', 'Tarification', 'Notifications', 'Compte'] as const;
type Onglet = (typeof ONGLETS)[number];

/**
 * Champ texte enregistrable — nom, ville, adresse de l'atelier.
 *
 * Bouton dédié plutôt qu'enregistrement à la frappe : chaque lettre partirait
 * sinon en requête, et une saisie interrompue laisserait une ville à moitié
 * tapée sur le compte.
 */
function ChampEnregistrable({
  label,
  valeur,
  placeholder,
  aide,
  messageEchec,
  onEnregistrer,
}: {
  label: string;
  valeur: string;
  placeholder: string;
  aide?: string;
  messageEchec: string;
  onEnregistrer: (valeur: string) => Promise<void>;
}) {
  const { t } = useLangue();
  const [saisie, setSaisie] = useState(valeur);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enregistre, setEnregistre] = useState(false);

  // La valeur du serveur reprend la main quand elle arrive après le montage.
  useEffect(() => {
    setSaisie(valeur);
  }, [valeur]);

  const modifie = saisie.trim() !== valeur.trim();

  async function soumettre() {
    setEnvoi(true);
    setErreur(null);
    try {
      await onEnregistrer(saisie.trim());
      setEnregistre(true);
    } catch (err) {
      setErreur(messageErreur(err, t(messageEchec)));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div>
      <span className="text-muted-foreground mb-1 block text-xs">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={saisie}
          placeholder={placeholder}
          onChange={(e) => {
            setSaisie(e.target.value);
            setEnregistre(false);
          }}
          className="bg-input border-border text-foreground min-w-0 flex-1 rounded-md border px-3 py-2.5 text-sm"
        />
        <Button type="button" onClick={() => void soumettre()} disabled={!modifie || envoi}>
          {t(envoi ? 'Enregistrement…' : 'Enregistrer')}
        </Button>
      </div>
      {aide && !erreur && <p className="text-muted-foreground mt-1 text-xs">{aide}</p>}
      {erreur && (
        <p role="alert" className="text-danger mt-1 text-xs">
          {t(erreur)}
        </p>
      )}
      {enregistre && !modifie && !erreur && (
        <p className="text-success mt-1 text-xs">{t('Enregistré.')}</p>
      )}
    </div>
  );
}

/**
 * Heures d'ouverture, choisies dans deux dérouleurs.
 *
 * Deux listes plutôt qu'un champ libre : « 8h-18h », « 08:00 à 18h00 » et
 * « du matin au soir » sont tous des saisies plausibles, et aucune ne se
 * compare à une échéance. Les créneaux couvrent la journée entière, par
 * demi-heures.
 *
 * Les deux heures partent ensemble, en un seul enregistrement. La route refuse
 * d'ailleurs d'en écrire une seule : bouger l'ouverture sans la fermeture
 * pourrait produire « 19h00 — 18h00 », un intervalle que personne n'a demandé.
 */
function HorairesEnregistrables({
  ouverture,
  fermeture,
  onEnregistrer,
}: {
  ouverture: string;
  fermeture: string;
  onEnregistrer: (ouverture: string, fermeture: string) => Promise<void>;
}) {
  const { t } = useLangue();
  const [debut, setDebut] = useState(ouverture);
  const [fin, setFin] = useState(fermeture);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enregistre, setEnregistre] = useState(false);

  // Les valeurs du serveur reprennent la main quand elles arrivent.
  useEffect(() => {
    setDebut(ouverture);
    setFin(fermeture);
  }, [ouverture, fermeture]);

  const probleme = validerHoraires(debut, fin);
  const modifie = debut !== ouverture || fin !== fermeture;

  async function soumettre() {
    setEnvoi(true);
    setErreur(null);
    try {
      await onEnregistrer(debut, fin);
      setEnregistre(true);
    } catch (err) {
      setErreur(messageErreur(err, t('Les horaires n’ont pas pu être enregistrés.')));
    } finally {
      setEnvoi(false);
    }
  }

  const styleListe =
    'bg-input border-border text-foreground rounded-md border px-2 py-2.5 text-sm focus:border-primary focus:outline-none';

  return (
    <div>
      <span className="text-muted-foreground mb-1 block text-xs">{t('Horaires')}</span>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={debut}
          aria-label={t('Heure d’ouverture')}
          onChange={(e) => {
            setDebut(e.target.value);
            setEnregistre(false);
          }}
          className={styleListe}
        >
          <option value="">—</option>
          {CRENEAUX.map((c) => (
            <option key={c} value={c}>
              {formaterHeure(c)}
            </option>
          ))}
        </select>

        <span className="text-muted-foreground text-sm">{t('à')}</span>

        <select
          value={fin}
          aria-label={t('Heure de fermeture')}
          onChange={(e) => {
            setFin(e.target.value);
            setEnregistre(false);
          }}
          className={styleListe}
        >
          <option value="">—</option>
          {CRENEAUX.map((c) => (
            <option key={c} value={c}>
              {formaterHeure(c)}
            </option>
          ))}
        </select>

        <Button
          type="button"
          taille="sm"
          onClick={() => void soumettre()}
          disabled={!modifie || envoi || probleme !== null}
        >
          {t(envoi ? 'Enregistrement…' : 'Enregistrer')}
        </Button>
      </div>

      {probleme && (
        <p role="alert" className="text-danger mt-1 text-xs">
          {t(probleme)}
        </p>
      )}
      {erreur && !probleme && (
        <p role="alert" className="text-danger mt-1 text-xs">
          {t(erreur)}
        </p>
      )}
      {enregistre && !modifie && !erreur && !probleme && (
        <p className="text-success mt-1 text-xs">{t('Enregistré.')}</p>
      )}
    </div>
  );
}

/**
 * Téléphone de l'atelier, enregistrable.
 *
 * Même forme que `ChampEnregistrable` — bouton dédié, la saisie ne part pas à
 * chaque frappe — mais bâti sur `ChampTelephone` pour l'indicatif. Le numéro
 * s'affiche à deux endroits de cet écran, l'onglet Atelier et l'onglet Compte :
 * les deux lisent `user.phone` et écrivent au même endroit, donc ils ne peuvent
 * pas diverger.
 */
function TelephoneEnregistrable({
  label,
  valeur,
  aide,
  onEnregistrer,
}: {
  label: string;
  valeur: string;
  aide?: string;
  onEnregistrer: (valeur: string) => Promise<void>;
}) {
  const { t } = useLangue();
  const [saisie, setSaisie] = useState(valeur);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enregistre, setEnregistre] = useState(false);

  // La valeur du serveur reprend la main quand elle arrive après le montage.
  useEffect(() => {
    setSaisie(valeur);
  }, [valeur]);

  const modifie = saisie !== valeur;
  const invalide = validerInternational(saisie) !== null;

  async function soumettre() {
    setEnvoi(true);
    setErreur(null);
    try {
      await onEnregistrer(saisie);
      setEnregistre(true);
    } catch (err) {
      setErreur(messageErreur(err, t('Le numéro n’a pas pu être enregistré.')));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <ChampTelephone
        label={label}
        valeur={saisie}
        onChange={(v) => {
          setSaisie(v);
          setEnregistre(false);
        }}
        {...(aide === undefined ? {} : { aide })}
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          taille="sm"
          onClick={() => void soumettre()}
          disabled={!modifie || envoi || invalide}
        >
          {t(envoi ? 'Enregistrement…' : 'Enregistrer')}
        </Button>
        {erreur && (
          <span role="alert" className="text-danger text-xs">
            {t(erreur)}
          </span>
        )}
        {enregistre && !modifie && !erreur && (
          <span className="text-success text-xs">{t('Enregistré.')}</span>
        )}
      </div>
    </div>
  );
}

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
  const { user, logout, loggingOut, refresh } = useAuth();
  const { t, tp } = useLangue();

  /**
   * Enregistre le nom de l'atelier, puis relit la session.
   *
   * Le relire plutôt que de poser la valeur localement : le nom s'affiche dans
   * le rail et le sous-titre de quatre écrans, tous alimentés par le contexte
   * d'authentification. Un seul point de vérité évite qu'un écran affiche
   * l'ancien nom et son voisin le nouveau.
   */
  async function enregistrerNom(nom: string) {
    await api('/api/atelier', { method: 'PATCH', body: { workshopName: nom } });
    await refresh();
  }
  /** Même chemin que le nom : on écrit, puis on relit la session, seule source. */
  async function enregistrerTelephone(numero: string) {
    await api('/api/atelier', { method: 'PATCH', body: { phone: numero } });
    await refresh();
  }
  async function enregistrerVille(ville: string) {
    await api('/api/atelier', { method: 'PATCH', body: { city: ville } });
    await refresh();
  }
  async function enregistrerAdresse(adresse: string) {
    await api('/api/atelier', { method: 'PATCH', body: { address: adresse } });
    await refresh();
  }
  /**
   * Les deux heures partent dans le même PATCH.
   *
   * La route refuse d'en écrire une seule : n'envoyer que l'ouverture
   * laisserait la fermeture à sa valeur précédente et pourrait composer
   * « 19h00 — 18h00 » sans que personne ne l'ait demandé.
   */
  async function enregistrerHoraires(ouverture: string, fermeture: string) {
    await api('/api/atelier', {
      method: 'PATCH',
      body: { opensAt: ouverture, closesAt: fermeture },
    });
    await refresh();
  }

  const { theme, definir: definirTheme } = useTheme();

  const {
    artisans: equipe,
    source: sourceEquipe,
    chargement: chargementEquipe,
    ajouter: ajouterArtisan,
    basculer: basculerArtisan,
  } = useArtisans();

  const [onglet, setOnglet] = useState<Onglet>('Atelier');

  const {
    alertes,
    estActif: alerteActive,
    basculer: basculerAlerte,
    chargement: chargementAlertes,
    session: sessionAlertes,
    erreur: erreurAlertes,
  } = usePreferencesNotifications();
  const [echecAlerte, setEchecAlerte] = useState<string | null>(null);

  // La déconnexion demande confirmation. Le bouton est collé au reste des
  // réglages, et depuis que la reconnexion passe par un code envoyé par
  // e-mail, un clic de travers ne coûte plus un mot de passe à retaper mais
  // une boîte mail à aller consulter — parfois sur un téléphone resté à la
  // maison, au milieu d'une journée d'atelier.
  const [deconnexionOuverte, setDeconnexionOuverte] = useState(false);

  const {
    tarifs,
    source: sourceTarifs,
    chargement: chargementTarifs,
    ajouter: ajouterTarif,
    modifier: modifierTarif,
    supprimer: retirerTarif,
  } = useTarifs();
  const [echecTarif, setEchecTarif] = useState<string | null>(null);

  // Formulaire de tarif — création et édition partagent la même fenêtre.
  const [tarifOuvert, setTarifOuvert] = useState(false);
  const [tarifEdite, setTarifEdite] = useState<Tarif | null>(null);
  const [nomTenue, setNomTenue] = useState('');
  const [prix, setPrix] = useState('');

  // Ajout d'un artisan — la maquette Banani montre le bouton sans destination.
  const [artisanOuvert, setArtisanOuvert] = useState(false);
  const [nomArtisan, setNomArtisan] = useState('');
  const [roleArtisan, setRoleArtisan] = useState('Couturière');
  const [capaciteArtisan, setCapaciteArtisan] = useState('8');
  const [telArtisan, setTelArtisan] = useState('');
  const [echecEquipe, setEchecEquipe] = useState<string | null>(null);
  const [envoiArtisan, setEnvoiArtisan] = useState(false);

  async function soumettreArtisan(e: FormEvent) {
    e.preventDefault();
    const capacite = Number.parseInt(capaciteArtisan, 10);
    if (!nomArtisan.trim() || !roleArtisan.trim() || Number.isNaN(capacite)) return;

    setEnvoiArtisan(true);
    setEchecEquipe(null);
    const probleme = await ajouterArtisan({
      nom: nomArtisan.trim(),
      role: roleArtisan.trim(),
      capacite,
      telephone: telArtisan,
    });
    setEnvoiArtisan(false);

    if (probleme) {
      setEchecEquipe(probleme);
      return;
    }
    setNomArtisan('');
    setTelArtisan('');
    setArtisanOuvert(false);
  }

  /** L'interrupteur est optimiste ; le hook revient en arrière si le serveur refuse. */
  async function basculerMembre(id: string) {
    const probleme = await basculerArtisan(id);
    if (probleme) setEchecEquipe(probleme);
  }

  /** Comme pour l'équipe : bascule optimiste, le hook revient en arrière si le serveur refuse. */
  async function basculerRappel(type: string) {
    setEchecAlerte(await basculerAlerte(type));
  }

  function ouvrirTarif(t?: Tarif) {
    setTarifEdite(t ?? null);
    setNomTenue(t?.tenue ?? '');
    setPrix(t ? String(t.prix) : '');
    setEchecTarif(null);
    setTarifOuvert(true);
  }

  async function enregistrerTarif(e: FormEvent) {
    e.preventDefault();
    const montant = Number.parseInt(prix, 10);
    if (!nomTenue.trim() || Number.isNaN(montant)) return;

    const entree = { tenue: nomTenue.trim(), prix: montant, unite: 'façon' };
    // La fenêtre ne se ferme qu'en cas de succès : la refermer sur un échec
    // ferait croire le tarif enregistré, et il faudrait tout retaper.
    const message = tarifEdite
      ? await modifierTarif(tarifEdite.id, entree)
      : await ajouterTarif(entree);
    if (message) setEchecTarif(message);
    else setTarifOuvert(false);
  }

  async function supprimerTarif(t: Tarif) {
    const message = await retirerTarif(t.id);
    if (message) setEchecTarif(message);
  }

  const actifs = equipe.filter((m) => m.actif).length;

  async function seDeconnecter() {
    setDeconnexionOuverte(false);
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
            {t(o)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
        {/* ---------- Atelier ---------- */}
        {onglet === 'Atelier' && (
          <section className="bg-surface border-border rounded-lg border p-5">
            <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
              {t('Informations de l’atelier')}
            </h2>

            <div className="mb-4 flex flex-col gap-5 sm:flex-row">
              <LogoAtelier />

              <div className="flex flex-1 flex-col gap-3">
                <ChampEnregistrable
                  label={t('Nom de l’atelier')}
                  valeur={user?.workshopName ?? ''}
                  placeholder={t(NOM_ATELIER_DEFAUT)}
                  messageEchec="Le nom n’a pas pu être enregistré."
                  onEnregistrer={enregistrerNom}
                />
                <TelephoneEnregistrable
                  label={t('Téléphone de l’atelier')}
                  valeur={user?.phone ?? ''}
                  aide={t('Le numéro sur lequel on joint l’atelier.')}
                  onEnregistrer={enregistrerTelephone}
                />
                <ChampEnregistrable
                  label={t('Ville')}
                  valeur={user?.workshopCity ?? ''}
                  placeholder={t('Ouagadougou')}
                  messageEchec="La ville n’a pas pu être enregistrée."
                  onEnregistrer={enregistrerVille}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <ChampEnregistrable
                label={t('Adresse')}
                valeur={user?.workshopAddress ?? ''}
                placeholder={t('Secteur 15, rue 15.42')}
                messageEchec="L’adresse n’a pas pu être enregistrée."
                onEnregistrer={enregistrerAdresse}
              />
              <HorairesEnregistrables
                ouverture={user?.workshopOpensAt ?? ''}
                fermeture={user?.workshopClosesAt ?? ''}
                onEnregistrer={enregistrerHoraires}
              />
              {/*
                La devise reste fixe, et c'est délibéré. Tous les montants déjà
                enregistrés — commandes, acomptes, journal de caisse — sont des
                entiers en francs CFA. Changer l'étiquette sans convertir ferait
                lire « 25 000 € » là où l'atelier a encaissé 25 000 F : les
                chiffres seraient inchangés, leur sens faux.
              */}
              <div>
                <span className="text-muted-foreground mb-1 block text-xs">{t('Devise')}</span>
                <div className="bg-input border-border rounded-md border px-3 py-2.5">
                  <span className="text-foreground text-sm">{t('F CFA')}</span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t('Tous les montants enregistrés sont en francs CFA.')}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ---------- Équipe ---------- */}
        {onglet === 'Équipe' && (
          <section className="bg-surface border-border overflow-hidden rounded-lg border">
            <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
              <h2 className="font-headings text-foreground text-sm font-bold">
                {t('Équipe')} (
                {tp('{n} actif sur {total}', '{n} actifs sur {total}', actifs, {
                  total: equipe.length,
                })}
                )
                {sourceEquipe === 'demonstration' && (
                  <span className="text-warning ms-1.5 font-normal">{t('· exemples')}</span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => setArtisanOuvert(true)}
                className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
              >
                <UserPlus size={12} aria-hidden />
                {t('Ajouter')}
              </button>
            </div>

            {echecEquipe && (
              <p role="alert" className="text-danger border-border border-b px-5 py-2.5 text-xs">
                {echecEquipe}
              </p>
            )}

            {chargementEquipe && equipe.length === 0 && (
              <p className="text-muted-foreground px-5 py-4 text-xs">
                {t('Chargement de l’équipe…')}
              </p>
            )}

            {/* Un atelier qui vient d'ouvrir n'a personne : c'est ici qu'il
                compose son équipe, et le planning en dépend entièrement. */}
            {!chargementEquipe && equipe.length === 0 && (
              <p className="text-muted-foreground px-5 py-4 text-xs">
                {t(
                  'Aucun artisan. Ajoutez-en un pour pouvoir assigner des commandes et remplir le planning.',
                )}
              </p>
            )}

            <ul>
              {equipe.map((m) => (
                <li key={m.id} className="border-border flex items-center gap-3 border-b px-5 py-3">
                  <Avatar initiales={m.initiales} taille="md" />
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">{m.nom}</div>
                    <div className="text-muted-foreground text-xs">
                      {t(m.role)} · {t('{n} h / jour', { n: m.capacite })}
                      {m.telephone ? ` · ${formaterAffichage(m.telephone)}` : ''}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'hidden text-xs font-medium sm:block',
                      m.actif ? 'text-success' : 'text-muted-foreground',
                    )}
                  >
                    {t(m.actif ? 'Actif' : 'Inactif')}
                  </span>
                  <Interrupteur
                    actif={m.actif}
                    onChange={() => basculerMembre(m.id)}
                    label={t('Activer {nom}', { nom: m.nom })}
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
              <h2 className="font-headings text-foreground text-sm font-bold">
                {t('Grille tarifaire')}
              </h2>
              <button
                type="button"
                onClick={() => ouvrirTarif()}
                className="text-primary border-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors"
              >
                <Plus size={11} aria-hidden />
                {t('Ajouter un tarif')}
              </button>
            </div>

            {chargementTarifs && (
              <p className="text-muted-foreground px-5 py-6 text-sm">
                {t('Chargement de la grille…')}
              </p>
            )}

            {!chargementTarifs && sourceTarifs === 'demonstration' && (
              <p className="text-muted-foreground border-border border-b px-5 py-3 text-xs">
                {t('Grille d’exemple — connectez-vous pour composer la vôtre.')}
              </p>
            )}

            {!chargementTarifs && sourceTarifs === 'serveur' && tarifs.length === 0 && (
              <p className="text-muted-foreground px-5 py-6 text-sm">
                {t(
                  'Aucun tarif enregistré. Ajoutez vos prix de façon : ils seront proposés à chaque nouvelle commande.',
                )}
              </p>
            )}

            {echecTarif && !tarifOuvert && (
              <p role="alert" className="text-danger border-border border-b px-5 py-3 text-sm">
                {echecTarif}
              </p>
            )}

            <ul>
              {tarifs.map((tarif) => (
                <li
                  key={tarif.id}
                  className="border-border flex items-center gap-3 border-b px-5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">
                      {tarif.tenue}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {t('Prix de {unite}', { unite: t(tarif.unite) })}
                    </div>
                  </div>
                  <span className="text-foreground text-sm font-medium">
                    {formatPrice(tarif.prix, 'F')}
                  </span>
                  <button
                    type="button"
                    onClick={() => ouvrirTarif(tarif)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil size={13} aria-hidden />
                    <span className="sr-only">
                      {t('Modifier le tarif {tenue}', { tenue: tarif.tenue })}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void supprimerTarif(tarif)}
                    className="text-muted-foreground hover:text-danger"
                  >
                    <Trash2 size={13} aria-hidden />
                    <span className="sr-only">
                      {t('Supprimer le tarif {tenue}', { tenue: tarif.tenue })}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/*
          ---------- Notifications ----------
          La liste précédente comptait cinq réglages, dont trois pour des envois
          qui n'existent nulle part dans le code — SMS au client, alerte de
          saturation, récapitulatif du lundi. On n'énumère que les deux alertes
          que le passage quotidien émet vraiment : un interrupteur pour un envoi
          qui n'a jamais lieu se coupe sans rien changer, et c'est en cas de
          panne qu'on s'en aperçoit.
        */}
        {onglet === 'Notifications' && (
          <section className="bg-surface border-border overflow-hidden rounded-lg border">
            <div className="border-border border-b px-5 py-3">
              <h2 className="font-headings text-foreground text-sm font-bold">
                {t('Rappels automatiques')}
              </h2>
              <p className="text-muted-foreground mt-1 text-xs">
                {t('Relevés chaque matin et déposés dans vos notifications.')}
              </p>
            </div>

            {chargementAlertes && (
              <p className="text-muted-foreground px-5 py-6 text-sm">
                {t('Chargement des réglages…')}
              </p>
            )}

            {!chargementAlertes && !sessionAlertes && (
              <p className="text-muted-foreground px-5 py-6 text-sm">
                {t('Connectez-vous pour régler vos rappels.')}
              </p>
            )}

            {(erreurAlertes ?? echecAlerte) && (
              <p role="alert" className="text-danger border-border border-b px-5 py-3 text-sm">
                {erreurAlertes ?? echecAlerte}
              </p>
            )}

            {!chargementAlertes && sessionAlertes && (
              <ul>
                {alertes.map((a) => (
                  <li
                    key={a.type}
                    className="border-border flex items-center gap-4 border-b px-5 py-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-foreground text-sm font-medium">{t(a.label)}</div>
                      <div className="text-muted-foreground text-xs">{t(a.description)}</div>
                    </div>
                    <Interrupteur
                      actif={alerteActive(a.type)}
                      onChange={() => void basculerRappel(a.type)}
                      label={t(a.label)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ---------- Compte ---------- */}
        {onglet === 'Compte' && (
          <section className="bg-surface border-border rounded-lg border p-5">
            <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
              {t('Votre compte')}
            </h2>

            {/*
              Le nom, l’adresse et le numéro étaient écrits en dur — « Moussa
              Koné », « moussa.kone@atelierpro.bf ». Chaque atelier voyait donc
              l’identité de quelqu’un d’autre sur SON écran de compte, jusqu’à
              croire s’être trompé de session.
            */}
            <div className="mb-5 flex items-center gap-4">
              <PastilleAtelier taille="lg" className="h-12 w-12 text-base" accentue />
              <div className="min-w-0">
                <div className="text-foreground truncate text-sm font-medium">
                  {user?.workshopName?.trim() || t(NOM_ATELIER_DEFAUT)}
                </div>
                <div className="text-muted-foreground text-xs">
                  {t('Propriétaire de l’atelier')}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Champ label={t('Adresse e-mail')} valeur={user?.email ?? '—'} />
              <TelephoneEnregistrable
                label={t('Téléphone')}
                valeur={user?.phone ?? ''}
                aide={t('Le même que celui de l’onglet Atelier.')}
                onEnregistrer={enregistrerTelephone}
              />
            </div>

            {/*
              Apparence — la bascule de la barre haute suffit à l'usage courant,
              mais c'est ici qu'on cherche une préférence. Radios natives plutôt
              que role="radio" : la navigation aux flèches vient gratuitement et
              sans code ARIA à maintenir.
            */}
            <div className="border-border mt-5 border-t pt-5">
              <h3 className="font-headings text-foreground text-sm font-bold">{t('Apparence')}</h3>
              <p className="text-muted-foreground mt-1 mb-3 text-xs">
                {t('Mémorisé sur cet appareil, pas sur votre compte.')}
              </p>
              <div role="radiogroup" aria-label={t('Thème de l’interface')} className="flex gap-2">
                {THEMES.map((valeur) => {
                  const actif = theme === valeur;
                  const Icone = valeur === 'dark' ? Moon : Sun;
                  return (
                    <label
                      key={valeur}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                        'has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2',
                        actif
                          ? 'border-primary bg-muted text-foreground font-medium'
                          : 'border-border text-muted-foreground hover:bg-muted',
                      )}
                    >
                      <input
                        type="radio"
                        name="theme-interface"
                        value={valeur}
                        checked={actif}
                        onChange={() => definirTheme(valeur)}
                        className="sr-only"
                      />
                      <Icone size={14} aria-hidden />
                      {t(valeur === 'dark' ? 'Sombre' : 'Clair')}
                    </label>
                  );
                })}
              </div>
            </div>

            <ChoixLangue />

            <div className="border-border mt-5 flex flex-wrap gap-2 border-t pt-5">
              {/*
                Le bouton n'avait aucun gestionnaire : cliquer dessus ne faisait
                rien, ce qui se lit comme une panne. L'écran /settings porte déjà
                les deux cas — définir un mot de passe pour un compte ouvert via
                Google, le changer pour les autres — plutôt que d'en refaire un
                troisième formulaire ici.
              */}
              <Link
                href="/settings"
                className="border-border text-foreground hover:bg-muted rounded-md border px-3 py-2 text-sm transition-colors"
              >
                {t('Changer le mot de passe')}
              </Link>
              <Button
                variante="danger"
                onClick={() => setDeconnexionOuverte(true)}
                disabled={loggingOut}
              >
                {t(loggingOut ? 'Déconnexion…' : 'Se déconnecter')}
              </Button>
            </div>
          </section>
        )}
      </div>

      {/*
        Confirmation de déconnexion.
        La description dit ce que la déconnexion coûte réellement plutôt que de
        demander « êtes-vous sûr ? » : c'est le retour par un code envoyé par
        e-mail qui décide si l'on clique, pas la question elle-même.
      */}
      <Modal
        ouvert={deconnexionOuverte}
        onFermer={() => setDeconnexionOuverte(false)}
        titre={t('Se déconnecter ?')}
        description={t(
          'Pour revenir, il faudra retaper votre mot de passe puis saisir un code envoyé à votre adresse e-mail.',
        )}
        pied={
          <>
            <Button variante="fantome" onClick={() => setDeconnexionOuverte(false)}>
              {t('Rester connecté')}
            </Button>
            <Button variante="danger" onClick={() => void seDeconnecter()} disabled={loggingOut}>
              {t(loggingOut ? 'Déconnexion…' : 'Se déconnecter')}
            </Button>
          </>
        }
      >
        <p className="text-muted-foreground text-sm">
          {t(
            'Les commandes, la caisse et les mesures restent enregistrées — c’est l’accès depuis cet appareil qui se ferme.',
          )}
        </p>
      </Modal>

      {/* Création / édition d'un tarif — écran absent des maquettes Banani. */}
      <Modal
        ouvert={tarifOuvert}
        onFermer={() => setTarifOuvert(false)}
        titre={t(tarifEdite ? 'Modifier le tarif' : 'Nouveau tarif')}
        description={t('Prix de façon appliqué par défaut à ce type de tenue.')}
        pied={
          <>
            <Button variante="fantome" onClick={() => setTarifOuvert(false)}>
              {t('Annuler')}
            </Button>
            <Button type="submit" form="formulaire-tarif">
              {t(tarifEdite ? 'Enregistrer' : 'Ajouter')}
            </Button>
          </>
        }
      >
        <form
          id="formulaire-tarif"
          onSubmit={(e) => void enregistrerTarif(e)}
          className="flex flex-col gap-4"
        >
          <Field
            label={t('Type de tenue')}
            required
            autoFocus
            placeholder={t('Boubou bazin brodé')}
            value={nomTenue}
            onChange={(e) => setNomTenue(e.target.value)}
          />
          <Field
            label={t('Prix de façon')}
            type="number"
            required
            min={0}
            step={500}
            placeholder="25000"
            aide={t('En francs CFA, sans décimales.')}
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
          />
          {echecTarif && (
            <p role="alert" className="text-danger text-sm">
              {echecTarif}
            </p>
          )}
        </form>
      </Modal>

      {/* Ajout d'un artisan — écran absent des maquettes Banani. */}
      <Modal
        ouvert={artisanOuvert}
        onFermer={() => setArtisanOuvert(false)}
        titre={t('Ajouter un artisan')}
        description={t(
          'Les initiales sont déduites du nom ; elles identifient l’artisan sur les commandes et le planning.',
        )}
        pied={
          <>
            <Button variante="fantome" onClick={() => setArtisanOuvert(false)}>
              {t('Annuler')}
            </Button>
            <Button
              type="submit"
              form="formulaire-artisan"
              disabled={!nomArtisan.trim() || envoiArtisan}
            >
              {t(envoiArtisan ? 'Ajout…' : 'Ajouter à l’équipe')}
            </Button>
          </>
        }
      >
        <form id="formulaire-artisan" onSubmit={soumettreArtisan} className="flex flex-col gap-4">
          <Field
            label={t('Nom complet')}
            required
            autoFocus
            placeholder={t('Moussa Koné')}
            value={nomArtisan}
            onChange={(e) => setNomArtisan(e.target.value)}
          />
          <Field
            label={t('Rôle')}
            required
            placeholder={t('Tailleur senior')}
            value={roleArtisan}
            onChange={(e) => setRoleArtisan(e.target.value)}
          />
          <Field
            label={t('Capacité quotidienne (heures)')}
            type="number"
            required
            min={1}
            max={16}
            aide={t(
              'Un apprenti ne tient pas les 8 h d’un tailleur senior — le planning s’appuie sur ce chiffre.',
            )}
            value={capaciteArtisan}
            onChange={(e) => setCapaciteArtisan(e.target.value)}
          />

          <ChampTelephone
            label={t('Téléphone (facultatif)')}
            valeur={telArtisan}
            onChange={setTelArtisan}
            aide={t('Pour joindre l’artisan quand une tenue est promise pour le lendemain.')}
          />

          {echecEquipe && (
            <p role="alert" className="text-danger text-sm">
              {echecEquipe}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}
