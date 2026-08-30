'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

import BeeSvg from './BeeSvg';

/**
 * Pcela koju vodi skrol.
 *
 * Ne leti sama. Kadar joj je fiksan sloj preko strane, a gdje ce u njemu
 * stajati racuna se iz toga koliko je strana odskrolana: krece slijeva
 * nadesno, vrati se, pa opet — jedan zamah na svakih nekoliko ekrana skrola.
 * Ko stane, stane i ona; ko se vrati gore, vrati se i ona istim putem.
 *
 * Prije ovoga je birala slobodne tacke u kadru i sama letjela od jedne do
 * druge, na tajmer. To je izgledalo zivo dok strana miruje, ali je bilo
 * nevezano za ono sto citalac radi — skrolas nadolje, a pcela ide nagore, jer
 * je krenula prije nego sto si ti. Sada je pokret njen odgovor na skrol.
 *
 * Dva mjesta gdje ipak sjedi — vrh strelice u heroju i kamilica uz teglu —
 * ostaju: tamo je crtez zove poimence i tu je skrol ne dira.
 */

/**
 * Koliko skrola stane u jedan puni zamah, u pikselima.
 *
 * Mjereno je sa strane koja je posluzila kao uzor: pcela stigne do desnog ruba
 * poslije oko hiljadu i sedamsto piksela skrola, a nazad do lijevog poslije
 * jos toliko.
 */
const WAVE = 3800;

/**
 * Pojas kroz koji se pcela krece, u dijelovima kadra.
 *
 * Vodoravno ide gotovo cijelom sirinom, uspravno ostaje u gornjoj trecini —
 * nize bi presijecala slog koji se u tom trenutku cita.
 */
const BAND = {
  x: { mid: 0.5, amp: 0.34 },
  y: { mid: 0.34, amp: 0.11 },
};

/**
 * Koliko pcela zaostaje za skrolom.
 *
 * Nula bi je zalijepila za kotacic — svaki trzaj skrola bio bi i njen. Ovako
 * pristize u svoje mjesto za oko trecinu sekunde, pa se pokret cita kao let, a
 * ne kao pomjeranje.
 */
const LAG = 0.045;

/** Ispod ovoliko piksela po kadru se smjer ne mijenja — inace pcela treperi. */
const TURN = 0.35;

/**
 * Polazno mjesto: tik uz vrh isprekidane strelice u heroju.
 *
 * Strelica i natpis "Listaj i prati pcelu" pokazuju na pcelu — ako je nema
 * tamo, crtez pokazuje u prazno. Mjere su razlomci same strelice, ne kadra,
 * pa je pcela nadje gdje god strelica bila: nesto vise od desetine njene
 * sirine lijevo od nje, na pola i po njene visine — tacno u produzetku vrha.
 */
const START = { x: -0.115, y: 0.55, tilt: 20 };

/**
 * Dokle pcela sjedi uz strelicu: dok je dno strelice jos ispod ove crte,
 * mjerene od vrha ekrana. Cim strelica ode, preuzima je skrol.
 *
 * Crta je namjerno niska. Na jednu stranu, mjeriti heroj umjesto strelice
 * znaci da pcela ostaje uz nju i kad je strelica odavno izasla iznad ruba —
 * ode s njom van kadra i vrati se tek kad heroj prodje. Na drugu, visoka crta
 * je isto tako lose: strelica stoji pri vrhu crteza, pa joj je dno na visokom
 * ekranu vec u prvom kadru iznad trecine ekrana — i pcela ne bi sjela uz nju
 * ni na samom vrhu strane, a strelica bi pokazivala u prazno.
 */
const HERO_HOLD = 0.12;

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

/**
 * Sekcije preko kojih pcele nema.
 *
 * Snimak pcelinjaka preko cijelog ekrana je njeno mjesto, ne njena pozadina.
 * Album je drugi razlog: sedam okvira koji klize vodoravno vec vode oko, i
 * pcela preko njih nema sta da pokazuje — samo odvlaci pogled s fotografija.
 *
 * Traka s proizvodima nosi iste klase kao album, pa je iz izbora izuzeta
 * imenom: tamo pcela smije.
 */
const NO_FLY = '.apiary, .rail:not(.rail--shelf)';

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
     * pcelu preuzima skrol.
     */
    const heroSpot = () => {
      const arrow = document.querySelector('.hero-land__arrow');
      if (!arrow) return null;
      const r = arrow.getBoundingClientRect();
      if (r.bottom < window.innerHeight * HERO_HOLD) return null;
      return { x: r.left + r.width * START.x, y: r.top + r.height * START.y, tilt: START.tilt };
    };

    /**
     * Mjesto na kamilici, dok se ona vidi. Trazi se da cvijet bude stvarno u
     * kadru — ne tek zavirio odozdo — inace bi pcela sjela na njega jos dok je
     * sekcija ispod pregiba.
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
      return { x: r.left + r.width * BLOOM.x, y: r.top + r.height * BLOOM.y, tilt: BLOOM.tilt };
    };

    /** Mjesto na kojem pcela sjedi, ako ga trenutno ima. */
    const parkSpot = () => heroSpot() ?? bloomSpot();

    /**
     * Mjesto koje joj daje skrol.
     *
     * Vodoravno je sinus, uspravno sinus upola sporiji i pomjeren za pola
     * zamaha — da se dva pokreta ne poklope u kosu liniju gore-dolje nego da
     * se pcela vraca drugom visinom nego sto je otisla.
     */
    const scrollSpot = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const u = (window.scrollY / WAVE) * Math.PI * 2;
      return {
        x: w * (BAND.x.mid + BAND.x.amp * Math.sin(u)),
        y: h * (BAND.y.mid + BAND.y.amp * Math.sin(u * 0.5 + 1.1)),
        tilt: 0,
      };
    };

    /** Da li je neka od sekcija bez pcele trenutno preko sredine kadra. */
    const noFly = () => {
      const mid = window.innerHeight / 2;
      return Array.from(document.querySelectorAll(NO_FLY)).some((section) => {
        const r = section.getBoundingClientRect();
        return r.top < mid && r.bottom > mid;
      });
    };

    const first = parkSpot() ?? scrollSpot();
    const at = { x: first.x, y: first.y };

    gsap.set(bee, {
      xPercent: -50,
      yPercent: -50,
      x: at.x,
      y: at.y,
      scaleX: 1,
      rotation: first.tilt,
    });

    if (still) {
      layer.dataset.still = 'true';
      return;
    }

    const ctx = gsap.context(() => {
      const setX = gsap.quickSetter(bee, 'x', 'px');
      const setY = gsap.quickSetter(bee, 'y', 'px');

      let facing = 1;
      let tilt = first.tilt;
      let hidden = false;

      const update = (_time: number, delta: number) => {
        const to = parkSpot() ?? scrollSpot();

        /*
         * Zaostajanje se racuna po proteklom vremenu, ne po kadru: na ekranu
         * sa sto dvadeset osvjezenja u sekundi bi inace pcela stizala dvaput
         * brze nego na onom sa sezdeset.
         */
        const k = 1 - Math.pow(1 - LAG, delta / 16.667);
        const dx = (to.x - at.x) * k;
        at.x += dx;
        at.y += (to.y - at.y) * k;

        setX(at.x);
        setY(at.y);

        /* Gleda tamo kuda ide; crtez gleda udesno, pa se za lijevo ogleda. */
        const want = Math.abs(dx) < TURN ? facing : dx < 0 ? -1 : 1;
        if (want !== facing) {
          facing = want;
          gsap.to(bee, { scaleX: facing, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        }

        /* Nagib nosi samo dok sjedi; u letu je ravna. */
        if (to.tilt !== tilt) {
          tilt = to.tilt;
          gsap.to(bee, { rotation: tilt, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        }

        /*
         * Sakrivanje nad sekcijom sa snimkom. Pcela se i dalje pomjera sa
         * skrolom, samo se ne vidi — kad sekcija prodje, vraca se tamo gdje ju
         * je skrol u medjuvremenu odnio, a ne tamo gdje je zamrznuta.
         */
        const away = noFly();
        if (away !== hidden) {
          hidden = away;
          gsap.to(bee, { autoAlpha: hidden ? 0 : 1, duration: 0.5, overwrite: 'auto' });
        }
      };

      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
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
