'use client';

import TransitionLink from '@/components/ui/TransitionLink';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

import { localeHref, type Locale } from '@/i18n/config';

const copy = {
  sr: {
    drawingAlt: 'Crtež livade oko Mračaja: niski brežuljci s drvoredima i grmljem',
    title: 'Iz naših pčelinjaka, pravo do vašeg stola.',
    lead: 'Sirov med iz sela nadomak Prnjavora.',
    cta: 'Okusi slast',
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

/*
 * Koliko mastila crtez nosi kad se sve slegne. Ista vrijednost stoji i na
 * `.hero-land__drawing` u CSS-u — ovdje je da bi animacija znala gdje da
 * stane; da su dvije, crtez bi na kraju animacije skocio na drugu jacinu.
 *
 * Crtez je podloga pod slogom, ne slika iza njega: punom bojom nadjacava
 * naslov koji stoji na njemu.
 */
const DRAWING_INK = 0.7;

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

  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      const drawing = hero.querySelector('.hero-land__drawing');
      const wordmark = hero.querySelector('.hero-land__wordmark');
      const lowerContent = hero.querySelectorAll(
        '.hero-land__title, .hero-land__lead, .hero-land__cta',
      );
      if (!drawing || !wordmark || !lowerContent.length) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([wordmark, ...lowerContent], { opacity: 1, y: 0 });
        // Samo prozirnost: `y` bi ovdje upisao transform i obrisao
        // `translateX(-50%)` kojim crtez stoji na sredini.
        gsap.set(drawing, { opacity: DRAWING_INK });
        return;
      }

      /*
       * Crtez krece jedva vidljiv i naraste do pune mjere tek kad slog sjedne.
       *
       * Dno je udio krova, ne svoj broj: kad se `DRAWING_INK` pomjeri, cijela
       * rampa se pomjeri s njim i odnos prvog i zadnjeg kadra ostaje isti.
       * Raspon je namjerno sirok — na 0.4 gore, blizu dno bi dalo porast koji
       * se ne vidi.
       */
      gsap.set(drawing, { opacity: DRAWING_INK * 0.15 });
      gsap.set(wordmark, { opacity: 0, y: 10 });
      gsap.set(lowerContent, { opacity: 0, y: 12 });

      let timeline: gsap.core.Timeline | null = null;
      let started = false;
      const play = () => {
        if (started) return;
        started = true;
        timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
        timeline
          .to(drawing, { opacity: DRAWING_INK * 0.35, duration: 0.75 })
          .to(wordmark, { opacity: 1, y: 0, duration: 0.65 })
          .to(lowerContent, { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 })
          .to(drawing, {
            opacity: DRAWING_INK,
            duration: 1.15,
            ease: 'power1.inOut',
          });
      };

      const preloading = document.documentElement.classList.contains('is-preloading');
      if (preloading) window.addEventListener('preloader:done', play, { once: true });
      else play();

      const watchdog = window.setTimeout(play, 6000);
      return () => {
        window.clearTimeout(watchdog);
        window.removeEventListener('preloader:done', play);
        timeline?.kill();
      };
    }, hero);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section className="hero-land" ref={heroRef} data-no-type>
        <h1 className="hero-land__wordmark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/foot.svg" alt="Pčelarstvo Jevtić" fetchPriority="high" />
        </h1>

        <div className="hero-land__content">
          {/*
            * `data-no-type` iskljucuje kucanje slova koje inace dobija svaki
            * naslov na sajtu. Ovdje je heroj namjerno miran: ime, recenica i
            * dugme treba da stoje ispisani cim zavjesa padne.
            */}
          <h2 className="hero-land__title" data-no-type>
            {t.title}
          </h2>

          <p className="hero-land__lead">{t.lead}</p>

          <TransitionLink href={href} className="hero-land__cta" aria-label={t.cta}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero/okusi-slast.svg" alt="" aria-hidden="true" />
          </TransitionLink>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-land__drawing" src="/hero/hero-pejzaz.svg" alt={t.drawingAlt} />
    </section>
  );
}
