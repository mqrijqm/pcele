'use client';

import { useEffect } from 'react';

/**
 * Ulazak elemenata u kadar.
 *
 * Dvije animacije sa uzora, obje vezane za trenutak kad element udje u kadar:
 *
 *   `.pcl-in`       — pomak od 45px odozdo, 0.6s, cubic-bezier(.645,.045,.355,1)
 *   `.pcl-ph--zoom` — slika sjedne iz uvecanja 1.2969 na 1
 *
 * Jedan posmatrac za cijelu stranu, umjesto jednog po komponenti: elementi se
 * gledaju dok ne udju, pa se ispustaju. Ono sto je vec proslo ne provjerava se
 * ponovo.
 *
 * Stilovi su u `pcelinjak.css`; ovdje se samo dodaje klasa `is-in`, pa strana
 * bez JavaScripta ostaje citljiva — vidi `noscript` pravilo ispod.
 */
export default function Motion() {
  useEffect(() => {
    const cilj = document.querySelectorAll<HTMLElement>('.pcl-in, .pcl-ph--zoom');
    if (!cilj.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cilj.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const posmatrac = new IntersectionObserver(
      (unosi) => {
        unosi.forEach((u) => {
          if (!u.isIntersecting) return;
          u.target.classList.add('is-in');
          posmatrac.unobserve(u.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    cilj.forEach((el) => posmatrac.observe(el));
    return () => posmatrac.disconnect();
  }, []);

  return null;
}
