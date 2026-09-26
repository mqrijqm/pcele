'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TransitionLink from '@/components/ui/TransitionLink';
import ImagePlaceholder from './ImagePlaceholder';
import { SKROL_MQ, lijepi } from './lijepi';

gsap.registerPlugin(ScrollTrigger);

type Slika = { alt: string; omjer: '3:2' | '4:3' | '2:3' | '1:1'; src?: string };

/*
 * Omjeri su omjeri samih fotografija, ne izbor: traka je i na uzoru nosila
 * razlicite sirine na istoj visini, pa uspravna slika u njoj nije izuzetak
 * nego ono zbog cega traka i postoji.
 */
const OMJER: Record<Slika['omjer'], number> = {
  '3:2': 1.499,
  '4:3': 1.333,
  '2:3': 0.667,
  '1:1': 1,
};

/**
 * Traka slika koja se lista skrolom.
 *
 * Strana stane dok traka ne prodje: scena se zalijepi na sredinu kadra i, dok
 * se skroluje nadolje, niz putuje u stranu dok se ne izlista do kraja. Koliko
 * se prstom pomjeri, toliko traka predje — nema ubrzanja ni zaostajanja, pa se
 * moze i stati na sredini i vratiti natrag.
 *
 * Duzina skrola je jednaka sirini koju traka treba da predje. Tako je stajanje
 * tacno onoliko dugo koliko ima sta da se vidi: sest slika ne drze stranu
 * jednako dugo kao tri.
 *
 * Lijepljenje je CSS (`position: sticky`), ne GSAP pin — vidi `lijepi.ts`.
 * Scena je visoka samo koliko slike i malo zraka, ne cio kadar, pa oko trake
 * nema pola ekrana praznine u toku strane.
 *
 * Strelica vise nema. Dok se traka pomjerala klikom imale su smisla; sada bi
 * se tukle sa skrolom, jer bi vukle niz na mjesto koje skrol istog trena
 * vraca natrag.
 *
 * Na telefonu se ne lijepi: tamo traka ostaje obican vodoravni niz koji se
 * prevlaci prstom, jer lijepljenje na uskom kadru pojede citav ekran.
 */
export default function Rail({
  slike,
  aria,
  productsHref,
  productsLabel,
}: {
  slike: Slika[];
  aria: string;
  productsHref?: string;
  productsLabel?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const s = stage.current;
    const v = viewport.current;
    const t = track.current;
    if (!w || !s || !v || !t) return;

    const mm = gsap.matchMedia();
    mm.add(SKROL_MQ, () => {
      const setX = gsap.quickSetter(t, 'x', 'px');
      const stop = lijepi({
        outer: w,
        stage: s,
        // Preci treba sve osim jednog kadra trake.
        put: () => Math.max(0, t.offsetWidth - v.clientWidth),
        napredak: (p, put) => setX(-put * p),
      });
      return () => {
        stop();
        gsap.set(t, { clearProps: 'transform' });
      };
    });

    return () => mm.revert();
  }, [slike.length]);

  return (
    <div
      className="pcl-rail pcl-lijep"
      ref={wrap}
      role="group"
      aria-roledescription="carousel"
      aria-label={aria}
    >
      <div className="pcl-rail__stage pcl-lijep__scena" ref={stage}>
        <div className="pcl-rail__viewport" ref={viewport}>
          <div className="pcl-rail__track" ref={track}>
            {slike.map((s, i) => (
              <div className="pcl-rail__item" key={`${s.alt}-${i}`}>
                <ImagePlaceholder
                  ratio={OMJER[s.omjer]}
                  label={s.omjer}
                  alt={s.alt}
                  src={s.src}
                  sizes="(max-width: 767px) 70vw, 45vw"
                />
              </div>
            ))}
          </div>
        </div>
        {productsHref && productsLabel && (
          <TransitionLink
            href={productsHref}
            aria-label={productsLabel}
            className="pcl-rail__products-badge"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/proizvodiii.svg" alt="" aria-hidden="true" />
          </TransitionLink>
        )}
      </div>
    </div>
  );
}
