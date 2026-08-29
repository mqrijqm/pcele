'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Razmak izmedju dva susjeda koja ulaze zajedno. */
const STEP_MS = 70;
/** Poslije ovoliko koraka kaskada se zaustavlja — inace zadnji red ceka predugo. */
const MAX_STEPS = 5;
/** Ako zavjesa nikad ne javi da je otisla, gledamo sami. */
const WATCHDOG_MS = 6000;

const SELECTOR =
  '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-draw, .reveal-pop';

/**
 * Adds `.in-view` to every `.reveal*` element once it scrolls into view.
 * Re-scans on navigation so client-side route changes animate too.
 *
 * Dvije stvari koje obicno promasi:
 *
 * 1. Ne gleda dok je zavjesa gore. Ranije je gledao od prvog trenutka, pa je
 *    prvi ekran odradio svoj ulazak iza zavjese — kad bi zavjesa pala, sve je
 *    vec bilo slegnuto. Sada ceka `preloader:done`, pa se prvi ekran ispise
 *    pred korisnikom.
 *
 * 2. Susjedi koji udju zajedno ne pale se u isti kadar. Mreza od cetiri
 *    kartice inace skoci kao jedan blok; ovako ide red po red, po polozaju na
 *    strani. Rucno postavljeno kasnjenje — bilo `stagger-N` klasom, bilo kroz
 *    `style` — uvijek ima prednost nad ovom kaskadom.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let started = false;

    const scan = () => {
      if (started) return;
      started = true;

      const targets = document.querySelectorAll<HTMLElement>(SELECTOR);
      if (!targets.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          const arrived = entries
            .filter((entry) => entry.isIntersecting)
            // Observer javlja redom kojim je primijetio, ne redom kojim stoje
            // na strani; kaskada mora da ide odozgo nadolje.
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          arrived.forEach((entry, index) => {
            const el = entry.target as HTMLElement;
            if (index > 0 && !el.className.includes('stagger-') && !el.style.transitionDelay) {
              el.style.transitionDelay = `${Math.min(index, MAX_STEPS) * STEP_MS}ms`;
            }
            el.classList.add('in-view');
            observer?.unobserve(el);
          });
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
      );

      targets.forEach((el) => observer?.observe(el));
    };

    /*
     * Zavjesa skine klasu prije nego sto javi dogadjaj, pa ako je vec otisla
     * (ili je nikad nije ni bilo — druga strana, smireno stanje), gledamo
     * odmah. Bez ove provjere bi dogadjaj koji je vec prosao ostavio cijelu
     * stranu nevidljivom.
     */
    const preloading = document.documentElement.classList.contains('is-preloading');
    if (preloading) window.addEventListener('preloader:done', scan, { once: true });
    else scan();

    const watchdog = window.setTimeout(scan, WATCHDOG_MS);

    return () => {
      window.clearTimeout(watchdog);
      window.removeEventListener('preloader:done', scan);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
