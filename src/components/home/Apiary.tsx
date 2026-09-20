'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SPEED = 1;

/**
 * Pcelinjak is triggered by scroll, but the reveal itself is time based.
 * The five-second timeline is intentionally independent from video duration.
 */
export default function Apiary({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const t = home.apiary[locale];

  useEffect(() => {
    const el = root.current;
    const video = film.current;
    if (!el || !video) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (selector: string) => Element[];
      const shot = q('.apiary__shot')[0] as HTMLElement | undefined;
      const heading = q('.apiary__heading')[0] as HTMLElement | undefined;
      const coords = q('.apiary__coords')[0] as HTMLElement | undefined;
      const hills = q('.apiary__hills')[0] as HTMLElement | undefined;
      const body = q('.apiary__body')[0] as HTMLElement | undefined;
      const sun = q('.apiary__sun')[0] as HTMLElement | undefined;

      if (!shot || !heading || !coords || !hills || !body || !sun) return;

      const fitCoords = () => {
        coords.style.fontSize = '';
        const base = parseFloat(getComputedStyle(coords).fontSize);
        const textWidth = (node: HTMLElement) => {
          const range = document.createRange();
          range.selectNodeContents(node);
          return range.getBoundingClientRect().width;
        };
        const nameWidth = textWidth(heading);
        const coordsWidth = textWidth(coords);
        if (!base || !nameWidth || !coordsWidth) return;
        coords.style.fontSize = `${(base * nameWidth) / coordsWidth}px`;
      };

      fitCoords();
      document.fonts?.ready.then(fitCoords).catch(() => undefined);
      window.addEventListener('resize', fitCoords);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        gsap.set(shot, { top: '3%', right: '2%', bottom: '3%', left: '2%' });
        gsap.set(video, { opacity: 1, scale: 1 });
        gsap.set([heading, coords, sun], { opacity: 1, y: 0, scale: 1 });
        gsap.set([hills, body], { opacity: 1, clipPath: 'inset(0 0% 0 0)' });

        return () => window.removeEventListener('resize', fitCoords);
      }

      gsap.set(shot, { top: '0%', right: '0%', bottom: '0%', left: '0%' });
      gsap.set(video, { opacity: 0.55, scale: 1.012 });
      gsap.set([heading, coords], { opacity: 0, y: 26 });
      gsap.set([hills, body], { opacity: 1, clipPath: 'inset(0 100% 0 0)' });
      gsap.set(sun, { opacity: 0, scale: 0 });

      const timeline = gsap
        .timeline({ paused: true })
        .to(video, { opacity: 1, scale: 1, duration: 1.55, ease: 'power1.out' }, 0)
        .to(heading, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.3)
        .to(coords, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.7)
        .to(hills, { clipPath: 'inset(0 0% 0 0)', duration: 1.05, ease: 'power1.inOut' }, 0.75)
        .to(
          shot,
          {
            top: '3%',
            right: '2%',
            bottom: '3%',
            left: '2%',
            duration: 1.05,
            ease: 'power2.inOut',
          },
          2.8,
        )
        .to(body, { clipPath: 'inset(0 0% 0 0)', duration: 0.75, ease: 'power1.inOut' }, 3.45)
        .to(sun, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, 3.55)
        .to({}, { duration: 0.65 }, 4.35);

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          video.playbackRate = VIDEO_SPEED;
          video.play().catch(() => undefined);
          timeline.play(0);
        },
      });

      return () => {
        window.removeEventListener('resize', fitCoords);
        trigger.kill();
        timeline.kill();
      };
    }, el);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section className="apiary" ref={root} aria-label={t.heading}>
      <div className="apiary__stage">
        <figure className="apiary__shot">
          <video
            ref={film}
            className="apiary__img"
            poster="/images/real/pcelinjak-mracaj-poster.webp"
            muted
            playsInline
            preload="metadata"
            aria-label={t.alt}
          >
            <source src="/images/real/pcelinjak-mracaj.webm" type="video/webm" />
            <source src="/images/real/pcelinjak-mracaj.mp4" type="video/mp4" />
          </video>

          <div className="apiary__scrim" aria-hidden="true" />

          <figcaption className="apiary__caption">
            <div className="apiary__where">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="apiary__hills apiary__copy"
                src="/images/brand/brda.svg"
                alt={t.hillsAlt}
              />
              <h2 className="apiary__heading apiary__copy">{t.heading}</h2>
              <p className="apiary__coords apiary__copy">{t.coords}</p>
            </div>

            <div className="apiary__foot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="apiary__sun"
                src="/images/brand/sunce.svg"
                alt=""
                aria-hidden="true"
              />
              <p className="apiary__body">{t.body}</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
