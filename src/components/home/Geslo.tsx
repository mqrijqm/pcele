'use client';

import { Fragment, useEffect, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

type WordStyle = CSSProperties & { '--i': number };
type LineStyle = CSSProperties & { '--n': number; '--p': number };

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

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => text.style.setProperty('--p', '1'));
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      text.style.setProperty('--p', '0');
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          // The last 18% holds the fully filled sentence before release.
          text.style.setProperty('--p', String(Math.min(1, progress / 0.82)));
        },
      });
      return () => trigger.kill();
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
          style={{ '--n': words.length, '--p': 0 } as LineStyle}
        >
          {words.map(({ word, accent }, index) => (
            <Fragment key={`${word}-${index}`}>
              <span
                className={`geslo__w${accent ? ' geslo__accent' : ''}`}
                style={{ '--i': index } as WordStyle}
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
