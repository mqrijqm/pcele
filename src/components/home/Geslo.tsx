'use client';

import { Fragment, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

export default function Geslo({ locale }: { locale: Locale }) {
  const t = home.geslo[locale];
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLParagraphElement>(null);
  const segments = [
    { text: t.lead, accent: false },
    { text: t.accent, accent: true },
    { text: t.tail, accent: false },
  ];
  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({ word, accent: segment.accent })),
  );
  const sentence = `${t.lead} ${t.accent} ${t.tail}`;

  useEffect(() => {
    const section = root.current;
    const text = line.current;
    if (!section || !text) return;
    const wordEls = Array.from(text.querySelectorAll<HTMLElement>('.geslo__w'));
    if (!wordEls.length) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(wordEls, { opacity: 1 });
      return () => gsap.set(wordEls, { clearProps: 'opacity' });
    });
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const setters = wordEls.map((word) => gsap.quickSetter(word, 'opacity'));
      const render = (scrollProgress: number) => {
        const progress = Math.min(1, scrollProgress / 0.82);
        const count = wordEls.length;

        setters.forEach((setOpacity, index) => {
          const opacity = Math.min(
            1,
            Math.max(0.25, (progress * (count + 3) - index) / 3),
          );
          setOpacity(opacity);
        });
      };

      render(0);
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: ({ progress }) => render(progress),
        // The last 18% holds the fully filled sentence before release.
        onUpdate: ({ progress }) => render(progress),
      });
      return () => {
        trigger.kill();
        gsap.set(wordEls, { clearProps: 'opacity' });
      };
    });

    return () => mm.revert();
  }, [locale]);

  return (
    <section className="geslo" ref={root} aria-label={sentence}>
      <div className="geslo__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="geslo__seal reveal" src="/images/brand/pecat-cvijet.svg" alt={t.sealAlt} />
        <p
          className="geslo__line"
          ref={line}
          aria-hidden="true"
        >
          {words.map(({ word, accent }, index) => (
            <Fragment key={`${word}-${index}`}>
              <span
                className={`geslo__w${accent ? ' geslo__accent' : ''}`}
              >
                {word}
              </span>{' '}
            </Fragment>
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="geslo__sun" src="/images/brand/sunce.svg" alt="" aria-hidden="true" />
        </p>
      </div>
    </section>
  );
}
