'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import ImageSlot from '@/components/products/ImageSlot';

type Step = { when: string; title: string; body: string };

/**
 * Sezona u pcelinjaku, korak po korak.
 *
 * Na sirokom ekranu: traka s naljepnicama gore (jedna po koraku) i red
 * kartica ispod, u kojem je otvoren samo jedan korak — njegov naslov je
 * krupniji, a snimak se otvori uz njega. Prelazak na drugi korak pomjeri
 * traku tako da otvoreni korak stane uz lijevu ivicu, a bjelina ispod
 * naljepnice klizne na novo mjesto.
 *
 * Na telefonu isti red postaje lista koju prevlacite prstom; `scroll-snap`
 * zaustavlja po jedan korak, a tacke ispod pokazuju gdje ste.
 *
 * Nema `ScrollTrigger`-a: nista se ne odvija skrolom strane, samo klikom.
 * Referentna strana radi isto.
 */
export default function SeasonTimeline({
  label,
  heading,
  steps,
  slots,
}: {
  label: string;
  heading: string;
  steps: Step[];
  slots: string[];
}) {
  const root = useRef<HTMLElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  /* Prvo postavljanje ide bez animacije — inace naljepnica "dodje" na klik. */
  const placed = useRef(false);
  /*
   * Sirina jednog zatvorenog koraka plus razmak medju koracima. Mjeri se
   * jednom i stoji, jer je stalna: stubac teksta ima fiksnu sirinu, a snimak
   * je sirine nula dok je korak zatvoren.
   *
   * Od nje se racuna pomak trake. `offsetLeft` otvorenog koraka se NE smije
   * mjeriti neposredno poslije klika — sirina stubca je tada jos u tranziciji,
   * pa traka stane na pogresno mjesto i otvoreni korak ostane van kadra.
   */
  const step = useRef(0);

  useEffect(() => {
    const track = slider.current;
    if (!track) return;

    const measure = () => {
      const items = track.querySelectorAll<HTMLElement>('.pe-season__item');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const closed = [...items].find((item) => item.dataset.active !== 'true');
      if (!closed) return;
      step.current = closed.offsetWidth + gap;
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const place = useCallback((index: number, animate: boolean) => {
    const track = slider.current;
    const navEl = nav.current;
    const mark = indicator.current;
    if (!track || !navEl || !mark) return;

    const tabs = navEl.querySelectorAll<HTMLElement>('.pe-season__tab');
    const tab = tabs[index];
    if (!tab) return;

    const to = animate ? gsap.to : gsap.set;

    to(mark, {
      width: tab.offsetWidth,
      height: tab.offsetHeight,
      left: tab.offsetLeft,
      top: tab.offsetTop,
      duration: animate ? 0.55 : 0,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    /* Otvoreni korak predje u boju papira tek kad naljepnica stane pod njega. */
    navEl.dataset.ready = 'true';

    /* Traka se pomjera samo na sirokom ekranu; na telefonu je lista prstom. */
    if (window.matchMedia('(orientation: landscape)').matches && step.current) {
      to(track, {
        x: -index * step.current,
        duration: animate ? 0.6 : 0,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    } else {
      gsap.set(track, { x: 0 });
    }
  }, []);

  useEffect(() => {
    place(active, placed.current);
    placed.current = true;
  }, [active, place]);

  /* Pri promjeni sirine mjere se mijenjaju — naljepnica ide na novo mjesto. */
  useEffect(() => {
    const onResize = () => place(active, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active, place]);

  /*
   * Na telefonu tacke prate gdje je lista stala. Racuna se sredina svake
   * kartice prema sredini liste, isto kako se i zaustavlja.
   */
  const onRailScroll = useCallback(() => {
    const track = slider.current;
    if (!track || window.matchMedia('(orientation: landscape)').matches) return;

    const middle = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let near = Infinity;
    track.querySelectorAll<HTMLElement>('.pe-season__item').forEach((item, i) => {
      const away = Math.abs(item.offsetLeft + item.offsetWidth / 2 - middle);
      if (away < near) {
        near = away;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const goToRail = useCallback((index: number) => {
    const track = slider.current;
    const item = track?.querySelectorAll<HTMLElement>('.pe-season__item')[index];
    if (!track || !item) return;
    track.scrollTo({ left: item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2, behavior: 'smooth' });
  }, []);

  return (
    <section data-snap="off" className="pe-season" ref={root}>
      <div className="pe-wrap--small pe-season__head">
        <p className="pe-label reveal">{label}</p>
        <h2 className="pe-title reveal stagger-1">{heading}</h2>
      </div>

      <div className="pe-wrap--small pe-season__navwrap">
        <div className="pe-season__nav reveal" role="tablist" aria-label={label} ref={nav}>
          <span className="pe-season__indicator" ref={indicator} aria-hidden="true" />
          {steps.map((step, i) => (
            <button
              className="pe-season__tab"
              key={step.title}
              type="button"
              role="tab"
              id={`pe-season-tab-${i}`}
              aria-controls={`pe-season-step-${i}`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
            >
              {step.when}
            </button>
          ))}
        </div>
      </div>

      <div className="pe-season__viewport">
        <div className="pe-wrap--small">
          <div className="pe-season__slider" ref={slider} onScroll={onRailScroll}>
            {steps.map((step, i) => (
              <article
                className="pe-season__item"
                key={step.title}
                id={`pe-season-step-${i}`}
                role="tabpanel"
                aria-labelledby={`pe-season-tab-${i}`}
                data-active={i === active}
              >
                <div className="pe-season__item__inner">
                  <div className="pe-season__content">
                    <div>
                      <h3 className="pe-title pe-season__when">{step.when}</h3>
                      <p className="pe-season__name">{step.title}</p>
                    </div>
                    <p className="pe-body pe-season__text">{step.body}</p>
                  </div>

                  <div className="pe-season__media">
                    <ImageSlot slot={slots[i]} label={`${step.title} — fotografija`} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="pe-season__dots">
        {steps.map((step, i) => (
          <button
            key={step.title}
            type="button"
            aria-label={step.title}
            aria-current={i === active}
            onClick={() => goToRail(i)}
          />
        ))}
      </div>
    </section>
  );
}
