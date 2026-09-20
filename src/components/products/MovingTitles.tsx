'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Dva krupna naslova koja ulaze jedan s lijeve, drugi s desne strane.
 *
 * Redovi su sirine cijelog omotaca, pa pomak od pola njihove sirine znaci da
 * su van kadra prije nego sto se pocnu priblizavati. Pomak je vezan za skrol
 * (scrub), pa ga citate kao da ga skrol vuche â€” a ne kao animaciju koja se
 * jednom odigrala.
 *
 * Ikonica je nas crtez iz brenda i stoji uz naslov, kao sto na referentnoj
 * strani stoji klas pirinca.
 */
export default function MovingTitles({
  items,
}: {
  items: { title: string; icon: string; iconAlt: string }[];
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const rows = gsap.utils.toArray<HTMLElement>('.pe-movers__row', el);
      if (rows.length < 2) return;

      gsap.set(rows[0], { xPercent: 50 });
      gsap.set(rows[1], { xPercent: -50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'top 40%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(rows[0], { xPercent: 0, ease: 'none' }, 0).to(rows[1], { xPercent: 0, ease: 'none' }, 0);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section data-snap="off" className="pe-movers" ref={root}>
      <div className="pe-wrap--small">
        {items.map((item) => (
          <div className="pe-movers__row" key={item.title}>
            <h2 className="pe-display pe-movers__title">{item.title}</h2>
            <span className="pe-movers__icon" aria-hidden="true">
              <Image src={item.icon} alt={item.iconAlt} width={213} height={313} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
