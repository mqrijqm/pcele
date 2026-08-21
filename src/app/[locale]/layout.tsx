import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { DM_Sans, Newsreader } from 'next/font/google';
import '../globals.css';

import { isLocale, locales, type Locale } from '@/i18n/config';
import { meta } from '@/content/pages';
import { CartProvider } from '@/lib/cart';
import { WishlistProvider } from '@/lib/wishlist';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CookieConsent from '@/components/layout/CookieConsent';
import RevealObserver from '@/components/ui/RevealObserver';

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-newsreader',
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
      icon: [{ url: '/images/icons/brand-mark.png', sizes: '32x32', type: 'image/png' }],
      apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
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
      className={`${dmSans.variable} ${newsreader.variable}`}
      // The inline script below adds `js-reveal` before React hydrates, so the
      // server and client markup differ on this element by design.
      suppressHydrationWarning
    >
      <head>
        {/* Enable the scroll-reveal hidden state only when JS can actually reveal it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-reveal')`,
          }}
        />
      </head>
      <body>
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
