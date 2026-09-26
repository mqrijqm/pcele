'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import ImageSlot from '@/components/products/ImageSlot';
import { anticipatePin } from '@/components/products/pinAnticipate';
import SplitTitle from '@/components/products/SplitTitle';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function WhyBlock({
  title,
  slot,
  slotLabel,
  intro,
  list,
  outro,
  image,
}: {
  title: string;
  slot: string;
  slotLabel: string;
  intro: string;
  list: string[];
  outro: string;
  image?: string;
}) {
  const root = useRef<HTMLElement>(null);

  /*
   * Skrol staje dok blijedi tekst ispod ne postane vidljiv: kotačić samo
   * "čita" tekst riječ po riječ, a strana se ne pomjera (`pin`). Kad je i
   * zadnja riječ jasna, skrol nastavlja dalje.
   *
   * Isti uslov kao u CSS-u (`orientation`), da JS i raspored ne razilaze.
   */
  useGSAP(
    () => {
      const el = root.current;
      const outro = el?.querySelector<HTMLElement>('.pe-why__outro');
      const words = el ? gsap.utils.toArray<HTMLElement>('.pe-why__outro-word', el) : [];
      if (!el || !outro || !words.length) return;

      const mm = gsap.matchMedia();

      /*
       * Široki ekran: cijela sekcija (naslov, slika, tekst) stoji na mjestu.
       * Ako je viša od ekrana, poravnava se donjom ivicom, da tekst koji se
       * otkriva uvijek bude u kadru.
       */
      mm.add('(orientation: landscape) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(words, { opacity: 0.12 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: () => (el.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
            end: '+=110%',
            pin: true,
            scrub: 0.7,
            anticipatePin: anticipatePin(),
            invalidateOnRefresh: true,
          },
        });
        tl.to(words, { opacity: 1, ease: 'none', stagger: 0.03 });
        /* Zadnjih ~20% skrola drzi pun tekst prije otpustanja (kao `.geslo`). */
        tl.to({}, { duration: tl.duration() * 0.25 });
      });

      /*
       * Telefon: sekcija je mnogo viša od ekrana i slika stoji ispod teksta,
       * pa se ne može zaustaviti cijela. Staje cijeli stubac s tekstom (naslov,
       * spisak i tekst koji se otkriva), na sredini ekrana. Da je stajao samo
       * zadnji pasus, spisak bi odletio iznad kadra, a crta uz stubac bi ostala
       * da visi u praznini.
       */
      mm.add('(orientation: portrait) and (prefers-reduced-motion: no-preference)', () => {
        const column = el.querySelector<HTMLElement>('.pe-why__text') ?? outro;
        gsap.set(words, { opacity: 0.12 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: column,
            /* Ako se na sredini ne bi odvojio od plutajućeg menija, ide ispod njega. */
            start: () =>
              window.innerHeight - column.offsetHeight >= 190 ? 'center center' : 'top 96px',
            end: '+=90%',
            pin: true,
            /*
             * Tekst stoji u `flex` koloni, a GSAP tamo po defaultu NE ostavlja
             * mjesto za pin — pa bi slika ispod naletjela na tekst dok stoji.
             */
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: anticipatePin(),
            invalidateOnRefresh: true,
          },
        });
        tl.to(words, { opacity: 1, ease: 'none', stagger: 0.03 });
        /* Zadnjih ~20% skrola drzi pun tekst prije otpustanja (kao `.geslo`). */
        tl.to({}, { duration: tl.duration() * 0.25 });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(words, { opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-snap="off" className="pe-why">
      <div className="pe-wrap--small pe-why__inner">
        <SplitTitle text={title} className="pe-display pe-why__title" />

        <div className="pe-why__content">
          <div className="pe-why__image reveal reveal-scale">
            {image ? (
              <Image className="pe-why__photo" src={image} alt={slotLabel} fill sizes="(max-width: 767px) 78vw, 30vw" />
            ) : (
              <ImageSlot slot={slot} label={slotLabel} />
            )}
          </div>

          <div className="pe-why__text">
            <div>
              {/* `data-long`: uvod od cijele recenice dobija manja slova, vidi CSS. */}
              <p className="pe-title reveal" data-long={intro.length > 60 ? '' : undefined}>
                {intro}
              </p>

              <ul className="pe-why__list reveal stagger-1">
                {list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="pe-body pe-why__outro" aria-label={outro}>
              {outro.split(/\s+/).map((word, index) => (
                <span className="pe-why__outro-word" aria-hidden="true" key={`${word}-${index}`}>
                  {word}{' '}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
