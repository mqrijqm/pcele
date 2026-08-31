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
 * Na koju stranu crtez gleda.
 *
 * Pcela je nacrtana glavom nalijevo, pa je ogledana ona koja gleda udesno. To
 * je lako pomijesati — otud imena umjesto jedinice i minus jedinice.
 */
const FACE = { left: 1, right: -1 };

/**
 * Polazno mjesto: uz gornji desni ugao imena u heroju.
 *
 * Prije je sjedila na vrhu isprekidane strelice; strelice i natpisa "Listaj i
 * prati pcelu" vise nema, pa je mjerena tacka sada samo ime. Mjere su razlomci
 * njegovog okvira, ne kadra: tik uz desnu ivicu, malo iznad gornje — dovoljno
 * blizu da se cita kao pcela nad imenom, dovoljno van da mu ne sjedne na slovo.
 */
const START = { x: 1.03, y: -0.06, tilt: 14 };

/**
 * Koliko se pcela mice dok sjedi, u pikselima.
 *
 * Nekoliko piksela, u dva perioda razlicite duzine — pa se ne vrti u krug nego
 * lebdi. Toliko da se vidi da je ziva, i premalo da odvuce pogled sa naslova
 * pod njom. Ko je iskljucio animacije ne dobija ni ovo: tamo se ticker uopste
 * ne pali.
 */
const IDLE = { x: 4, y: 3 };

/**
 * Dokle pcela sjedi uz ime: dok je dno imena jos ispod ove crte, mjerene od
 * vrha ekrana. Cim ime ode, preuzima je skrol.
 *
 * Crta je namjerno niska. Mjeriti cio heroj umjesto imena znaci da pcela
 * ostaje uz njega i kad je odavno izaslo iznad ruba — ode van kadra i vrati se
 * tek kad heroj prodje. Visoka crta je isto tako lose: ime stoji pri vrhu
 * heroja, pa bi mu dno na visokom ekranu vec u prvom kadru bilo iznad crte, i
 * pcela ne bi sjela uz njega ni na samom vrhu strane.
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
     * Mjesto uz ime u heroju, dok se heroj vidi. Kad prodje — `null`, pa
     * pcelu preuzima skrol.
     */
    const heroSpot = () => {
      const name = document.querySelector('.hero-land__wordmark');
      if (!name) return null;
      const r = name.getBoundingClientRect();
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
      scaleX: FACE.right,
      rotation: first.tilt,
    });

    if (still) {
      layer.dataset.still = 'true';
      return;
    }

    const ctx = gsap.context(() => {
      const setX = gsap.quickSetter(bee, 'x', 'px');
      const setY = gsap.quickSetter(bee, 'y', 'px');

      let facing = FACE.right;
      let tilt = first.tilt;
      let hidden = false;

      const update = (time: number, delta: number) => {
        /*
         * Dok sjedi, mjestu se dodaje lagano lebdenje od nekoliko piksela. Dva
         * perioda su razlicite duzine i nesamjerljivi, pa se putanja ne
         * zatvara u krug koji bi oko prepoznalo.
         */
        const parked = parkSpot();
        const to = parked
          ? {
              x: parked.x + Math.sin(time * 1.1) * IDLE.x,
              y: parked.y + Math.sin(time * 0.7) * IDLE.y,
              tilt: parked.tilt,
            }
          : scrollSpot();

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

        /* Gleda tamo kuda ide. Dok stoji, ostaje kako je zadnji put okrenuta. */
        const want = Math.abs(dx) < TURN ? facing : dx < 0 ? FACE.left : FACE.right;
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
