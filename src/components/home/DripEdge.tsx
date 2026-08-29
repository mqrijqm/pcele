'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  HEAD_DRIP,
  HEAD_FLAT,
  HEAD_VIEWBOX,
  TAIL_DRIP,
  TAIL_FLAT,
  TAIL_VIEWBOX,
  morph,
} from './dripPaths';

gsap.registerPlugin(ScrollTrigger);

/* Na serveru nema rasporeda da se mjeri, pa tamo `useEffect`. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const SHAPES = {
  head: { viewBox: HEAD_VIEWBOX, flat: HEAD_FLAT, drip: HEAD_DRIP, fill: 'var(--amber)' },
  tail: { viewBox: TAIL_VIEWBOX, flat: TAIL_FLAT, drip: TAIL_DRIP, fill: 'var(--paper)' },
} as const;

/**
 * Ivica koja se skrolom pretvara iz prave linije u kapi.
 *
 * Med najprije stoji ravno, kao da je tek naliven, pa kako sekcija ulazi u
 * kadar iz njega izrastu kapi. Prelaz je vezan za skrol a ne za vrijeme:
 * koliko se skrola, toliko se i kapi izduzi, i moze se vratiti unazad.
 *
 * Kroz slog ide crtez s kapima, ne ravna linija. Ako skripta ne stigne — a
 * to je jedini trenutak kad je vidljivo sta se desava — vidi se gotova ivica,
 * ne prazna crta. Ravno stanje se postavlja prije prvog iscrtavanja, pa se
 * skok ne vidi.
 *
 * Ko je iskljucio kretanje u sistemu, dobija odmah kapi i nista se ne mice.
 */
export default function DripEdge({ variant }: { variant: 'head' | 'tail' }) {
  const path = useRef<SVGPathElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const shape = SHAPES[variant];

  useIsomorphicLayoutEffect(() => {
    const el = path.current;
    const root = svg.current;
    if (!el || !root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: '(prefers-reduced-motion: no-preference)',
          still: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (!context.conditions?.animate) {
            el.setAttribute('d', shape.drip);
            return;
          }

          const at = morph(shape.flat, shape.drip);
          el.setAttribute('d', shape.flat);

          /*
           * Napredak nosi jedan broj koji GSAP mice, a ne sama putanja: tako
           * ScrollTrigger radi ono sto zna — mjeri i usporava — a putanja se
           * racuna samo kad se broj promijeni.
           */
          const state = { t: 0 };

          gsap.to(state, {
            t: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              /*
               * Od trenutka kad ivica udje odozdo do trenutka kad stigne do
               * gornje trecine kadra. Poslije toga kapi stoje.
               */
              start: 'top bottom',
              end: 'top 35%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
            onUpdate: () => el.setAttribute('d', at(state.t)),
          });
        },
      );

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [shape]);

  return (
    <svg
      className="drip__edge"
      ref={svg}
      viewBox={shape.viewBox}
      aria-hidden="true"
      focusable="false"
    >
      <path ref={path} fill={shape.fill} d={shape.drip} />
    </svg>
  );
}
