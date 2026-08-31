'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { localeHref, type Locale } from '@/i18n/config';

const copy = {
  sr: {
    drawingAlt: 'Crtež livade oko Mračaja: niski brežuljci s drvoredima i grmljem',
    title: 'Med koji još uvijek miriše na livadu.',
    lead:
      'Sirov porodični med iz naših pčelinjaka nadomak Prnjavora. ' +
      'Bez primjesa i prihrane šećerom — od 1980.',
    cta: 'Pogledaj naše medove',
  },
  en: {
    drawingAlt: 'A drawing of the meadows around Mračaj: low hills lined with trees and shrubs',
    title: 'Honey that still smells of the meadow.',
    lead:
      'Raw family honey from our apiaries near Prnjavor. ' +
      'Nothing added, no sugar feeding — since 1980.',
    cta: 'See our honeys',
  },
} as const;

/**
 * Pocetni ekran: ime, jedna recenica, jedno dugme, i crtez livade pod njima.
 *
 * Sve stoji u jednoj koloni po sredini — ime, naslov, opis, dugme — i cita se
 * kao jedna grupa, ne kao cetiri stvari razbacane po platnu. Crtez je pod
 * njima, prilijepljen za dno i pusten preko obje ivice ekrana, pa je pejzaz
 * ono sto jeste: horizont pod sadrzajem.
 *
 * **Sta je otislo.** Rukopisni natpis "Listaj i prati pcelu" i isprekidana
 * strelica uz njega. Oboje je bilo uputstvo za citanje strane, a strana koja
 * mora da objasni da se skroluje ima vec drugi problem. Uz njih je otisla i
 * "plata" — kutija zadatog omjera u kojoj je svaki element stajao na svom
 * postotku. Ona je imala smisla dok su se cetiri crteza morala poklopiti u
 * pikselu; sada je heroj obican tok, pa razmake drzi `clamp` a ne geometrija.
 *
 * **Zasto je ime i dalje `h1`.** Ono je i dalje ime firme i i dalje je prvo
 * sto se na strani vidi; naslov pod njim je recenica o proizvodu, ne o kuci.
 * Isto je bilo i prije ove dorade, pa se ostatak strane — a `HeroJar` na to
 * racuna u svom komentaru — nije morao dirati.
 *
 * **Dugme.** Jedno je, i vodi na stranu s proizvodima. Kad izadje iz kadra,
 * isto to dugme se javi kao mala pilula u donjem desnom uglu — nikad oba
 * odjednom, o cemu vodi racuna `IntersectionObserver` nize.
 */
export default function HeroLand({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = localeHref(locale, '/products');

  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [docked, setDocked] = useState(false);

  /*
   * Pilula u uglu se javi tek kad pravo dugme ode iz kadra, i sklanja se kad
   * dodje podnozje — tamo je vec sve sto se moze kliknuti, pa bi lebdjela
   * preko njega. Dva posmatraca, jedno stanje: nijedan ne odlucuje sam.
   *
   * Posmatraju se ulasci i izlasci, ne skrol — pa se nista ne racuna dok se
   * strana pomjera, i pilula radi isto na strani bilo koje duzine.
   */
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;

    const footer = document.querySelector('footer');
    let gone = false;
    let atFoot = false;
    const sync = () => setDocked(gone && !atFoot);

    const onCta = new IntersectionObserver(([entry]) => {
      gone = !entry.isIntersecting;
      sync();
    });
    onCta.observe(cta);

    const onFoot = footer
      ? new IntersectionObserver(([entry]) => {
          atFoot = entry.isIntersecting;
          sync();
        })
      : null;
    if (footer && onFoot) onFoot.observe(footer);

    return () => {
      onCta.disconnect();
      onFoot?.disconnect();
    };
  }, []);

  return (
    <>
      <section className="hero-land">
        <div className="hero-land__content">
          <h1 className="hero-land__wordmark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero/foot.svg" alt="Pčelarstvo Jevtić" fetchPriority="high" />
          </h1>

          {/*
            * `data-no-type` iskljucuje kucanje slova koje inace dobija svaki
            * naslov na sajtu. Ovdje je heroj namjerno miran: ime, recenica i
            * dugme treba da stoje ispisani cim zavjesa padne.
            */}
          <h2 className="hero-land__title" data-no-type>
            {t.title}
          </h2>

          <p className="hero-land__lead">{t.lead}</p>

          <Link ref={ctaRef} href={href} className="btn hero-land__cta">
            {t.cta}
          </Link>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-land__drawing" src="/hero/livada-crtez.svg" alt={t.drawingAlt} />
      </section>

      {/*
        * Isto dugme, u uglu. Stoji izvan sekcije jer je `position: fixed`, a
        * heroj ima `overflow: hidden` — unutra bi ga pojedini preglednici
        * odsjekli cim heroj izadje iz kadra.
        *
        * Sakriveno je `visibility`-jem, ne samo prozirnoscu: tako ispada i iz
        * reda za tabulator i iz onoga sto citac ekrana vidi, pa se isti poziv
        * nikad ne procita dvaput.
        */}
      <Link href={href} className="btn hero-cta-dock" data-shown={docked}>
        {t.cta}
      </Link>
    </>
  );
}
