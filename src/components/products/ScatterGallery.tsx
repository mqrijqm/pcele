'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import DripEdge from '@/components/home/DripEdge';
import ImageSlot from '@/components/products/ImageSlot';
import SplitTitle from '@/components/products/SplitTitle';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Rasuti snimci preko pune plohe, sa naslovom u sredini.
 *
 * Dvije stvari se desavaju, i obje su iz referentne strane:
 *
 * 1. Snimci se skupljaju u kadar kad sekcija dodje na pola ekrana — bez toga
 *    bi ploha izgledala kao da je nesto ostalo nedovrseno.
 * 2. Kad prelazite misem, snimci se pomjeraju, svaki svojom brzinom
 *    (`data-delta`). Pomak je mali namjerno: ploha treba da dise, ne da se
 *    raspe. Na telefonu se ovo ne ukljucuje — tamo nema misa, a i snimci su
 *    poredani drugacije.
 *
 * `quickTo` se koristi umjesto `gsap.to` u petlji: on drzi jedan tween po
 * elementu i samo mu mijenja odrediste, pa pomeranje misa ne pravi smece.
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
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const images = gsap.utils.toArray<HTMLElement>('.pe-scatter__image', el);
      const titleNode = el.querySelector<HTMLElement>('.pe-scatter__content');
      const xOffsets = [-150, -30, 160, -60, 130];
      const yOffsets = [40, -110, -80, 140, 150];

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          end: 'top 18%',
          scrub: 1,
        },
      });
      intro.from(images, {
        opacity: 0,
        scale: 0.84,
        x: (index) => xOffsets[index] ?? 0,
        y: (index) => yOffsets[index] ?? 80,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.07,
      }).from(titleNode, { opacity: 0, y: 28, duration: 0.35, ease: 'power2.out' }, 0.3);

      return () => {
        intro.scrollTrigger?.kill();
        intro.kill();
      };
    });

    mm.add('(prefers-reduced-motion: no-preference) and (orientation: landscape)', () => {
      const gallery = el.querySelector('.pe-scatter__gallery');
      if (!gallery) return;

      const images = gsap.utils.toArray<HTMLElement>('.pe-scatter__image', el);
      const setters = images.map((image) => ({
        delta: Number(image.dataset.delta ?? 0.75),
        x: gsap.quickTo(image, 'x', { duration: 1.1, ease: 'power3.out' }),
        y: gsap.quickTo(image, 'y', { duration: 1.1, ease: 'power3.out' }),
      }));

      const onMove = (event: MouseEvent) => {
        const box = gallery.getBoundingClientRect();
        const cx = event.clientX - box.left - box.width / 2;
        const cy = event.clientY - box.top - box.height / 2;

        for (const setter of setters) {
          setter.x((-cx * 0.05 * setter.delta) / 0.75);
          setter.y((-cy * 0.05 * setter.delta) / 0.75);
        }
      };

      const onLeave = () => {
        for (const setter of setters) {
          setter.x(0);
          setter.y(0);
        }
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);

      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });

    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.from('.pe-scatter__image', {
        opacity: 0,
        scale: 0.88,
        y: 36,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 72%' },
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(['.pe-scatter__image', '.pe-scatter__content'], { opacity: 1, x: 0, y: 0, scale: 1 });
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
          {slots.map((item, i) => (
            <span
              className={`pe-scatter__image pe-scatter__image--${i}`}
              key={item.slot}
              data-delta={i === 0 ? 0.5 : 0.75}
            >
              {item.image ? (
                <Image src={item.image} alt="" fill sizes="(max-width: 767px) 42vw, 18vw" />
              ) : (
                <ImageSlot slot={item.slot} label={item.label} />
              )}
            </span>
          ))}
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
    </>
  );
}
