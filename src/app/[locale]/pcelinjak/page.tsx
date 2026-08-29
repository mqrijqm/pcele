import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Testimonials from '@/components/home/Testimonials';
import BeeFlight from '@/components/bee/BeeFlight';
import { pcelinjak } from '@/content/pcelinjak';
import { isLocale, localeHref, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: pcelinjak[l].meta.title, description: pcelinjak[l].meta.description };
}

/**
 * Nasi pcelinjaci.
 *
 * Raspored je preuzet sa strane o vinogradima na moncalisse.com: niz traka
 * razlicite sirine preko iste mreze od dvadeset i cetiri kolone, uvijek u
 * istom odnosu — sitan natpis, krupan naslov, tekst u uzem stupcu, pa slika
 * koja se prosiri preko svega. Odatle su i mjere: sirinska skala (usko /
 * normalno / siroko), razmaci u odnosu 1:2:4, i tipografska skala 75/60/45.
 *
 * Preuzet je raspored, ne sadrzaj. Nijedna rijec i nijedna slika nisu odande.
 *
 * Mjesto ilustracije u heroju je namjerno prazno — ceka crtez.
 */
export default async function PcelinjakPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = pcelinjak[locale];

  return (
    <div className="pcl header-offset">
      <BeeFlight />

      {/* --- heroj: natpis, naslov, jedna recenica ---------------------- */}
      <section className="strip strip--normal pcl__hero">
        <div className="strip__inner">
          <p className="strip__pretitle">{t.hero.pretitle}</p>
          <h1 className="strip__title1">{t.hero.title}</h1>
          <p className="strip__lead">{t.hero.lead}</p>
        </div>

        {/*
          Mjesto crteza pcelinjaka. Stoji prazno dok crtez ne stigne, ali drzi
          svoju visinu — da se strana ne prelomi kad ga bude.
        */}
        <div className="pcl__plate" aria-hidden="true" />
      </section>

      {/* --- uvod: natpis i naslov lijevo, tekst u desnoj polovini ------ */}
      <section className="strip strip--normal strip--columns mb-xl">
        <div className="strip__inner strip__cols">
          <div>
            <p className="strip__pretitle">{t.uvod.pretitle}</p>
            <h2 className="strip__title2">{t.uvod.title}</h2>
          </div>
          <div className="strip__copy">
            {t.uvod.body.map((par) => (
              <p key={par.slice(0, 24)}>{par}</p>
            ))}
          </div>
        </div>
      </section>

      {/* --- siroka traka: tri snimka preko cijele mjere ---------------- */}
      <section className="strip strip--wide mb-lg">
        <div className="pcl__band">
          <figure className="pcl__shot">
            <Image
              src="/images/pcelinjak/kosnice-blizu.webp"
              alt={t.prica.altB}
              width={1800}
              height={1200}
              sizes="(max-width: 900px) 90vw, 46vw"
            />
          </figure>
          <figure className="pcl__shot pcl__shot--tall">
            <Image
              src="/images/pcelinjak/tegle-ograda.webp"
              alt={t.prica.altA}
              width={1400}
              height={1749}
              sizes="(max-width: 900px) 60vw, 26vw"
            />
          </figure>
          <figure className="pcl__shot">
            <Image
              src="/images/pcelinjak/kosnice-hlad.webp"
              alt={t.mjesta.lista[2].alt}
              width={1800}
              height={1547}
              sizes="(max-width: 900px) 90vw, 30vw"
            />
          </figure>
        </div>
      </section>

      {/* --- istaknuti pcelinjak: tekst lijevo, snimak desno ------------ */}
      <section className="strip strip--normal mb-xl">
        <div className="strip__inner">
          <div className="pcl__feature">
            <div className="pcl__featureCopy">
              <p className="strip__pretitle">{t.istaknuti.pretitle}</p>
              <h2 className="strip__title3">{t.istaknuti.title}</h2>
              <p>{t.istaknuti.body}</p>
            </div>
            <figure className="pcl__featureShot">
              <Image
                src="/images/pcelinjak/kosnice-livada.webp"
                alt={t.istaknuti.alt}
                width={1800}
                height={1350}
                sizes="(max-width: 900px) 90vw, 42vw"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* --- tri pcelinjaka -------------------------------------------- */}
      <section className="strip strip--narrow mb-lg">
        <div className="strip__inner">
          <p className="strip__pretitle">{t.mjesta.pretitle}</p>
          <h2 className="strip__title2">{t.mjesta.title}</h2>
        </div>
      </section>

      <section className="strip strip--normal mb-xl">
        <ul className="pcl__places">
          {t.mjesta.lista.map((mjesto) => (
            <li className="pcl__place" key={mjesto.key}>
              <figure className="pcl__placeShot">
                <Image
                  src={mjesto.slika}
                  alt={mjesto.alt}
                  width={1800}
                  height={1350}
                  sizes="(max-width: 900px) 90vw, 30vw"
                />
              </figure>
              <h3 className="strip__title4">{mjesto.naziv}</h3>
              <dl className="pcl__rows">
                {mjesto.redovi.map((red) => (
                  <div className="pcl__row" key={red.label}>
                    <dt>{red.label}</dt>
                    <dd>{red.value}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </section>

      {/* --- prica: naslov lijevo, tekst desno -------------------------- */}
      <section className="strip strip--normal strip--columns mb-lg">
        <div className="strip__inner strip__cols">
          <h2 className="strip__title2">{t.prica.title}</h2>
          <div className="strip__copy">
            {t.prica.body.map((par) => (
              <p key={par.slice(0, 24)}>{par}</p>
            ))}
          </div>
        </div>
      </section>

      {/* --- jedan snimak preko mjere ----------------------------------- */}
      <section className="strip strip--normal strip--image mb-xl">
        <figure className="pcl__wide">
          <Image
            src="/images/pcelinjak/tegla-brdo.webp"
            alt={t.zavrsna.alt}
            width={1400}
            height={1749}
            sizes="(max-width: 900px) 100vw, 78vw"
          />
        </figure>
      </section>

      <Testimonials locale={locale} />

      {/* --- poziv ------------------------------------------------------ */}
      <section className="strip strip--narrow pcl__cta">
        <div className="strip__inner">
          <p className="strip__pretitle">{t.poziv.pretitle}</p>
          <h2 className="strip__title3">{t.poziv.title}</h2>
          <p className="pcl__ctaLinks">
            <Link className="pcl__button" href={localeHref(locale, '/contact')}>
              {t.poziv.cta}
            </Link>
            <Link className="pcl__button pcl__button--quiet" href={localeHref(locale, '/products')}>
              {t.poziv.ctaSecondary}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
