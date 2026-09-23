'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Uvodni red koji se neprekidno krece.
 *
 * Dva pokreta, namjerno razdvojena na dva elementa: petlja je CSS animacija
 * (ne trosi niti jedan kadar JavaScripta), a pomak vezan za skrol radi GSAP
 * na vanjskom omotacu. Zajedno se citaju kao da red usporava dok skrolujete —
 * isti efekat koji nosi i referentna strana.
 *
 * Isti naslov se ponavlja cetiri puta i traka se pomjera za tacno pola svoje
 * duzine, pa petlja nema vidljiv spoj.
 */
const UNITS = 4;

export default function HeroMarquee({ title }: { title: string }) {
  const root = useRef<HTMLElement>(null);
  const labels = title
    .replace(/\.$/, '')
    .split(/\s+(?:i|and)\s+/i)
    .map((label) => label.toLocaleLowerCase());

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const drift = el.querySelector('.pe-hero__drift');
      if (!drift) return;

      const tween = gsap.fromTo(
        drift,
        { x: () => window.innerWidth * 0.02 },
        {
          x: () => -window.innerWidth * 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section data-snap="off" className="pe-hero" ref={root}>
      {/* Naslov za citace ekrana i za pretragu; red ispod je samo slika slova. */}
      <h1 className="sr-only">{title}</h1>

      <div className="pe-hero__marquee" aria-hidden="true">
        <div className="pe-hero__drift">
          <div className="pe-hero__track">
            {Array.from({ length: UNITS }, (_, i) => (
              <span className="pe-hero__unit" key={i}>
                {labels.map((label, labelIndex) => (
                  <span className="pe-hero__phrase" key={`${label}-${labelIndex}`}>
                    <span className="pe-display">{label}</span>
                    <i>
                      <Image src="/images/brand/sunce.svg" alt="" width={200} height={219} />
                    </i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
