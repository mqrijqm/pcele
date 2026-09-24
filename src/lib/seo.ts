import type { Metadata } from 'next';

import { locales, type Locale } from '@/i18n/config';
import { SITE_URL } from '@/lib/site-url';

/*
 * Metadata za svaku unutrašnju stranu, na jednom mjestu.
 *
 * Zašto ovo postoji: layout postavlja `canonical: /sr` i Open Graph podatke
 * početne, a strane ih naslijede ako ne kažu drugačije. Rezultat je bio da
 * svaka strana (proizvodi, kontakt...) Googleu javlja da je njena prava adresa
 * početna — što se čita kao "ova strana je kopija početne" — i da link na
 * proizvod podijeljen na WhatsAppu nosi naslov početne. Ovdje svaka strana
 * dobija svoju adresu, svoj naslov i svoj opis.
 *
 * Slika za dijeljenje je uvijek dizajnirana karta 1200x630 (JPG, jer WebP
 * LinkedIn i WhatsApp znaju da preskoče — vidi layout).
 */

const SITE_NAME = 'Pčelarstvo Jevtić';
const OG_IMAGE = '/images/og/social-card.jpg';
const OG_ALT: Record<Locale, string> = {
  sr: 'Tegla livadskog meda u pletenoj korpi, na platnu i poljskom cvijeću',
  en: 'A jar of meadow honey in a woven basket, on linen and wild flowers',
};

/** Google prikazuje ~160 znakova opisa; duži se odsijeca usred riječi. Režemo mi, na kraju riječi. */
export function clip(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.—-]+$/, '')}…`;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
}: {
  locale: Locale;
  /** Putanja bez jezika, npr. '/products' ili '/products/bagremov-med-1kg'. */
  path: string;
  title: string;
  description: string;
  /** Lične strane (korpa, nalog, lista želja) — ne idu u pretragu. */
  noindex?: boolean;
}): Metadata {
  const summary = clip(description);
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description: summary,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
    },
    openGraph: {
      title: fullTitle,
      description: summary,
      url: `${SITE_URL}/${locale}${path}`,
      siteName: SITE_NAME,
      locale: locale === 'sr' ? 'sr_BA' : 'en_US',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_ALT[locale] }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: summary,
      images: [OG_IMAGE],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
