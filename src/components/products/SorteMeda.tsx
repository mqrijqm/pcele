import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import InkRule from '@/components/ui/InkRule';
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
