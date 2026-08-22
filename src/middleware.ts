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
  // `models` mora ovde — inace bi /models/tegla.glb bio preusmeren na
  // /sr/models/tegla.glb, gde fajla nema, pa 3D scena ostane prazna.
  matcher: [
    '/((?!api|_next|images|icons|models|manifest.json|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
