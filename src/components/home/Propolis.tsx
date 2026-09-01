'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TransitionLink from '@/components/ui/TransitionLink';
import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

import { BRANCH_PATH, BRANCH_VIEWBOX } from './propolisBranch';

gsap.registerPlugin(ScrollTrigger);

/**
 * Propolis: bocica u sredini, grancica iza nje, tri natpisa oko njih.
 *
 * Sekcija je visoka vise ekrana, a scena u njoj je `position: sticky`. Dok
 * strana ide dalje, slika stoji na mjestu i skrol je ne nosi nego je ispisuje —
 * strana kao da je stala da se sve moze pogledati. Nema pina; sticky to radi
 * bez diranja rasporeda, sto je uz Lenis mirnije. Isti mehanizam nose heroj s
 * teglom i album.
 *
 * Redoslijed je taj koji skrol otkljucava:
 *
 * 1. bocica — izadje iz nicega, s malim uvecanjem;
 * 2. grancica — iscrta se, kao da je neko upravo povlaci;
 * 3. natpis gore lijevo, red po red, pa njegova isprekidana veza;
 * 4. natpis desno, pa njegova veza;
 * 5. natpis dolje lijevo, pa njegova.
 *
 * Svaki natpis dobije svoju vezu prije nego sto krene sljedeci: veza pokazuje
 * odakle je slog dosao, a pokazivati na slog kojeg jos nema nema sta.
 *
 * **Zasto se grancica crta dva puta.** Crtez je stigao kao jedan slozen potez
 * u kojem linije nisu potezi nego tanke popunjene plohe. `stroke-dashoffset`
 * pomjera crticu po potezu — a potez ovdje nema obrisa, ima ispunu, pa nema
 * sta da se pomjera. Zato isti potez ide dvaput: prvo kao tanka kontura koja
 * se povlaci od pocetka do kraja, pa preko nje popunjena ploha koja se upali
 * kad kontura stigne do kraja. Podaci o potezu stoje jednom, u `defs`, a oba
 * sloja su `use` nad njima — inace bi ista dva megabajta stajala dva puta.
 */

/**
 * Gdje u skrolu sekcije pada koji korak, kao dio puta kroz nju.
 *
 * Cio slijed stoji na jednom mjestu i cita se odozgo nadolje kako se i
 * odigrava. Poslije zadnjeg koraka ostaje jos malo puta — da se sva tri
 * natpisa vide zajedno prije nego sto scena krene dalje.
 */
const BEAT = {
  bottle: [0, 0.1],
  trace: [0.08, 0.38],
  ink: [0.36, 0.44],
  lead: [0.46, 0.55],
  leadThread: [0.55, 0.6],
  use: [0.62, 0.71],
  useThread: [0.71, 0.76],
  benefits: [0.78, 0.87],
  benefitsThread: [0.87, 0.92],
  /*
   * Znak dolazi posljednji, kad je sve ostalo vec ispisano — on je pecat na
   * gotovu scenu, ne dio nje. Zato mu korak pocinje tek kad zadnja nit sjedne,
   * i traje do samog kraja puta kroz sekciju.
   */
  stamp: [0.93, 1],
} as const;

/** Puna vidljivost popunjene grancice. Ona je podloga, ne slika. */
const INK = 0.55;

export default function Propolis({ locale }: { locale: Locale }) {
  const t = home.propolis[locale];
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const mm = gsap.matchMedia();

      /*
       * Ko je iskljucio animacije, i telefon na kojem je sve slozeno jedno pod
       * drugim, dobijaju sekciju ispisanu. Na uskom ekranu scena nije lijepljena
       * pa nema ni puta po kojem bi se ispisivala; ostaviti je sakrivenu znacilo
       * bi da se tamo ne vidi nikad.
       */
      mm.add('(prefers-reduced-motion: reduce), (max-width: 900px)', () => {
        gsap.set(q('.propolis__bottle'), { opacity: 1, y: 0, scale: 1 });
        gsap.set(q('.propolis__ink'), { opacity: INK });
        gsap.set(q('.propolis__trace'), { opacity: 0 });
        gsap.set(q('.propolis__line'), { opacity: 1, y: 0 });
        gsap.set(q('.propolis__thread'), { opacity: 1 });
        gsap.set(q('.propolis__znak'), { opacity: 1, scale: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        /* Korak s liste, na svoje mjesto u putu — pocetak i trajanje iz `BEAT`. */
        const at = (
          beat: readonly [number, number],
          target: gsap.TweenTarget,
          vars: gsap.TweenVars,
        ) => tl.to(target, { ...vars, duration: beat[1] - beat[0] }, beat[0]);

        /*
         * Redovi jednog natpisa, jedan za drugim, ali tako da cijela grupa
         * stane u svoj korak.
         *
         * Razmak medju redovima se racuna iz duzine koraka, ne zadaje rukom: sa
         * zadatim razmakom duzim od koraka drugi red krece tek kad je korak vec
         * prosao, ostatak slijeda se pomjeri za toliko, i cio put kroz sekciju
         * se stisne u prvu polovinu.
         */
        const linesIn = (beat: readonly [number, number], note: string) => {
          const targets = q(`.propolis__note--${note} .propolis__line`);
          const span = beat[1] - beat[0];
          const each = span / 2;
          const gap = targets.length > 1 ? (span - each) / (targets.length - 1) : 0;
          return tl.to(
            targets,
            { opacity: 1, y: 0, duration: each, stagger: gap },
            beat[0],
          );
        };

        at(BEAT.bottle, q('.propolis__bottle'), { opacity: 1, y: 0, scale: 1 });

        /*
         * Kontura se ne povlaci preko `strokeDashoffset` nego preko broja koji
         * se sam upisuje.
         *
         * GSAP na ovom svojstvu ne racuna medjukorake — upise pocetnu pa
         * krajnju vrijednost i kontura preskoci iz praznog u ispisano. Ovako se
         * animira obican broj, a upis je nas: jedno svojstvo, jedan element, i
         * nema sta da se ne prepozna.
         */
        const drawn = { at: 1 };
        const trace = q('.propolis__trace')[0] as SVGElement | undefined;
        at(BEAT.trace, drawn, {
          at: 0,
          onUpdate: () => trace?.style.setProperty('stroke-dashoffset', String(drawn.at)),
        });
        at(BEAT.ink, q('.propolis__ink'), { opacity: INK });
        at(BEAT.ink, q('.propolis__trace'), { opacity: 0 });

        linesIn(BEAT.lead, 'lead');
        at(BEAT.leadThread, q('.propolis__thread--lead'), { opacity: 1 });

        linesIn(BEAT.use, 'use');
        at(BEAT.useThread, q('.propolis__thread--use'), { opacity: 1 });

        linesIn(BEAT.benefits, 'benefits');
        at(BEAT.benefitsThread, q('.propolis__thread--benefits'), { opacity: 1 });

        gsap.set(q('.propolis__znak'), { opacity: 0, scale: 0.72 });
        at(BEAT.stamp, q('.propolis__znak'), { opacity: 1, scale: 1, ease: 'back.out(1.5)' });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="propolis" ref={root}>
      <div className="propolis__stage">
        <div className="propolis__scene">
          {/* Grancica: lezi iza bocice i ne nosi znacenje koje se cita. */}
          <svg
            className="propolis__branch"
            viewBox={BRANCH_VIEWBOX}
            role="img"
            aria-label={t.branchAlt}
            focusable="false"
          >
            <defs>
              {/*
                `pathLength` normalizuje duzinu poteza na jedinicu, pa crtanje
                ide isto bez obzira koliko je crtez velik na ekranu.
              */}
              <path id="propolis-branch" d={BRANCH_PATH} pathLength={1} />
            </defs>

            <use className="propolis__trace" href="#propolis-branch" />
            <use className="propolis__ink" href="#propolis-branch" />
          </svg>

          <div className="propolis__bottle">
            <Image
              src="/images/real/propolis-bocica.webp"
              alt={t.bottleAlt}
              width={373}
              height={1275}
              sizes="(max-width: 900px) 46vw, 18vw"
            />
          </div>

          {/*
            Pecat na kraju: dolazi kad se scena ispise, i vodi na proizvode.

            Natpis je u samom crtezu, pa slika nema `alt` — ime veze nosi
            `aria-label`, koji kaze i sta na znaku pise i kuda vodi. Da su oba
            stajala, citac ekrana bi ime procitao dvaput.

            Najtamniji od tri: bocica u sredini je tamna, pa pecat uz nju mora
            biti istog reda — zlatni se na papiru gubio uz nju.
          */}
          <TransitionLink
            className="propolis__znak pecat"
            href={localeHref(locale, '/products')}
            aria-label={`${t.znakAlt} — ${home.znakCta[locale]}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/pecat-okusi-tamni.svg" alt="" aria-hidden="true" />
          </TransitionLink>

          {/*
            Naslov se ne vidi — na crtezu sekcije ga nema, ime proizvoda stoji na
            samoj etiketi. Ostaje u slogu za citac ekrana i za strukturu strane:
            sekcija bez naslova je za njega samo gomila recenica bez imena.
          */}
          <h2 className="sr-only">{t.heading}</h2>

          <div className="propolis__note propolis__note--lead">
            {t.lead.map((line) => (
              <p className="propolis__line" key={line}>
                {line}
              </p>
            ))}
          </div>

          <div className="propolis__note propolis__note--use">
            {t.use.map((line) => (
              <p className="propolis__line" key={line}>
                {line}
              </p>
            ))}
          </div>

          <div className="propolis__note propolis__note--benefits">
            <ul className="propolis__list">
              {t.benefits.map((line) => (
                <li className="propolis__line" key={line}>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/*
            Tri isprekidane veze: od svakog natpisa ka crtezu. Nisu djeca
            natpisa nego stoje u sceni, na svojim mjerama — kutija natpisa je
            sira od sloga u njoj, pa bi vezana za nju svaka veza pala drugdje.
          */}
          <Thread className="propolis__thread--lead" flip />
          <Thread className="propolis__thread--use" />
          <Thread className="propolis__thread--benefits" />
        </div>
      </div>
    </section>
  );
}

/**
 * Isprekidana veza od natpisa ka crtezu.
 *
 * Jedna te ista kriva iz crteza, u svojim mjerama. Sama se penje nadesno; dva
 * natpisa je nose takvu, a gornji lijevi je okrece naopako, jer njegova veza
 * pada nadolje. Zato `flip` ogleda po visini, a ne po sirini — ogledana po
 * sirini bi kriva pocela tamo gdje treba da zavrsi.
 *
 * Potez se skalira zajedno sa krivom, bez `non-scaling-stroke`: na mjeri koju
 * veza ima u sceni to je oko dva piksela. Sa stalnom debljinom su crtice bile
 * dvaput deblje nego na crtezu i citale su se kao potez, ne kao trag.
 */
function Thread({ className, flip = false }: { className: string; flip?: boolean }) {
  return (
    <svg
      className={`propolis__thread${flip ? ' propolis__thread--flip' : ''} ${className}`}
      viewBox="0 0 235 119"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M232.585 1.05196C163.654 112.48 114.392 138.932 0.673641 98.2533"
        stroke="currentColor"
        strokeWidth={4}
        strokeDasharray="8 8"
      />
    </svg>
  );
}
