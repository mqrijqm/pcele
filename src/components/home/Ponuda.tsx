'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import { products } from '@/data/products';
import type { Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Dvije mjere livadskog meda, veca prva.
 *
 * Naslovi mjera se ne pisu ovdje nego se uzimaju iz kataloga po `slug`-u — iz
 * istog izvora iz kojeg ih cita i webshop, da se natpis na sekciji ne moze
 * razici s onim u korpi.
 *
 * Cijene se vise ne prikazuju. Sekcija predstavlja med, ne prodaje ga: ovdje
 * stoje ime, mjere i ono po cemu se med prepoznaje, a broj i dugme su na
 * strani proizvoda, gdje se i kupuje.
 */
const MJERE = [
  { slug: 'livadski-med-1kg', slika: '/images/proizvodi/tegla-1kg.webp', visina: 100 },
  { slug: 'livadski-med-500g', slika: '/images/proizvodi/tegla-500g.webp', visina: 84 },
] as const;

/**
 * Livadski med: tegla, cvijet oko nje, i sve sto se o medu cita.
 *
 * Sekcija stoji na punoj medenoj plohi, izmedju crteza pcelinjaka i propolisa:
 * prvo se vidi odakle med dolazi, pa sta iz toga izlazi, pa tek onda ostalo iz
 * kosnice.
 *
 * **Dvije kolone.** Lijevo tegla na kremastom krugu, s kamilicom koja izlazi
 * izvan njega i znakom u donjem uglu; desno sve sto se cita. Crtez nikad ne
 * ide iza sloga — linija bi prosla kroz slova.
 *
 * **Slog.** Ono sto se cita ide u serif kojim je pisan cio sajt: ime i mjere.
 * U sans ostaje ono sto se ne cita nego ocitava — nadnaslov, oznake cinjenica,
 * poziv na izbor mjere i sam opis.
 *
 * **Boje.** Na medenoj plohi nema bijelog sloga: ime je u mastilu, ostalo u
 * tamnijem tonu istog mastila. Krem se pojavljuje samo kao ploha kruga i u
 * samom znaku.
 *
 * **Otkrivanje ide redom** — tegla, pa cvijet, pa slog — i vezano je za dolazak
 * sekcije u kadar, ne za vrijeme. Vidi `useEffect` nize.
 */
export default function Ponuda({ locale }: { locale: Locale }) {
  const t = home.ponuda[locale];
  const root = useRef<HTMLElement>(null);

  /* Veca mjera je unaprijed izabrana. */
  const [izabrana, setIzabrana] = useState(0);

  const stavke = MJERE.map((m) => {
    const proizvod = products.find((p) => p.slug === m.slug)!;
    return { ...m, proizvod, varijanta: proizvod.variants[0] };
  });

  /*
   * Redoslijed otkrivanja: tegla, pa cvijet, pa slog.
   *
   * **Cvijet se brise, ne povlaci.** Trazeni `stroke-dashoffset` ovdje nema na
   * cemu da radi: u crtezu su vidljive linije popunjene plohe (dvije putanje
   * od preko pedeset kilobajta), a ne potezi — jedini pravi potezi su debele
   * krem latice ispod njih. Da se povlacio samo dashoffset, latice bi se
   * crtale a smedja linija bi banula odjednom. Brisanje preko cijelog crteza
   * daje isti utisak crtanja i radi na oba sloja; isti postupak vec nosi crtez
   * brda u sekciji pcelinjaka.
   *
   * **Ko je iskljucio kretanje** dobija sve odmah i na svom mjestu.
   */
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];
      const tegla = q('.ponuda__tegla');
      const cvijet = q('.ponuda__cvijet');
      const znak = q('.ponuda__znak');
      const slog = q('.ponuda__copy > *');

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([tegla, znak, ...slog], { opacity: 1, y: 0, scale: 1 });
        gsap.set(cvijet, { opacity: 1, clipPath: 'inset(0 0% 0 0)' });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(tegla, { opacity: 0, y: 46 });
        gsap.set(cvijet, { opacity: 1, clipPath: 'inset(0 100% 0 0)' });
        gsap.set(znak, { opacity: 0, scale: 0.7 });
        gsap.set(slog, { opacity: 0, y: 22 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 72%',
            once: true,
          },
          defaults: { ease: 'power2.out' },
        });

        /*
         * Tegla, pa slog, pa crtez iza tegle, pa znak.
         *
         * Crtez namjerno dolazi poslije sloga: on je pozadina, a pozadina koja
         * udje prva navuce pogled na sebe i tegla se u njoj izgubi. Ovako se
         * prvo vidi sta se prodaje, pa sta o tome pise, pa tek onda oko cega
         * to stoji.
         */
        tl.to(tegla, { opacity: 1, y: 0, duration: 0.85 })
          .to(slog, { opacity: 1, y: 0, duration: 0.62, stagger: 0.09 }, 0.5)
          .to(
            cvijet,
            { clipPath: 'inset(0 0% 0 0)', duration: 1.15, ease: 'power1.inOut' },
            1.15,
          )
          .to(znak, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 2.05);

        return () => tl.scrollTrigger?.kill();
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section className="ponuda" ref={root}>
      <div className="ponuda__inner">
        {/* --- lijevo: tegla na krugu, cvijet oko nje, znak u uglu --- */}
        <div className="ponuda__shot">
          {/*
            Crtez i znak su ukras: ono sto tegla jeste vec pise u njenom opisu
            i u imenu pored nje. Znak nosi natpis u samom crtezu, pa mu ime
            stoji u `alt`-u, ne kao slog preko njega.

            Kremasti krug nije zaseban element — dolazi u samom crtezu cvijeta.
            Dok je ovdje stajao i CSS krug, na plohi su se vidjela dva: jedan
            pravilan i jedan koji crtez nosi sa sobom.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ponuda__cvijet"
            src="/images/brand/livadski-cvijet.svg"
            alt=""
            aria-hidden="true"
          />

          {/*
            Obje tegle stoje jedna preko druge i dijele istu osnovicu; izabrana
            je vidljiva, druga na nuli. Prelaz je obicna prozirnost, pa se med
            ne "prekopira" nego pretopi.

            Manja mjera je i manja na slici (84% visine): tegle su izrezane na
            sam sadrzaj, pa im se odnos vidi tacno onako kako i stoje na polici.

            Opis nosi samo izabrana; druga je za citaca ekrana prazna slika,
            inace bi se ime proizvoda cilo dvaput.
          */}
          <div className="ponuda__tegla">
            {stavke.map((s, i) => (
              <Image
                key={s.slug}
                className={`ponuda__staklo${i === izabrana ? ' is-active' : ''}`}
                style={{ height: `${s.visina}%` }}
                src={s.slika}
                alt={i === izabrana ? t.teglaAlt : ''}
                width={560}
                height={972}
                sizes="(max-width: 900px) 54vw, 22vw"
                priority={i === 0}
              />
            ))}
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ponuda__znak" src="/images/brand/okusi-slast-znak.svg" alt={t.znakAlt} />
        </div>

        {/* --- desno: sve sto se cita --- */}
        <div className="ponuda__copy">
          <p className="ponuda__eyebrow">{t.eyebrow}</p>

          <h2 className="ponuda__ime">{t.ime}</h2>

          <dl className="ponuda__cinjenice">
            {t.cinjenice.map((c) => (
              <div key={c.oznaka}>
                <dt>{c.oznaka}</dt>
                <dd>{c.vrijednost}</dd>
              </div>
            ))}
          </dl>

          <p className="ponuda__tekst">{t.tekst}</p>

          {/*
            Obje mjere stoje vidljive odjednom, ne u padajucem izborniku.
            Izabrana je puna, druga prigusena; `aria-pressed` to isto kaze
            citacu ekrana, koji prigusenost ne vidi.
          */}
          <div className="ponuda__izbor">
            <p className="ponuda__biraj" id="ponuda-biraj">
              {t.birajTezinu}
            </p>

            <div className="ponuda__mjere" role="group" aria-labelledby="ponuda-biraj">
              {stavke.map((s, i) => (
                <span key={s.slug} className="ponuda__mjera-red">
                  {i > 0 && (
                    <span className="ponuda__tacka" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <button
                    type="button"
                    className={`ponuda__mjera${i === izabrana ? ' is-selected' : ''}`}
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
