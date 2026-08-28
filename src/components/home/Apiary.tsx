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
 * Mjere okvira na kraju: pet posto sa strana, dvanaest gore i dolje. Time
 * okvir dobije omjer blizak omjeru samog snimka, pa se u njemu vidi gotovo
 * cijela sirina.
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
            top: '12%',
            right: '5%',
            bottom: '12%',
            left: '5%',
            borderRadius: 20,
            ease: 'none',
            duration: 1,
          },
        );

        /*
         * Natpisi stizu tek kad se snimak vec odmakao. Da krecu zajedno s
         * njim, citali bi se dok se kadar jos pomjera ispod njih.
         *
         * `set` pa `to`, ne `from`: uz `stagger` meta ciji red jos nije dosao
         * zadrzava svoju prirodnu vrijednost, pa su koordinate stajale
         * ispisane preko punog kadra dok naslova jos nije bilo.
         */
        gsap.set(copy, { opacity: 0, y: 26 });
        tl.to(copy, { opacity: 1, y: 0, stagger: 0.12, duration: 0.45 }, 0.55);

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

          <figcaption className="apiary__where">
            <h2 className="apiary__heading apiary__copy">{t.heading}</h2>
            <p className="apiary__body apiary__copy">{t.body}</p>
          </figcaption>

          {/* Koordinate idu grotesknim slogom — to je podatak, ne recenica. */}
          <p className="apiary__coords apiary__copy">
            {t.coords.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </figure>
      </div>
    </section>
  );
}
