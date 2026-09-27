// /settings — account-level controls.
//
// Two flows live here today:
//   1. Set / change password
//      - If the account was created via OAuth (hasPassword=false), the
//        "Set password" form calls POST /api/auth/set-password — no current
//        password required, because there isn't one.
//      - Otherwise the "Change password" form calls PUT /api/auth/change-password
//        with currentPassword + newPassword.
//   2. Link a provider (Google)
//      - When Google is not already linked, the button kicks the user to
//        GET /api/auth/oauth/google/start?next=/settings, which goes through
//        the normal OAuth dance and lands back on /settings linked.
//      - When already linked, we just show a "linked" pill — no unlink action
//        yet (would need a /api/auth/oauth/google/unlink endpoint with a
//        guard refusing to leave the user without any sign-in method).
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { useAuth, useUser } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useT } from '@/contexts/LangueContext';

export default function SettingsPage() {
  const t = useT();
  const user = useUser();
  const { refresh } = useAuth();
  const { toast } = useToast();

  // Password form state — fields used by either branch.
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-2 px-4">
        <p className="text-sm text-muted-foreground">{t('Chargement…')}</p>
      </main>
    );
  }

  const hasPassword = user.hasPassword;
  const googleLinked = user.linkedProviders.includes('google');

  async function onSubmitPassword(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length === 0) {
      setError(t('Saisis un nouveau mot de passe.'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('La confirmation ne correspond pas au nouveau mot de passe.'));
      return;
    }

    setSubmitting(true);
    try {
      if (hasPassword) {
        await api('/api/auth/change-password', {
          method: 'PUT',
          body: { currentPassword, newPassword },
        });
        toast(t('Mot de passe mis à jour.'), 'success');
      } else {
        await api('/api/auth/set-password', {
          method: 'POST',
          body: { newPassword },
        });
        toast(t('Mot de passe défini. Tu peux maintenant te connecter par email.'), 'success');
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        const map: Record<string, string> = {
          INVALID_CREDENTIALS: t('Mot de passe actuel incorrect.'),
          PASSWORD_BANNED: t('Ce mot de passe est trop courant.'),
          PASSWORD_TOO_SHORT: err.message || t('Mot de passe trop court.'),
          PASSWORD_PWNED: t('Ce mot de passe a fuité — choisis-en un autre.'),
          PASSWORD_ALREADY_SET: t(
            'Un mot de passe est déjà défini. Utilise « changer le mot de passe ».',
          ),
          VALIDATION_FAILED: t('Champs invalides.'),
        };
        setError(map[err.code] ?? err.message);
      } else {
        setError(t('Erreur réseau. Réessaie.'));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-8 px-4 py-12">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{t('Paramètres')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('Connecté en tant que {email}', { email: user.email })}
        </p>
      </header>

      {/* ── Password section ─────────────────────────────────────────── */}
      <section className="flex flex-col gap-3 rounded-lg border border-border p-5">
        <h2 className="text-lg font-semibold">
          {t(hasPassword ? 'Changer le mot de passe' : 'Définir un mot de passe')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {hasPassword
            ? t('Tu peux modifier ton mot de passe ici. Les autres sessions seront déconnectées.')
            : t(
                'Tu t’es connecté via Google. Définis un mot de passe pour pouvoir aussi te connecter par email.',
              )}
        </p>
        <form onSubmit={onSubmitPassword} className="mt-2 flex flex-col gap-4">
          {hasPassword && (
            <label className="flex flex-col gap-1 text-sm">
              {t('Mot de passe actuel')}
              <input
                type="password"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-md border border-border px-3 py-2"
              />
            </label>
          )}
          <label className="flex flex-col gap-1 text-sm">
            {t('Nouveau mot de passe')}
            <input
              type="password"
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-md border border-border px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            {t('Confirmer le nouveau mot de passe')}
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md border border-border px-3 py-2"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent disabled:opacity-50"
          >
            {submitting
              ? t('Enregistrement…')
              : t(hasPassword ? 'Changer le mot de passe' : 'Définir le mot de passe')}
          </button>
        </form>
      </section>

      {/* ── Linked providers section ────────────────────────────────── */}
      <section className="flex flex-col gap-3 rounded-lg border border-border p-5">
        <h2 className="text-lg font-semibold">{t('Comptes liés')}</h2>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{t('Google')}</span>
            <span className="text-xs text-muted-foreground">
              {t(
                googleLinked
                  ? 'Tu peux te connecter via Google.'
                  : 'Lie ton compte Google pour te connecter en un clic.',
              )}
            </span>
          </div>
          {googleLinked ? (
            <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              {t('Lié')}
            </span>
          ) : (
            <a
              href="/api/auth/oauth/google/start?next=/settings"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              {t('Lier Google')}
            </a>
          )}
        </div>
      </section>

      <Link href="/dashboard" className="text-center text-sm text-muted-foreground underline">
        {t('Retour au dashboard')}
      </Link>
    </main>
  );
}
