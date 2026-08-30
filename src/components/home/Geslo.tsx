'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Koliko skrola kroz sekciju traje jedna rijec, kao dio cijelog puta.
 *
 * Vrijednost je namjerno velika: rijeci se preklapaju, pa se ne pale jedna po
 * jedna nego prelaze jedna u drugu. Manje od desetak posto i rec se upali
 * prije nego se prethodna ugasila iz oka — cita se kao niz treptaja, ne kao
 * potez. Ostatak puta (1 - EACH) se dijeli na razmake medju rijecima.
 */
const EACH = 0.2;

/**
 * Geslo: jedan red preko cijelog pojasa.
 *
 * Pojas izmedju heroja i tegle je dosad bio prazan — samo prelaz s papira na
 * med i natrag. Sada nosi jednu recenicu, dovoljno krupnu da bude sve sto se
 * na njoj vidi, i tri crteza oko nje.
 *
 * Recenica je u dva glasa: mastilo, pa sredina u bijelom kurzivu, pa opet
 * mastilo. Zato je i pisana u tri dijela a ne jednim tekstom — obiljeziti
 * sredinu jednog niza znacilo bi vezati se za odredjenu sirinu ekrana.
 *
 * Uz recenicu su jos dva crteza: pecat nad njom, na istoj osi, i sunce koje
 * je zavrsava, u njenom redu. Crtez kosnice u desnom uglu je otisao — pojas
 * je pun kad je recenica ovoliko krupna, i uz nju je smetao.
 *
 * Sunce je ukras i nosi `aria-hidden`; pecat nesto znaci, pa ima opis.
 *
 * **Kako se recenica pojavljuje.** Ne ulazi u kadar — vec je tu. Stoji u
 * pojasu na jedva vidljivoj boji, kao trag olovke ispod mastila, i skrol je
 * ne dovodi nego je popunjava: rijec po rijeku slijeva nadesno, do pune boje.
 * Zato je vezana za `scrub`, a ne za obican ulazak: citalac vodi ispisivanje
 * svojim skrolom, moze da stane na pola i da se vrati. Da krece od nule,
 * pojas bi na dolasku bio prazan — ovako je uvijek pun, samo blijed.
 *
 * Rijeci se lome ovdje, u markupu, a ne u pregledniku: recenica je tri kratka
 * niza iz sadrzaja, pa nema sta da se cuva od pretrazivaca ni od onoga ko je
 * kopira — razmaci medju omotacima ostaju obican tekst, po njima se red lomi
 * kao i prije.
 */
export default function Geslo({ locale }: { locale: Locale }) {
  const t = home.geslo[locale];
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const mm = gsap.matchMedia();

      /* Ko je iskljucio animacije dobija recenicu ispisanu. */
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('.geslo__w, .geslo__sun'), { opacity: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /*
         * Sunce ide na kraj niza jer je zadnje u redu — recenicu zavrsava i u
         * citanju i u ispisivanju. `querySelectorAll` vraca cvorove redom
         * kojim stoje u dokumentu, pa je to ujedno i red rijeci.
         */
        const targets = q('.geslo__w, .geslo__sun');
        if (!targets.length) return;

        const gap = targets.length > 1 ? (1 - EACH) / (targets.length - 1) : 0;

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: q('.geslo__line')[0],
            /*
             * Punjenje pocinje kad red udje u donju trecinu kadra i zavrsi se
             * kad dodje malo iznad sredine. Kraj nije na izlasku iz kadra: da
             * jeste, zadnja rijec bi se popunila tek kad recenica vec odlazi
             * gore, i puna boja se ne bi ni vidjela.
             */
            start: 'top 88%',
            end: 'top 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(targets, { opacity: 1, duration: EACH, stagger: gap }, 0);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [locale]);

  /* Rijec u svoj omotac; razmak medju njima ostaje tekst, da se red lomi. */
  const words = (text: string) =>
    text.split(' ').map((word, i) => (
      <span className="geslo__w" key={`${word}-${i}`}>
        {word}{' '}
      </span>
    ));

  return (
    <section className="geslo" ref={root} aria-label={`${t.lead} ${t.accent}`}>
      <div className="geslo__inner">
        {/* Pecat stoji nad recenicom, na istoj osi s njom. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="geslo__seal reveal" src="/images/brand/pecat-cvijet.svg" alt={t.sealAlt} />

        <p className="geslo__line">
          {words(t.lead)}
          <span className="geslo__accent">{words(t.accent)}</span>
          {words(t.tail)}
          {/*
            * Sunce zavrsava recenicu, u istom redu s njom — mjera mu je u `em`
            * pa raste i pada zajedno sa slogom. Jedino se ono vrti.
            */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="geslo__sun" src="/images/brand/sunce.svg" alt="" aria-hidden="true" />
        </p>
      </div>
    </section>
  );
}
