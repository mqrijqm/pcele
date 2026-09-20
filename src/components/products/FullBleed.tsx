'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ImageSlot from '@/components/products/ImageSlot';

gsap.registerPlugin(ScrollTrigger);

/**
 * Snimak preko cijelog ekrana, sa malim krugom u sredini.
 *
 * Krug stoji u sredini sekcije i vodi na ono sto je ispod â€” isti posao koji
 * nosi i referentna strana. Snimak se ne pomjera, samo se lagano umanji dok
 * sekcija ulazi, pa se dobija dubina bez ijednog dodatnog sloja.
 */
export default function FullBleed({
  slot,
  label,
  cta,
  href,
}: {
  slot: string;
  label: string;
  cta: string;
  href: string;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const zoom = el.querySelector('.pe-banner__zoom');
      if (!zoom) return;

      const tween = gsap.fromTo(
        zoom,
        { scale: 1.12 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
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
    <section data-snap="off" className="pe-banner" ref={root}>
      <div className="pe-banner__frame">
        <div className="pe-banner__zoom">
          <ImageSlot slot={slot} label={label} />
        </div>
      </div>

      <a className="pe-pill pe-banner__cta" href={href}>
        {cta}
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path
            d="M7 1v12M1.8 7.8 7 13l5.2-5.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
