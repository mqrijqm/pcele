import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import '../globals.css';

import { isLocale, locales, type Locale } from '@/i18n/config';
import { meta } from '@/content/pages';
import { CartProvider } from '@/lib/cart';
import { WishlistProvider } from '@/lib/wishlist';
import Header from '@/components/layout/Header';
import Preloader from '@/components/layout/Preloader';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CookieConsent from '@/components/layout/CookieConsent';
import RevealObserver from '@/components/ui/RevealObserver';

// Sans nosi sve sitno: navigaciju, tekst, dugmad, cene.
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

// Gazpacho je brend serif. Cuva se za krupnu tipografiju — naslove sekcija,
// wordmark i citate. Browser skida samo one rezove koje stranica stvarno koristi.
const gazpacho = localFont({
  src: [
    { path: '../../fonts/Gazpacho-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../fonts/Gazpacho-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/Gazpacho-Italic.woff2', weight: '400', style: 'italic' },
    { path: '../../fonts/Gazpacho-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/Gazpacho-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../fonts/Gazpacho-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-gazpacho',
  display: 'swap',
});

// General Sans carries the small caps labels — the brand's grotesque.
const generalSans = localFont({
  src: [
    { path: '../../fonts/GeneralSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/GeneralSans-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-general',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  const page = meta[l].home;

  return {
    metadataBase: new URL('https://pcelarstvo-jevtic.ba'),
    title: { default: page.title, template: '%s | Pčelarstvo Jevtić' },
    description: page.description,
    authors: [{ name: 'Pčelarstvo Jevtić' }],
    keywords: ['med', 'pčelarstvo', 'honey', 'propolis', 'Bosna', 'Prnjavor', 'prirodan med'],
    manifest: '/manifest.json',
    alternates: {
      canonical: `/${l}`,
      languages: { sr: '/sr', en: '/en' },
    },
    openGraph: {
      title: l === 'sr' ? 'Tradicija u svakoj kapi' : 'Tradition in every drop',
      description:
        l === 'sr'
          ? 'Med iz srca bosanskih livada, proizveden s ljubavlju već tri generacije'
          : 'Honey from the heart of Bosnian meadows, made with love for three generations',
      url: 'https://pcelarstvo-jevtic.ba',
      siteName: 'Pčelarstvo Jevtić',
      locale: l === 'sr' ? 'sr_BA' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/real/kosnice-livada.webp',
          width: 1200,
          height: 630,
          alt: l === 'sr' ? 'Tradicija u svakoj kapi' : 'Tradition in every drop',
        },
      ],
    },
    twitter: { card: 'summary_large_image' },
    icons: {
      icon: [
        { url: '/images/icons/brand-mark-16.png', sizes: '16x16', type: 'image/png' },
        { url: '/images/icons/brand-mark-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/images/icons/brand-mark-48.png', sizes: '48x48', type: 'image/png' },
      ],
      apple: [{ url: '/images/icons/brand-mark-180.png', sizes: '180x180', type: 'image/png' }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#73552E',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${gazpacho.variable} ${generalSans.variable}`}
      // The inline script below adds `js-reveal` before React hydrates, so the
      // server and client markup differ on this element by design.
      suppressHydrationWarning
    >
      <head>
        {/*
          * Both flags are set from script, never from the server markup, so a
          * page with no JS is never left hidden or unscrollable. The timeout is
          * a dead-man's switch: if the curtain's own code never runs, scrolling
          * comes back by itself.
          */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js-reveal','is-preloading');" +
              "setTimeout(function(){d.classList.remove('is-preloading')},8000);",
          }}
        />
      </head>
      <body>
        <Preloader />
        <SmoothScroll />
        <CartProvider>
          <WishlistProvider>
            <RevealObserver />
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
            <CartDrawer locale={locale} />
            <CookieConsent locale={locale} />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
