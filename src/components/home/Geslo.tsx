'use client';

import { Fragment, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Koliko skrola kroz sekciju traje jedna rijec, kao dio cijelog puta.
 *
 * Rijeci se preklapaju, pa se ne pale jedna po jedna nego prelaze jedna u
 * drugu. Ostatak puta (1 - EACH) se dijeli na razmake medju njima.
 */
const EACH = 0.16;

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
             * Put je dug namjerno: recenica se ispisuje kroz gotovo cio prolaz
             * kroz kadar, od donje ivice do gornje trecine. Na kracem putu se
             * ispisivanje ne cita kao ispisivanje nego kao da je tekst prosto
             * bljesnuo — sto je i bila mana prve verzije.
             *
             * Kraj ipak nije na izlasku iz kadra: da jeste, zadnja rijec bi se
             * popunila tek kad recenica vec odlazi gore, i puna boja se ne bi
             * ni vidjela.
             */
            start: 'top 92%',
            end: 'top 28%',
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

  /*
   * Rijec u svoj omotac, a izmedju omotaca pravi razmak — obican tekstualni
   * cvor, ne `margin`.
   *
   * Ranije je razmak bio `margin-inline-end` na omotacu, uz obrazlozenje da bi
   * razmak u tekstu bio "dio nicije rijeci" pa bi se u prelazu vidio kao
   * stepenica. To ne stoji: razmak nema sta da iscrta, pa mu se blijedost i ne
   * moze vidjeti. Ono sto je `margin` stvarno radio jeste da je recenicu
   * ostavljao bez ijednog razmaka u samom tekstu — `textContent` je bio
   * "URepubliciSrpskoj...". Takvu je kopira onaj ko je oznaci misem, takvu je
   * cita citac ekrana i takvu je vidi pretrazivac.
   *
   * Zato razmak sada stoji tamo gdje mu je mjesto — u tekstu — a `margin` je
   * otisao iz CSS-a. Sirina razmaka se vratila na staru mjeru preko
   * `word-spacing` na samoj recenici, da se prelom redova ne pomjeri.
   */
  const words = (text: string) =>
    text.split(' ').map((word, i) => (
      <Fragment key={`${word}-${i}`}>
        <span className="geslo__w">{word}</span>{' '}
      </Fragment>
    ));

  return (
    <section className="geslo" ref={root} aria-label={`${t.lead} ${t.accent} ${t.tail}`}>
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
