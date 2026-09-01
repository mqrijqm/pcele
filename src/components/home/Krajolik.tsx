'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TransitionLink from '@/components/ui/TransitionLink';
import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Med koji pamti krajolik.
 *
 * Stoji iza tri sorte i kaze zasto se razlikuju: ne po receptu nego po tome
 * sta je te godine cvjetalo. Zato ovdje nema ni tegle ni mjere — samo pcelar
 * nad ramom, kriska hljeba, i ono sto se o tome cita.
 *
 * **Tri kolone.** Lijevo dvije fotografije, u sredini naslov preko tri reda,
 * desno tekst i veza na pcelinjake. Naslov je namjerno u sredini, izmedju
 * slike i sloga: on nije zaglavlje kolone nego os oko koje sekcija stoji.
 *
 * **Dvije fotografije, ne jedna.** Snimak pcelara je uspravan i ostrih ivica,
 * kao slika prikacena na papir; kriska je izrezana na sam sadrzaj i lezi preko
 * njegovog donjeg ugla, izvan okvira. Ta razlika — jedno u okviru, drugo van
 * njega — je ono sto kadar drzi da ne bude obicna kartica s tekstom.
 *
 * **Polje cvijeca** ispod sekcije nije njeno: sekcija stoji u istom omotacu
 * (`bloomfield`) kao i sorte iznad, pa uzorak tece preko ruba medju njima.
 *
 * **Otkrivanje** ide redom — slika, pa naslov red po red, pa slog — i vezano
 * je za dolazak sekcije u kadar. Bez pina: ovdje se nista ne sklapa niti
 * iscrtava, samo ulazi, pa nema sta da se ceka.
 */
export default function Krajolik({ locale }: { locale: Locale }) {
  const t = home.krajolik[locale];
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];
      const okvir = q('.krajolik__okvir');
      const kriska = q('.krajolik__kriska');
      const redovi = q('.krajolik__red');
      const slog = q('.krajolik__copy > *');

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([...okvir, ...kriska, ...redovi, ...slog], { opacity: 1, y: 0, scale: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(okvir, { opacity: 0, y: 40 });
        gsap.set(kriska, { opacity: 0, y: 30, scale: 0.94 });
        gsap.set(redovi, { opacity: 0, y: 26 });
        gsap.set(slog, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
          defaults: { ease: 'power2.out' },
        });

        /*
         * Slika, pa naslov, pa slog. Kriska kasni za okvirom: ona se cita kao
         * nesto polozeno preko snimka, a preko cega se polaze mora prvo
         * stajati.
         */
        tl.to(okvir, { opacity: 1, y: 0, duration: 0.8 })
          .to(kriska, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, 0.35)
          .to(redovi, { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 }, 0.5)
          .to(slog, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.95);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [locale]);

  /*
   * Naslov se lomi rukom, ne po sirini kolone: tri reda, kako i stoji na
   * predlosku. Svaki red je svoj element da bi mogao da udje za sebe.
   */
  const redovi = t.heading.split(' ');
  const naslovRedovi =
    redovi.length > 3
      ? [redovi.slice(0, 2).join(' '), redovi[2], redovi.slice(3).join(' ')]
      : redovi;

  return (
    <section className="krajolik" ref={root}>
      <div className="krajolik__inner">
        {/* --- lijevo: snimak u okviru i kriska preko njegovog ugla --- */}
        <div className="krajolik__slike">
          <div className="krajolik__okvir">
            <Image
              src="/images/krajolik/pcelar-kosnice.webp"
              alt={t.pcelarAlt}
              width={320}
              height={480}
              sizes="(max-width: 900px) 62vw, 22vw"
            />
          </div>

          {/*
            Kriska nije u okviru i namjerno prelazi preko njega — zato je
            zaseban element, a ne jos jedna slika u istom sanduku.
          */}
          <Image
            className="krajolik__kriska"
            src="/images/krajolik/kriska-meda.webp"
            alt={t.kriskaAlt}
            width={345}
            height={510}
            sizes="(max-width: 900px) 46vw, 17vw"
          />
        </div>

        {/* --- sredina: naslov --- */}
        <h2 className="krajolik__naslov">
          {naslovRedovi.map((red) => (
            <span className="krajolik__red" key={red}>
              {red}
            </span>
          ))}
        </h2>

        {/* --- desno: sve sto se cita --- */}
        <div className="krajolik__copy">
          {t.paragrafi.map((p) => (
            <p className="krajolik__tekst" key={p.slice(0, 24)}>
              {p}
            </p>
          ))}

          <TransitionLink className="krajolik__cta" href={localeHref(locale, '/pcelinjak')}>
            {t.cta}
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
