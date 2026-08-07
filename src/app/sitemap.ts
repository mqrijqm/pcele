import type { MetadataRoute } from 'next';

import { posts } from '@/data/posts';
import { products } from '@/data/products';
import { locales } from '@/i18n/config';

const BASE = 'https://pcelarstvo-jevtic.ba';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: { path: string; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/products', changeFrequency: 'daily', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/process', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
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
    for (const post of posts) {
      entries.push({
        url: `${BASE}/${locale}/blog/${post.slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
