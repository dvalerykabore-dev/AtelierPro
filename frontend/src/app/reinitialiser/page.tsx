'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import { useLangue } from '@/contexts/LangueContext';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { api, ApiError } from '@/lib/api';

const MESSAGES: Record<string, string> = {
  INVALID_CODE: 'Code invalide ou expiré. Vérifiez les 8 caractères saisis.',
  CODE_EXPIRED: 'Ce code a expiré. Demandez-en un nouveau.',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit faire au moins 10 caractères.',
  PASSWORD_BANNED: 'Ce mot de passe est trop courant. Choisissez-en un autre.',
  PASSWORD_PWNED: 'Ce mot de passe a fuité lors d’une brèche connue. Choisissez-en un autre.',
};

function FormulaireReinitialisation() {
  const router = useRouter();
  const params = useSearchParams();

  const { t } = useLangue();
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [code, setCode] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await api('/api/auth/reset-password', {
        method: 'POST',
        body: { email, code: code.trim().toUpperCase(), password: motDePasse },
      });
      // La réinitialisation invalide les sessions existantes : on repasse par
      // la connexion plutôt que de supposer que l'utilisateur est authentifié.
      router.push('/connexion?reinitialise=1');
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

  return (
    <AuthCard
      titre={t('Nouveau mot de passe')}
      sousTitre={t('Saisissez le code reçu par e-mail et choisissez votre nouveau mot de passe.')}
      pied={
        <>
          {t('Code perdu ?')}{' '}
          <Link href="/mot-de-passe-oublie" className="text-primary font-medium">
            {t('En demander un autre')}
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
          label={t('Code reçu')}
          required
          maxLength={8}
          autoComplete="one-time-code"
          placeholder="A1B2C3D4"
          className="text-center font-mono text-lg tracking-[0.3em] uppercase"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Field
          label={t('Nouveau mot de passe')}
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          placeholder="••••••••••"
          aide={t('10 caractères minimum.')}
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        {erreur && (
          <p role="alert" className="text-danger flex items-start gap-2 text-sm">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {t(erreur)}
          </p>
        )}

        <Button type="submit" taille="lg" pleineLargeur disabled={envoi}>
          {t(envoi ? 'Enregistrement…' : 'Changer mon mot de passe')}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function ReinitialiserPage() {
  return (
    <Suspense fallback={<AuthCard titre="Nouveau mot de passe">Chargement…</AuthCard>}>
      <FormulaireReinitialisation />
    </Suspense>
  );
}
