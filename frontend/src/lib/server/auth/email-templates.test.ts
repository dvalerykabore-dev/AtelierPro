import { describe, it, expect } from 'vitest';
import { verificationEmail, resetPasswordEmail, loginCodeEmail } from './email-templates';

describe('verificationEmail', () => {
  it('returns { subject, html, text } all non-empty', () => {
    const t = verificationEmail({ code: 'ABCD2345', email: 'a@b.com' });
    expect(t.subject).toBeTruthy();
    expect(t.html).toBeTruthy();
    expect(t.text).toBeTruthy();
  });

  it('embeds the code in both html and text', () => {
    const t = verificationEmail({ code: 'ABCD2345', email: 'a@b.com' });
    expect(t.html).toContain('ABCD2345');
    expect(t.text).toContain('ABCD2345');
  });

  it('subject matches expected', () => {
    const t = verificationEmail({ code: 'XYZ12345', email: 'x@y.com' });
    expect(t.subject).toBe('Verify your email');
  });

  it('renders "in N minutes" when expiresAt is provided (O1 audit fix)', () => {
    const expiresAt = new Date(Date.now() + 15 * 60_000).toISOString();
    const t = verificationEmail({ code: 'ABCD2345', email: 'a@b.com', expiresAt });
    // floor-biased: with 15 min remaining the actual rendered value can be
    // 14 or 15 — either is acceptable.
    expect(t.text).toMatch(/in 1[45] minutes/);
    expect(t.html).toMatch(/in 1[45] minutes/);
  });

  it('renders "in N hours" for multi-hour TTLs', () => {
    // +1 min buffer so the floor-biased rounding can't drop minutes to 119
    // (which would render "in 1 hour" instead of "in 2 hours" — a latent
    // flake fixed by audit pass 2).
    const expiresAt = new Date(Date.now() + 2 * 60 * 60_000 + 60_000).toISOString();
    const t = verificationEmail({ code: 'ABCD2345', email: 'a@b.com', expiresAt });
    expect(t.text).toContain('in 2 hours');
  });

  it('falls back to "soon" when expiresAt is omitted', () => {
    const t = verificationEmail({ code: 'ABCD2345', email: 'a@b.com' });
    expect(t.text).toContain('expires soon');
  });

  it('falls back to "soon" when expiresAt is malformed', () => {
    const t = verificationEmail({
      code: 'ABCD2345',
      email: 'a@b.com',
      expiresAt: 'not-an-iso-date',
    });
    expect(t.text).toContain('expires soon');
  });

  it('falls back to "soon" when expiresAt is already in the past', () => {
    const expiresAt = new Date(Date.now() - 1000).toISOString();
    const t = verificationEmail({ code: 'ABCD2345', email: 'a@b.com', expiresAt });
    expect(t.text).toContain('expires soon');
  });
});

describe('resetPasswordEmail', () => {
  it('returns { subject, html, text } all non-empty', () => {
    const t = resetPasswordEmail({ code: 'WXYZ9876', email: 'a@b.com' });
    expect(t.subject).toBeTruthy();
    expect(t.html).toBeTruthy();
    expect(t.text).toBeTruthy();
  });

  it('embeds the code in both html and text', () => {
    const t = resetPasswordEmail({ code: 'WXYZ9876', email: 'a@b.com' });
    expect(t.html).toContain('WXYZ9876');
    expect(t.text).toContain('WXYZ9876');
  });

  it('subject matches expected', () => {
    const t = resetPasswordEmail({ code: 'ABCD2345', email: 'a@b.com' });
    expect(t.subject).toBe('Reset your password');
  });

  it('renders "in N minutes" when expiresAt is provided (O1 audit fix)', () => {
    const expiresAt = new Date(Date.now() + 15 * 60_000).toISOString();
    const t = resetPasswordEmail({ code: 'WXYZ9876', email: 'a@b.com', expiresAt });
    expect(t.text).toMatch(/in 1[45] minutes/);
  });
});

describe('loginCodeEmail', () => {
  const DANS_9_MIN = new Date(Date.now() + 9 * 60_000 + 30_000).toISOString();

  it('porte le code dans les deux corps', () => {
    const t = loginCodeEmail({ code: 'ABCD2345', email: 'a@b.com', expiresAt: DANS_9_MIN });
    expect(t.html).toContain('ABCD2345');
    expect(t.text).toContain('ABCD2345');
  });

  it('met le code dans l’objet — il se lit depuis la notification du téléphone', () => {
    // En atelier, on lit la vignette sans ouvrir l'e-mail : le code y est déjà.
    const t = loginCodeEmail({ code: 'ABCD2345', email: 'a@b.com' });
    expect(t.subject).toContain('ABCD2345');
  });

  it('dit de changer le mot de passe, pas d’ignorer l’e-mail', () => {
    // Recevoir ce code sans l'avoir demandé signifie que quelqu'un connaît le
    // mot de passe. « Ignorez cet e-mail » serait ici un mauvais conseil.
    const t = loginCodeEmail({ code: 'ABCD2345', email: 'a@b.com' });
    expect(t.text).toMatch(/changez-le/i);
    expect(t.text).not.toMatch(/ignorez/i);
  });

  it('arrondit le délai vers le bas — jamais promettre plus de temps qu’il n’en reste', () => {
    const t = loginCodeEmail({ code: 'ABCD2345', email: 'a@b.com', expiresAt: DANS_9_MIN });
    expect(t.text).toContain('dans 9 minutes');
  });

  it('reste vague plutôt que faux quand l’échéance manque ou est illisible', () => {
    expect(loginCodeEmail({ code: 'ABCD2345', email: 'a@b.com' }).text).toContain('sous peu');
    expect(
      loginCodeEmail({ code: 'ABCD2345', email: 'a@b.com', expiresAt: 'n’importe quoi' }).text,
    ).toContain('sous peu');
  });

  it('accorde le singulier', () => {
    const dans1min = new Date(Date.now() + 90_000).toISOString();
    expect(loginCodeEmail({ code: 'A', email: 'a@b.com', expiresAt: dans1min }).text).toContain(
      'dans 1 minute.',
    );
  });

  it('échappe le HTML du code interpolé', () => {
    // Le format amont interdit ces caractères ; l'échappement est là pour le
    // jour où quelqu'un élargit l'alphabet sans y penser.
    const t = loginCodeEmail({ code: '<script>x</script>', email: 'a@b.com' });
    expect(t.html).not.toContain('<script>');
    expect(t.html).toContain('&lt;script&gt;');
  });
});
