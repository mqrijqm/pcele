'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
 * Na telefonu se adresna traka pri skrolu skuplja i vraca, pa se visina kadra
 * mijenja. Bez ovoga ScrollTrigger to čita kao promjenu veličine ekrana i
 * preračuna sve pinove — strana tada vidljivo poskoči usred skrola.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

/** Lenis owns smooth scrolling and keeps all existing ScrollTriggers in sync. */
export default function SmoothScroll() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (document.documentElement.classList.contains('is-preloading')) window.scrollTo(0, 0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);

    const nativeScroll =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth <= 768;

    // Touch uređaji koriste nativni skrol. Time se čuva inercija operativnog
    // sistema i izbjegava dvostruko ubrzanje prsta kroz Lenis.
    if (nativeScroll) {
      window.addEventListener('preloader:done', refresh);
      window.addEventListener('resize', refresh, { passive: true });
      return () => {
        window.removeEventListener('preloader:done', refresh);
        window.removeEventListener('resize', refresh);
      };
    }

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      anchors: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    if (document.documentElement.classList.contains('is-preloading')) lenis.stop();
    const start = () => {
      lenis.start();
      refresh();
    };
    window.addEventListener('preloader:done', start);

    // Meni i korpa zaključavaju body. Lenis mora da prati isto stanje, inače
    // točak i dalje pomjera stranicu iza otvorenog panela.
    const syncBodyLock = () => {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    };
    const bodyLockObserver = new MutationObserver(syncBodyLock);
    bodyLockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    // Route transitions move instantly under the existing honey curtain.
    const toTop = () => lenis.scrollTo(0, { immediate: true, force: true });
    window.addEventListener('scroll:top', toTop);

    return () => {
      window.removeEventListener('preloader:done', start);
      window.removeEventListener('scroll:top', toTop);
      bodyLockObserver.disconnect();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
