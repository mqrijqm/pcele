import type { MetadataRoute } from 'next';

import { products } from '@/data/products';
import { locales } from '@/i18n/config';

import { SITE_URL } from '@/lib/site-url';

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: { path: string; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/products', changeFrequency: 'daily', priority: 0.9 },
    { path: '/process', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE}/${locale}${page.path}`,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
    for (const product of products) {
      entries.push({
        url: `${BASE}/${locale}/products/${product.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
