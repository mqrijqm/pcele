'use client';

import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import MenuSun from '@/components/layout/MenuSun';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

import { createTranslator, locales, localeHref, type Locale } from '@/i18n/config';
import { useCart } from '@/lib/cart';

/*
 * Tri glavne stavke menija. Uz svaku ide crtez koji se pojavi sa desne
 * strane panela dok je stavka pod misem — svi crtezi vec postoje u
 * `public/images/brand/`, pa se mijenjaju samo ovdje, u ovom nizu.
 */
const navItems = [
  {
    href: '/products',
    key: 'nav.shop',
    illustration: '/images/brand/teglica.svg',
    width: 213,
    height: 313,
  },
  {
    href: '/pcelinjak',
    key: 'nav.apiaries',
    illustration: '/images/brand/pejzaz-kosnice.svg',
    width: 393,
    height: 187,
  },
  {
    href: '/process',
    key: 'nav.process',
    illustration: '/images/brand/pcelar.svg',
    width: 214,
    height: 333,
  },
];

/** Sekundarne stavke ispod glavne liste — manje, tise, bez crteza. */
const secondaryLinks = [
  { href: '/products', key: 'nav.buy' },
  { href: '/kontakt', key: 'nav.contact' },
];

export default function Header({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const pathname = usePathname();
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Koja je glavna stavka pod misem / u fokusu — drzi crtez sa desna zivim.
  const [activeItem, setActiveItem] = useState<number | null>(null);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Escape zatvara meni — mala stvar, ali tastatura to ocekuje.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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

          {/* Korpa vodi na svoju stranicu; brojac ostaje preko ikonice. */}
          <span className="header-pill-split" aria-hidden="true" />

          <TransitionLink
            href={localeHref(locale, '/cart')}
            aria-label={t('nav.cart')}
            className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-[#EEC660]"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.7} />
            {cart.count > 0 && (
              <span className="absolute right-0.5 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#885B27] px-1 text-[10px] font-bold tabular-nums text-[#FCF0DC]">
                {cart.count}
              </span>
            )}
          </TransitionLink>
        </div>
      </header>

      {/*
       * Meni preko celog ekrana — editorial panel. Lijeva kolona drzi
       * navigaciju, desna (samo na velikom ekranu) crtez aktivne stavke.
       */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto bg-[var(--white-soft)] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 pb-8 pt-[8.5rem] sm:px-10">
          <p className="border-b border-[#885B27]/15 pb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#885B27]">
            {locale === 'sr' ? 'Mračaj · Prnjavor · od 1980.' : 'Mračaj · Prnjavor · since 1980'}
          </p>

          <div className="flex flex-1 items-start gap-12 py-8 lg:gap-20">
            {/* --- lijevo: navigacija ------------------------------------ */}
            <div className="flex w-full flex-col lg:w-auto lg:flex-1">
              <nav className="flex flex-col" aria-label={locale === 'sr' ? 'Glavna navigacija' : 'Main navigation'}>
                {navItems.map((item, index) => {
                  const active = activeItem === index;
                  return (
                    <TransitionLink
                      key={item.href}
                      href={localeHref(locale, item.href)}
                      style={{ transitionDelay: menuOpen ? `${60 + index * 45}ms` : '0ms' }}
                      onPointerEnter={() => setActiveItem(index)}
                      onPointerLeave={() => setActiveItem(null)}
                      onFocus={() => setActiveItem(index)}
                      onBlur={() => setActiveItem(null)}
                      className={`menu-item group border-b border-[#885B27]/15 transition-all duration-500 ${
                        menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                      }`}
                    >
                      <span className="flex items-center py-4 sm:py-5">
                        <span
                          className={`font-display text-[2.6rem] leading-[1.05] tracking-[-0.02em] text-[#885B27] transition-colors duration-300 group-hover:text-[#885B27]/85 group-focus-visible:text-[#885B27]/85 sm:text-6xl lg:text-[4.2rem] ${
                            active ? 'italic' : ''
                          }`}
                        >
                          {t(item.key)}
                        </span>
                        {/*
                         * Sunce stoji u svom slotu cak i kad je nevidljivo —
                         * polje je rezervisano unaprijed, pa se red ne pomjera
                         * kad se pojavi. Pojava je kratka i meka: fade + mali
                         * pomak i skaliranje.
                         */}
                        <span
                          aria-hidden="true"
                          className={`ml-4 inline-flex w-10 shrink-0 items-center justify-center transition-all duration-300 ease-out sm:w-12 ${
                            active
                              ? 'translate-x-0 scale-100 opacity-100'
                              : '-translate-x-1.5 scale-75 opacity-0'
                          }`}
                        >
                          <MenuSun className="h-9 w-auto sm:h-10" />
                        </span>
                      </span>
                    </TransitionLink>
                  );
                })}
              </nav>

              <div
                style={{ transitionDelay: menuOpen ? '240ms' : '0ms' }}
                className={`mt-10 flex flex-col gap-1 transition-all duration-500 sm:mt-12 ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                {secondaryLinks.map((link) => (
                  <TransitionLink
                    key={link.href}
                    href={localeHref(locale, link.href)}
                    className="inline-block w-fit font-display text-xl text-[#885B27]/75 transition-all duration-300 hover:translate-x-1 hover:text-[#885B27] hover:underline hover:decoration-[#EEC660] hover:decoration-2 hover:underline-offset-8 sm:text-2xl"
                  >
                    {t(link.key)}
                  </TransitionLink>
                ))}
              </div>
            </div>

            {/* --- desno: crtez aktivne stavke --------------------------- */}
            {/*
             * Tri crteza stoje jedan preko drugog u istom slotu, pa se
             * prelazak sa stavke na stavku svodi na presluh izmedju njih —
             * nijedan ne utice na raspored liste.
             */}
            <div
              aria-hidden="true"
              className="relative hidden w-[38%] self-stretch lg:block"
            >
              {navItems.map((item, index) => (
                <Image
                  key={item.href}
                  src={item.illustration}
                  alt=""
                  width={item.width}
                  height={item.height}
                  className={`absolute left-1/2 top-1/2 w-auto max-w-[16rem] -translate-x-1/2 transition-all duration-500 ease-out xl:max-w-[18rem] ${
                    activeItem === index
                      ? 'translate-y-[-50%] opacity-100'
                      : 'translate-y-[calc(-50%+1.25rem)] opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-auto">
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
