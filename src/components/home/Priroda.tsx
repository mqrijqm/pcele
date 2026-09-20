'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

export default function Priroda({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const t = home.priroda[locale];

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const inner = el.querySelector<HTMLElement>('.priroda__inner');
      const heading = el.querySelector<HTMLElement>('.priroda__heading');
      const seal = el.querySelector<HTMLElement>('.priroda__seal');
      const copyItems = Array.from(el.querySelectorAll<HTMLElement>('.priroda__copy > *'));
      if (!inner || !heading || !seal || !copyItems.length) return;

      const showAll = () => {
        gsap.set(heading, { opacity: 1, y: 0 });
        gsap.set(copyItems, { opacity: 1, y: 0 });
        gsap.set(seal, { opacity: 1, scale: 1 });
      };

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        showAll();
        return;
      }

      gsap.set(heading, { opacity: 0, y: 28 });
      gsap.set(copyItems, { opacity: 0, y: 18 });
      gsap.set(seal, { opacity: 0, scale: 0.78 });

      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const pinDistance = () => Math.round(Math.max(460, Math.min(620, window.innerHeight * 0.65)));
        const timeline = gsap
          .timeline({
            scrollTrigger: {
              trigger: inner,
              start: 'top 12%',
              end: () => `+=${pinDistance()}`,
              pin: inner,
              scrub: 0.55,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(heading, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }, 0)
          .to(copyItems, { opacity: 1, y: 0, duration: 0.38, stagger: 0.06, ease: 'power2.out' }, 0.2)
          .to(seal, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.4)' }, 0.64)
          .to({}, { duration: 0.12 });

        return () => timeline.scrollTrigger?.kill();
      });

      mm.add('(max-width: 768px)', () => {
        const timeline = gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top 72%',
              once: true,
              toggleActions: 'play none none none',
            },
          })
          .to(heading, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 0)
          .to(copyItems, { opacity: 1, y: 0, duration: 0.42, stagger: 0.06, ease: 'power2.out' }, 0.18)
          .to(seal, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.4)' }, 0.72);

        return () => timeline.scrollTrigger?.kill();
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section className="priroda" ref={root}>
      <div className="priroda__inner">
        <figure className="priroda__shot">
          <Image
            src="/images/priroda/pcela-na-dlanu.webp"
            alt={t.photoAlt}
            width={716}
            height={1073}
            sizes="(max-width: 900px) 70vw, 26vw"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="priroda__seal"
            src="/images/brand/pecat-cvijet.svg"
            alt=""
            aria-hidden="true"
          />
        </figure>

        <h2 className="priroda__heading">{t.heading}</h2>

        <div className="priroda__copy">
          {t.body.map((par) => (
            <p key={par.slice(0, 24)}>{par}</p>
          ))}

          <Link className="priroda__link" href={localeHref(locale, '/#porijeklo')}>
            {t.link}
          </Link>
        </div>
      </div>
    </section>
  );
}
