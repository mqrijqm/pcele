'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/** Koliko je snimak ubrzan. Deset sekundi postaje nesto preko sest. */
const SPEED = 1.6;



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
          { top: '0%', right: '0%', bottom: '0%', left: '0%', borderRadius: 0 },
          {
            top: '3%',
            right: '2%',
            bottom: '3%',
            left: '2%',
            borderRadius: 8,
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
   * Kad odsvira, ispisu se natpisi: ime sela, koordinate pod njim, pa se
   * crtez brda iscrta, pa recenica, pa sunce iskoci. Mjesto se prvo pokaze,
   * pa onda imenuje.
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

    let told = false;
    const tell = () => {
      if (told) return;
      told = true;
      gsap
        .timeline()
        .to(head, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
        .to(coords, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
        .to(hills, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power1.inOut' }, '-=0.15')
        .to(body, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power1.inOut' }, '-=0.35')
        .to(sun, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3');
    };

    v.playbackRate = SPEED;
    v.addEventListener('ended', tell);

    /*
     * Sigurnosni rok. Broji se od trenutka kad je snimak pusten, ne od
     * ucitavanja strane — inace istekne dok se do sekcije jos nije ni stiglo,
     * pa natpisi docekaju posjetioca vec ispisani.
     */
    let late: number | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.9) return;
        io.disconnect();
        /* Preglednik smije odbiti pustanje (stedljivi rezim); tada ostaje
         * poster, koji je prvi kadar, pa se natpisi ispisu po roku. */
        v.play().catch(() => undefined);
        const runs = (v.duration || 10) / SPEED;
        late = window.setTimeout(tell, (runs + 2.5) * 1000);
      },
      { threshold: [0, 0.5, 0.9, 1] },
    );
    io.observe(stage);

    return () => {
      io.disconnect();
      window.clearTimeout(late);
      v.removeEventListener('ended', tell);
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
