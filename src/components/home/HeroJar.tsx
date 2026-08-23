'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Travel of each headline half, as a fraction of the viewport width, taken
 * from the reference frames at 1440 wide:
 *
 *   left  half   x 473 → 97     =  376px  →  0.2611 vw
 *   right half   right edge 955 → 1077 = 122px → 0.0847 vw
 *
 * Meracinque expresses the same move as `xPercent: ±50` — half of each span's
 * own width. Our two halves are not the same length, so a single percentage
 * cannot land both on the reference. Anchoring to the viewport keeps the
 * mechanic (one linear, scrubbed translate per half) and still scales, because
 * the type is sized in vw as well.
 */
const LEFT_TRAVEL = 376 / 1440;
const RIGHT_TRAVEL = -122 / 1440;

const copy = {
  sr: {
    left: 'Med kakav',
    right: 'treba biti',
    labelTop: 'VRCANO 2025',
    labelBottom: '100% SIROVO PRIRODAN',
    jarAlt: 'Tegla livadskog meda Pčelarstvo Jevtić, 1 kg',
    crestAlt: 'Znak Pčelarstva Jevtić',
  },
  en: {
    left: 'Honey as',
    right: 'it should be',
    labelTop: 'HARVESTED 2025',
    labelBottom: '100% RAW AND NATURAL',
    jarAlt: 'A 1 kg jar of Pčelarstvo Jevtić meadow honey',
    crestAlt: 'The Pčelarstvo Jevtić mark',
  },
} as const;

export default function HeroJar({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const t = copy[locale];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const left = q('.hero-jar__half--left')[0];
      const right = q('.hero-jar__half--right')[0];
      const crest = q('.hero-jar__crest')[0];
      const flowers = q('.hero-jar__flowers')[0];
      const caps = q('.hero-jar__label > span');

      const mm = gsap.matchMedia();

      /*
       * Landscape. Structure, order and easing follow the measured
       * `initHomeProductEffects` timeline: one scrubbed master, an inner
       * timeline whose steps are one unit each, then `.duration(1)` to
       * normalise the whole thing — that normalisation is what fixes the
       * proportions between the steps.
       */
      mm.add(
        '(prefers-reduced-motion: no-preference) and (orientation: landscape)',
        () => {
          const master = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          /*
           * The staggered pairs start from an explicit `set` rather than a
           * `from`. With `stagger`, the target whose slot has not been reached
           * yet keeps its natural value until the playhead arrives — invisible
           * on a mid-page section, but this hero opens at progress 0, where the
           * second daisy and the second label would flash in already placed.
           * `set` + `to` is the same shape their portrait branch uses.
           */
          gsap.set([crest, flowers], { scale: 0 });
          gsap.set(caps, { yPercent: 100 });

          const tl = gsap.timeline({ defaults: { ease: 'linear', duration: 1 } });

          // Order comes from the reference frames, not from theirs: ref-2 shows
          // the mark and the daisies already in while the headline is still
          // travelling, so the decorations lead and the labels close.
          tl.to([crest, flowers], { scale: 1, stagger: 0.5 });
          tl.addLabel('titles');
          // No opacity on the halves — all three frames paint them at full
          // strength, the collapsed one included.
          tl.from(left, { x: () => window.innerWidth * LEFT_TRAVEL }, 'titles');
          tl.from(right, { x: () => window.innerWidth * RIGHT_TRAVEL }, 'titles');
          tl.to(caps, { yPercent: 0, stagger: 0.5 });
          tl.duration(1);

          master.add(tl);
          return () => master.scrollTrigger?.kill();
        },
      );

      /*
       * Portrait. Their portrait branch splits the headline vertically so it
       * never sits trapped behind the product; the halves fade as they part,
       * because stacked they would otherwise overlap.
       */
      mm.add(
        '(prefers-reduced-motion: no-preference) and (orientation: portrait)',
        () => {
          const master = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          gsap.set([crest, flowers], { scale: 0 });
          gsap.set(caps, { yPercent: 100 });

          /*
           * Distance from a half's resting place back to the middle of the
           * stage, read from layout offsets so a transform in flight cannot
           * poison the measurement. The halves start piled behind the jar and
           * part vertically, which is their portrait behaviour.
           */
          const toCentre = (node: HTMLElement) => {
            const stage = el.querySelector('.hero-jar__stage') as HTMLElement;
            const title = node.parentElement as HTMLElement;
            const own = title.offsetTop + node.offsetTop + node.offsetHeight / 2;
            return stage.offsetHeight / 2 - own;
          };

          const tl = gsap.timeline({ defaults: { ease: 'linear', duration: 1 } });

          tl.to([crest, flowers], { scale: 1, stagger: 0.5 });
          tl.addLabel('titles');
          tl.from(left, { opacity: 0, y: () => toCentre(left as HTMLElement) }, 'titles');
          tl.from(right, { opacity: 0, y: () => toCentre(right as HTMLElement) }, 'titles');
          tl.to(caps, { yPercent: 0, stagger: 0.5 });
          tl.duration(1);

          master.add(tl);
          return () => master.scrollTrigger?.kill();
        },
      );

      // Reduced motion: no timeline at all, the hero simply is its end state.
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hero-jar" aria-label={`${t.left} ${t.right}`}>
      <div className="hero-jar__stage">
        <div className="hero-jar__layer">
          {/*
            * Znak nije kvadrat: prirodne mere su 27.9 x 29.77, pa je malo visi
            * nego siri. Mere ispod sluze samo da se unapred rezervise mesto —
            * sirinu i dalje drzi CSS, a visina ide iz odnosa samog crteza.
            */}
          <span className="hero-jar__crest">
            <Image
              src="/hero/logo-krug.svg"
              alt={t.crestAlt}
              width={279}
              height={298}
              priority
            />
          </span>

          <p className="hero-jar__label hero-jar__label--top">
            <span>{t.labelTop}</span>
          </p>

          <h1 className="hero-jar__title">
            <span className="hero-jar__half hero-jar__half--left">{t.left}</span>
            <span className="hero-jar__half hero-jar__half--right">{t.right}</span>
          </h1>

          <p className="hero-jar__label hero-jar__label--bottom">
            <span>{t.labelBottom}</span>
          </p>

          <span className="hero-jar__flowers">
            <Image src="/hero/cvijece.png" alt="" aria-hidden="true" width={1024} height={1536} />
          </span>
        </div>

        <div className="hero-jar__jar">
          <Image
            id="hero-jar-image"
            src="/hero/jar.png"
            alt={t.jarAlt}
            width={489}
            height={771}
            priority
            fetchPriority="high"
            loading="eager"
            sizes="(orientation: portrait) 60vw, 22vw"
          />
        </div>
      </div>
    </section>
  );
}
