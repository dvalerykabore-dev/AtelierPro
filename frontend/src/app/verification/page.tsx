'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { api, ApiError, storeCsrfToken } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLangue } from '@/contexts/LangueContext';

const MESSAGES: Record<string, string> = {
  INVALID_CODE: 'Code invalide ou expiré. Vérifiez les 8 caractères saisis.',
  CODE_EXPIRED: 'Ce code a expiré. Demandez-en un nouveau.',
  TOO_MANY_ATTEMPTS: 'Trop de tentatives. Réessayez dans quelques minutes.',
};

function FormulaireVerification() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();

  const { t } = useLangue();
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [renvoye, setRenvoye] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await api<{ csrfToken?: string }>('/api/auth/verify-email', {
        method: 'POST',
        // Le code est saisi en Crockford base32 : on normalise la casse pour
        // éviter un rejet purement cosmétique.
        body: { email, code: code.trim().toUpperCase() },
      });
      if (res.csrfToken) storeCsrfToken(res.csrfToken);
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? (MESSAGES[err.code ?? ''] ?? err.message)
          : 'Impossible de joindre le serveur.',
      );
    } finally {
      setEnvoi(false);
    }
  }

  async function renvoyer() {
    setErreur(null);
    setRenvoye(false);
    try {
      await api('/api/auth/resend-verification', { method: 'POST', body: { email } });
      setRenvoye(true);
    } catch (err) {
      // La route est volontairement non-révélatrice : on affiche le même
      // message de succès quoi qu'il arrive, sauf limitation de débit.
      if (err instanceof ApiError && err.status === 429) {
        setErreur('Trop de demandes. Patientez quelques minutes.');
      } else {
        setRenvoye(true);
      }
    }
  }

  return (
    <AuthCard
      titre={t('Vérifiez votre e-mail')}
      sousTitre={t('Saisissez le code à 8 caractères que nous venons de vous envoyer.')}
      pied={
        <>
          {t('Mauvaise adresse ?')}{' '}
          <Link href="/inscription" className="text-primary font-medium">
            {t('Recommencer l’inscription')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          label={t('Adresse e-mail')}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label={t('Code de vérification')}
          required
          inputMode="text"
          autoComplete="one-time-code"
          maxLength={8}
          placeholder="A1B2C3D4"
          className="text-center font-mono text-lg tracking-[0.3em] uppercase"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {erreur && (
          <p role="alert" className="text-danger flex items-start gap-2 text-sm">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {t(erreur)}
          </p>
        )}
        {renvoye && !erreur && (
          <p role="status" className="text-success flex items-start gap-2 text-sm">
            <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {t('Si un compte existe pour cette adresse, un nouveau code vient d’être envoyé.')}
          </p>
        )}

        <Button type="submit" taille="lg" pleineLargeur disabled={envoi}>
          {t(envoi ? 'Vérification…' : 'Vérifier mon compte')}
        </Button>

        <Button type="button" variante="fantome" taille="sm" onClick={renvoyer} disabled={!email}>
          {t('Renvoyer le code')}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function VerificationPage() {
  const { t } = useLangue();
  // `useSearchParams` impose une frontière Suspense côté App Router.
  return (
    <Suspense fallback={<AuthCard titre={t('Vérifiez votre e-mail')}>{t('Chargement…')}</AuthCard>}>
      <FormulaireVerification />
    </Suspense>
  );
}
