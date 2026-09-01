'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ImagePlaceholder from './ImagePlaceholder';

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
 * Strana stane dok traka ne prodje: sekcija se zakaci za vrh kadra i, dok se
 * skroluje nadolje, niz putuje u stranu dok se ne izlista do kraja. Koliko se
 * prstom pomjeri, toliko traka predje — nema ubrzanja ni zaostajanja, pa se
 * moze i stati na sredini i vratiti natrag.
 *
 * Duzina skrola je jednaka sirini koju traka treba da predje. Tako je stajanje
 * tacno onoliko dugo koliko ima sta da se vidi: sest slika ne drze stranu
 * jednako dugo kao tri.
 *
 * Strelica vise nema. Dok se traka pomjerala klikom imale su smisla; sada bi
 * se tukle sa skrolom, jer bi vukle niz na mjesto koje skrol istog trena
 * vraca natrag.
 *
 * Na telefonu se ne pinuje: tamo traka ostaje obican vodoravni niz koji se
 * prevlaci prstom, jer pinovanje na uskom kadru pojede citav ekran.
 */
export default function Rail({ slike, aria }: { slike: Slika[]; aria: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const t = track.current;
    if (!w || !t) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      // Preci treba sve osim jednog kadra trake.
      const put = () => Math.max(0, t.scrollWidth - t.clientWidth);
      gsap.to(t, {
        x: () => -put(),
        ease: 'none',
        scrollTrigger: {
          trigger: w,
          start: 'top top',
          end: () => `+=${put()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    });

    return () => mm.revert();
  }, [slike.length]);

  return (
    <div
      className="pcl-rail"
      ref={wrap}
      role="group"
      aria-roledescription="carousel"
      aria-label={aria}
    >
      <div className="pcl-rail__viewport">
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
    </div>
  );
}
