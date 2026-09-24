import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site-url';

/*
 * Korpa, nalog i lista zelja se ne zabranjuju ovdje nego `noindex` oznakom na
 * samim stranicama. Ako bi ih robots.txt zabranio, Google ne bi smio ni da ih
 * otvori — pa nikad ne bi vidio `noindex`, i mogao bi da ih ipak prikaze.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
