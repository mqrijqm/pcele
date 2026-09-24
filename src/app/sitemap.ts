import type { MetadataRoute } from 'next';

import { products } from '@/data/products';
import { locales } from '@/i18n/config';

import { SITE_URL } from '@/lib/site-url';

const BASE = SITE_URL;

/*
 * Cart, account i wishlist nisu ovdje namjerno: to su lične stranice bez
 * sadržaja za pretragu (vidi robots.ts i `robots: noindex` na njima).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: { path: string; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/products', changeFrequency: 'daily', priority: 0.9 },
    { path: '/pcelinjak', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/process', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/kontakt', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  ];

  /*
   * Svaka stranica postoji na dva jezika; `alternates` to javlja Googleu
   * (hreflang), da srpski posjetilac dobije /sr a engleski /en umjesto da se
   * dvije verzije iste stranice takmiče jedna s drugom.
   */
  const languages = (path: string) =>
    Object.fromEntries(locales.map((locale) => [locale, `${BASE}/${locale}${path}`]));

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE}/${locale}${page.path}`,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: languages(page.path) },
      });
    }
    for (const product of products) {
      const path = `/products/${product.slug}`;
      entries.push({
        url: `${BASE}/${locale}${path}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: languages(path) },
      });
    }
  }

  return entries;
}
