'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Zavrsna sekcija: strana stane dok se karta ne ispise.
 *
 * Sekcija se zakaci za vrh kadra i, dok stoji, njeni dijelovi ulaze redom —
 * brojac, naslov, snimak, tekst, veza, pa red imena sekcija pod njima. Tek kad
 * je sve na svom mjestu strana pusta dalje, u podnozje.
 *
 * Ulazak je vezan za skrol (`scrub`), ne za vrijeme: koliko se prstom pomjeri,
 * toliko se ispise. Zato se moze i stati na sredini, i vratiti natrag — a i
 * nema cekanja na animaciju koja ide svojim tempom bez obzira na korisnika.
 *
 * Duzina stajanja je jedan kadar: dovoljno da se sve ispise bez zurbe, a ne
 * toliko da se cini da je strana zapela.
 *
 * Na telefonu i uz iskljucene animacije nema pinovanja — sve stoji ispisano,
 * jer bi na uskom kadru zadrzavanje pojelo citav ekran.
 */
export default function Kraj({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const dijelovi = el.querySelectorAll<HTMLElement>('[data-ulaz]');
      if (!dijelovi.length) return;

      gsap.set(dijelovi, { opacity: 0, y: 26 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 0.9)}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      tl.to(dijelovi, {
        opacity: 1,
        y: 0,
        ease: 'none',
        stagger: 0.5,
        duration: 1,
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="pcl-kraj" ref={root}>
      {children}
    </div>
  );
}
