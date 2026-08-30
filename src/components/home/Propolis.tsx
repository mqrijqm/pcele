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
          <Connector className="propolis__thread propolis__thread--lead" flip />
        </div>

        <div className="propolis__note propolis__note--use">
          {t.use.map((line, i) => (
            <p className="propolis__line" style={{ '--i': i + 1 } as React.CSSProperties} key={line}>
              {line}
            </p>
          ))}
          <Connector className="propolis__thread propolis__thread--use" />
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
          <Connector className="propolis__thread propolis__thread--benefits" flip />
        </div>
      </div>
    </section>
  );
}

/**
 * Isprekidana veza od natpisa ka bocici.
 *
 * Jedna kriva iz crteza, u svojim mjerama. `flip` je okrece naopako — dva
 * natpisa lijevo od bocice vezu vuku nadolje, onaj desno nagore, a kriva je
 * ista.
 */
function Connector({ className, flip = false }: { className: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 60"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d={flip ? 'M236 4C210 52 160 62 4 44' : 'M236 56C210 8 160 -2 4 16'}
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="8 10"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
