'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { sorte as copy } from '@/content/sorte';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * "Vrcamo ukus koji traje" — tri sorte u lukovima kroz koje se lista vodoravno.
 *
 * Listanje je nativno (`overflow-x` + `scroll-snap`), a ne GSAP, iz tri
 * razloga: dodir i inercija na telefonu dolaze besplatno i rade na 60fps jer
 * ih vozi kompozitor a ne JS; strelice rade same kad je traka fokusirana; i
 * nista se ne bije sa Lenisom, koji vozi uspravni skrol cijele strane.
 *
 * Na sirokom ekranu sekcija se pinuje i uspravni skrol vozi traku vodoravno:
 * dok se sve tri sorte ne prelistaju, strana ne ide dalje. To jeste otimanje
 * kotacica, ali sa dvije ograde koje ga cine predvidljivim — put je konacan i
 * jednak sirini trake, pa se sekcija napusta istim potezom kojim se i usla, i
 * traka nikad ne moze da "proguta" skrol bez kraja.
 *
 * Na dodir i uz `prefers-reduced-motion` nista se ne pinuje: tamo ostaje
 * nativno listanje prstom, sa inercijom i snapom koje daje sam preglednik.
 *
 * Lukovi sjede na dnu sekcije bez razmaka — ispod njih odmah pocinje smedja
 * traka 01–04, pa ravno dno luka dodiruje njenu ivicu.
 */
/** Lijevi unutrasnji razmak trake — na njega se kartice hvataju. */
function padStart(track: HTMLElement) {
  return parseFloat(getComputedStyle(track).paddingLeft) || 0;
}

export default function SorteMeda({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  /** Postoji samo dok je sekcija pinovana; drugdje je traka nativna. */
  const pinRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  /**
   * Koja kartica "drzi" traku.
   *
   * Kartice se hvataju lijevom ivicom, pa je aktivna ona ciji je pocetak
   * najblizi lijevoj ivici okvira. Kraj trake je poseban slucaj: posljednja
   * kartica nikad ne stigne do lijeve ivice jer iza nje nema sta da se skrola
   * — tri kartice sirine 42% daju manje od jedne sirine okvira hoda. Bez ove
   * grane posljednja tacka se nikad ne bi upalila.
   */
  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const last = track.children.length - 1;

    if (max > 0 && track.scrollLeft >= max - 2) {
      setActive(last);
      return;
    }

    // Mjeri se preko rect-ova, ne offsetLeft-a: offsetLeft zavisi od toga ko
    // je offsetParent i ne oduzima bocni razmak same trake.
    const edge = track.getBoundingClientRect().left + padStart(track);
    let best = 0;
    let bestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const d = Math.abs((child as HTMLElement).getBoundingClientRect().left - edge);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // rAF gusenje: scroll okida cesto, a nama treba samo posljednje stanje.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        syncActive();
      });
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    syncActive();
    return () => {
      track.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [syncActive]);

  /*
   * Pin + vodoravni scrub. Traka se pomjera transformom, a ne `scrollLeft`-om:
   * transform vozi kompozitor, dok bi postavljanje `scrollLeft` svakog kadra
   * tuklo o `scroll-snap` iste trake.
   *
   * Zato aktivnu karticu ovdje NE mjeri `syncActive`: on poredi rect kartice
   * sa rect-om trake, a transform pomjera oboje jednako, pa bi razlika ostala
   * ista do kraja. Umjesto toga se predjeni put racuna iz napretka pina i
   * poredi sa `offsetLeft`, koji transform ne dira.
   */
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      section.classList.add('sorte--pinned');
      const run = () => track.scrollWidth - track.clientWidth;

      const tween = gsap.to(track, {
        x: () => -run(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          // Put strane je tacno sirina koju traka ima da prijedje.
          end: () => `+=${run()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const last = track.children.length - 1;
            if (self.progress > 0.995) {
              setActive(last);
              return;
            }
            const travelled = self.progress * run();
            const pad = padStart(track);
            let best = 0;
            let bestDist = Infinity;
            Array.from(track.children).forEach((child, i) => {
              const d = Math.abs((child as HTMLElement).offsetLeft - pad - travelled);
              if (d < bestDist) {
                bestDist = d;
                best = i;
              }
            });
            setActive(best);
          },
        },
      });

      pinRef.current = tween.scrollTrigger ?? null;

      return () => {
        pinRef.current = null;
        section.classList.remove('sorte--pinned');
        gsap.set(track, { clearProps: 'transform' });
      };
    });

    return () => mm.revert();
  }, []);

  /** Dovodi karticu na lijevu ivicu. Preko kraja trake se ne moze. */
  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const el = track.children[i] as HTMLElement | undefined;
    if (!el) return;

    /*
     * Pinovano: traka ne moze sama nigdje da ode — nju vozi polozaj strane.
     * Zato se skace na onu tacku skrola na kojoj scrub dovodi bas ovu karticu
     * na lijevu ivicu. Skok je trenutan namjerno: Lenis vozi glatko kretanje
     * strane, pa bi jos jedna animacija preko njega dala dvostruko usporenje.
     */
    const pin = pinRef.current;
    if (pin) {
      const run = track.scrollWidth - track.clientWidth;
      const target = Math.max(0, Math.min(el.offsetLeft - padStart(track), run));
      const p = run > 0 ? target / run : 0;
      window.scrollTo(0, pin.start + p * (pin.end - pin.start));
      return;
    }

    const delta =
      el.getBoundingClientRect().left - track.getBoundingClientRect().left - padStart(track);
    const max = track.scrollWidth - track.clientWidth;
    const left = Math.max(0, Math.min(track.scrollLeft + delta, max));
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left, behavior: still ? 'auto' : 'smooth' });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = active + (e.key === 'ArrowRight' ? 1 : -1);
    goTo(Math.min(Math.max(next, 0), t.sorte.length - 1));
  };

  return (
    <section ref={sectionRef} className="sorte" aria-labelledby="sorte-naslov">
      {/*
       * Tacke stoje gore, uz dugme, a ne ispod kartica. Dno sekcije je
       * zauzeto: lukovi tamo dodiruju smedju traku, pa bi tacke lebdjele
       * preko samog sadrzaja kartice.
       */}
      <div className="sorte__top">
        <div>
          <h2 id="sorte-naslov" className="sorte__heading">
            {t.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <Link href={localeHref(locale, '/contact')} className="sorte__cta">
            {t.cta}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="sorte__tacke">
          {t.sorte.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className="sorte__tacka"
              aria-label={s.naziv}
              aria-current={i === active}
              data-active={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      {/*
       * tabIndex 0 je namjeran: traka koja se skroluje mora da se moze
       * fokusirati tastaturom, inace strelice nemaju gdje da stignu.
       */}
      <div
        ref={trackRef}
        className="sorte__track"
        role="region"
        aria-label={t.regionLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {t.sorte.map((s) => (
          <article key={s.key} className="sorta" style={{ background: s.bg }}>
            <div className="sorta__art">
              {/*
               * <img>, ne inline SVG: crtezi su trasirani iz rasterа i i posle
               * sazimanja nose oko 700 KB u tri fajla. Inline bi to uselilo u
               * sam HTML svake ucitane strane; ovako ih preglednik kesira
               * odvojeno i drugi put ih uopste ne skida.
               */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/hero/sorte/${s.key}.svg`} alt={s.alt} loading="lazy" decoding="async" />
            </div>

            <h3 className="sorta__naziv" style={{ color: s.nazivBoja }}>
              {s.naziv}
            </h3>

            <dl className="sorta__info">
              {s.redovi.map((r) => (
                <div key={r.label} className="sorta__red">
                  <dt>{r.label}</dt>
                  {/* Tackasta linija je ukras, pa je van dt/dl para. */}
                  <span className="sorta__crta" aria-hidden="true" />
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
