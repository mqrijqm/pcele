'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Stani i citaj: sekcija sa tekstom koji treba procitati.
 *
 * Isti obrazac kao `Geslo.tsx` (`.geslo` u `globals.css`): sekcija je visoka
 * koliko kadar plus budzet za citanje, scena u njoj je `position: sticky`, a
 * skrol vodi otkrivanje rijeci — svaka pocinje blijeda i dolazi do pune boje
 * kad je skrol dotakne. Zadnjih ~18% skrola drzi cijeli tekst prije
 * otpustanja.
 *
 * Razlika od Gesla: rijeci ne dobijaju `opacity` od JavaScripta jednu po
 * jednu. JavaScript upisuje samo jedan broj, `--p` (0 do 1), na sekciju, a
 * svaka rijec iz njega i iz svog rednog broja (`--i`, `--n` — vidi `Rijeci`)
 * sama izracuna svoju providnost u CSS-u. Jedan upis po kadru, bez petlje po
 * rijecima, a rijeci ostaju obicne rijeci u obicnom tekstu.
 *
 * Sadrzaj scene mora stati u jedan kadar (100svh) — i na 1280x720 i na
 * telefonu; vidi `.citaj__scena` u `pcelinjak.css`.
 *
 * Uz iskljucene animacije nema ni lijepljenja ni blijedenja: sav tekst stoji
 * ispisan, u toku strane.
 */
export default function Citaj({
  children,
  budzet = 70,
  tablet = false,
  className = '',
}: {
  children: ReactNode;
  /** Budzet za citanje, u svh povrh jednog kadra. Srazmjeran duzini teksta. */
  budzet?: number;
  /** Lijepi se samo od 768 navise: sadrzaj (slika uz tekst) ne staje u telefonski kadar. */
  tablet?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(
      tablet
        ? '(min-width: 768px) and (prefers-reduced-motion: no-preference)'
        : '(prefers-reduced-motion: no-preference)',
      () => {
        let zadnje = -1;
        const upisi = (progress: number) => {
          // Zadnjih ~18% skrola drzi puni tekst.
          const p = Math.min(1, progress / 0.82);
          if (p === zadnje) return;
          zadnje = p;
          el.style.setProperty('--p', p.toFixed(4));
        };
        upisi(0);

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: (self) => upisi(self.progress),
          onUpdate: (self) => upisi(self.progress),
        });

        return () => {
          trigger.kill();
          el.style.removeProperty('--p');
        };
      },
    );

    return () => mm.revert();
  }, [tablet]);

  return (
    <div
      className={`citaj${tablet ? ' citaj--tablet' : ''}${className ? ` ${className}` : ''}`}
      ref={root}
      style={{ ['--citaj-run' as string]: `${budzet}svh` } as CSSProperties}
    >
      <div className="citaj__scena">{children}</div>
    </div>
  );
}
