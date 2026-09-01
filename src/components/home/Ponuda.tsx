'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TransitionLink from '@/components/ui/TransitionLink';
import { home } from '@/content/pages';
import { products } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/** Jedna mjera: sta pise u katalogu, koja je slika i koliko je tegla visoka. */
type Mjera = {
  /**
   * Kljuc u katalogu. Naslovi mjera se ne pisu ovdje nego se uzimaju odatle —
   * iz istog izvora iz kojeg ih cita i webshop, da se natpis na sekciji ne
   * moze razici s onim u korpi.
   */
  slug: string;
  slika: string;
  /** Visina tegle u postotku sanduka; manja mjera je i na slici manja. */
  visina: number;
};

/**
 * Sve po cemu se jedna sorta razlikuje od druge.
 *
 * Sekcija je jedna komponenta koja se puni dvaput, pa ovdje stoji samo ono sto
 * se mijenja: rijeci, crtez, tegle, ploha i strana na kojoj je slog. Nista o
 * rasporedu — to zna sekcija.
 *
 * Cijene se ne prikazuju ni u jednoj. Sekcija predstavlja med, ne prodaje ga:
 * ovdje stoje ime, mjere i ono po cemu se med prepoznaje, a broj i dugme su na
 * strani proizvoda, gdje se i kupuje.
 */
type Sorta = {
  /** Iz kojeg polja u `content/pages` dolaze rijeci. */
  copy: 'ponuda' | 'bagremov';
  mjere: ReadonlyArray<Mjera>;
  /** Botanicki crtez; krug iza tegle dolazi u samom fajlu, nije zaseban sloj. */
  crtez: string;
  /**
   * Okrugli znak "Okusi slast". Isti crtez u tri jacine — svaka sekcija uzima
   * onu koja se na njenoj plohi najbolje drzi.
   */
  znak: string;
  /**
   * Ploha sekcije: `med` je puna medena, `krem` papir. Sorte se smjenjuju, da
   * se pri skrolu kroz niz vidi gdje jedna prestaje a druga pocinje.
   */
  ton: 'med' | 'krem';
  /**
   * Uobicajeno je vizual lijevo i slog desno; `true` ih zamjenjuje. Susjedne
   * sorte stoje jedna nasuprot druge, da niz ne bude niz istih strana.
   */
  obrnuto: boolean;
};

export const SORTE = {
  livadski: {
    copy: 'ponuda',
    mjere: [
      { slug: 'livadski-med-1kg', slika: '/images/proizvodi/tegla-1kg.webp', visina: 100 },
      { slug: 'livadski-med-500g', slika: '/images/proizvodi/tegla-500g.webp', visina: 84 },
    ],
    crtez: '/images/brand/livadski-cvijet.svg',
    /* Srednji od tri: medena ploha trazi jaci ton od zlatnog, ali ne najtamniji. */
    znak: '/images/brand/pecat-okusi-oker.svg',
    ton: 'med',
    obrnuto: false,
  },
  bagremov: {
    copy: 'bagremov',
    mjere: [
      { slug: 'bagremov-med-1kg', slika: '/images/proizvodi/tegla-bagrem-1kg.webp', visina: 100 },
      { slug: 'bagremov-med-500g', slika: '/images/proizvodi/tegla-bagrem-500g.webp', visina: 84 },
    ],
    crtez: '/images/brand/bagremov-grana.svg',
    /*
     * Zlatni: sekcija je sva u papiru i zlatnom slogu, pa pecat ostaje u istom
     * tonu kao ime i mjere umjesto da bude jedina tamna mrlja u njoj.
     */
    znak: '/images/brand/pecat-okusi-zlatni.svg',
    ton: 'krem',
    obrnuto: true,
  },
} as const satisfies Record<string, Sorta>;

/**
 * Jedna sorta meda: tegla, botanicki crtez oko nje, i sve sto se o njoj cita.
 *
 * Ista komponenta nosi i livadski i bagremov — razlikuju se rijecima, crtezom,
 * plohom i stranom na kojoj stoji slog. Sve to je u `SORTE` gore; ovdje je
 * samo kako se slaze.
 *
 * **Dvije kolone.** S jedne strane tegla na krugu, s botanickim crtezom koji
 * izlazi izvan njega i znakom u uglu; s druge sve sto se cita. Crtez nikad ne
 * ide iza sloga — linija bi prosla kroz slova.
 *
 * **Slog.** Ono sto se cita ide u serif kojim je pisan cio sajt: ime i mjere.
 * U sans ostaje ono sto se ne cita nego ocitava — nadnaslov, oznake cinjenica,
 * poziv na izbor mjere i sam opis.
 *
 * **Boje.** Livadski stoji na punoj medenoj plohi: ime je u mastilu, ostalo u
 * tise od njega, a krem se pojavljuje samo kao ploha kruga i u znaku. Bagremov
 * je obrnut — papir nosi sekciju, ime i mjere su zlatni, a med je krug iza
 * tegle. Dvije sekcije razmjenjuju iste dvije boje.
 *
 * **Sekcija se zaustavi.** Na sirokom ekranu je pinovana: kad dodje na vrh
 * kadra, strana stane i skrol umjesto nje otkriva sekciju — tegla, pa slog, pa
 * crtez, pa znak. Dalje se ide tek kad je sve na svom mjestu. Vidi `useEffect`
 * nize i `.ponuda__stage` u `globals.css`.
 */
export default function Ponuda({
  locale,
  sorta = 'livadski',
}: {
  locale: Locale;
  sorta?: keyof typeof SORTE;
}) {
  const { copy, mjere, crtez, znak, ton, obrnuto } = SORTE[sorta];
  const t = home[copy][locale];
  const root = useRef<HTMLElement>(null);

  /* Veca mjera je unaprijed izabrana. */
  const [izabrana, setIzabrana] = useState(0);

  /*
   * Obje sorte stoje na istoj strani, pa `id` ne moze biti konstanta: dva ista
   * `id`-a bi znacila da citac ekrana za obje grupe mjera cita isti natpis.
   */
  const birajId = `ponuda-biraj-${sorta}`;

  const stavke = mjere.map((m) => {
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
   * **Otkrivanje je vezano za skrol, ne za vrijeme.** Sekcija je pinovana (vidi
   * `.ponuda__stage` u `globals.css`): drzi kadar i ne pusta stranu dalje dok
   * se ne otkrije. Prije ovoga je otkrivanje bilo traka od dvije i po sekunde
   * koja krene kad sekcija udje u kadar — ko skrola brzo, prosao bi pored
   * cvijeta koji se jos crta.
   *
   * **Ko je iskljucio kretanje** dobija sve odmah i na svom mjestu, bez pina.
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

      /*
       * Pocetno stanje: sve sakriveno, crtez neiscrtan.
       *
       * Brisanje ide od one strane s koje crtez i "raste". Kamilica livadskog
       * stoji lijevo od tegle pa se otvara slijeva; bagremova grana ulazi s
       * desne strane i cvat joj visi ulijevo, pa se otvara zdesna. Da su obje
       * isle istim smjerom, na bagremu bi se prvo pojavili vrhovi cvata a
       * grana koja ih drzi tek na kraju.
       */
      const zatvoren = obrnuto ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
      const otvoren = obrnuto ? 'inset(0 0 0 0%)' : 'inset(0 0% 0 0)';

      const sakrij = () => {
        gsap.set(tegla, { opacity: 0, y: 46 });
        gsap.set(cvijet, { opacity: 1, clipPath: zatvoren });
        gsap.set(znak, { opacity: 0, scale: 0.7 });
        gsap.set(slog, { opacity: 0, y: 22 });
      };

      /*
       * Tegla, pa slog, pa crtez iza tegle, pa znak.
       *
       * Crtez namjerno dolazi poslije sloga: on je pozadina, a pozadina koja
       * udje prva navuce pogled na sebe i tegla se u njoj izgubi. Ovako se
       * prvo vidi sta se prodaje, pa sta o tome pise, pa tek onda oko cega to
       * stoji.
       *
       * Trajanja su odnosi, ne sekunde: kad traku vodi skrol, one govore samo
       * koliki dio puta uzima koji korak.
       */
      const otkrivanje = (vars: gsap.TimelineVars) => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, ...vars });

        tl.to(tegla, { opacity: 1, y: 0, duration: 0.85 })
          .to(slog, { opacity: 1, y: 0, duration: 0.62, stagger: 0.09 }, 0.5)
          .to(cvijet, { clipPath: otvoren, duration: 1.15, ease: 'power1.inOut' }, 1.15)
          .to(znak, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 2.05);

        return tl;
      };

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([tegla, znak, ...slog], { opacity: 1, y: 0, scale: 1 });
        gsap.set(cvijet, { opacity: 1, clipPath: otvoren });
      });

      /*
       * Sirok ekran: sekcija stoji, skrol otkriva.
       *
       * Uslov je isti kao u CSS-u koji pin postavlja — da se ne desi da JS
       * vodi traku skrolom dok sekcija u stvari prolazi kroz kadar.
       *
       * Pin traje tacno onoliko koliko je sekcija visa od kadra; otkrivanje
       * uzima 65% toga, a ostatak sekcija stoji mirno da se otkriveni raspored
       * vidi prije nego strana krene dalje. Mjeri se funkcijom, ne brojem:
       * `invalidateOnRefresh` je zove iznova na svaku promjenu prozora.
       */
      mm.add(
        '(prefers-reduced-motion: no-preference) and (min-width: 901px) and (min-height: 640px)',
        () => {
          sakrij();

          const tl = otkrivanje({
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: () => `+=${(el.offsetHeight - window.innerHeight) * 0.65}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      /*
       * Uzak ili nizak prozor: bez pina — sadrzaj tu ne stane u kadar, pa bi
       * mu pinovana pozornica odsjekla dno. Otkrivanje ide svojim tempom kad
       * sekcija udje u kadar, kako je i bilo.
       */
      mm.add(
        '(prefers-reduced-motion: no-preference) and (max-width: 900px), (prefers-reduced-motion: no-preference) and (max-height: 639px)',
        () => {
          sakrij();

          const tl = otkrivanje({
            scrollTrigger: { trigger: el, start: 'top 72%', once: true },
          });

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [locale, obrnuto]);

  return (
    <section
      className={`ponuda ponuda--${ton}${obrnuto ? ' ponuda--obrnuta' : ''}`}
      ref={root}
    >
      {/*
        Pozornica: na sirokom ekranu se lijepi za vrh kadra i drzi stranu dok
        se sekcija ne otkrije. Sve sto se vidi stoji u njoj — sekcija je samo
        visina kroz koju se skrola.
      */}
      <div className="ponuda__stage">
        <div className="ponuda__inner">
          {/* --- vizual: tegla na krugu, crtez oko nje, znak u uglu --- */}
          <div className="ponuda__shot">
            {/*
              Crtez i znak su ukras: ono sto tegla jeste vec pise u njenom opisu
              i u imenu pored nje. Znak nosi natpis u samom crtezu, pa mu ime
              stoji u `alt`-u, ne kao slog preko njega.

              Krug iza tegle nije zaseban element — dolazi u samom crtezu. Dok
              je ovdje stajao i CSS krug, na plohi su se vidjela dva: jedan
              pravilan i jedan koji crtez nosi sa sobom.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ponuda__cvijet" src={crtez} alt="" aria-hidden="true" />

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

            {/*
              Znak vodi na proizvode. Natpis je u samom crtezu, pa slika nema
              `alt` — ime veze nosi `aria-label`, koji kaze i sta na znaku pise
              i kuda vodi. Da su oba stajala, citac ekrana bi ga cuo dvaput.
            */}
            <TransitionLink
              className="ponuda__znak pecat"
              href={localeHref(locale, '/products')}
              aria-label={`${t.znakAlt} — ${home.znakCta[locale]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={znak} alt="" aria-hidden="true" />
            </TransitionLink>
          </div>

          {/* --- slog: sve sto se cita --- */}
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
              <p className="ponuda__biraj" id={birajId}>
                {t.birajTezinu}
              </p>

              <div className="ponuda__mjere" role="group" aria-labelledby={birajId}>
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
      </div>
    </section>
  );
}
