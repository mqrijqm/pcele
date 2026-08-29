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
    right: 'treba biti.',
    labelTop: 'VRCANO 2025',
    labelBottom: '100% SIROVO PRIRODAN',
    jarAlt: 'Tegla livadskog meda Pčelarstvo Jevtić, 1 kg',
    crestAlt: 'Znak Pčelarstva Jevtić',
    sealAlt: 'Pečat: 100% prirodan',
    bloomAlt: 'Crtež cvijeta kamilice',
  },
  en: {
    left: 'Honey as',
    right: 'it should be.',
    labelTop: 'HARVESTED 2025',
    labelBottom: '100% RAW AND NATURAL',
    jarAlt: 'A 1 kg jar of Pčelarstvo Jevtić meadow honey',
    crestAlt: 'The Pčelarstvo Jevtić mark',
    sealAlt: 'Seal: 100% natural',
    bloomAlt: 'A drawing of a camomile flower',
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
      const caps = q('.hero-jar__label > span');
      /* Pecat iskace na kraju, cvijet se otvara za njim — dotle ih nema. */
      const pops = q('.hero-jar__pop');
      const heart = q('.hero-jar__heart')[0];
      const petals = q('.hero-jar__petals')[0];

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
           * The staggered labels start from an explicit `set` rather than a
           * `from`. With `stagger`, the target whose slot has not been reached
           * yet keeps its natural value until the playhead arrives — invisible
           * on a mid-page section, but this hero opens at progress 0, where the
           * second label would flash in already placed. `set` + `to` is the
           * same shape their portrait branch uses.
           */
          gsap.set(crest, { scale: 0 });
          gsap.set(caps, { yPercent: 100 });
          gsap.set([left, right], { opacity: 0 });
          gsap.set(pops, { scale: 0, opacity: 0 });
          gsap.set(heart, { scale: 0, opacity: 0 });
          gsap.set(petals, { scale: 0.45, opacity: 0, rotation: -22 });

          const tl = gsap.timeline({ defaults: { ease: 'linear', duration: 1 } });

          // Order comes from the reference frames, not from theirs: ref-2 shows
          // the mark already in while the headline is still travelling, so the
          // mark leads and the labels close.
          tl.to(crest, { scale: 1 });
          tl.addLabel('titles');
          tl.from(left, { x: () => window.innerWidth * LEFT_TRAVEL }, 'titles');
          tl.from(right, { x: () => window.innerWidth * RIGHT_TRAVEL }, 'titles');
          /*
           * Tegla stoji iznad naslova, pa ga u sredini ona pokriva — ali dok
           * su polovine skupljene, krajevi im vire pored stakla. Zato krecu
           * nevidljive i ispisuju se tek kad se izmaknu: prvo lijeva, pa desna.
           *
           * `set` + `to`, ne `from` — isti razlog kao kod krune i natpisa gore:
           * uz `stagger`, meta ciji red jos nije dosao zadrzava svoju prirodnu
           * vrijednost, pa bi desna polovina stajala vidljiva iza tegle.
           */
          tl.to([left, right], { opacity: 1, duration: 0.55, stagger: 0.15 }, 'titles+=0.35');
          tl.to(caps, { yPercent: 0, stagger: 0.5 });
          /*
           * Pecat i cvijet dolaze zadnji, kad je kompozicija vec slozena, i to
           * skokom: `back.out` ih prebaci malo preko pune velicine pa vrati.
           * Zato se citaju kao dva pecata koja neko spusti na gotovu stranu, a
           * ne kao jos dvije stvari koje se pojave usput.
           *
           * `scale` pise u `transform`, pa ova dva elementa u CSS-u nemaju
           * nijedan svoj `transform` — stoje na `left`/`top`, inace bi ih GSAP
           * pomjerio kad ih uveca.
           */
          tl.to(pops, { scale: 1, opacity: 1, ease: 'back.out(1.6)', duration: 0.7, stagger: 0.16 });
          /*
           * Cvijet se otvara: prvo sjedne srce, pa se latice rasire oko njega.
           * Latice krecu manje i zaokrenute, i vrte se natrag u svoje mjesto —
           * oko srca, ne oko svog kadra (`transform-origin` je u CSS-u).
           */
          tl.to(heart, { scale: 1, opacity: 1, ease: 'back.out(2)', duration: 0.5 });
          tl.to(
            petals,
            { scale: 1, opacity: 1, rotation: 0, ease: 'back.out(1.4)', duration: 0.8 },
            '<0.18',
          );
          tl.duration(1);

          master.add(tl);
          /*
           * Bez ovoga se kompozicija sklapa tacno do posljednjeg piksela
           * sekcije, pa konacni raspored postoji samo u jednom trenutku, na
           * izlasku. Prazan razmak na kraju znaci da se sve slozi u prvih
           * ~60% skrola, a ostatak stoji mirno — sto je i smisao pina.
           */
          master.to({}, { duration: 0.65 });
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

          gsap.set(crest, { scale: 0 });
          gsap.set(caps, { yPercent: 100 });
          gsap.set(pops, { scale: 0, opacity: 0 });
          gsap.set(heart, { scale: 0, opacity: 0 });
          gsap.set(petals, { scale: 0.45, opacity: 0, rotation: -22 });

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

          tl.to(crest, { scale: 1 });
          tl.addLabel('titles');
          tl.from(left, { opacity: 0, y: () => toCentre(left as HTMLElement) }, 'titles');
          tl.from(right, { opacity: 0, y: () => toCentre(right as HTMLElement) }, 'titles');
          tl.to(caps, { yPercent: 0, stagger: 0.5 });
          tl.to(pops, { scale: 1, opacity: 1, ease: 'back.out(1.6)', duration: 0.7, stagger: 0.16 });
          /*
           * Cvijet se otvara: prvo sjedne srce, pa se latice rasire oko njega.
           * Latice krecu manje i zaokrenute, i vrte se natrag u svoje mjesto —
           * oko srca, ne oko svog kadra (`transform-origin` je u CSS-u).
           */
          tl.to(heart, { scale: 1, opacity: 1, ease: 'back.out(2)', duration: 0.5 });
          tl.to(
            petals,
            { scale: 1, opacity: 1, rotation: 0, ease: 'back.out(1.4)', duration: 0.8 },
            '<0.18',
          );
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

          {/*
            * h2, ne h1: glavni naslov pocetne je wordmark u heroju iznad. Dva
            * h1 na jednoj strani nisu greska u HTML-u, ali pretrazivacu i
            * citacu ekrana govore da strana ima dva pocetka.
            */}
          <h2 className="hero-jar__title">
            <span className="hero-jar__half hero-jar__half--left">{t.left}</span>
            <span className="hero-jar__half hero-jar__half--right">{t.right}</span>
          </h2>

          <p className="hero-jar__label hero-jar__label--bottom">
            <span>{t.labelBottom}</span>
          </p>

          {/*
            * Dvije stvari koje dodju na kraju: pecat uz rame tegle i cvijet u
            * donjem desnom uglu.
            */}
          <span className="hero-jar__seal hero-jar__pop">
            <Image
              src="/images/brand/pecat-prirodan.svg"
              alt={t.sealAlt}
              width={127}
              height={127}
            />
          </span>

          {/*
            * Cvijet je razlozen na dvoje da bi mogao da se otvori: prvo sjedne
            * srce, pa se oko njega rasire latice. Dva sloja su izrezana iz
            * istog crteza po boji — zlatna sredina u jedan, sve ostalo u
            * drugi — pa slozena jedan preko drugog daju tacno original.
            */}
          <span className="hero-jar__bloom">
            <Image
              className="hero-jar__petals"
              src="/images/brand/kamilica-latice.webp"
              alt={t.bloomAlt}
              width={700}
              height={658}
              sizes="(orientation: portrait) 38vw, 16vw"
            />
            <Image
              className="hero-jar__heart"
              src="/images/brand/kamilica-srce.webp"
              alt=""
              aria-hidden="true"
              width={700}
              height={658}
              sizes="(orientation: portrait) 38vw, 16vw"
            />
          </span>
        </div>

        <div className="hero-jar__jar">
          <Image
            id="hero-jar-image"
            src="/hero/jar.webp"
            alt={t.jarAlt}
            width={853}
            height={1285}
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
