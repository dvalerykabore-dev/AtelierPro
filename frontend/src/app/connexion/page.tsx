'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, MailCheck } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import BoutonGoogle from '@/components/auth/BoutonGoogle';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { api, ApiError, storeCsrfToken } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLangue } from '@/contexts/LangueContext';

/** Messages métier — l'API renvoie des codes stables, pas du texte à afficher. */
const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Adresse e-mail ou mot de passe incorrect.',
  EMAIL_NOT_VERIFIED: 'Votre compte n’est pas encore vérifié. Consultez vos e-mails.',
  LOCKED_OUT: 'Trop de tentatives. Réessayez dans quelques minutes.',
  TOO_MANY_LOGIN_ATTEMPTS: 'Trop de tentatives. Réessayez dans quelques minutes.',
  ACCOUNT_SUSPENDED: 'Ce compte est suspendu. Contactez le support.',
  LOGIN_CODE_NOT_SENT: 'Le code n’a pas pu être envoyé. Réessayez dans un instant.',
  LOGIN_CODE_INVALID: 'Code incorrect. Vérifiez les 8 caractères reçus par e-mail.',
  LOGIN_CODE_EXPIRED: 'Ce code a expiré. Demandez-en un nouveau.',
  LOGIN_CODE_BURNED: 'Trop d’essais sur ce code. Demandez-en un nouveau.',
  TOO_MANY_VERIFY_ATTEMPTS: 'Trop de tentatives. Réessayez dans quelques minutes.',
};

function messageDe(err: unknown, defaut = 'Impossible de joindre le serveur.'): string {
  if (!(err instanceof ApiError)) return defaut;
  return MESSAGES[err.code ?? ''] ?? err.message;
}

/**
 * Connexion en deux temps : mot de passe, puis code reçu par e-mail.
 *
 * Les deux étapes vivent sur la même page plutôt que sur deux routes. Le mot de
 * passe reste alors en mémoire du composant — jamais dans l'URL, jamais en
 * stockage — ce qui permet de redemander un code sans le faire retaper, et de
 * revenir en arrière si l'adresse saisie était la mauvaise. Une seconde page
 * aurait imposé de faire transiter l'adresse par la barre d'URL, comme le fait
 * `/verification`, et n'aurait rien su du mot de passe.
 */
export default function ConnexionPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const { t } = useLangue();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [code, setCode] = useState('');
  const [etape, setEtape] = useState<'identifiants' | 'code'>('identifiants');
  const [erreur, setErreur] = useState<string | null>(null);
  const [renvoye, setRenvoye] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  /** Entre dans la session : cookies déjà posés par la route, il reste à relire /me. */
  async function entrer(csrfToken?: string) {
    if (csrfToken) storeCsrfToken(csrfToken);
    await refresh();
    router.push('/dashboard');
  }

  async function soumettreIdentifiants(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await api<{ csrfToken?: string; challenge?: boolean }>('/api/auth/login', {
        method: 'POST',
        body: { email, password: motDePasse },
      });

      // Sans fournisseur d'e-mail configuré, le serveur ouvre directement la
      // session : il n'y a alors pas de code à attendre.
      if (!res.challenge) {
        await entrer(res.csrfToken);
        return;
      }

      setCode('');
      setRenvoye(false);
      setEtape('code');
    } catch (err) {
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_VERIFIED') {
        router.push(`/verification?email=${encodeURIComponent(email)}`);
        return;
      }
      setErreur(messageDe(err, 'Impossible de joindre le serveur. Vérifiez votre connexion.'));
    } finally {
      setEnvoi(false);
    }
  }

  async function soumettreCode(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await api<{ csrfToken?: string }>('/api/auth/verify-login', {
        method: 'POST',
        // Le code est saisi en Crockford base32 : on normalise la casse pour
        // éviter un rejet purement cosmétique.
        body: { email, code: code.trim().toUpperCase() },
      });
      await entrer(res.csrfToken);
    } catch (err) {
      setErreur(messageDe(err));
    } finally {
      setEnvoi(false);
    }
  }

  /**
   * Redemande un code en rejouant la connexion.
   *
   * Pas de route de renvoi dédiée : celle-ci revaliderait le mot de passe ou
   * s'en passerait. S'en passer laisserait n'importe qui faire pleuvoir des
   * codes sur l'adresse d'un atelier. Rejouer `/api/auth/login` réutilise le
   * mot de passe déjà en mémoire, ses limites de débit et son verrouillage.
   */
  async function renvoyer() {
    setEnvoi(true);
    setErreur(null);
    setRenvoye(false);
    try {
      await api('/api/auth/login', { method: 'POST', body: { email, password: motDePasse } });
      setCode('');
      setRenvoye(true);
    } catch (err) {
      setErreur(messageDe(err));
    } finally {
      setEnvoi(false);
    }
  }

  function revenir() {
    setEtape('identifiants');
    setCode('');
    setErreur(null);
    setRenvoye(false);
  }

  const bandeauErreur = erreur && (
    <p role="alert" className="text-danger flex items-start gap-2 text-sm">
      <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
      {t(erreur)}
    </p>
  );

  if (etape === 'code') {
    return (
      <AuthCard
        titre={t('Confirmer la connexion')}
        sousTitre={t('Un code à 8 caractères vient d’être envoyé à {email}.', { email })}
        pied={
          <button
            type="button"
            onClick={revenir}
            className="text-primary inline-flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft size={13} data-miroir aria-hidden />
            {t('Changer d’adresse')}
          </button>
        }
      >
        <form onSubmit={soumettreCode} className="flex flex-col gap-4">
          <Field
            label={t('Code reçu par e-mail')}
            required
            autoFocus
            autoComplete="one-time-code"
            inputMode="text"
            maxLength={8}
            placeholder="A1B2C3D4"
            aide={t('Il expire au bout de quelques minutes.')}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="text-center font-mono tracking-[0.3em] uppercase"
          />

          {renvoye && !erreur && (
            <p className="text-success flex items-start gap-2 text-sm">
              <MailCheck size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
              {t('Nouveau code envoyé. Le précédent ne fonctionne plus.')}
            </p>
          )}

          {bandeauErreur}

          <Button
            type="submit"
            taille="lg"
            pleineLargeur
            disabled={envoi || code.trim().length !== 8}
          >
            {t(envoi ? 'Vérification…' : 'Confirmer')}
          </Button>

          <button
            type="button"
            onClick={() => void renvoyer()}
            disabled={envoi}
            className="text-muted-foreground hover:text-primary text-xs disabled:opacity-50"
          >
            {t('Je n’ai rien reçu — renvoyer un code')}
          </button>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      titre={t('Connexion')}
      sousTitre={t('Accédez à vos commandes, votre planning et vos clients.')}
      pied={
        <>
          {t('Pas encore de compte ?')}{' '}
          <Link href="/inscription" className="text-primary font-medium">
            {t('Créer un atelier')}
          </Link>
        </>
      }
    >
      <form onSubmit={soumettreIdentifiants} className="flex flex-col gap-4">
        <Field
          label={t('Adresse e-mail')}
          type="email"
          required
          autoComplete="email"
          placeholder="vous@atelier.bf"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <Field
            label={t('Mot de passe')}
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          <Link
            href="/mot-de-passe-oublie"
            className="text-muted-foreground hover:text-primary self-end text-xs"
          >
            {t('Mot de passe oublié ?')}
          </Link>
        </div>

        {bandeauErreur}

        <Button type="submit" taille="lg" pleineLargeur disabled={envoi}>
          {t(envoi ? 'Connexion…' : 'Se connecter')}
        </Button>
      </form>

      <BoutonGoogle />
    </AuthCard>
  );
}
