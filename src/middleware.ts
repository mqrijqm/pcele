import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales } from '@/i18n/config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Everything else is treated as a default-locale path: / → /sr, /products → /sr/products
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Svaki folder iz `public/` mora ovde — inace bi /hero/jar.png bio
  // preusmeren na /sr/hero/jar.png, gde fajla nema, pa slika ne bi radila.
  //
  // `_vercel` je Vercelova sopstvena putanja (skripta za analitiku je na
  // /_vercel/insights/script.js). Lokalno je nema, pa se ne vidi — ali na Vercelu
  // bi je middleware preusmjerio na /sr/_vercel/... i skripta se nikad ne bi ucitala.
  matcher: [
    '/((?!api|_next|_vercel|images|icons|hero|splash|lab|manifest.json|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
