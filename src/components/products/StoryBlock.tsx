'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import ImageSlot from '@/components/products/ImageSlot';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function StoryBlock({
  label,
  lede,
  body,
  facts,
  art,
  artAlt,
  photo,
  photoLabel,
  scrollReveal = false,
  highlightWords = [],
}: {
  label: string;
  lede: string;
  body?: string;
  facts?: { label: string; value: string }[];
  art?: { src: string; width: number; height: number };
  artAlt?: string;
  photo?: string;
  photoLabel?: string;
  scrollReveal?: boolean;
  highlightWords?: string[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!scrollReveal || !root.current) return;

      const words = gsap.utils.toArray<HTMLElement>('.pe-story__word');
      const labelNode = root.current.querySelector<HTMLElement>('.pe-story__label');
      const artNode = root.current.querySelector<HTMLElement>('.pe-story__art');
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(words, { opacity: 0.13 });
        if (labelNode) gsap.set(labelNode, { opacity: 0.3 });
        if (artNode) gsap.set(artNode, { opacity: 0, scale: 0.82, rotate: 0 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=115%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        timeline
          .to(labelNode, { opacity: 1, duration: 0.12, ease: 'none' }, 0)
          .to(words, { opacity: 1, duration: 0.12, stagger: 0.035, ease: 'none' }, 0)
          .to(artNode, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }, 0.08)
          .to(artNode, { rotate: 360, duration: 1, ease: 'none' }, 0);
      });

      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.025,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 75%',
              end: 'center 38%',
              scrub: 0.6,
            },
          },
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(words, { opacity: 1 });
        gsap.set([labelNode, artNode], { opacity: 1, scale: 1, rotate: 0 });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [scrollReveal], revertOnUpdate: true },
  );

  const highlighted = new Set(highlightWords.map((word) => word.toLocaleLowerCase('sr')));
  const normalizeWord = (word: string) =>
    word.toLocaleLowerCase('sr').replace(/^[^a-zčćžšđ]+|[^a-zčćžšđ]+$/gi, '');

  return (
    <section ref={root} data-snap="off" className={`pe-story${scrollReveal ? ' pe-story--scroll' : ''}`}>
      <div className="pe-wrap">
        <div className="pe-story__inner">
          <h2 className={`pe-label pe-story__label${scrollReveal ? '' : ' reveal'}`}>{label}</h2>

          {scrollReveal ? (
            <p className="pe-title pe-story__lede pe-story__lede--words" aria-label={lede}>
              {lede.split(/\s+/).map((word, index) => (
                <span
                  className={`pe-story__word${highlighted.has(normalizeWord(word)) ? ' pe-story__word--gold' : ''}`}
                  aria-hidden="true"
                  key={`${word}-${index}`}
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          ) : (
            <p className="pe-title pe-story__lede reveal stagger-1">{lede}</p>
          )}

          {body ? <p className="pe-body pe-story__body reveal stagger-2">{body}</p> : null}

          {photo ? (
            <div className="pe-story__photo reveal stagger-2">
              <ImageSlot slot={photo} label={photoLabel ?? label} />
            </div>
          ) : null}

          {facts?.length ? (
            <dl className={`pe-facts reveal stagger-2${art ? ' pe-facts--roomy' : ''}`}>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {art ? (
            <span className="pe-story__art" aria-hidden="true">
              <Image src={art.src} alt={artAlt ?? ''} width={art.width} height={art.height} />
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
