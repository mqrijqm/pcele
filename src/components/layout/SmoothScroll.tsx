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

    return () => {
      window.removeEventListener('preloader:done', start);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
