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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#73552E]/14 bg-[#FDF9DC] transition-shadow duration-300">
        <nav className="mx-auto grid h-[var(--header-h)] max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:px-8 lg:gap-10 lg:px-12">
          {/* Levo: navigacija na desktopu, dugme za meni na telefonu. */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#73552E] text-[#FDF9DC] lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="hidden items-center gap-7 lg:flex xl:gap-9">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={localeHref(locale, item.href)}
                  className="relative py-3 text-[13px] font-semibold tracking-[0.01em] text-[#73552E] transition-colors hover:text-[#C79A3B]"
                >
                  {t(item.key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Sredina: znak stoji iznad imena, kao pecat na tegli. */}
          <Link
            href={localeHref(locale, '/')}
            className="relative z-50 flex flex-col items-center leading-none transition-opacity hover:opacity-75"
          >
            <Image
              src="/images/brand/mark.svg"
              alt=""
              aria-hidden="true"
              width={45}
              height={95}
              priority
              className="h-9 w-auto sm:h-11"
            />
            <span className="mt-2 text-[8px] font-bold uppercase tracking-[0.26em] text-[#73552E] sm:text-[9px]">
              Pčelarstvo
            </span>
            <span className="mt-1.5 font-display text-[1.35rem] font-medium leading-none tracking-[0.005em] text-[#73552E] sm:text-[1.6rem]">
              Jevtić
            </span>
          </Link>

          <div className="flex items-center justify-end gap-4">
            <div className="hidden sm:block">
              <div className="flex items-center gap-1">
                {locales.map((code, index) => (
                  <span key={code} className="flex items-center">
                    <Link
                      href={`/${code}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`}
                      aria-label={`Switch to ${code.toUpperCase()}`}
                      className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                        code === locale
                          ? 'font-bold text-[#73552E] underline decoration-[#C79A3B] decoration-2 underline-offset-4'
                          : 'text-[#73552E] hover:underline hover:decoration-[#C79A3B] hover:decoration-2 hover:underline-offset-4'
                      }`}
                    >
                      {code}
                    </Link>
                    {index === 0 && (
                      <span aria-hidden="true" className="mx-1 text-[#73552E]/40">
                        /
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={localeHref(locale, '/account')}
              className="hidden text-xs font-semibold text-[#73552E] transition-colors hover:text-[#73552E] xl:block"
            >
              {t('nav.account')}
            </Link>

            <button
              type="button"
              onClick={cart.open}
              aria-label={t('nav.cart')}
              className="hidden items-center gap-2 border-l border-[#73552E]/15 pl-4 text-xs font-semibold text-[#73552E] transition-colors hover:text-[#73552E] sm:flex"
            >
              <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.7} />
              <span>{t('nav.cart')}</span>
              <span className="tabular-nums text-[#73552E]">{cart.count}</span>
            </button>

            <Link
              href={localeHref(locale, '/products')}
              className="hidden min-h-11 items-center rounded-full bg-[#73552E] px-6 text-sm font-medium text-[#FDF9DC] transition-colors hover:bg-[#C79A3B] hover:text-[#73552E] md:inline-flex"
            >
              {locale === 'sr' ? 'Naruči med' : 'Order honey'}
            </Link>

          </div>
        </nav>
      </header>

      {/* Full-screen mobile navigation */}
      <div
        className={`fixed inset-0 z-40 bg-[#73552E]/[0.06] px-6 pt-32 transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="mx-auto flex h-full max-w-lg flex-col">
          <p className="border-b border-[#73552E]/15 pb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#73552E]">
            {locale === 'sr' ? 'Mračaj · Prnjavor · od 1980.' : 'Mračaj · Prnjavor · since 1980'}
          </p>

          <div className="flex flex-col py-7">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={localeHref(locale, item.href)}
                style={{ transitionDelay: menuOpen ? `${60 + index * 40}ms` : '0ms' }}
                className={`border-b border-[#73552E]/12 py-4 text-3xl text-[#73552E] transition-all ${
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
              className="rounded-[1.25rem] bg-[#FDF9DC] px-4 py-4 text-center text-sm font-semibold text-[#73552E]"
            >
              {t('nav.account')}
            </Link>
            <Link
              href={localeHref(locale, '/wishlist')}
              className="rounded-[1.25rem] bg-[#FDF9DC] px-4 py-4 text-center text-sm font-semibold text-[#73552E]"
            >
              {t('wishlist.title')}
            </Link>
          </div>

          <Link
            href={localeHref(locale, '/products')}
            className="mb-8 mt-4 flex min-h-14 items-center justify-center rounded-full bg-[#73552E] px-6 text-sm font-semibold text-[#FDF9DC]"
          >
            {locale === 'sr' ? 'Pogledaj i naruči med' : 'Browse and order honey'}
          </Link>
        </div>
      </div>
    </>
  );
}
