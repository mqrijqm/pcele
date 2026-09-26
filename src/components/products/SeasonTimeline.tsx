'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ImageSlot from '@/components/products/ImageSlot';
import SeasonVideo from '@/components/products/SeasonVideo';
import { anticipatePin } from '@/components/products/pinAnticipate';
import type { SeasonMedia } from '@/content/productsEditorial';

gsap.registerPlugin(ScrollTrigger);

type Step = { when: string; title: string; body: string };

/*
 * Koliko skrola vrijedi jedan korak (u visinama ekrana) dok je sekcija zaustavljena,
 * i koji dio puta pripada koracima. Ostatak (zadnjih 10%) drzi zadnji korak prije
 * otpustanja, kao `.geslo` na pocetnoj.
 */
const SCROLL_PER_STEP = 0.36;
const STEPS_SHARE = 0.9;

/**
 * Sezona u pcelinjaku, korak po korak.
 *
 * Na sirokom ekranu: traka mjeseci gore, od ivice do ivice, omedjena dvjema
 * ravnim linijama (jedan mjesec po koraku), i red kartica ispod, u kojem je
 * otvoren samo jedan korak — njegov naslov je krupniji, a snimak se otvori
 * uz njega. Prelazak na drugi korak pomjeri traku tako da otvoreni korak stane
 * uz lijevu ivicu, a malo sunce uz otvoreni mjesec se okrene na novo mjesto.
 *
 * Na telefonu isti red postaje lista koju prevlacite prstom; `scroll-snap`
 * zaustavlja po jedan korak, a tacke ispod pokazuju gdje ste.
 *
 * Na sirokom ekranu se sekcija zaustavlja (`pin`), a skrol prelistava korake:
 * svaki korak ima tekst za citanje, pa ne smije da proleti pored. Klik na mjesec
 * i dalje radi — pomjeri skrol na taj korak, tako da traka i skrol ostanu jedno.
 * Bez pokreta (`prefers-reduced-motion`) i na telefonu nema zaustavljanja: tamo
 * korak bira samo klik, odnosno prevlacenje prstom.
 */
export default function SeasonTimeline({
  label,
  heading,
  steps,
  slots,
  media,
  videoLabels,
}: {
  label: string;
  heading: string;
  steps: Step[];
  /** Prazan sivi blok za korake koji još nemaju snimak. */
  slots: string[];
  media: (SeasonMedia | null)[];
  videoLabels: { play: string; pause: string };
}) {
  const root = useRef<HTMLElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /* Prvo postavljanje ide bez animacije — inace bi se traka pomjerila na ucitavanju. */
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
      /* Razlomljena sirina, ne `offsetWidth`: zaokruzena greska bi se kroz devet koraka nakupila u nekoliko piksela. */
      step.current = closed.getBoundingClientRect().width + gap;
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const place = useCallback((index: number, animate: boolean) => {
    const track = slider.current;
    const navEl = nav.current;
    if (!track || !navEl) return;

    const to = animate ? gsap.to : gsap.set;

    /*
     * Na uskom (ali još širokom) ekranu svi mjeseci ne stanu u traku i ona se
     * lista. Tad se otvoreni mjesec dovede na sredinu, da se sunce uz njega vidi.
     * Miče se samo traka, ne cijela strana (`scrollIntoView` bi i nju).
     */
    const tab = navEl.querySelectorAll<HTMLElement>('.pe-season__tab')[index];
    if (tab && navEl.scrollWidth > navEl.clientWidth) {
      navEl.scrollTo({
        left: tab.offsetLeft - (navEl.clientWidth - tab.offsetWidth) / 2,
        behavior: animate ? 'smooth' : 'instant',
      });
    }

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

  /*
   * Zaustavljanje sekcije. Okidac se sam brine za pin i razmak ispod; skrol samo
   * bira korak. `start` prati visinu: na niskom ekranu, gdje sekcija ne stane cijela,
   * poravnava se donjom ivicom, da otvoreni korak uvijek bude u kadru.
   */
  const pin = useRef<ScrollTrigger | null>(null);
  const count = steps.length;

  useEffect(() => {
    const el = root.current;
    if (!el || count < 2) return;

    const mm = gsap.matchMedia();
    mm.add(
      '(orientation: landscape) and (min-height: 600px) and (prefers-reduced-motion: no-preference)',
      () => {
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: () => (el.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
          end: () => `+=${Math.round(window.innerHeight * SCROLL_PER_STEP * count)}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: anticipatePin(),
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(count - 1, Math.floor((self.progress / STEPS_SHARE) * count));
            setActive((current) => (current === next ? current : next));
          },
        });
        pin.current = trigger;

        return () => {
          trigger.kill();
          pin.current = null;
        };
      },
    );

    return () => mm.revert();
  }, [count]);

  /*
   * Klik na mjesec. Dok je sekcija zaustavljena, korak se bira skrolom: klik
   * pomjeri skrol na sredinu tog koraka (u zaustavljenom kadru se ne vidi nikakav
   * skok, samo se promijeni korak). Bez zaustavljanja korak se postavlja direktno.
   */
  const select = useCallback(
    (index: number) => {
      const trigger = pin.current;
      if (!trigger) {
        setActive(index);
        return;
      }
      const share = ((index + 0.5) / count) * STEPS_SHARE;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * share, behavior: 'instant' });
    },
    [count],
  );

  /* Pri promjeni sirine mjere se mijenjaju — traka ide na novo mjesto. */
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

  const renderMedia = (step: Step, i: number) => {
    const item = media[i];

    if (item?.type === 'image') {
      return <Image src={item.src} alt={step.title} fill sizes="(orientation: portrait) 78vw, 24vw" />;
    }
    if (item?.type === 'video') {
      return (
        <SeasonVideo
          src={item.src}
          poster={item.poster}
          label={step.title}
          labels={videoLabels}
          active={i === active}
        />
      );
    }
    return <ImageSlot slot={slots[i]} label={`${step.title} — fotografija`} />;
  };

  return (
    /*
     * `data-seal-stop`: pecat "Okusi slast" (vidi `FullBleed`) staje ispred ove
     * sekcije. Ona se zaustavlja tri ekrana i pecat bi sve to vrijeme lebdio preko
     * sljedeceg koraka koji viri s desne strane; a katalog na koji pecat vodi je
     * odmah ispod, pa ga poslije nema cemu da sluzi.
     */
    <section data-snap="off" data-seal-stop="" className="pe-season" ref={root}>
      <div className="pe-wrap--small pe-season__head">
        <h2 className="pe-title reveal">{heading}</h2>
      </div>

      {/* Traka mjeseci ide od ivice do ivice ekrana — zato nije u omotaču sa uvlačenjem. */}
      <div className="pe-season__navwrap">
        <div className="pe-season__nav reveal" role="tablist" aria-label={label} ref={nav}>
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
              onClick={() => select(i)}
            >
              {/* Sunce uz otvoreni mjesec je pseudo-element ove oznake, vidi CSS. */}
              <span className="pe-season__tab-label">{step.when}</span>
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
                data-past={i < active}
              >
                <div className="pe-season__item__inner">
                  <div className="pe-season__content">
                    <div>
                      <h3 className="pe-title pe-season__when">{step.when}</h3>
                      <p className="pe-season__name">{step.title}</p>
                    </div>
                    <p className="pe-body pe-season__text">{step.body}</p>
                  </div>

                  <div className="pe-season__media">{renderMedia(step, i)}</div>
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
