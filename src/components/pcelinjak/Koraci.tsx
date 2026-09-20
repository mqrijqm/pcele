'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ImagePlaceholder from './ImagePlaceholder';

gsap.registerPlugin(ScrollTrigger);

export type Korak = {
  broj: string;
  ukupno: string;
  title: string[];
  alt: string;
  desc: string;
  src: string;
};

/**
 * Jedan korak: broj, naslov, kvadratna slika, tekst — sve uspravno, u koloni
 * uske sirine. Cio korak mora da stane u jedan kadar, jer se ovdje cita, ne
 * listra: zato su i slika i naslov ovoliko mali.
 */
function Kartica({ k, priority = false }: { k: Korak; priority?: boolean }) {
  return (
    <article className="pcl-korak">
      <p className="pcl-pretitle">
        {k.broj} / {k.ukupno}
      </p>
      <h2 className="pcl-display pcl-display--3">
        {k.title.map((r, i) => (
          <span className="pcl-display__word" key={`${r}-${i}`}>
            <span>{r}</span>
          </span>
        ))}
      </h2>
      <div className="pcl-korak__slika">
        <ImagePlaceholder
          ratio={1}
          label="1:1"
          alt={k.alt}
          src={k.src}
          sizes="(max-width: 767px) 90vw, 22rem"
          priority={priority}
        />
      </div>
      <p className="pcl-body">{k.desc}</p>
    </article>
  );
}

/**
 * Pet koraka u jednom kadru.
 *
 * Svih pet koraka su u jednoj traci: prvi stoji na lijevoj ivici sadrzaja,
 * ostali ulaze sdesna, a dok se strana skrola cijela traka putuje ulijevo —
 * prvi korak odlazi prvi, ne ostaje zalijepljen. Sekcija se zakaci za vrh
 * kadra tacno onoliko koliko treba da stigne posljednji korak. Koliko se
 * prstom pomjeri, toliko traka predje (`scrub`), pa se moze stati na sredini
 * i vratiti natrag.
 *
 * Na telefonu i uz iskljucene animacije nema pinovanja: koraci idu jedan pod
 * drugim, odnosno traka se prevlaci prstom — vidi `pcelinjak.css`.
 */
export default function Koraci({ koraci }: { koraci: Korak[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const v = viewport.current;
    const t = track.current;
    if (!w || !v || !t) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      // Preci treba sve sto ne stane u kadar trake.
      const put = () => Math.max(0, t.scrollWidth - v.clientWidth);
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
  }, [koraci.length]);

  return (
    <div className="pcl-koraci" ref={wrap}>
      <div className="pcl-koraci__stage">
        <div className="pcl-koraci__viewport" ref={viewport}>
          <div className="pcl-koraci__track" ref={track}>
            {koraci.map((k, i) => (
              <Kartica k={k} key={k.broj} priority={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
