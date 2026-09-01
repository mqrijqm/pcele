import TransitionLink from '@/components/ui/TransitionLink';
import { ArrowUpRight } from 'lucide-react';

import InkRule from '@/components/ui/InkRule';
import { sorte as copy } from '@/content/sorte';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * Tri sorte na istom papiru.
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
 * Naslova i uvoda nema: sekcija se predstavlja crtezima, a ne recenicom o
 * sebi.
 *
 * Ulazak ide redom, ne odjednom — prvo se povuce gornja linija, pa udje cvijet
 * sa livadskim, pa razdjelnik, pa bagrem, i tako do kraja. Kasnjenja stoje u
 * `style`, a ne u `stagger-` klasama, jer su ovdje koraci mnogo duzi nego
 * inace na strani: ovo je smjena scena, ne kaskada susjeda.
 *
 * Komponenta i dalje nije klijentska: cijeli ulazak nose CSS prelazi koje
 * pali `RevealObserver`, a lebdenje je CSS animacija.
 */

/**
 * Koliko se ceka na svaki korak ulaska, u sekundama.
 *
 * Korak je 0.6 s, a sam prelaz traje 0.95 s — taman da se dvije susjedne sorte
 * preklope za trecinu, pa se smjena osjeti kao jedan pokret a ne kao tri
 * odvojena. Na 0.4 s se citalo kao da su usle zajedno.
 */
const KORAK = {
  gornjaLinija: 0,
  sorta: (i: number) => 0.35 + i * 0.6,
  razdjelnik: (i: number) => 0.15 + i * 0.6,
  donjaLinija: 2,
  dugme: 2.25,
};

const delay = (s: number) => ({ transitionDelay: `${s}s` });

/*
 * Linija ne kasni istim putem kao ostalo: prelaz joj stoji na samom potezu
 * unutar SVG-a, pa kasnjenje mora da stigne dotle kao naslijedjena
 * promjenljiva. `transitionDelay` uz nju stoji samo da `RevealObserver` zna da
 * je kasnjenje vec rijeseno rukom i da ne dopisuje svoje.
 */
const drawDelay = (s: number) =>
  ({ transitionDelay: `${s}s`, '--draw-delay': `${s}s` }) as React.CSSProperties;

export default function SorteMeda({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="sorte" aria-label={t.srHeading}>
      <div className="sorte__inner">
        <InkRule className="reveal-draw" style={drawDelay(KORAK.gornjaLinija)} />

        <div className="sorte__lista">
          {t.sorte.map((s, i) => (
            <div key={s.key} className="sorte__polje">
              {/* Razdjelnik ide ispred svake sorte osim prve: na uskom ekranu
                  lezi vodoravno izmedju njih, na sirokom stoji uspravno. */}
              {i > 0 && (
                <InkRule
                  className="sorte__razdjelnik reveal-draw"
                  style={drawDelay(KORAK.razdjelnik(i))}
                />
              )}

              <article className="sorta reveal" style={delay(KORAK.sorta(i))}>
                <span
                  className="sorta__art"
                  style={
                    {
                      '--art-scale': s.scale,
                      '--float-dur': `${s.float}s`,
                      // Lebdenje krece tek kad crtez udje, da ne bude na pola
                      // udaha u trenutku kad ga prvi put vidis.
                      '--float-delay': `${KORAK.sorta(i)}s`,
                    } as React.CSSProperties
                  }
                >
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
                  <TransitionLink href={localeHref(locale, `/products/${s.slug}`)}>{s.naziv}</TransitionLink>
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

        <InkRule className="reveal-draw" style={drawDelay(KORAK.donjaLinija)} />

        <TransitionLink
          href={localeHref(locale, '/products')}
          className="link-quiet sorte__cta reveal"
          style={delay(KORAK.dugme)}
        >
          {t.cta}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </TransitionLink>
      </div>
    </section>
  );
}
