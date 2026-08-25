import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { sorte as copy } from '@/content/sorte';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * "Vrcamo ukus koji traje" — tri sorte na istom papiru.
 *
 * Ranije je ovdje stajala vodoravna traka od tri monumentalna luka: sekcija se
 * pinovala, uspravni skrol je vozio traku ustranu, kartice su imale svaku svoju
 * pozadinu (kremasta, bijela, kremasta), naslove u zlatnom italiku i tackice za
 * listanje. To je bio zaseban mikro-sajt usred strane — drugi ritam, druga
 * paleta, druga tipografija.
 *
 * Sada je otvorena kompozicija: jedna papirna podloga, tri crteza istim
 * mastilom kao hero pejzaz, naslovi istim serifom kao svaki drugi naslov, i
 * rucno crtane linije umjesto okvira. Nema kartica, nema lukova, nema pina —
 * uspravni skrol strane nigdje ne staje.
 *
 * Komponenta vise nije klijentska: nema stanja, nema GSAP-a, nema mjerenja.
 * Ulazak nose iste `reveal` klase kao ostatak strane.
 */

/**
 * Rucno povucena linija. Nije `border`: ravna linija od jednog piksela je
 * jedino mjesto na strani gdje bi se vidjelo da je nesto crtao racunar.
 * `non-scaling-stroke` drzi debljinu na jednom pikselu koliko god se linija
 * razvukla, a `preserveAspectRatio="none"` joj dozvoljava da se razvuce.
 *
 * Oba polozaja stoje u istom omotacu, a CSS bira koji se vidi: razdjelnik
 * izmedju sorti lezi vodoravno na uskom ekranu i stoji uspravno na sirokom.
 * Rotacija ne bi radila — put ide po X osi, pa bi razvucen u usku i visoku
 * kutiju ostao kratka vodoravna crta.
 */
function InkRule({ className }: { className?: string }) {
  return (
    <span className={`ink-rule ${className ?? ''}`} aria-hidden="true">
      <svg className="ink-rule__h" viewBox="0 0 600 10" preserveAspectRatio="none" fill="none">
        <path
          d="M1 5.6C60 3.2 120 7.4 180 5.1s120-2.4 180 .8 120 1.8 180-1.4c20-1.1 40-.4 59 .8"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg className="ink-rule__v" viewBox="0 0 10 600" preserveAspectRatio="none" fill="none">
        <path
          d="M5.6 1C3.2 60 7.4 120 5.1 180s-2.4 120 .8 180 1.8 120-1.4 180c-1.1 20-.4 40 .8 59"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

export default function SorteMeda({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="sorte" aria-labelledby="sorte-naslov">
      <div className="sorte__inner">
        <h2 id="sorte-naslov" className="sorte__heading reveal">
          {t.heading}
        </h2>
        <p className="sorte__lead reveal stagger-1">{t.lead}</p>

        <InkRule className="reveal stagger-2" />

        <div className="sorte__lista">
          {t.sorte.map((s, i) => (
            <div key={s.key} className="sorte__polje">
              {/* Razdjelnik ide ispred svake sorte osim prve: na uskom ekranu
                  lezi vodoravno izmedju njih, na sirokom stoji uspravno. */}
              {i > 0 && <InkRule className="sorte__razdjelnik" />}

              <article className={`sorta reveal stagger-${i + 1}`}>
                <span className="sorta__art" style={{ '--art-scale': s.scale } as React.CSSProperties}>
                  {/*
                   * <img>, ne inline SVG: crtezi su trasirani iz rastera i i
                   * posle sazimanja nose oko 700 KB u tri fajla. Inline bi to
                   * uselilo u sam HTML svake ucitane strane; ovako ih
                   * preglednik kesira odvojeno i drugi put ih ne skida.
                   */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/hero/sorte/${s.key}.svg`} alt={s.alt} loading="lazy" decoding="async" />
                </span>

                <h3 className="sorta__naziv">
                  <Link href={localeHref(locale, `/products/${s.slug}`)}>{s.naziv}</Link>
                </h3>

                <p className="sorta__nota">{s.nota}</p>

                <dl className="sorta__info">
                  {s.redovi.map((r) => (
                    <div key={r.label} className="sorta__red">
                      <dt>{r.label}</dt>
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>
          ))}
        </div>

        <InkRule className="reveal" />

        <Link href={localeHref(locale, '/products')} className="link-quiet sorte__cta reveal">
          {t.cta}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
