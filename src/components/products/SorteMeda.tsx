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

/**
 * Tri scene zakovane sekcije, i gdje na traci pocinje svaka.
 *
 * Prva pokazuje livadski sam, po sredini ekrana. Druga ga pomjera ulijevo
 * taman toliko da uz njega stane bagrem, pa par stoji centriran. Treca pomjeri
 * traku za jednu karticu, i onda su centrirani bagrem i propolis.
 *
 * Sve tri se racunaju iz jedne mjere — sirine kartice plus razmaka — pa se
 * cijela koreografija sama prilagodi kad se ekran promijeni.
 */
function stopX(section: HTMLElement, track: HTMLElement, scene: 0 | 1 | 2) {
  const first = track.children[0] as HTMLElement | undefined;
  if (!first) return 0;
  const cs = getComputedStyle(track);
  const w = first.offsetWidth;
  const gap = parseFloat(cs.columnGap) || parseFloat(cs.gap) || 0;
  const pad = parseFloat(cs.paddingLeft) || 0;
  const view = section.clientWidth;

  if (scene === 0) return (view - w) / 2 - pad;
  const pair = (view - 2 * w - gap) / 2 - pad;
  return scene === 1 ? pair : pair - (w + gap);
}

/**
 * Trajanja u jedinicama vremenske ose. Namjerno su srazmjerna predjenom putu:
 * druga scena pomjeri traku za pola koraka, treca za cijeli — pa trecoj treba
 * dvostruko vremena da bi obje isle istom brzinom pod prstom.
 */
const T = { ulaz: 0.9, mir1: 0.5, hod1: 1.0, mir2: 0.4, hod2: 2.0 };
const UKUPNO = T.ulaz + T.mir1 + T.hod1 + T.mir2 + T.hod2;

/** Napredak na kojem svaka scena stoji mirno — tu vode tackice. */
const SCENA_P = [(T.ulaz + T.mir1) / UKUPNO, (T.ulaz + T.mir1 + T.hod1 + T.mir2) / UKUPNO, 1];

/** Koja je scena "na redu" za dati napredak — tackica se pali na pola hoda. */
function scenaNa(p: number) {
  if (p < (T.ulaz + T.mir1 + T.hod1 / 2) / UKUPNO) return 0;
  if (p < (T.ulaz + T.mir1 + T.hod1 + T.mir2 + T.hod2 / 2) / UKUPNO) return 1;
  return 2;
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
   * Pin + koreografija u tri scene. Traka se pomjera transformom, a ne
   * `scrollLeft`-om: transform vozi kompozitor, dok bi postavljanje
   * `scrollLeft` svakog kadra tuklo o `scroll-snap` iste trake.
   *
   * Kartice koje jos nisu na redu drze se na `opacity: 0`, a ne `visibility`
   * ili `display` — tako ostaju u stablu pristupacnosti i citac ekrana ih
   * procita bez obzira gdje je strana zastala.
   */
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      section.classList.add('sorte--pinned');
      const cards = Array.from(track.children) as HTMLElement[];
      const [livada, bagrem, propolis] = cards;
      if (!livada || !bagrem || !propolis) {
        section.classList.remove('sorte--pinned');
        return;
      }

      /*
       * Put strane: koliko traka stvarno predje (jedan i po korak), plus pola
       * ekrana za ulazak i dva predaha. Bez tog dodatka scene bi se smjenjivale
       * bez daha izmedju, a ovako svaka ima trenutak u kojem samo stoji.
       */
      const travel = () => {
        const step = stopX(section, track, 1) - stopX(section, track, 2);
        return Math.round(1.5 * step + section.clientWidth * 0.55);
      };

      gsap.set(track, { x: () => stopX(section, track, 0) });
      gsap.set(livada, { opacity: 0, scale: 0.96 });
      gsap.set([bagrem, propolis], { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${travel()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(scenaNa(self.progress)),
        },
      });

      tl
        // 1. livadski se pojavi sam, po sredini
        .to(livada, { opacity: 1, scale: 1, duration: T.ulaz, ease: 'power2.out' })
        .to({}, { duration: T.mir1 })
        // 2. odmakne se ulijevo, a bagrem ulazi u prostor koji je oslobodio
        .to(track, { x: () => stopX(section, track, 1), duration: T.hod1, ease: 'none' })
        .to(bagrem, { opacity: 1, duration: T.hod1 * 0.75, ease: 'power1.out' }, '<0.15')
        .to({}, { duration: T.mir2 })
        // 3. par otklizi za jednu karticu, i na desnoj strani ostaje propolis
        .to(track, { x: () => stopX(section, track, 2), duration: T.hod2, ease: 'none' })
        .to(propolis, { opacity: 1, duration: T.hod2 * 0.45, ease: 'power1.out' }, '<0.1')
        // livadski ode s ekrana, ali ne skroz: bez ovoga mu rub luka ostane da
        // viri uz lijevu ivicu i scena se ne zatvori na dvije kartice
        .to(livada, { opacity: 0, duration: T.hod2 * 0.4, ease: 'power1.in' }, '<0.5');

      pinRef.current = tl.scrollTrigger ?? null;

      return () => {
        pinRef.current = null;
        section.classList.remove('sorte--pinned');
        gsap.set(track, { clearProps: 'transform' });
        gsap.set(cards, { clearProps: 'opacity,transform' });
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
     * Zato se skace na onu tacku skrola na kojoj scena i inace stoji mirno.
     * Skok je trenutan namjerno: Lenis vozi glatko kretanje strane, pa bi jos
     * jedna animacija preko njega dala dvostruko usporenje.
     */
    const pin = pinRef.current;
    if (pin) {
      const p = SCENA_P[Math.min(i, SCENA_P.length - 1)];
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
