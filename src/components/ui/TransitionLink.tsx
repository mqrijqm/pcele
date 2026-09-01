'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  forwardRef,
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';

import { useHoneyTransition } from '@/components/layout/HoneyTransition';

type Props = ComponentPropsWithoutRef<typeof Link>;

/**
 * `next/link` koji unutrasnju navigaciju provuce kroz medenu zavjesu.
 *
 * Zamjena jedan za jedan: prima iste propse, prosljedjuje ih sve dalje, i sam
 * ne dira ni izgled ni ponasanje osim dvije stvari — sto pricekne klik i pusti
 * med prije nego strana ode, i sto stranu pocne dovlaciti cim se vidi da se
 * ide na nju.
 *
 * **Zagrijavanje.** Ruta se trazi na prelazak misem, na fokus i na pritisak
 * prsta — dakle prije klika, i uvijek prije nego sto med krene. Bez toga se
 * dovlacenje pocinjalo tek kad se zavjesa slegne, pa se cekanje lijepilo na
 * animaciju umjesto da tece ispod nje. Trazi se jednom po odredistu; drugi
 * prelazak preko iste veze ne salje nista.
 *
 * **Kad se ne mijesa.** Sve sto nije obican lijevi klik na unutrasnju stranu
 * ostaje preglednikovo: vanjski link, sidro u istoj strani, `mailto:` i `tel:`,
 * otvaranje u novoj kartici (`target`, ili drzan Ctrl/Cmd/Shift/Alt),
 * preuzimanje, srednji i desni taster, i link koji vodi tamo gdje si vec. Ni u
 * jednom od tih slucajeva se `preventDefault` ne zove, pa se `next/link`
 * ponasa tacno kako je i inace — ovo je zamjena, ne presretac.
 *
 * **Dok med tece** klik se pojede: bez toga bi drugi klik poslao jos jednu
 * navigaciju pod istom zavjesom.
 */
const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { href, onClick, onPointerEnter, onFocus, ...rest },
  ref,
) {
  const { navigate, isBusy, isEnabled } = useHoneyTransition();
  const pathname = usePathname();
  const router = useRouter();

  /* Sta je vec trazeno, da prelazak tamo-amo ne salje isti zahtjev deset puta. */
  const zagrijano = useRef<string | null>(null);

  /*
   * Odrediste se cita sa samog elementa, ne iz propsa: tamo je vec razrijeseno
   * u punu adresu, pa isti racun vazi i kad je `href` objekat. Time otpadaju i
   * `mailto:` i `tel:` — njima `origin` nije nas.
   */
  const odrediste = useCallback(
    (anchor: HTMLAnchorElement): string | null => {
      if (anchor.origin !== window.location.origin) return null;
      if (anchor.hash) return null;
      if (anchor.pathname === pathname) return null;
      if (anchor.target && anchor.target !== '_self') return null;
      if (anchor.hasAttribute('download')) return null;
      return anchor.pathname + anchor.search;
    },
    [pathname],
  );

  const zagrij = useCallback(
    (anchor: HTMLAnchorElement) => {
      const cilj = odrediste(anchor);
      if (!cilj || zagrijano.current === cilj) return;
      zagrijano.current = cilj;
      router.prefetch(cilj);
    },
    [odrediste, router],
  );

  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerEnter?.(event);
    zagrij(event.currentTarget);
  };

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    onFocus?.(event);
    zagrij(event.currentTarget);
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (!isEnabled) return;
    if (event.defaultPrevented) return;

    /* Samo lijevi taster, i to bez ijednog drzanog tastera na tastaturi. */
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const cilj = odrediste(event.currentTarget);
    if (!cilj) return;

    if (isBusy) {
      /* Zavjesa je vec u pokretu; ovaj klik nema gdje. */
      event.preventDefault();
      return;
    }

    event.preventDefault();
    navigate(cilj);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onFocus={handleFocus}
      ref={ref}
      {...rest}
    />
  );
});

export default TransitionLink;
