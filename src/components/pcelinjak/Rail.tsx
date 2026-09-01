'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import ImagePlaceholder from './ImagePlaceholder';

type Slika = { alt: string; omjer: '3:2' | '4:3' };

const OMJER: Record<Slika['omjer'], number> = { '3:2': 1.499, '4:3': 1.333 };

/**
 * Traka slika koja se lista u stranu.
 *
 * Na uzoru trake drzi splide sa promjenljivim sirinama: sve slike su visoke
 * 450px, a siroke onoliko koliko im omjer trazi, s razmakom od 27.648px.
 * Traka pocinje uvucena od lijeve ivice i izlazi preko desne — nije poravnata
 * sa sadrzajem nego namjerno visi preko ruba.
 *
 * Pisano bez nove zavisnosti: pomak je obican `translateX` po zbiru sirina do
 * trazenog slajda, a strelice se gase na krajevima. Splide bi ovdje bio jos
 * jedan paket koji sutra treba odrzavati, a radi isto.
 */
export default function Rail({ slike, aria }: { slike: Slika[]; aria: string }) {
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [max, setMax] = useState(0);

  /*
   * Dokle se smije otici: do trenutka kad zadnji slajd sjedne uz desnu ivicu.
   * Racuna se iz stvarnih sirina, jer se one mijenjaju s omjerom i sirinom
   * ekrana — nema fiksnog broja koji bi ovdje bio tacan.
   */
  const measure = useCallback(() => {
    const t = track.current;
    const v = viewport.current;
    if (!t || !v) return;
    const items = Array.from(t.children) as HTMLElement[];
    let last = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].offsetLeft + items[i].offsetWidth <= t.scrollWidth - v.clientWidth + 1) last = i;
    }
    setMax(last);
    setIndex((i) => Math.min(i, last));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const item = t.children[index] as HTMLElement | undefined;
    t.style.transform = `translateX(${item ? -item.offsetLeft : 0}px)`;
  }, [index]);

  return (
    <div className="pcl-rail" role="group" aria-roledescription="carousel" aria-label={aria}>
      <div className="pcl-rail__viewport" ref={viewport}>
        <div className="pcl-rail__track" ref={track}>
          {slike.map((s, i) => (
            <div className="pcl-rail__item" key={`${s.alt}-${i}`}>
              <ImagePlaceholder ratio={OMJER[s.omjer]} label={s.omjer} alt={s.alt} />
            </div>
          ))}
        </div>
      </div>

      <div className="pcl-rail__arrows">
        <button
          type="button"
          className="pcl-rail__arrow"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          aria-label="Prethodna slika"
        >
          <Strelica smjer="lijevo" />
        </button>
        <button
          type="button"
          className="pcl-rail__arrow"
          onClick={() => setIndex((i) => Math.min(max, i + 1))}
          disabled={index >= max}
          aria-label="Sljedeća slika"
        >
          <Strelica smjer="desno" />
        </button>
      </div>
    </div>
  );
}

function Strelica({ smjer }: { smjer: 'lijevo' | 'desno' }) {
  return (
    <svg width="11" height="18" viewBox="0 0 11 18" fill="none" aria-hidden="true">
      <path
        d={smjer === 'lijevo' ? 'M9.5 1 1.5 9l8 8' : 'M1.5 1l8 8-8 8'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
