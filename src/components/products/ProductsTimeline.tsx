'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './productsEditorial.module.css';

export type TimelineStep = {
  number: string;
  season: string;
  title: string;
  body: string;
  image: string;
  slot: string;
};

export default function ProductsTimeline({ steps }: { steps: TimelineStep[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-timeline-card]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.timelineCard);
        if (Number.isFinite(index)) setActive(index);
      },
      { root: track, threshold: [0.45, 0.7] },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const card = trackRef.current?.querySelector<HTMLElement>(`[data-timeline-card="${index}"]`);
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  return (
    <div className={styles.timelineShell}>
      <div className={styles.timelineNav} aria-label="Koraci procesa">
        {steps.map((step, index) => (
          <button
            key={step.number}
            type="button"
            className={index === active ? styles.timelineDotActive : styles.timelineDot}
            onClick={() => goTo(index)}
            aria-label={`Prikaži korak ${step.number}: ${step.title}`}
            aria-current={index === active ? 'step' : undefined}
          />
        ))}
      </div>

      <div className={styles.timelineTrack} ref={trackRef} tabIndex={0}>
        {steps.map((step, index) => (
          <article className={styles.timelineCard} data-timeline-card={index} key={step.number}>
            <div className={styles.timelineCopy}>
              <div className={styles.timelineMeta}>
                <span>{step.number}</span>
                <span>{step.season}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
            <div className={styles.timelineImage} data-image-slot={step.slot}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={step.image} alt="" loading="lazy" decoding="async" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
