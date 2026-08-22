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
  matcher: [
    '/((?!api|_next|images|icons|hero|manifest.json|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
