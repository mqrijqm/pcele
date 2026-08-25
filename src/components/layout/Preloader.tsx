'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import BeeSvg from '@/components/bee/BeeSvg';

/**
 * Koliko punjenje smije da traje. Snimak je 5.88 s — toliko niko ne ceka da
 * se tegla napuni. Ne sijecemo ga i ne preskacemo kraj, nego mu dizemo brzinu
 * tako da cijelo punjenje stane u ovo vrijeme: med i dalje tece do vrha, samo
 * brze. Brzina se racuna iz stvarnog trajanja snimka, pa ako se klip jednom
 * zamijeni kracim, ovdje se nista ne mijenja.
 */
const CLIP_TARGET_MS = 2600;
const MAX_RATE = 3;

/**
 * Cekanje na fontove i na sliku tegle ide uporedo sa punjenjem, ali ni tada ne
 * smije da traje duze od ovoga — inace jedan spor fajl drzi cijelu stranu.
 */
const ASSET_WAIT_MS = 2200;

/** Belt and braces: if the clip never plays, leave anyway. */
const FALLBACK_MS = 5000;

/**
 * The loading curtain: a jar filling to 1 kg, then the curtain drops.
 *
 * Cekanje i punjenje idu uporedo. Ranije je bilo u nizu — prvo `window.load`
 * (a to je cijela strana, sa svim slikama), pa tek onda snimak od 5.88 s, pa
 * izlaz: oko sedam sekundi praznog ekrana na svako otvaranje. Sada snimak
 * krece odmah, fontovi i tegla se ucitavaju iza zavjese, a zavjesa odlazi kad
 * su oba gotova.
 *
 * Izlaz vise nije jedan potez nego primopredaja: pcela poleti sa oboda, kadar
 * se odmakne i ugasi, zavjesa klizne dolje — a strana ispod pocinje da se
 * ispisuje jos dok zavjesa putuje. Natpis u heroju stoji na 4.44% visine, pa
 * ga otkrije vec prvi centimetar klizanja; zato se `preloader:done` javlja na
 * pocetku klizanja, a ne na kraju.
 *
 * Pcela nije u snimku nego preko njega. U kadru je stajala fotografija tudje
 * pcele; sada je na obodu ista ona iz heroja, sa istim lepetom. Snimak je zato
 * iznova iscrtan (recon/recolour-splash.mjs): fotografija je skinuta, a
 * papir, med i mastilo su prebojeni u boje palete — u izvoru su bili sivkasti,
 * i tegla je izgledala prazno umesto puna meda.
 *
 * The node unmounts through state rather than `.remove()`. Pulling a
 * React-owned node out of the DOM by hand is what broke navigation before.
 *
 * Like theirs, it runs on every full page load — nothing is stored to skip it.
 * (To show it once per session instead, keep a flag in `sessionStorage` here.)
 */
export default function Preloader() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const beeRef = useRef<HTMLDivElement>(null);
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
        delay: 0.15,
        onComplete: () => setDone(true),
      });

      // Pcela prva: odleti sa oboda dok je tegla jos u kadru.
      tl.to(beeRef.current, { y: -26, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0);
      // Kadar se odmakne i ugasi — zavjesa ispod njega ostaje puna boje.
      tl.to(
        stageRef.current,
        { scale: 1.06, opacity: 0, duration: 0.55, ease: 'power2.inOut' },
        0.08,
      );
      // Pa tek onda sama zavjesa. `expo.inOut` krece mirno i staje mirno;
      // `power3.out` je startovao trzajem, sto se na punom ekranu vidi.
      tl.to(curtain, { yPercent: 100, duration: 1, ease: 'expo.inOut' }, 0.3);
      // Strana se budi na prvom centimetru klizanja, ne poslije njega.
      tl.call(release, undefined, 0.5);
    };

    const bail = window.setTimeout(leave, FALLBACK_MS);

    /*
     * Dva uslova, ne jedan: snimak mora da se napuni do vrha, a strana ispod
     * mora da bude spremna. Sta god od to dvoje kasni, drugo ga ceka.
     */
    let clipDone = false;
    let assetsDone = false;
    const step = (which: 'clip' | 'assets') => {
      if (which === 'clip') clipDone = true;
      else assetsDone = true;
      if (clipDone && assetsDone) leave();
    };

    const video = videoRef.current;

    // Brzina se postavlja cim se zna trajanje — i prije `play()`, ako je vec
    // procitano iz kesa.
    const pace = () => {
      if (!video) return;
      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      video.playbackRate = Math.min(MAX_RATE, Math.max(1, (d * 1000) / CLIP_TARGET_MS));
    };

    if (video) {
      video.addEventListener('loadedmetadata', pace, { once: true });
      if (video.readyState >= 1) pace();

      video.addEventListener('ended', () => step('clip'), { once: true });
      video.addEventListener('error', () => step('clip'), { once: true });
      // Autoplay can still be refused; the clip is muted and inline, but if the
      // promise rejects we go straight to the exit rather than sit on a still.
      video.play().catch(() => step('clip'));
    } else {
      step('clip');
    }

    const jar = document.getElementById('hero-jar-image') as HTMLImageElement | null;
    const timeout = new Promise<void>((resolve) => {
      window.setTimeout(resolve, ASSET_WAIT_MS);
    });

    Promise.race([
      Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        jar?.decode?.().catch(() => undefined) ?? Promise.resolve(),
      ]),
      timeout,
    ]).then(() => {
      if (!cancelled) step('assets');
    });

    return () => {
      cancelled = true;
      window.clearTimeout(bail);
      tl?.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div id="preloader" ref={curtainRef} aria-hidden="true">
      <div className="preloader__stage" ref={stageRef}>
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

        {/* isti troslojni omotac kao u letu: mesto -> lebdenje -> crtez.
            Sloj za polijetanje je cetvrti i namjerno prazan u CSS-u: mjesto
            drzi `preloader__bee` svojim transformom, pa GSAP ovdje ima cistu
            plocu i ne prepisuje ga. */}
        <div className="preloader__bee">
          <div className="preloader__bee-lift" ref={beeRef}>
            <div className="bee__hover">
              <BeeSvg className="bee__art" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
