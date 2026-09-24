'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import TransitionLink from '@/components/ui/TransitionLink';
import { localeHref, type Locale } from '@/i18n/config';
import styles from './discoverHoney.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const copy = {
  sr: {
    eyebrow: 'Od košnice do stola',
    title: 'Otkrijte kako se vrca, kako nastaje med.',
    alt: 'Med se cijedi iz vrcaljke u teglu',
    cta: 'Pčelinjak — otkrijte kako nastaje med',
  },
  en: {
    eyebrow: 'From hive to table',
    title: 'Discover how honey is spun, how it comes to be.',
    alt: 'Honey pouring from the extractor into a jar',
    cta: 'The apiary — discover how honey is made',
  },
} as const;

/**
 * "Otkrijte kako nastaje med": cvjetno polje, mala slika u sredini i okrugli
 * zeleni pecat koji vodi na stranu pcelinjaka.
 *
 * Isti blok stoji na dnu svake strane proizvoda i na strani Proizvodi (tamo sa
 * `spacious`, tj. sa puno praznog papira prije i poslije), pa je jedna
 * komponenta a ne dvije kopije.
 *
 * Pozadina je globalna klasa `.bloomfield` (isti uzorak i isto blijedjenje kao
 * na pocetnoj i na strani pcelinjaka). Slika se blago zumira dok se strana
 * skrola — zumira se sama slika unutar svog okvira, pa okvir stoji. Ko je
 * iskljucio kretanje u sistemu, dobija sliku bez zuma.
 */
export default function DiscoverHoney({
  locale,
  spacious = false,
}: {
  locale: Locale;
  /** Puno praznog papira iznad i ispod polja cvijeca (strana Proizvodi). */
  spacious?: boolean;
}) {
  const c = copy[locale];
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const frame = root.current?.querySelector<HTMLElement>('[data-zoom-frame]');
      const img = frame?.querySelector<HTMLElement>('img');
      if (!frame || !img) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Od prave velicine kad okvir ulazi u kadar do +14% kad izlazi.
        const zoom = gsap.fromTo(
          img,
          { scale: 1 },
          {
            scale: 1.14,
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
        return () => {
          zoom.scrollTrigger?.kill();
          zoom.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div className={spacious ? styles.airy : undefined} ref={root}>
      <section className={`bloomfield ${styles.discover}`}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{c.eyebrow}</p>
          <h2>{c.title}</h2>

          <div className={styles.frameWrap}>
            <div className={styles.frame} data-zoom-frame>
              <Image
                src="/images/real/vrcaljka-tegla.webp"
                alt={c.alt}
                fill
                sizes="(max-width: 640px) 78vw, 24rem"
                className={styles.zoomImage}
              />
            </div>

            <TransitionLink
              href={localeHref(locale, '/pcelinjak')}
              className={`brand-cta brand-cta--seal pecat ${styles.seal}`}
              aria-label={c.cta}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="brand-cta__art" src="/images/brand/pecat-pcelinjak.svg" alt="" aria-hidden="true" />
            </TransitionLink>
          </div>
        </div>
      </section>
    </div>
  );
}
