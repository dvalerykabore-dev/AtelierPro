import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format an integer amount with regular ASCII space as thousands separator.
 *
 * The result is wrapped in Unicode directional isolates (U+2066 LRI … U+2069
 * PDI). Without them, "30 000 F" dropped into an Arabic screen is reordered by
 * the bidi algorithm into "F 000 30" — the digits survive but the amount reads
 * wrong, and money that reads wrong on one screen and right on the invoice is
 * worse than money that is missing. The isolates are zero-width: they change
 * nothing outside an RTL context, and they travel with the string, so `title`
 * attributes and aria labels are covered too, unlike a CSS-only fix.
 *
 * Deliberately always fr-FR grouping, in every language: an amount in CFA
 * francs must be re-readable character for character against the invoice,
 * whatever language the person looking at the screen has chosen.
 */
export function formatPrice(amount: number, currency: string = ''): string {
  // Some locales (e.g. fr-FR) emit non-breaking spaces (U+00A0) as the
  // grouping separator; normalise any whitespace to a regular space for
  // predictable output.
  const formatted = amount.toLocaleString('fr-FR').replace(/\s/g, ' ');
  return `⁦${currency ? `${formatted} ${currency}` : formatted}⁩`;
}

/**
 * Detect in-app browsers (Facebook, Instagram, TikTok). These WebViews
 * often block redirects to native payment apps.
 */
export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|Instagram|TikTok|musical_ly|BytedanceWebview/i.test(ua);
}

/** Detect specifically the TikTok WebView. */
export function isTikTokBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /TikTok|musical_ly|BytedanceWebview/i.test(ua);
}
