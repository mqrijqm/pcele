'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

import BeeSvg from './BeeSvg';

/**
 * Pcela koja stalno leti kroz kadar.
 *
 * Prva verzija je isla po putanji nacrtanoj preko cijelog dokumenta, a skrol
 * ju je vukao po njoj — pa je gdje ce se zateci zavisilo od visine strane,
 * koja se mijenja sa svakom slikom koja se ucita. Druga je birala jedno od pet
 * mjesta u kadru i tu sjedila; izmedju dva izbora se citala kao naljepnica.
 *
 * Ova leti bez prestanka. Kadar je podijeljen u mrezu tacaka, iz nje se izbace
 * one koje padaju na sadrzaj, i pcela redom putuje od jedne slobodne do druge.
 * Svaki let traje nekoliko sekundi i ide svojim tempom, pa nema ni skoka ni
 * mirovanja — a posto se bira samo medju slobodnim tackama, nikad ne stoji
 * preko onoga sto se cita.
 */

/** Mreza mogucih odredista, u dijelovima kadra. Rubovi su namjerno uvuceni. */
const COLS = [0.12, 0.3, 0.5, 0.7, 0.88];
const ROWS = [0.2, 0.45, 0.72];

/** Sve sto se cita ili dodiruje — preko toga pcela ne leti. */
const CONTENT =
  'h1, h2, h3, h4, p, li, a, button, input, textarea, select, img, video, figure, blockquote';

/** Koliko zraka oko pcele mora biti prazno da bi tacka vazila za slobodnu. */
const CLEAR = 44;

/**
 * Sve preko ovolikog dijela kadra je podloga, ne sadrzaj.
 *
 * Snimak preko cijelog ekrana — livada u heroju, pcelinjak — jeste `img`, ali
 * nije nesto sto se cita: to je pozadina, i preko nje pcela smije. Da se i
 * takve plohe racunaju, slobodne tacke ne bi bilo nigdje osim uz sam rub, pa
 * bi pcela cijelu stranu klizila gore-dolje uz lijevu ivicu. Ono sto se na
 * takvoj podlozi zaista cita — naslov, recenica — ima svoju kutiju i dalje se
 * racuna.
 */
const BACKDROP = 0.55;

/** Najkraci let. Ispod ovoga se dvije tacke citaju kao jedna. */
const MIN_HOP = 0.22;

/** Raspon trajanja jednog leta, u sekundama. */
const HOP = { min: 3.4, max: 5.6 };

export default function BeeFlight() {
  const [mounted, setMounted] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const beeRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const layer = layerRef.current;
    const bee = beeRef.current;
    if (!layer || !bee) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /*
     * Polazi gore lijevo i gleda udesno — u stranu, ne u rub. Tu je i vrh
     * isprekidane strelice u heroju, pa natpis "Listaj i prati pcelu" pokazuje
     * na nju a ne u prazno.
     */
    const start = { x: 0.12, y: 0.2 };

    gsap.set(bee, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth * start.x,
      y: window.innerHeight * start.y,
      scaleX: 1,
    });

    if (still) {
      layer.dataset.still = 'true';
      return;
    }

    const ctx = gsap.context(() => {
      let at = { x: window.innerWidth * start.x, y: window.innerHeight * start.y };

      /*
       * Sadrzaj koji je trenutno u kadru. Ukrasi se ne broje: sajt je pun
       * crteza koji pokrivaju cijele pojaseve, i da se i oni racunaju, slobodne
       * tacke ne bi bilo nigdje. Prepoznaju se po `aria-hidden` — sto preskace
       * citac ekrana, preskace i ona.
       */
      const inView = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const out: DOMRect[] = [];
        document.querySelectorAll<HTMLElement>(CONTENT).forEach((el) => {
          if (layer.contains(el)) return;
          if (el.closest('[aria-hidden="true"]')) return;
          const b = el.getBoundingClientRect();
          if (b.bottom < 0 || b.top > h || b.right < 0 || b.left > w) return;
          if (b.width < 8 || b.height < 8) return;
          if ((b.width * b.height) / (w * h) > BACKDROP) return;
          out.push(b);
        });
        return out;
      };

      const free = (x: number, y: number, boxes: DOMRect[]) =>
        !boxes.some(
          (b) =>
            b.left - CLEAR < x && b.right + CLEAR > x && b.top - CLEAR < y && b.bottom + CLEAR > y,
        );

      /** Koliko je tacka daleko od najblizeg sadrzaja. */
      const room = (x: number, y: number, boxes: DOMRect[]) =>
        Math.min(
          ...boxes.map((b) =>
            Math.hypot(Math.max(b.left - x, 0, x - b.right), Math.max(b.top - y, 0, y - b.bottom)),
          ),
          Infinity,
        );

      /**
       * Sljedece odrediste: neka slobodna tacka dovoljno daleko od trenutne.
       * Ako slobodne nema — a na gustoj strani je ne mora biti — ide na onu
       * koja je najdalje od svega.
       */
      const nextStop = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const boxes = inView();
        const far = Math.hypot(w, h) * MIN_HOP;

        const all = COLS.flatMap((cx) => ROWS.map((ry) => ({ x: cx * w, y: ry * h })));
        const open = all.filter((p) => free(p.x, p.y, boxes));
        const reach = (open.length ? open : all).filter(
          (p) => Math.hypot(p.x - at.x, p.y - at.y) > far,
        );

        const pool = reach.length ? reach : open.length ? open : all;
        if (open.length) return gsap.utils.random(pool);

        return pool.reduce((best, p) =>
          room(p.x, p.y, boxes) > room(best.x, best.y, boxes) ? p : best,
        );
      };

      let hop: gsap.core.Tween | null = null;

      const flyOn = () => {
        const to = nextStop();
        /* Gleda tamo gdje leti; crtez gleda udesno, pa se za lijevo ogleda. */
        gsap.to(bee, {
          scaleX: to.x < at.x ? -1 : 1,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        at = to;
        hop = gsap.to(bee, {
          x: to.x,
          y: to.y,
          duration: gsap.utils.random(HOP.min, HOP.max),
          ease: 'sine.inOut',
          onComplete: flyOn,
        });
      };

      flyOn();

      /*
       * Strana se pomjerila pod njom: ako je tamo gdje leti u medjuvremenu
       * osvanuo naslov, prekida se i bira novo odrediste. Mjeri se kad se
       * skrol smiri, ne u toku njega.
       */
      let idle: number | undefined;
      const recheck = () => {
        window.clearTimeout(idle);
        idle = window.setTimeout(() => {
          if (free(at.x, at.y, inView())) return;
          hop?.kill();
          flyOn();
        }, 180);
      };

      window.addEventListener('scroll', recheck, { passive: true });
      window.addEventListener('resize', recheck);
      const ro = new ResizeObserver(recheck);
      ro.observe(document.body);

      return () => {
        window.clearTimeout(idle);
        window.removeEventListener('scroll', recheck);
        window.removeEventListener('resize', recheck);
        ro.disconnect();
        hop?.kill();
      };
    }, layer);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div className="bee-layer" ref={layerRef} aria-hidden="true">
      {/* dva omotaca: let kroz kadar -> lebdenje -> crtez */}
      <div className="bee" ref={beeRef}>
        <div className="bee__hover">
          <BeeSvg className="bee__art" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
