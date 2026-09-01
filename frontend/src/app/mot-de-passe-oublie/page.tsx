'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import { useLangue } from '@/contexts/LangueContext';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { api, ApiError } from '@/lib/api';

export default function MotDePasseOubliePage() {
  const { t } = useLangue();
  const [email, setEmail] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await api('/api/auth/forgot-password', { method: 'POST', body: { email } });
      setEnvoye(true);
    } catch (err) {
      // La route est volontairement non-révélatrice (elle répond toujours de la
      // même façon, à durée constante) : seule une limitation de débit mérite
      // un message distinct.
      if (err instanceof ApiError && err.status === 429) {
        setErreur('Trop de demandes. Patientez quelques minutes.');
      } else {
        setEnvoye(true);
      }
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <AuthCard
      titre={t('Mot de passe oublié')}
      sousTitre={t('Nous vous envoyons un code pour en choisir un nouveau.')}
      pied={
        <>
          {t('Vous vous en souvenez ?')}{' '}
          <Link href="/connexion" className="text-primary font-medium">
            {t('Se connecter')}
          </Link>
        </>
      }
    >
      {envoye && !erreur ? (
        <div className="flex flex-col gap-4">
          <p className="text-success flex items-start gap-2 text-sm">
            <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {t(
              'Si un compte existe pour {email}, un code de réinitialisation vient d’être envoyé.',
              {
                email,
              },
            )}
          </p>
          <Link href={`/reinitialiser?email=${encodeURIComponent(email)}`}>
            <Button taille="lg" pleineLargeur>
              {t('J’ai reçu mon code')}
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Field
            label={t('Adresse e-mail')}
            type="email"
            required
            autoComplete="email"
            placeholder="vous@atelier.bf"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {erreur && (
            <p role="alert" className="text-danger flex items-start gap-2 text-sm">
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
              {t(erreur)}
            </p>
          )}

          <Button type="submit" taille="lg" pleineLargeur disabled={envoi}>
            {t(envoi ? 'Envoi…' : 'Envoyer le code')}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
