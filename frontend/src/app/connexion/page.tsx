'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { api, ApiError, storeCsrfToken } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Connexion à l'atelier.
 *
 * La connexion Google est une navigation de premier niveau (pas un `fetch`) :
 * le navigateur doit porter les cookies et recevoir le `Set-Cookie` du callback
 * OAuth. D'où le `<a>` plutôt qu'un `<Link>` ou un appel API.
 */
const lienGoogle = '/api/auth/oauth/google/start?next=/dashboard';

/** Messages métier — l'API renvoie des codes stables, pas du texte à afficher. */
const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Adresse e-mail ou mot de passe incorrect.',
  EMAIL_NOT_VERIFIED: 'Votre compte n’est pas encore vérifié. Consultez vos e-mails.',
  LOCKED_OUT: 'Trop de tentatives. Réessayez dans quelques minutes.',
  TOO_MANY_LOGIN_ATTEMPTS: 'Trop de tentatives. Réessayez dans quelques minutes.',
};

export default function ConnexionPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await api<{ csrfToken?: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password: motDePasse },
      });
      if (res.csrfToken) storeCsrfToken(res.csrfToken);
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'EMAIL_NOT_VERIFIED') {
          router.push(`/verification?email=${encodeURIComponent(email)}`);
          return;
        }
        setErreur(MESSAGES[err.code ?? ''] ?? err.message);
      } else {
        setErreur('Impossible de joindre le serveur. Vérifiez votre connexion.');
      }
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <AuthCard
      titre="Connexion"
      sousTitre="Accédez à vos commandes, votre planning et vos clients."
      pied={
        <>
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="text-primary font-medium">
            Créer un atelier
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          label="Adresse e-mail"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@atelier.bf"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <Field
            label="Mot de passe"
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
            Mot de passe oublié ?
          </Link>
        </div>

        {erreur && (
          <p role="alert" className="text-danger flex items-start gap-2 text-sm">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {erreur}
          </p>
        )}

        <Button type="submit" taille="lg" pleineLargeur disabled={envoi}>
          {envoi ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>

      <div className="text-muted-foreground my-5 flex items-center gap-3 text-xs tracking-widest uppercase">
        <span className="bg-border h-px flex-1" />
        ou
        <span className="bg-border h-px flex-1" />
      </div>

      <a
        href={lienGoogle}
        className="border-border text-foreground hover:bg-muted flex w-full items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm font-medium transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuer avec Google
      </a>
    </AuthCard>
  );
}
