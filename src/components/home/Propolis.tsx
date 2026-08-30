'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { home } from '@/content/pages';
import { type Locale } from '@/i18n/config';

import { BRANCH_PATH, BRANCH_VIEWBOX } from './propolisBranch';

/**
 * Propolis: bocica u sredini, grancica iza nje, tri natpisa oko njih.
 *
 * Sekcija se odigra jednom, kad prvi put udje u kadar, i to redom:
 *
 * 1. bocica — izadje iz nicega, s malim uvecanjem;
 * 2. grancica — iscrta se, kao da je neko upravo povlaci;
 * 3. natpisi — red po red, svaki malo iza prethodnog.
 *
 * Redoslijed i trajanja stoje u CSS-u, u zakasnjenjima; ovdje je samo prekidac
 * koji ga pusti. Tako se cijeli slijed cita na jednom mjestu, a ne razbijen
 * izmedju skripte i stila.
 *
 * **Zasto se grancica crta dva puta.** Crtez je stigao kao jedan slozen potez
 * u kojem linije nisu potezi nego tanke popunjene plohe. `stroke-dashoffset`
 * pomjera crticu po potezu — a potez ovdje nema obrisa, ima ispunu, pa nema
 * sta da se pomjera. Zato isti potez ide dvaput: prvo kao tanka kontura koja
 * se povlaci od pocetka do kraja, pa preko nje popunjena ploha koja se upali
 * kad kontura stigne do kraja. Podaci o potezu stoje jednom, u `defs`, a oba
 * sloja su `use` nad njima — inace bi ista dva megabajta stajala dva puta.
 */
export default function Propolis({ locale }: { locale: Locale }) {
  const t = home.propolis[locale];
  const root = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el || shown) return;

    /*
     * Ko je iskljucio animacije u sistemu dobija sekciju odmah ispisanu, bez
     * cekanja da udje u kadar: nema sta da se odigra, pa nema ni razloga da
     * bilo sta stoji sakriveno.
     */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShown(true);
        observer.disconnect();
      },
      /*
       * Trazi se cetvrtina sekcije u kadru, ne prvi piksel: slijed traje oko
       * tri sekunde i dobar dio njega bi se inace odigrao ispod ruba ekrana.
       */
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <section className={`propolis${shown ? ' is-drawn' : ''}`} ref={root}>
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
          Naslov se ne vidi — na crtezu sekcije ga nema, ime proizvoda stoji na
          samoj etiketi. Ostaje u slogu za citac ekrana i za strukturu strane:
          sekcija bez naslova je za njega samo gomila recenica bez imena.
        */}
        <h2 className="sr-only">{t.heading}</h2>

        {/*
          Tri natpisa oko bocice. Svaki nosi svoju isprekidanu vezu ka njoj —
          kratak potez, pa stoji ovdje a ne u fajlu; ukras je i ne cita se.
        */}

        <div className="propolis__note propolis__note--lead">
          {t.lead.map((line, i) => (
            <p className="propolis__line" style={{ '--i': i + 1 } as React.CSSProperties} key={line}>
              {line}
            </p>
          ))}
        </div>

        <div className="propolis__note propolis__note--use">
          {t.use.map((line, i) => (
            <p className="propolis__line" style={{ '--i': i + 1 } as React.CSSProperties} key={line}>
              {line}
            </p>
          ))}
        </div>

        <div className="propolis__note propolis__note--benefits">
          <ul className="propolis__list">
            {t.benefits.map((line, i) => (
              <li
                className="propolis__line"
                style={{ '--i': i + 1 } as React.CSSProperties}
                key={line}
              >
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
