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
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    const start = () => lenis.start();
    window.addEventListener('preloader:done', start);

    return () => {
      window.removeEventListener('preloader:done', start);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
