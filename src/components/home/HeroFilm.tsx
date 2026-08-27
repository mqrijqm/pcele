'use client';

import { useEffect, useRef } from 'react';

/**
 * Snimak u heroju ceka zavjesu.
 *
 * `autoPlay` je bio pogresan alat: snimak bi krenuo cim ga preglednik ucita,
 * a to je dok je zavjesa jos gore. Dok zavjesa padne, kamera je vec odsvirala
 * naguravanje — strana se otvarala na zadnjem kadru, zumirana na pcelara, i
 * izgledala kao da pocinje s kraja.
 *
 * Zato ovdje nema `autoPlay`. Snimak se premota na nulu i pusti tek kad padne
 * zavjesa (`preloader:done`), pa prvi kadar koji se vidi jeste prvi kadar.
 * Ako zavjese nema — drugo otvaranje strane, ili je vec pala — krece odmah.
 *
 * Poster je isto prvi kadar, ne zadnji: on je ono sto stoji dok se snimak
 * dekodira, i mora biti isto sto i prvi kadar da se prelaz ne vidi.
 */
export default function HeroFilm({ alt }: { alt: string }) {
  const film = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = film.current;
    if (!el) return;

    const start = () => {
      el.currentTime = 0;
      /* Preglednik moze odbiti pustanje (stedljivi rezim, tab u pozadini);
       * tada ostaje poster, koji je isti kadar, pa se nista ne raspada. */
      el.play().catch(() => undefined);
    };

    if (!document.documentElement.classList.contains('is-preloading')) {
      start();
      return;
    }

    window.addEventListener('preloader:done', start, { once: true });
    return () => window.removeEventListener('preloader:done', start);
  }, []);

  return (
    <video
      ref={film}
      className="hero-land__film"
      poster="/hero/livada-poster.webp"
      muted
      playsInline
      preload="auto"
      aria-label={alt}
    >
      <source src="/hero/livada.webm" type="video/webm" />
      <source src="/hero/livada.mp4" type="video/mp4" />
    </video>
  );
}
