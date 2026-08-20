'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { createTranslator, locales, localeHref, type Locale } from '@/i18n/config';
import { useCart } from '@/lib/cart';

const navItems = [
  { href: '/products', key: 'nav.shop' },
  { href: '/about', key: 'nav.about' },
  { href: '/process', key: 'nav.process' },
  { href: '/blog', key: 'blog.navLabel' },
  { href: '/contact', key: 'nav.contact' },
];

export default function Header({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const pathname = usePathname();
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Strip the current locale prefix so the switcher can keep you on the same page.
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#8A5A2B]/14 bg-[#FFF7E6] transition-shadow duration-300">
        <nav className="mx-auto grid h-24 max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-8 px-5 sm:px-8 lg:px-12">
          <Link
            href={localeHref(locale, '/')}
            className="relative z-50 inline-flex items-center transition-opacity hover:opacity-75"
          >
            <Image
              src="/images/logo.svg"
              alt="Pčelarstvo Jevtić"
              width={360}
              height={88}
              priority
              className="h-11 w-auto sm:h-12 lg:h-14"
            />
          </Link>

          <div className="hidden items-center justify-center gap-7 lg:flex xl:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={localeHref(locale, item.href)}
                className="relative py-3 text-[13px] font-semibold tracking-[0.01em] text-[#8A5A2B]/75 transition-colors hover:text-[#8A5A2B]"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4">
            <div className="hidden sm:block">
              <div className="flex items-center gap-1">
                {locales.map((code, index) => (
                  <span key={code} className="flex items-center">
                    <Link
                      href={`/${code}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`}
                      aria-label={`Switch to ${code.toUpperCase()}`}
                      className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                        code === locale ? 'text-[#8A5A2B] font-bold' : 'text-[#8A5A2B]/45 hover:text-[#8A5A2B]'
                      }`}
                    >
                      {code}
                    </Link>
                    {index === 0 && <span className="mx-1 text-[#8A5A2B]/25">/</span>}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={localeHref(locale, '/account')}
              className="hidden text-xs font-semibold text-[#8A5A2B]/75 transition-colors hover:text-[#8A5A2B] xl:block"
            >
              {t('nav.account')}
            </Link>

            <button
              type="button"
              onClick={cart.open}
              aria-label={t('nav.cart')}
              className="hidden items-center gap-2 border-l border-[#8A5A2B]/15 pl-4 text-xs font-semibold text-[#8A5A2B] transition-colors hover:text-[#8A5A2B] sm:flex"
            >
              <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.7} />
              <span>{t('nav.cart')}</span>
              <span className="tabular-nums text-[#8A5A2B]">{cart.count}</span>
            </button>

            <Link
              href={localeHref(locale, '/products')}
              className="hidden min-h-11 items-center rounded-full bg-[#8A5A2B] px-6 text-sm font-medium text-[#FFF7E6] transition-colors hover:bg-[#C89B3C] hover:text-[#8A5A2B] md:inline-flex"
            >
              {locale === 'sr' ? 'Naruči med' : 'Order honey'}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#8A5A2B] text-[#FFF7E6] lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile navigation */}
      <div
        className={`fixed inset-0 z-40 bg-[#F6EEDB] px-6 pt-32 transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="mx-auto flex h-full max-w-lg flex-col">
          <p className="border-b border-[#8A5A2B]/15 pb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A5A2B]">
            {locale === 'sr' ? 'Mračaj · Prnjavor · od 1985.' : 'Mračaj · Prnjavor · since 1985'}
          </p>

          <div className="flex flex-col py-7">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={localeHref(locale, item.href)}
                style={{ transitionDelay: menuOpen ? `${60 + index * 40}ms` : '0ms' }}
                className={`border-b border-[#8A5A2B]/12 py-4 font-display text-3xl text-[#8A5A2B] transition-all ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2">
            <Link
              href={localeHref(locale, '/account')}
              className="rounded-[1.25rem] bg-[#FFF7E6] px-4 py-4 text-center text-sm font-semibold text-[#8A5A2B]"
            >
              {t('nav.account')}
            </Link>
            <Link
              href={localeHref(locale, '/wishlist')}
              className="rounded-[1.25rem] bg-[#FFF7E6] px-4 py-4 text-center text-sm font-semibold text-[#8A5A2B]"
            >
              {t('wishlist.title')}
            </Link>
          </div>

          <Link
            href={localeHref(locale, '/products')}
            className="mb-8 mt-4 flex min-h-14 items-center justify-center rounded-full bg-[#8A5A2B] px-6 text-sm font-semibold text-[#FFF7E6]"
          >
            {locale === 'sr' ? 'Pogledaj i naruči med' : 'Browse and order honey'}
          </Link>
        </div>
      </div>
    </>
  );
}
