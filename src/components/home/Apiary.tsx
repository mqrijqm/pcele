'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

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
  const t = home.apiary[locale];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];
      const shot = q('.apiary__shot')[0];
      const head = q('.apiary__heading')[0];
      const hills = q('.apiary__hills')[0];
      const rest = q('.apiary__body, .apiary__sun, .apiary__coords');
      const copy = q('.apiary__copy');
      if (!shot) return;

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

        /*
         * Natpisi stizu tek kad se snimak vec odmakao. Da krecu zajedno s
         * njim, citali bi se dok se kadar jos pomjera ispod njih.
         *
         * Redom: prvo ime sela, pa crtez brda nad njim, pa sve ostalo. Ime je
         * ono zbog cega je snimak tu, crtez ga zaokruzi, a recenica, sunce i
         * broj dolaze kad je mjesto vec imenovano.
         *
         * `set` pa `to`, ne `from`: uz `stagger` meta ciji red jos nije dosao
         * zadrzava svoju prirodnu vrijednost, pa su koordinate stajale
         * ispisane preko punog kadra dok naslova jos nije bilo.
         */
        gsap.set(copy, { opacity: 0, y: 26 });
        tl.to(head, { opacity: 1, y: 0, duration: 0.4 }, 0.5);
        tl.to(hills, { opacity: 1, y: 0, duration: 0.4 }, 0.68);
        tl.to(rest, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, 0.86);

        /* Zavrsni raspored ostaje da stoji dok sekcija ne prodje. */
        tl.to({}, { duration: 0.5 });

        return () => tl.scrollTrigger?.kill();
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="apiary" ref={root} aria-label={t.heading}>
      <div className="apiary__stage">
        <figure className="apiary__shot">
          <Image
            className="apiary__img"
            src="/images/real/pcelinjak-mracaj.webp"
            alt={t.alt}
            fill
            sizes="100vw"
          />

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

            {/* Dolje lijevo: sunce, i pod njim recenica. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="apiary__sun apiary__copy"
              src="/images/brand/sunce.svg"
              alt=""
              aria-hidden="true"
            />
            <p className="apiary__body apiary__copy">{t.body}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
