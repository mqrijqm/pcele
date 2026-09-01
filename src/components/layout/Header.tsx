'use client';

import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

import { createTranslator, locales, localeHref, type Locale } from '@/i18n/config';
import { useCart } from '@/lib/cart';

const navItems = [
  { href: '/products', key: 'nav.shop' },
  { href: '/pcelinjak', key: 'nav.apiaries' },
  { href: '/process', key: 'nav.process' },
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

  /*
   * Prag sa histerezom, da se pilula ne "trese" kad si tacno na granici.
   *
   * Na pocetnoj je prag visina samog heroja: pilula stoji u cosku dok se crtez
   * livade ne prolista, pa tek onda klizi u sredinu. Na ostalim stranicama
   * nema takvog uvoda, pa vazi kratak prag kao i ranije.
   */
  useEffect(() => {
    const hero = document.querySelector('.hero-land') as HTMLElement | null;
    const enter = hero ? hero.offsetHeight * 0.8 : 90;
    const leave = hero ? hero.offsetHeight * 0.65 : 40;
    const onScroll = () => {
      setScrolled((was) => (was ? window.scrollY > leave : window.scrollY > enter));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  // Strip the current locale prefix so the switcher can keep you on the same page.
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/';

  /*
   * Pocetna sada ima isti uvod kao ostale stranice: pilula pocinje u cosku i
   * uklizi u sredinu tek kad heroj prodje. Stojeci znak se na pocetnoj ne
   * prikazuje uopste — sredinu heroja vec drze natpis i wordmark, pa bi se
   * tukli.
   */
  const isHome = pathWithoutLocale === '/';
  const docked = scrolled || menuOpen;

  return (
    <>
      <header className="site-header" data-docked={docked}>
        {/* Znak stoji sam iznad heroja — bez trake, bez linije. Na pocetnoj ga
            nema: tamo su vec i natpis i wordmark preko crteza. */}
        {!isHome && (
        <TransitionLink
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
          <span className="mt-2.5 text-[8px] font-bold uppercase tracking-[0.28em] text-[#885B27] sm:text-[9px]">
            Pčelarstvo
          </span>
          <span className="mt-1.5 font-display text-[1.4rem] font-medium leading-none tracking-[0.005em] text-[#885B27] sm:text-[1.7rem]">
            Jevtić
          </span>
        </TransitionLink>
        )}

        {/* Pilula: gore desno na vrhu, u sredini kad se skroluje. */}
        <div className="header-pill p-[0.4rem] text-[#885B27]">
          <TransitionLink
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
              <span className="font-display text-[1.2rem] font-medium leading-none tracking-[0.01em]">
                Jevtić
              </span>
            </span>
          </TransitionLink>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={
              menuOpen
                ? locale === 'sr'
                  ? 'Zatvori meni'
                  : 'Close menu'
                : locale === 'sr'
                  ? 'Meni'
                  : 'Menu'
            }
            aria-expanded={menuOpen}
            className="flex min-h-11 items-center gap-2 rounded-full px-3 transition-colors hover:text-[#EEC660] sm:gap-3 sm:px-4"
          >
            <span className="font-display text-[1.2rem] font-medium leading-none tracking-[0.01em]">
              {locale === 'sr' ? 'Meni' : 'Menu'}
            </span>
            <span className="menu-glyph" data-open={menuOpen} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          {/* Korpa je svoja radnja, pa je od menija dijeli vlas smedje. */}
          <span className="header-pill-split" aria-hidden="true" />

          <button
            type="button"
            onClick={cart.open}
            aria-label={t('nav.cart')}
            className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-[#EEC660]"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.7} />
            {cart.count > 0 && (
              <span className="absolute right-0.5 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#885B27] px-1 text-[10px] font-bold tabular-nums text-[#FCF0DC]">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Meni preko celog ekrana — sad je jedina navigacija, na svim sirinama. */}
      <div
        className={`fixed inset-0 z-50 bg-[var(--white-soft)] px-6 pt-[9rem] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="mx-auto flex h-full max-w-3xl flex-col">
          <p className="border-b border-[#885B27]/15 pb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#885B27]">
            {locale === 'sr' ? 'Mračaj · Prnjavor · od 1980.' : 'Mračaj · Prnjavor · since 1980'}
          </p>

          <nav className="flex flex-col py-6">
            {navItems.map((item, index) => (
              <TransitionLink
                key={item.href}
                href={localeHref(locale, item.href)}
                style={{ transitionDelay: menuOpen ? `${60 + index * 45}ms` : '0ms' }}
                className={`border-b border-[#885B27]/15 py-4 font-display text-3xl text-[#885B27] transition-all duration-500 hover:text-[#EEC660] sm:text-4xl ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                {t(item.key)}
              </TransitionLink>
            ))}
          </nav>

          <div className="mt-auto pb-10">
            <div className="flex items-center justify-center gap-1">
              {locales.map((code, index) => (
                <span key={code} className="flex items-center">
                  <TransitionLink
                    href={`/${code}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`}
                    aria-label={`Switch to ${code.toUpperCase()}`}
                    className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                      code === locale
                        ? 'font-bold text-[#885B27] underline decoration-[#EEC660] decoration-2 underline-offset-4'
                        : 'text-[#885B27]/70 hover:text-[#885B27]'
                    }`}
                  >
                    {code}
                  </TransitionLink>
                  {index === 0 && (
                    <span aria-hidden="true" className="mx-1.5 text-[#885B27]/40">
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
