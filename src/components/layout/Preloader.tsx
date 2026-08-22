'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * The loading curtain.
 *
 * Timeline, durations and easing are lifted from meracinque.com's
 * `initPreloader` (recon/findings.md §2), verbatim:
 *
 *   gsap.set(mark, { opacity: 0, yPercent: 20 })
 *   timeline({ onComplete: remove })
 *     .delay(0.2)
 *     .to(mark,    { opacity: 1, yPercent: 0, duration: 1,   ease: 'power3.out' })
 *     .to(curtain, { yPercent: 100,           duration: 0.9, ease: 'power3.out' }, '+=0.25')
 *
 * Their last step is `$('#preloader').remove()`. We cannot copy that: the node
 * belongs to React, and tearing it out from underneath makes the next render —
 * the first click on a nav link — throw `insertBefore`/`removeChild` and take
 * the whole tree down with it. Unmounting through state removes the same node
 * and leaves React's bookkeeping intact.
 *
 * Two more things are ours rather than theirs:
 *   - scroll is locked while it runs (they leave it free)
 *   - it waits on `document.fonts.ready` and on the jar decoding, on top of
 *     `window.load`, so the hero can never be caught half-painted
 *
 * Like theirs, it runs on every full page load — nothing is stored to skip it.
 */
export default function Preloader() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;

    const release = () => {
      document.documentElement.classList.remove('is-preloading');
      window.dispatchEvent(new Event('preloader:done'));
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      release();
      setDone(true);
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    const run = async () => {
      const jar = document.getElementById('hero-jar-image') as HTMLImageElement | null;
      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        jar?.decode?.().catch(() => undefined) ?? Promise.resolve(),
      ]);
      if (cancelled) return;

      const mark = curtain.querySelector('.preloader__mark');
      gsap.set(mark, { opacity: 0, yPercent: 20 });

      tl = gsap
        .timeline({
          onComplete: () => {
            release();
            setDone(true);
          },
        })
        .delay(0.2)
        .to(mark, { opacity: 1, yPercent: 0, duration: 1, ease: 'power3.out' })
        .to(curtain, { yPercent: 100, duration: 0.9, ease: 'power3.out' }, '+=0.25');
    };

    if (document.readyState === 'complete') {
      run();
    } else {
      window.addEventListener('load', run, { once: true });
    }

    return () => {
      cancelled = true;
      tl?.kill();
      window.removeEventListener('load', run);
    };
  }, []);

  if (done) return null;

  return (
    <div id="preloader" ref={curtainRef} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="preloader__mark" src="/hero/logo-krug.svg" alt="" width={120} height={120} />
    </div>
  );
}
