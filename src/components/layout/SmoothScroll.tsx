'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Lenis owns smooth scrolling and keeps all existing ScrollTriggers in sync. */
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

    if (document.documentElement.classList.contains('is-preloading')) lenis.stop();
    const start = () => {
      lenis.start();
      refresh();
    };
    window.addEventListener('preloader:done', start);

    // Route transitions move instantly under the existing honey curtain.
    const toTop = () => lenis.scrollTo(0, { immediate: true, force: true });
    window.addEventListener('scroll:top', toTop);

    /*
     * Short sections get a quiet chapter alignment after scrolling settles.
     * Tall, pinned and explicitly excluded sections retain natural movement.
     */
    const MAX_SECTION_HEIGHT = 1.5;
    let snapPoints: number[] = [];

    const measure = () => {
      const main = document.querySelector('main');
      if (!main) {
        snapPoints = [];
        return;
      }

      const viewport = window.innerHeight;
      const chapters = main.querySelectorAll<HTMLElement>(
        ':scope > section, :scope > div > section',
      );

      snapPoints = Array.from(chapters)
        .filter((section) => {
          if (section.dataset.snap === 'off') return false;
          if (section.classList.contains('pin-spacer')) return false;
          if (section.querySelector('.pin-spacer')) return false;
          const height = section.offsetHeight;
          return height > viewport * 0.3 && height < viewport * MAX_SECTION_HEIGHT;
        })
        .map((section) => section.getBoundingClientRect().top + window.scrollY)
        .sort((a, b) => a - b);
    };

    let idleTimer: number | undefined;
    const settle = () => {
      if (document.body.style.overflow === 'hidden' || !snapPoints.length) return;

      const current = window.scrollY;
      const pageEnd = document.documentElement.scrollHeight - window.innerHeight;
      if (current < 4 || current > pageEnd - 4) return;

      let closest = snapPoints[0];
      for (const point of snapPoints) {
        if (Math.abs(point - current) < Math.abs(closest - current)) closest = point;
      }

      const proximity = window.innerWidth <= 768 ? 0.14 : 0.22;
      if (Math.abs(closest - current) > window.innerHeight * proximity) return;
      if (Math.abs(closest - current) < 2) return;

      lenis.scrollTo(closest, {
        duration: window.innerWidth <= 768 ? 0.4 : 0.55,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    };

    const onScroll = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(settle, 160);
    };
    lenis.on('scroll', onScroll);

    ScrollTrigger.addEventListener('refresh', measure);
    measure();

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.removeEventListener('refresh', measure);
      window.removeEventListener('preloader:done', start);
      window.removeEventListener('scroll:top', toTop);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
