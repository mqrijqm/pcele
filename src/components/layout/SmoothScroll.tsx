'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis, wired exactly as meracinque.com wires it — the scrubbed hero timeline
 * reads its progress through this, so the feel of the reveal depends on it:
 *
 *   new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)),
 *               wheelMultiplier: 1, touchMultiplier: 2, normalizeWheel: true, anchors: true })
 *   lenis.on('scroll', ScrollTrigger.update)
 *   gsap.ticker.add(t => lenis.raf(t * 1000))
 *   gsap.ticker.lagSmoothing(0)
 *
 * It stays stopped while the loading curtain is up.
 *
 * Ovdje su i dvije stvari koje se ticu ucitavanja, a ne samog skrola:
 *
 * — Strana se otvara na vrhu. Preglednik inace vraca na mjesto gdje si stao
 *   prije osvjezavanja; sa zavjesom to znaci da zavjesa padne na sredinu
 *   sekcije koju nisi trazio.
 *
 * — `ScrollTrigger.refresh()` poslije zavjese i poslije fontova. Visine
 *   pinovanih sekcija se mjere dok je zavjesa gore i dok slog jos stoji u
 *   zamjenskom fontu; kad se pravi font ucita, mjera se pomjeri, a okidaci
 *   ostanu na starim brojevima.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (document.documentElement.classList.contains('is-preloading')) window.scrollTo(0, 0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('preloader:done', refresh);
      return () => window.removeEventListener('preloader:done', refresh);
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
      anchors: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const preloading = document.documentElement.classList.contains('is-preloading');
    if (preloading) lenis.stop();
    const start = () => {
      lenis.start();
      refresh();
    };
    window.addEventListener('preloader:done', start);

    /*
     * Zadrzavanje skrola.
     *
     * Sekcija sa snimkom pcelinjaka trazi da se strana zaustavi dok snimak ne
     * prodje. Lenis je ovdje jedini koji zna gdje je strana, ali on nema koga
     * da pita — zato se javlja dogadjajem, isto kao zavjesa iznad.
     *
     * `lenis.stop()` gasi tocak i dodir. Tastatura ide mimo njega, pa se
     * razmaknica i strelice hvataju posebno; bez toga se strana i dalje moze
     * pomjeriti tipkom.
     */
    const KEYS = new Set([
      ' ',
      'PageDown',
      'PageUp',
      'ArrowDown',
      'ArrowUp',
      'Home',
      'End',
      'Spacebar',
    ]);

    let locked = false;
    const swallow = (e: KeyboardEvent) => {
      if (!locked) return;
      const el = e.target as HTMLElement | null;
      /* U polju za unos razmaknica je slovo, ne skrol. */
      if (el?.closest('input, textarea, select, [contenteditable]')) return;
      if (KEYS.has(e.key)) e.preventDefault();
    };

    /*
     * Prije zaustavljanja strana se dovede na mjesto. Bez toga se zamrzne
     * tamo gdje se zatekla — sekcija napola u kadru, pa izgleda kao da je
     * strana zapela, a ne da je stala namjerno.
     */
    const lock = (e: Event) => {
      locked = true;
      const to = (e as CustomEvent<{ to?: Element }>).detail?.to;
      if (!to) {
        lenis.stop();
        return;
      }
      lenis.scrollTo(to as HTMLElement, {
        duration: 0.5,
        lock: true,
        onComplete: () => lenis.stop(),
      });
    };
    const unlock = () => {
      locked = false;
      lenis.start();
    };

    window.addEventListener('scroll:lock', lock);
    window.addEventListener('scroll:unlock', unlock);
    window.addEventListener('keydown', swallow, { passive: false });

    return () => {
      window.removeEventListener('preloader:done', start);
      window.removeEventListener('scroll:lock', lock);
      window.removeEventListener('scroll:unlock', unlock);
      window.removeEventListener('keydown', swallow);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
