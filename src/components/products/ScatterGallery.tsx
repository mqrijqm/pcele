'use client';

import { useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import DripEdge from '@/components/home/DripEdge';
import ImageSlot from '@/components/products/ImageSlot';
import SplitTitle from '@/components/products/SplitTitle';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Zuta ploha sa naslovom u sredini i snimcima koji kruze oko njega.
 *
 * Snimci stoje na krugu, ravnomjerno, i cio krug se polako okrece oko rijeci.
 * Svaki snimak se okrece za isti ugao u suprotnom smjeru, pa ostaje uspravan
 * dok putuje — inace bi se prevrtao naglavacke.
 *
 * Okretanje je cisti CSS (vidi `.pe-scatter__orbit` u products.css): radi na
 * grafickoj kartici, ne koci skrol i ne trazi JavaScript. GSAP radi samo
 * jedno — kad ploha udje u kadar, krug izraste iz sredine — i to na
 * omotacu (`.pe-scatter__ring`), a ne na elementu koji se okrece, da se dva
 * pokreta ne bore oko istog `transform`-a.
 *
 * Ploha ima kapi i na vrhu i na dnu — isti rubovi (`DripEdge`) kao pojas ispod
 * heroja na pocetnoj — a ispod donjeg ruba ostaje puno praznog papira prije
 * sljedece sekcije.
 */
export default function ScatterGallery({
  title,
  lede,
  slots,
  id,
}: {
  title: string;
  lede?: string;
  slots: { slot: string; label: string; image?: string }[];
  id?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = root.current;
    const ring = el?.querySelector<HTMLElement>('.pe-scatter__ring');
    const titleNode = el?.querySelector<HTMLElement>('.pe-scatter__content');
    if (!el || !ring || !titleNode) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          end: 'top 18%',
          scrub: 1,
        },
      });
      intro
        .from(ring, { opacity: 0, scale: 0.45, duration: 0.8, ease: 'power3.out' })
        .from(titleNode, { opacity: 0, y: 28, duration: 0.35, ease: 'power2.out' }, 0.3);

      return () => {
        intro.scrollTrigger?.kill();
        intro.kill();
      };
    });

    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.from(ring, {
        opacity: 0,
        scale: 0.6,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 72%' },
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([ring, titleNode], { opacity: 1, scale: 1, y: 0 });
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <>
      {/*
        Isti pocetak kao zuta ploha ispod heroja na pocetnoj: med se prelije preko
        ruba i skrolom se ravna linija izduzi u kapi. Komponenta i crtez su oni sa
        pocetne (`DripEdge`), a `drip__head` je njen sanduk — proziran, pa se
        iznad kapi vidi papir strane. Ploha ispod pocinje tamo gdje se kapi zavrse.
      */}
      <div className="drip__head" aria-hidden="true">
        <DripEdge variant="head" />
      </div>

      <section data-snap="off" className="pe-scatter" ref={root} id={id}>
        <div className="pe-scatter__gallery" aria-hidden="true">
          <div className="pe-scatter__ring">
            <div className="pe-scatter__orbit">
              {slots.map((item, i) => (
                <span
                  className="pe-scatter__slot"
                  key={item.slot}
                  // Prvi snimak stoji gore (-90deg), ostali ravnomjerno oko kruga.
                  style={{ '--a': `${(360 / slots.length) * i - 90}deg` } as CSSProperties}
                >
                  <span className="pe-scatter__image">
                    {item.image ? (
                      <Image src={item.image} alt="" fill sizes="(max-width: 767px) 22vw, 12vw" />
                    ) : (
                      <ImageSlot slot={item.slot} label={item.label} />
                    )}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pe-wrap--medium pe-scatter__content">
          <div className="pe-scatter__title-row">
            <SplitTitle text={title} className="pe-display pe-scatter__title" />
            {/* Crtež je maska obojena bojom naslova (papir), vidi `.pe-scatter__title-icon`. */}
            <span className="pe-scatter__title-icon" aria-hidden="true" />
          </div>
          {lede ? <p className="pe-body pe-scatter__lede reveal">{lede}</p> : null}
        </div>
      </section>

      {/*
        Donja ivica: isti potez kao na dnu pojasa na pocetnoj. Zuta ploha se
        zavrsava kapima koje vise u papir, a ispod njih je namjerno puno praznog
        prostora — sljedeca sekcija ne treba da pocne odmah uz med.
      */}
      <div className="drip__tail pe-scatter__tail" aria-hidden="true">
        <DripEdge variant="tail" />
      </div>
      <div className="pe-scatter__air" aria-hidden="true" />
    </>
  );
}
