'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Prag sa histerezom: pilula se ne "trese" kad si tacno na granici.
  useEffect(() => {
    const onScroll = () => {
      setScrolled((was) => (was ? window.scrollY > 40 : window.scrollY > 90));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Dok je meni otvoren pilula ostaje u sredini — logo se tad ne duplira.
  const docked = scrolled || menuOpen;

  // Strip the current locale prefix so the switcher can keep you on the same page.
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/';

  return (
    <>
      <header className="site-header" data-docked={docked}>
        {/* Znak stoji sam iznad heroja — bez trake, bez linije. */}
        <Link
          href={localeHref(locale, '/')}
          aria-label="Pčelarstvo Jevtić"
          className="header-crest flex flex-col items-center leading-none transition-opacity hover:opacity-70"
        >
          <Image
            src="/images/brand/mark.svg"
            alt=""
            aria-hidden="true"
            width={45}
            height={95}
            priority
            className="h-11 w-auto sm:h-14"
          />
          <span className="mt-2.5 text-[8px] font-bold uppercase tracking-[0.28em] text-[#73552E] sm:text-[9px]">
            Pčelarstvo
          </span>
          <span className="mt-1.5 font-display text-[1.4rem] font-medium leading-none tracking-[0.005em] text-[#73552E] sm:text-[1.7rem]">
            Jevtić
          </span>
        </Link>

        {/* Pilula: gore desno na vrhu, u sredini kad se skroluje. */}
        <div className="header-pill p-[0.4rem] text-[#73552E]">
          <Link
            href={localeHref(locale, '/')}
            aria-label="Pčelarstvo Jevtić"
            tabIndex={docked ? 0 : -1}
            className="header-pill-logo"
          >
            <span className="flex items-center gap-2">
              <Image
                src="/images/brand/mark.svg"
                alt=""
                aria-hidden="true"
                width={45}
                height={95}
                className="h-8 w-auto"
              />
              <span className="font-display text-[1.15rem] font-medium leading-none tracking-[0.01em]">
                Jevtić
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? (locale === 'sr' ? 'Zatvori meni' : 'Close menu') : 'Menu'}
            aria-expanded={menuOpen}
            className="flex min-h-11 items-center gap-3 rounded-full px-3 transition-colors hover:text-[#C79A3B] sm:px-4"
          >
            <span className="hidden font-display text-[0.95rem] font-medium uppercase tracking-[0.16em] sm:inline">
              {menuOpen ? (locale === 'sr' ? 'Zatvori' : 'Close') : 'Menu'}
            </span>
            <span className="menu-glyph" data-open={menuOpen} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <button
            type="button"
            onClick={cart.open}
            aria-label={t('nav.cart')}
            className="relative mr-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-[#C79A3B]"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.7} />
            {cart.count > 0 && (
              <span className="absolute right-1 top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#73552E] px-1 text-[10px] font-bold tabular-nums text-[#FDF9DC]">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Meni preko celog ekrana — sad je jedina navigacija, na svim sirinama. */}
      <div
        className={`fixed inset-0 z-50 bg-[#FDF9DC] px-6 pt-[9rem] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="mx-auto flex h-full max-w-3xl flex-col">
          <p className="border-b border-[#73552E]/15 pb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#73552E]">
            {locale === 'sr' ? 'Mračaj · Prnjavor · od 1980.' : 'Mračaj · Prnjavor · since 1980'}
          </p>

          <nav className="flex flex-col py-6">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={localeHref(locale, item.href)}
                style={{ transitionDelay: menuOpen ? `${60 + index * 45}ms` : '0ms' }}
                className={`border-b border-[#73552E]/12 py-4 font-display text-3xl text-[#73552E] transition-all duration-500 hover:text-[#C79A3B] sm:text-4xl ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pb-10">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={localeHref(locale, '/account')}
                className="rounded-[1.25rem] bg-[#73552E]/[0.07] px-4 py-4 text-center text-sm font-semibold text-[#73552E]"
              >
                {t('nav.account')}
              </Link>
              <Link
                href={localeHref(locale, '/wishlist')}
                className="rounded-[1.25rem] bg-[#73552E]/[0.07] px-4 py-4 text-center text-sm font-semibold text-[#73552E]"
              >
                {t('wishlist.title')}
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-1">
              {locales.map((code, index) => (
                <span key={code} className="flex items-center">
                  <Link
                    href={`/${code}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`}
                    aria-label={`Switch to ${code.toUpperCase()}`}
                    className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                      code === locale
                        ? 'font-bold text-[#73552E] underline decoration-[#C79A3B] decoration-2 underline-offset-4'
                        : 'text-[#73552E]/70 hover:text-[#73552E]'
                    }`}
                  >
                    {code}
                  </Link>
                  {index === 0 && (
                    <span aria-hidden="true" className="mx-1.5 text-[#73552E]/40">
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
