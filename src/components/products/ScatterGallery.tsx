'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ImageSlot from '@/components/products/ImageSlot';
import SplitTitle from '@/components/products/SplitTitle';

gsap.registerPlugin(ScrollTrigger);

/**
 * Rasuti snimci preko pune plohe, sa naslovom u sredini.
 *
 * Dvije stvari se desavaju, i obje su iz referentne strane:
 *
 * 1. Snimci se skupljaju u kadar kad sekcija dodje na pola ekrana â€” bez toga
 *    bi ploha izgledala kao da je nesto ostalo nedovrseno.
 * 2. Kad prelazite misem, snimci se pomjeraju, svaki svojom brzinom
 *    (`data-delta`). Pomak je mali namjerno: ploha treba da dise, ne da se
 *    raspe. Na telefonu se ovo ne ukljucuje â€” tamo nema misa, a i snimci su
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
  lede: string;
  slots: { slot: string; label: string }[];
  id?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const images = gsap.utils.toArray<HTMLElement>('.pe-scatter__image', el);

      /* Ulazak: ploha se otvori kad je pola u kadru. */
      const intro = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 60%', once: true },
      });
      intro.from(images, {
        opacity: 0,
        scale: 0.92,
        y: 40,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.09,
      });

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

    return () => mm.revert();
  }, []);

  return (
    <section data-snap="off" className="pe-scatter" ref={root} id={id}>
      <div className="pe-scatter__gallery" aria-hidden="true">
        {slots.map((item, i) => (
          <span
            className={`pe-scatter__image pe-scatter__image--${i}`}
            key={item.slot}
            data-delta={i === 0 ? 0.5 : 0.75}
          >
            <ImageSlot slot={item.slot} label={item.label} />
          </span>
        ))}
      </div>

      <div className="pe-wrap--medium pe-scatter__content">
        <SplitTitle text={title} className="pe-display pe-scatter__title" />
        <p className="pe-body pe-scatter__lede reveal">{lede}</p>
      </div>
    </section>
  );
}
