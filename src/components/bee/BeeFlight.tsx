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

/**
 * Polazno mjesto: tik uz vrh isprekidane strelice u heroju.
 *
 * Strelica i natpis "Listaj i prati pcelu" pokazuju na pcelu — ako je nema
 * tamo, crtez pokazuje u prazno. Mjere su razlomci same strelice, ne kadra,
 * pa je pcela nadje gdje god strelica bila: devet posto njene sirine lijevo
 * od nje, na sedamdeset posto njene visine.
 *
 * Nagib je isti kao na crtezu — pcela ulijece koso, ne vodoravno.
 */
const START = { x: -0.093, y: 0.704, tilt: 20 };

/**
 * Dokle heroj vazi za "u kadru". Dok mu se strelica vidi bar toliko, pcela
 * stoji na svom mjestu; cim heroj prodje, krece let.
 */
const HERO_HOLD = 0.35;

/**
 * Drugo mjesto na kojem pcela sjedi: kamilica uz teglu.
 *
 * Sekcija ispod nje je snimak pcelinjaka preko cijelog ekrana, a tamo pcele
 * nema — snimak je njeno mjesto, ne njena pozadina. Zato se prije njega
 * spusti na cvijet i tu ostane dok sekcija sa snimkom ne prodje.
 *
 * Mjere su razlomci samog cvijeta: gore lijevo od njegove sredine, na
 * laticama, ne na srcu.
 */
const BLOOM = { x: 0.36, y: 0.22, tilt: 12 };

/** Sekcija preko koje pcele nema. */
const NO_FLY = '.apiary';

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

    /**
     * Mjesto uz strelicu u heroju, dok se heroj vidi. Kad prodje — `null`, pa
     * pcela slobodno leti.
     */
    const heroSpot = () => {
      const arrow = document.querySelector('.hero-land__arrow');
      if (!arrow) return null;
      const r = arrow.getBoundingClientRect();
      if (r.bottom < window.innerHeight * HERO_HOLD) return null;
      return { x: r.left + r.width * START.x, y: r.top + r.height * START.y };
    };

    /**
     * Mjesto na kamilici, dok se ona vidi. Trazi se da cvijet bude stvarno u
     * kadru — ne tek zavirio odozdo — inace bi pcela odletjela na njega jos
     * dok je sekcija ispod pregiba.
     */
    const bloomSpot = () => {
      const bloom = document.querySelector('.hero-jar__bloom');
      const petals = document.querySelector('.hero-jar__petals');
      if (!bloom || !petals) return null;
      /*
       * Cvijet se ne iscrta odmah — latice se rasire tek pri kraju sekcije s
       * teglom. Dok ih nema, pcela nema na sta da sjedne: sjedila bi na
       * praznom uglu i to se vidi.
       */
      if (Number(getComputedStyle(petals).opacity) < 0.9) return null;
      const r = bloom.getBoundingClientRect();
      const h = window.innerHeight;
      if (r.bottom < h * 0.15 || r.top > h * 0.85) return null;
      return { x: r.left + r.width * BLOOM.x, y: r.top + r.height * BLOOM.y };
    };

    /** Mjesto na kojem pcela sjedi, ako ga trenutno ima. */
    const parkSpot = () => heroSpot() ?? bloomSpot();

    /** Da li je sekcija bez pcele trenutno preko sredine kadra. */
    const noFly = () => {
      const section = document.querySelector(NO_FLY);
      if (!section) return false;
      const r = section.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      return r.top < mid && r.bottom > mid;
    };

    const first = heroSpot() ?? { x: window.innerWidth * 0.12, y: window.innerHeight * 0.2 };

    gsap.set(bee, {
      xPercent: -50,
      yPercent: -50,
      x: first.x,
      y: first.y,
      scaleX: 1,
      rotation: START.tilt,
    });

    if (still) {
      layer.dataset.still = 'true';
      return;
    }

    const ctx = gsap.context(() => {
      let at = { ...first };

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
        /* Dok ima mjesta za sjedanje — strelica u heroju, pa kamilica uz
         * teglu — pcela ne bira slobodnu tacku nego ide tamo. */
        const park = parkSpot();
        if (park) return park;

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

      /*
       * Sakrivanje nad sekcijom sa snimkom. Pcela i dalje leti, samo se ne
       * vidi — kad sekcija prodje, vraca se tamo gdje je stigla, a ne tamo
       * gdje je zamrznuta.
       */
      const veil = () => {
        gsap.to(bee, { autoAlpha: noFly() ? 0 : 1, duration: 0.5, overwrite: 'auto' });
      };

      const flyOn = () => {
        const to = nextStop();
        const parked = parkSpot() !== null;
        /* Gleda tamo gdje leti; crtez gleda udesno, pa se za lijevo ogleda.
         * Nagib nosi samo dok stoji uz strelicu — u letu je ravna. */
        gsap.to(bee, {
          scaleX: to.x < at.x ? -1 : 1,
          rotation: parked ? (heroSpot() ? START.tilt : BLOOM.tilt) : 0,
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
      veil();

      /*
       * Strana se pomjerila pod njom: ako je tamo gdje leti u medjuvremenu
       * osvanuo naslov, prekida se i bira novo odrediste. Mjeri se kad se
       * skrol smiri, ne u toku njega.
       */
      let idle: number | undefined;
      const recheck = () => {
        window.clearTimeout(idle);
        idle = window.setTimeout(() => {
          veil();
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
