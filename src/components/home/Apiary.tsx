'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/** Koliko je snimak ubrzan. Sedam sekundi prodje za nesto preko tri. */
const SPEED = 2.2;



/**
 * Pcelinjak: snimak koji se odmakne, pa progovori.
 *
 * Sekcija se otvara snimkom preko cijelog kadra — bez ruba, bez teksta, bez
 * icega. Kako se skroluje, snimak se povlaci u okvir s papirom oko sebe i tek
 * tada se na njemu ispise gdje je to snimljeno.
 *
 * Odmicanje nije `scale` nego stvarne mjere okvira. `scale` bi smanjio i sam
 * snimak zajedno s okvirom, a treba obrnuto: okvir se skuplja, a `object-fit:
 * cover` u njemu racuna izrez iznova — u uspravnijem kadru se od siroke slike
 * vidi manje, u sirem vise. Zato se odmicanjem zapravo otvara vise livade,
 * umjesto da se ista slika samo umanji.
 *
 * Mjere okvira na kraju: dva posto sa strana, tri gore i dolje. Snimak se
 * jedva odmakne od ruba — dovoljno da se vidi da je slika polozena na papir,
 * premalo da se cita kao izdvojena ploca.
 */
export default function Apiary({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const t = home.apiary[locale];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];
      const shot = q('.apiary__shot')[0];
      if (!shot) return;

      /*
       * Koordinate se sirinom poravnavaju s imenom sela — red pod redom, oba
       * jednako duga.
       *
       * To ne moze stajati u CSS-u: ime je jedna rijec u serifu, broj je
       * cifre u grotesku, i koliko ce koji biti dug zavisi od fonta koji jos
       * nije stigao i od sirine prozora. Zato se oboje izmjeri, pa se broju
       * zada mjera koja mu izjednaci duzinu s imenom.
       *
       * Oba su `inline-block`, inace bi im kutija bila siroka koliko i cijeli
       * stupac, a ne koliko slog u njoj.
       */
      const head = q('.apiary__heading')[0] as HTMLElement | undefined;
      const coords = q('.apiary__coords')[0] as HTMLElement | undefined;
      if (!head || !coords) return;

      const fitCoords = () => {
        coords.style.fontSize = '';
        const base = parseFloat(getComputedStyle(coords).fontSize);
        /*
         * Mjeri se sam slog, rasponom preko sadrzaja, a ne kutija elementa.
         * Kutija je siroka koliko joj dopusti stupac, a nas zanima koliko je
         * dugacak ispisani red — i tako oboje smiju ostati blokovi, jedan pod
         * drugim. Da smo im kutije stisnuli na slog, sjeli bi jedan pored
         * drugog u isti red.
         */
        const span = (el: HTMLElement) => {
          const r = document.createRange();
          r.selectNodeContents(el);
          return r.getBoundingClientRect().width;
        };
        const name = span(head);
        const line = span(coords);
        if (!base || !name || !line) return;
        coords.style.fontSize = `${(base * name) / line}px`;
      };

      fitCoords();
      /* Slog se mjeri iznova kad stigne pravi font i kad se prozor promijeni. */
      document.fonts?.ready.then(fitCoords).catch(() => undefined);
      window.addEventListener('resize', fitCoords);

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          shot,
          { top: '0%', right: '0%', bottom: '0%', left: '0%' },
          {
            top: '3%',
            right: '2%',
            bottom: '3%',
            left: '2%',
            ease: 'none',
            duration: 1,
          },
        );

        /* Zavrsni raspored ostaje da stoji dok sekcija ne prodje. */
        tl.to({}, { duration: 0.5 });

        return () => tl.scrollTrigger?.kill();
      });

      return () => {
        window.removeEventListener('resize', fitCoords);
        mm.revert();
      };
    }, el);

    return () => ctx.revert();
  }, []);

  /*
   * Snimak vodi natpise.
   *
   * Krece kad scena ispuni ekran, i tek tada. Ranije je gledana cijela
   * sekcija, a ona je visoka dva i po ekrana — pa je petnaest posto njene
   * visine bilo vidljivo jos dok je duboko ispod pregiba: snimak bi krenuo
   * tamo, odsvirao svojih deset sekundi i stao na zadnjem kadru prije nego se
   * do njega uopste stigne. Otud utisak da je slika, ne snimak.
   *
   * Natpisi idu uz snimak, ne poslije njega. Ime sela, koordinate pod njim i
   * crtez brda ispisuju se od prvog kadra i gotovi su vec na dvije trecine
   * snimka — dovoljno sporo da se citaju kao upisivanje u sliku, dovoljno brzo
   * da ne kasne za kadrom. Kad snimak stane, dodje jos samo recenica dolje
   * lijevo i sunce nad njom.
   *
   * Crtez i recenica se otkrivaju `clip-path`-om slijeva nadesno, kao da ih
   * neko vuce olovkom. Crtez je puna povrsina a ne potez, pa mu se
   * dash-offset ne moze animirati; brisanje preko njega daje isti utisak i
   * radi jednako na tekstu.
   */
  useEffect(() => {
    const el = root.current;
    const v = film.current;
    if (!el || !v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const stage = el.querySelector('.apiary__stage');
    if (!stage) return;

    const q = (sel: string) => el.querySelector(sel);
    const head = q('.apiary__heading');
    const coords = q('.apiary__coords');
    const hills = q('.apiary__hills');
    const body = q('.apiary__body');
    const sun = q('.apiary__sun');

    gsap.set([head, coords], { opacity: 0, y: 26 });
    gsap.set([hills, body], { opacity: 1, clipPath: 'inset(0 100% 0 0)' });
    gsap.set(sun, { opacity: 0, scale: 0 });

    /*
     * Strana stoji dok snimak ne prodje.
     *
     * Sekcija se prvo dovede na mjesto pa se skrol zaustavi; kad se snimak
     * zavrsi i natpisi se ispisu, skrol se vraca. Zadrzavanje traje koliko i
     * snimak — nesto preko tri sekunde — plus ispisivanje.
     *
     * Otkljucava se na tri nacina, jer je zaglavljena strana gora od
     * preskocenog snimka: kad natpisi zavrse, po sigurnosnom roku, i kad
     * sekcija ode iz kadra. Nijedan ne smije izostati.
     */
    let free = false;
    const unlock = () => {
      if (free) return;
      free = true;
      window.dispatchEvent(new Event('scroll:unlock'));
    };

    /*
     * Ispis uz snimak: ime sela, koordinate, pa crtez brda.
     *
     * Trajanja dolje zajedno traju `WRITE`. Ispis vise ne ceka kraj snimka
     * nego je gotov na nekih dvije trecine njega — natpisi tako stignu dok se
     * jos ima sta gledati, umjesto da se dovlace do zadnjeg kadra. Stvarna
     * duzina snimka zna se tek kad krene, pa se tok `timeScale`-om stisne na
     * tu mjeru; razvlaci se nikad — ispod pune brzine ispis ne ide.
     */
    const WRITE = 2.6;
    let runs = 6.9 / SPEED;

    let wrote = false;
    const write = () => {
      if (wrote) return;
      wrote = true;
      gsap
        .timeline()
        .to(head, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.15)
        .to(coords, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.75)
        .to(hills, { clipPath: 'inset(0 0% 0 0)', duration: 1.35, ease: 'power1.inOut' }, 1.25)
        .timeScale(Math.max(1, WRITE / Math.max(runs * 0.66, 1.2)));
    };

    let told = false;
    const tell = () => {
      if (told) return;
      told = true;
      /* Ako snimak nikad nije ni krenuo, ispis kasni ovdje — bolje kasno nego
       * da natpisa nema. */
      write();
      gsap
        .timeline({ onComplete: unlock })
        .to(body, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power1.inOut' })
        .to(sun, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.25');
    };

    v.playbackRate = SPEED;
    v.addEventListener('ended', tell);

    /*
     * Sigurnosni rok. Broji se od trenutka kad je snimak pusten, ne od
     * ucitavanja strane — inace istekne dok se do sekcije jos nije ni stiglo,
     * pa natpisi docekaju posjetioca vec ispisani.
     */
    let late: number | undefined;

    let guard: number | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.9) return;
        io.disconnect();

        /* Sekcija se dovede na vrh kadra, pa se strana zaustavi. */
        window.dispatchEvent(new CustomEvent('scroll:lock', { detail: { to: el } }));

        /*
         * Preglednik smije odbiti pustanje (stedljivi rezim); tada ostaje
         * poster, koji je prvi kadar. Ispis krece svakako — obecanje se
         * ispunjava kad snimak stvarno pocne, a odbija se odmah — pa se natpisi
         * upisuju i preko mirnog kadra.
         */
        runs = (v.duration || 10) / SPEED;
        v.play().then(write, write);
        late = window.setTimeout(tell, (runs + 2.5) * 1000);

        /*
         * Krajnji rok. Ako snimak ne stigne ili se natpisi zaglave, strana se
         * pusta svakako — sekunda i po duze nego sto najduzi tok traje.
         */
        guard = window.setTimeout(unlock, (runs + 2.5 + 3.5) * 1000);

        /* Ako je posjetilac ipak zavrsio negdje drugdje, brava pada s njim. */
        exit.observe(el);
      },
      { threshold: [0, 0.5, 0.9, 1] },
    );
    io.observe(stage);

    const exit = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) unlock();
      },
      { threshold: 0 },
    );

    return () => {
      io.disconnect();
      exit.disconnect();
      window.clearTimeout(late);
      window.clearTimeout(guard);
      v.removeEventListener('ended', tell);
      unlock();
    };
  }, []);

  return (
    <section className="apiary" ref={root} aria-label={t.heading}>
      <div className="apiary__stage">
        <figure className="apiary__shot">
          {/*
            * Snimak, ne slika: kamera klizi niz red kosnica. Ne ide u krug —
            * pocetak i kraj su dva razlicita mjesta u pcelinjaku, pa bi
            * vracanje bilo rez. Vrti se jednom i stane na zadnjem kadru.
            */}
          <video
            ref={film}
            className="apiary__img"
            poster="/images/real/pcelinjak-mracaj-poster.webp"
            muted
            playsInline
            preload="metadata"
            aria-label={t.alt}
          >
            <source src="/images/real/pcelinjak-mracaj.webm" type="video/webm" />
            <source src="/images/real/pcelinjak-mracaj.mp4" type="video/mp4" />
          </video>

          {/*
            * `display: contents` na natpisu: sve troje su i dalje jedan potpis
            * snimka, ali svako sjeda u svoj ugao. Bez toga bi `figcaption`
            * morao biti kutija, a onda bi im pozicije racunao on a ne snimak.
            */}
          <figcaption className="apiary__caption">
            {/* Sredina: crtez brda, ime sela pod njim, pa koordinate. */}
            <div className="apiary__where">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="apiary__hills apiary__copy"
                src="/images/brand/brda.svg"
                alt={t.hillsAlt}
              />
              <h2 className="apiary__heading apiary__copy">{t.heading}</h2>
              <p className="apiary__coords apiary__copy">{t.coords}</p>
            </div>

            {/*
              * Dolje lijevo: sunce, i pod njim recenica. Jedan blok, da im
              * lijeva ivica bude ista i da zajedno drze isti razmak od ugla.
              */}
            <div className="apiary__foot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="apiary__sun"
                src="/images/brand/sunce.svg"
                alt=""
                aria-hidden="true"
              />
              <p className="apiary__body">{t.body}</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
