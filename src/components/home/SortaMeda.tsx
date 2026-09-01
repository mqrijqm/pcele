'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TransitionLink from '@/components/ui/TransitionLink';
import { products } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/** Jedna mjera: sta pise u katalogu, koja je slika i koliko je tegla visoka. */
export type Mjera = {
  /** Kljuc u katalogu — odatle dolazi natpis mjere, isti koji vidi i webshop. */
  slug: string;
  slika: string;
  /** Visina tegle u postotku sanduka. Manja mjera je i na slici manja. */
  visina: number;
};

export type SortaCopy = {
  eyebrow: string;
  ime: string;
  cinjenice: ReadonlyArray<{ oznaka: string; vrijednost: string }>;
  tekst: string;
  birajTezinu: string;
  znakAlt: string;
  teglaAlt: string;
};

type Props = {
  locale: Locale;
  copy: SortaCopy;
  mjere: ReadonlyArray<Mjera>;
  /** Botanicki crtez uz teglu. */
  crtez: string;
  /** Okrugli znak "Okusi slast"; vodi na stranu s proizvodima. */
  znak: string;
  /**
   * Ploha sekcije. `med` je puna medena, `krem` svijetli papir — sorte se
   * smjenjuju, da se pri skrolu kroz niz vidi gdje jedna prestaje a druga
   * pocinje.
   */
  ton: 'med' | 'krem';
  /** Slog desno i vizual lijevo je uobicajeno; `true` ih zamjenjuje. */
  obrnuto?: boolean;
  /** Kad se ne zada, uzima se ime sorte — mora biti jedinstveno na strani. */
  id?: string;
};

/**
 * Jedna sorta meda: tegla, botanicki crtez oko nje, i sve sto se o njoj cita.
 *
 * Ista komponenta nosi i livadski i bagremov — razlikuju se rijecima, crtezom,
 * plohom i stranom na kojoj stoji slog. Zato ovdje nema nijedne rijeci ni
 * putanje: sve dolazi propsima, a sekcija zna samo kako se to slaze.
 *
 * **Dvije kolone.** Sa jedne strane tegla s crtezom oko nje i znakom u uglu, sa
 * druge sve sto se cita. `obrnuto` mijenja koja je koja — susjedne sorte stoje
 * jedna nasuprot druge, da niz ne bude niz istih strana.
 *
 * **Slog.** Sve je serif, osim tri oznake nad cinjenicama: one se ne citaju
 * nego ocitavaju, pa ih grotesk odvaja od ostatka.
 *
 * **Otkrivanje ide redom** — tegla, pa slog, pa crtez iza tegle, pa znak. Crtez
 * namjerno dolazi poslije sloga: on je pozadina, a pozadina koja udje prva
 * navuce pogled na sebe i tegla se u njoj izgubi.
 *
 * **Crtez se brise, ne povlaci.** U crtezima su vidljive linije popunjene
 * plohe, a ne potezi, pa `stroke-dashoffset` na njima nema na cemu da radi.
 * Brisanje preko cijelog crteza daje isti utisak crtanja i radi na svakom
 * sloju; isti postupak nosi i crtez brda u sekciji pcelinjaka.
 */
export default function SortaMeda({
  locale,
  copy,
  mjere,
  crtez,
  znak,
  ton,
  obrnuto = false,
  id,
}: Props) {
  const root = useRef<HTMLElement>(null);

  /* Veca mjera je unaprijed izabrana. */
  const [izabrana, setIzabrana] = useState(0);

  const stavke = mjere.map((m) => {
    const proizvod = products.find((p) => p.slug === m.slug)!;
    return { ...m, varijanta: proizvod.variants[0] };
  });

  const kljuc = id ?? copy.ime.toLowerCase().replace(/[^a-z]+/g, '-');
  const birajId = `sorta-biraj-${kljuc}`;

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];
      const tegla = q('.sorta__tegla');
      const crtezEl = q('.sorta__crtez');
      const znakEl = q('.sorta__znak');
      const slog = q('.sorta__copy > *');

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([tegla, znakEl, ...slog], { opacity: 1, y: 0, scale: 1 });
        gsap.set(crtezEl, { opacity: 1, clipPath: 'inset(0 0% 0 0)' });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(tegla, { opacity: 0, y: 46 });
        /*
         * Brisanje ide od one strane s koje crtez i "raste": kad je vizual
         * desno, crtez se otkriva slijeva nadesno; u obrnutoj sekciji obrnuto,
         * pa potez uvijek ide od tegle prema van, a ne preko nje.
         */
        gsap.set(crtezEl, {
          opacity: 1,
          clipPath: obrnuto ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
        });
        gsap.set(znakEl, { opacity: 0, scale: 0.7 });
        gsap.set(slog, { opacity: 0, y: 22 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 72%', once: true },
          defaults: { ease: 'power2.out' },
        });

        tl.to(tegla, { opacity: 1, y: 0, duration: 0.85 })
          .to(slog, { opacity: 1, y: 0, duration: 0.62, stagger: 0.09 }, 0.5)
          .to(
            crtezEl,
            {
              clipPath: obrnuto ? 'inset(0 0 0 0%)' : 'inset(0 0% 0 0)',
              duration: 1.15,
              ease: 'power1.inOut',
            },
            1.15,
          )
          .to(znakEl, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 2.05);

        return () => tl.scrollTrigger?.kill();
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [locale, obrnuto]);

  return (
    <section
      className={`sorta sorta--${ton}${obrnuto ? ' sorta--obrnuto' : ''}`}
      ref={root}
      aria-label={copy.ime}
    >
      <div className="sorta__inner">
        {/* --- vizual: tegla, crtez oko nje, znak u uglu --- */}
        <div className="sorta__shot">
          {/*
            Crtez je ukras: ono sto tegla jeste vec pise u njenom opisu i u
            imenu pored nje. Kremasti krug nije zaseban element — dolazi u
            samom crtezu.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sorta__crtez" src={crtez} alt="" aria-hidden="true" />

          {/*
            Obje tegle stoje jedna preko druge i dijele osnovicu i os; izabrana
            je vidljiva, druga na nuli, pa se med ne "prekopira" nego pretopi.
            Opis nosi samo izabrana — inace bi se ime proizvoda cilo dvaput.
          */}
          <div className="sorta__tegla">
            {stavke.map((s, i) => (
              <Image
                key={s.slug}
                className={`sorta__staklo${i === izabrana ? ' is-active' : ''}`}
                style={{ height: `${s.visina}%` }}
                src={s.slika}
                alt={i === izabrana ? copy.teglaAlt : ''}
                width={560}
                height={972}
                sizes="(max-width: 900px) 54vw, 22vw"
              />
            ))}
          </div>

          {/*
            Znak vodi na stranu s proizvodima — "okusi slast" je poziv, ne
            ukras. Natpis je u samom crtezu, pa ime odredista nosi `alt`.
          */}
          <TransitionLink className="sorta__znak" href={localeHref(locale, '/products')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={znak} alt={copy.znakAlt} />
          </TransitionLink>
        </div>

        {/* --- slog --- */}
        <div className="sorta__copy">
          <p className="sorta__eyebrow">{copy.eyebrow}</p>

          <h2 className="sorta__ime">{copy.ime}</h2>

          <dl className="sorta__cinjenice">
            {copy.cinjenice.map((c) => (
              <div key={c.oznaka}>
                <dt>{c.oznaka}</dt>
                <dd>{c.vrijednost}</dd>
              </div>
            ))}
          </dl>

          <p className="sorta__tekst">{copy.tekst}</p>

          {/*
            Obje mjere stoje vidljive odjednom, ne u padajucem izborniku.
            Izabrana je puna, druga prigusena; `aria-pressed` to isto kaze
            citacu ekrana, koji prigusenost ne vidi.
          */}
          <div className="sorta__izbor">
            <p className="sorta__biraj" id={birajId}>
              {copy.birajTezinu}
            </p>

            <div className="sorta__mjere" role="group" aria-labelledby={birajId}>
              {stavke.map((s, i) => (
                <span key={s.slug} className="sorta__mjera-red">
                  {i > 0 && (
                    <span className="sorta__tacka" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <button
                    type="button"
                    className={`sorta__mjera${i === izabrana ? ' is-selected' : ''}`}
                    aria-pressed={i === izabrana}
                    onClick={() => setIzabrana(i)}
                  >
                    {s.varijanta.title}
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
