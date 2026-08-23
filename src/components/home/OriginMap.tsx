'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * Karta koja blago prati mis.
 *
 * Pomak je mali i namjerno spor: karta ne "juri" kursor nego se za njim vuce,
 * pa se pokret osjeti kao tezina, a ne kao efekat. Tacka koja se prati je
 * cijela sekcija, ne sama slika — inace bi karta reagovala tek kad predjes
 * preko nje.
 *
 * Sve je transform, i sve staje na `prefers-reduced-motion`. Na dodir se ne
 * vezuje nista: tamo mis ne postoji, a `pointer: fine` to pouzdano razdvaja.
 */
export default function OriginMap({ alt }: { alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const section = el?.closest('.origin') as HTMLElement | null;
    if (!el || !section) return;

    const fine = window.matchMedia('(pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || still.matches) return;

    // Koliko karta smije da odluta od svog mjesta.
    const RANGE = 14;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      // -1..1 od sredine sekcije
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2 * RANGE;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2 * RANGE;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      // Prosto priblizavanje cilju: sto je dalje, to brze ide.
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      const settled = Math.abs(targetX - x) < 0.05 && Math.abs(targetY - y) < 0.05;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = '';
    };
  }, []);

  return (
    <div className="origin__map reveal stagger-2" ref={wrap}>
      <Image
        src="/images/brand/mapa-prnjavor.webp"
        alt={alt}
        width={1058}
        height={706}
        sizes="(max-width: 768px) 88vw, 62vw"
      />
    </div>
  );
}
