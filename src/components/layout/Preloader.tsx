'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/** Belt and braces: if the clip never plays, leave anyway. */
const FALLBACK_MS = 9000;

/**
 * The loading curtain: a jar filling to 1 kg, then the curtain drops.
 *
 * The exit is meracinque.com's, measured rather than guessed
 * (recon/findings.md §2) — a 0.25 s hold on the full jar, then
 * `yPercent: 0 → 100` over 0.9 s on `power3.out`, then gone. What changed is
 * what fills the wait: their monogram rising into place, ours the clip.
 *
 * The node unmounts through state rather than `.remove()`. Pulling a
 * React-owned node out of the DOM by hand is what broke navigation before.
 *
 * It waits for `window.load`, for the fonts, for the hero jar to decode and
 * for the clip to be playable, so nothing is caught half-painted. If any of
 * that stalls, `FALLBACK_MS` releases the page regardless.
 *
 * Like theirs, it runs on every full page load — nothing is stored to skip it.
 * (To show it once per session instead, keep a flag in `sessionStorage` here.)
 */
export default function Preloader() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    let left = false;

    const leave = () => {
      if (left || cancelled) return;
      left = true;
      tl = gsap.timeline({
        delay: 0.25,
        onComplete: () => {
          release();
          setDone(true);
        },
      });
      tl.to(curtain, { yPercent: 100, duration: 0.9, ease: 'power3.out' });
    };

    const bail = window.setTimeout(leave, FALLBACK_MS);

    const start = async () => {
      const video = videoRef.current;
      const jar = document.getElementById('hero-jar-image') as HTMLImageElement | null;

      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        jar?.decode?.().catch(() => undefined) ?? Promise.resolve(),
        video && video.readyState < 3
          ? new Promise<void>((resolve) => {
              video.addEventListener('canplay', () => resolve(), { once: true });
              video.addEventListener('error', () => resolve(), { once: true });
            })
          : Promise.resolve(),
      ]);
      if (cancelled) return;

      // Autoplay can still be refused; the clip is muted and inline, but if the
      // promise rejects we go straight to the exit rather than sit on a still.
      video?.addEventListener('ended', leave, { once: true });
      video?.play().catch(leave);
    };

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(bail);
      tl?.kill();
      window.removeEventListener('load', start);
    };
  }, []);

  if (done) return null;

  return (
    <div id="preloader" ref={curtainRef} aria-hidden="true">
      <video
        ref={videoRef}
        className="preloader__clip"
        muted
        playsInline
        preload="auto"
        poster="/splash/jar-fill-start.webp"
      >
        <source src="/splash/jar-fill.webm" type="video/webm" />
        <source src="/splash/jar-fill.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
