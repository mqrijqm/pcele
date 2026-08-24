/*
 * Jedna adresa sajta za sve — metadata, sitemap, robots, JSON-LD.
 *
 * Dijeljenje na mrezama trazi apsolutne URL-ove: Facebook, WhatsApp i
 * LinkedIn ne znaju sta je "/images/og/social-card.jpg" dok im ne kazes
 * na kom domenu to stoji. Ranije je ovdje bio ukucan pcelarstvo-jevtic.ba,
 * koji jos nije ziv, pa su mreze isle po sliku na domen koji ne odgovara
 * i vracale se praznih ruku.
 *
 * Redoslijed je namjeran:
 *   1. NEXT_PUBLIC_SITE_URL — kad pravi domen proradi, upise se u Vercel
 *      Environment Variables i nista drugo se ne dira.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — stalna adresa produkcije. Bira se
 *      prije VERCEL_URL, jer je VERCEL_URL adresa pojedinacnog deploya
 *      (...-a1b2c3.vercel.app) i mijenja se sa svakim pushem; kartu za
 *      dijeljenje ne treba vezivati za nesto sto sutra ima drugo ime.
 *   3. VERCEL_URL — preview build tako dijeli sopstvenu sliku, a ne onu
 *      sa produkcije.
 *   4. Produkcijski vercel.app — sigurna mreza za lokalni build.
 */
const FALLBACK = 'https://pcelarstvo-jevtic-2026.vercel.app';

function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  if (process.env.VERCEL_ENV === 'production') {
    const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (prod) return `https://${prod.replace(/\/$/, '')}`;
  }

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;

  return FALLBACK;
}

export const SITE_URL = resolve();
