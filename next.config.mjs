/*
 * Sigurnosni headeri idu uz svaki odgovor.
 *
 * HTTPS: Vercel vec preusmjerava http -> https, ali HSTS kaze browseru da
 * vise ni ne pokusava http za ovaj domen (dvije godine). `preload` je
 * namjerno izostavljen — to je jednosmjerna prijava na listu browsera i
 * radi se tek kad je pravi domen zauvijek odlucen.
 *
 * Content-Security-Policy ovdje NIJE: sajt ima inline skriptu u <head> i
 * Next-ove inline skripte, pa bi ozbiljan CSP trazio nonce po zahtjevu.
 * Losa CSP-a koja ne blokira nista je gora od nikakve, jer lazno umiruje.
 */
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Landing photographs are already compressed WebP files and are preloaded
  // under these exact URLs, so Image must reuse that browser cache directly.
  images: { unoptimized: true },
  // Ne oglasavamo "X-Powered-By: Next.js" — nikome ne treba, a napadacu je putokaz.
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
