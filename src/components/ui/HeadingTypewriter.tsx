'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

/** Koliko stoji jedno slovo. Ispod ~25ms se vise ne cita kao kucanje nego kao treptaj. */
const STEP_MS = 34;
/** Duzi naslovi kucaju brze, da najduzi red ne drzi citaoca cijelu sekundu i po. */
const MAX_MS = 1150;
/** Preko ove duzine slog nije naslov nego pasus — takav se ne ispisuje. */
const MAX_CHARS = 140;
/** Ako zavjesa nikad ne javi da je otisla, gledamo sami. */
const WATCHDOG_MS = 6000;

const TARGETS = 'main h1, main h2';

/*
 * Sta se ne dira:
 *
 * - `sr-only` naslov postoji samo za citac ekrana i nema sta da se ispisuje;
 * - wordmark u heroju je slika, ne slog;
 * - naslov tegle i naslov pcelinjaka vec imaju svoju animaciju u GSAP-u, pa bi
 *   im kucanje islo preko ledja;
 * - `data-no-type` je rucna kocnica za ubuduce.
 */
const SKIP =
  '.sr-only, .hero-land__wordmark, .hero-jar__title, .apiary__heading, [data-no-type]';

/** Klase kojima naslov inace ulazi u kadar — kucanje ih preuzima. */
const REVEAL = /^(reveal|reveal-[a-z]+|stagger-\d)$/;

/* Na serveru se nema sta mjeriti, a `useLayoutEffect` bi tamo samo galamio. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Razlomi naslov na rijeci i slova i vrati koliko je slova ispalo.
 *
 * Slog se vadi iz tekstualnih cvorova, ne iz `innerHTML`: naslov koji u sebi
 * ima kurziv ili prelom ostaje citav, samo mu tekst oko toga dobije omotace.
 */
function split(heading: HTMLElement): number {
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  const letters: HTMLElement[] = [];

  nodes.forEach((node) => {
    const frag = document.createDocumentFragment();

    (node.data.match(/\s+|\S+/g) ?? []).forEach((part) => {
      // Razmak ostaje obican tekst: po njemu se red lomi, i kursor ga preskace.
      if (!part.trim()) {
        frag.append(part);
        return;
      }

      const word = document.createElement('span');
      word.className = 'tw__w';

      Array.from(part).forEach((ch) => {
        const letter = document.createElement('span');
        letter.className = 'tw__c';
        letter.style.setProperty('--d', `${letters.length}`);
        letter.textContent = ch;
        word.append(letter);
        letters.push(letter);
      });

      frag.append(word);
    });

    node.replaceWith(frag);
  });

  return letters.length;
}

/**
 * Svaki naslov se ispisuje slovo po slovo cim sekcija udje u kadar.
 *
 * Slog se ne lomi u markupu nego ovdje, u pregledniku. Tako naslov u izvoru
 * strane ostaje jedna rijec teksta — onakav kakvog ga uzimaju pretrazivac,
 * prevodilac i onaj ko ga kopira — a razlomljen je samo onoliko dugo koliko
 * traje animacija.
 *
 * Tri stvari koje se lako promase:
 *
 * 1. **Kad se lomi.** `useLayoutEffect` radi prije nego sto preglednik naslika
 *    kadar, pa se pri prelasku na drugu stranu ne vidi trenutak u kojem naslov
 *    stoji ispisan pa se ugasi. Na prvom ucitavanju taj trenutak pokriva
 *    zavjesa.
 *
 * 2. **Kad se gleda.** Lomi se odmah, ali se ne gleda dok je zavjesa gore —
 *    inace bi prvi ekran odradio svoj ulazak iza nje, i pao bi ispisan.
 *
 * 3. **Sta se skida.** Naslovu koji je do sada ulazio kroz `.reveal` te klase
 *    se oduzimaju. Bez toga bi se dva pokreta preklopila: slog bi klizio odozdo
 *    dok se u njemu kucaju slova. Ovo mora da se desi prije nego sto ih
 *    `RevealObserver` prebroji, i desava se — njegov posao je u `useEffect`, a
 *    ovaj je u `useLayoutEffect`, koji ide prvi.
 *
 * Citacu ekrana se slova ne serviraju: sadrzaj naslova ide pod `aria-hidden`, a
 * cio slog stoji na `aria-label`. Inace bi naslov bio procitan slovo po slovo.
 */
export default function HeadingTypewriter() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const headings = Array.from(document.querySelectorAll<HTMLElement>(TARGETS)).filter(
      (el) => !el.matches(SKIP) && !el.closest(SKIP) && !el.classList.contains('tw'),
    );

    const ready: HTMLElement[] = [];

    headings.forEach((heading) => {
      const text = heading.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      if (!text || text.length > MAX_CHARS) return;

      // Slog ide u jedan omotac da bi se sav odjednom mogao sakriti od citaca.
      const shell = document.createElement('span');
      shell.className = 'tw__shell';
      shell.setAttribute('aria-hidden', 'true');
      while (heading.firstChild) shell.append(heading.firstChild);
      heading.append(shell);
      heading.setAttribute('aria-label', text);

      const count = split(shell);
      if (!count) return;

      heading.classList.remove(
        ...Array.from(heading.classList).filter((name) => REVEAL.test(name)),
      );
      heading.style.transitionDelay = '';

      heading.classList.add('tw');
      heading.style.setProperty('--tw-step', `${Math.min(STEP_MS, MAX_MS / count)}ms`);
      ready.push(heading);
    });

    if (!ready.length) return;

    let observer: IntersectionObserver | null = null;
    let started = false;

    const scan = () => {
      if (started) return;
      started = true;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-typing');
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
      );

      ready.forEach((el) => observer?.observe(el));
    };

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
