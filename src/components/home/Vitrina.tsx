import Image from 'next/image';
import Link from 'next/link';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * Vitrina: uokviren snimak na medenom pojasu.
 *
 * Fotografija stoji u sredini, u cipkanom okviru, a recenica je oko nje —
 * lijeva polovina lijevo, desna desno. Cita se preko slike, ne pored nje.
 *
 * Okvir nije upecen u sliku nego stoji nad njom, kao poseban crtez. Tako
 * ostaje ostar na svakom ekranu i fotografija se moze zamijeniti a da se
 * okvir ne dira. Snimak je uvucen sest posto sa svake strane, pa mu rub ulazi
 * pod cipku i nigdje se ne vidi gdje jedno prestaje a drugo pocinje.
 *
 * Pecat sjedi na donjem desnom uglu okvira i vodi na proizvode — jedini je
 * ovdje sto se moze kliknuti. Rijec u njemu je nacrtana, savijena u luk, pa
 * je ne moze procitati niko: zato ista ta rijec stoji i kao `aria-label`.
 */
export default function Vitrina({ locale }: { locale: Locale }) {
  const t = home.vitrina[locale];

  return (
    <section className="vitrina" aria-label={`${t.headingLeft} ${t.headingRight}`}>
      <div className="vitrina__inner">
        <div className="vitrina__side vitrina__side--left reveal">
          <h2 className="vitrina__heading">{t.headingLeft}</h2>
          <p className="vitrina__eyebrow">{t.eyebrowLeft}</p>
          <p className="vitrina__body">{t.body}</p>
        </div>

        <div className="vitrina__stage reveal stagger-1">
          <figure className="vitrina__frame">
            <Image
              src="/images/med/tegle-ograda-red.webp"
              alt={t.alt}
              width={1122}
              height={1402}
              sizes="(max-width: 900px) 78vw, 30vw"
            />
            {/* Cipka nad snimkom. Ukras je, pa je ne cita niko. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="vitrina__lace"
              src="/images/brand/okvir-cipka.svg"
              alt=""
              aria-hidden="true"
            />
          </figure>

          <Link
            className="vitrina__seal reveal-pop stagger-3"
            href={localeHref(locale, '/products')}
            aria-label={t.seal}
          >
            <Image src="/images/brand/pecat-proizvodi.svg" alt="" width={423} height={423} />
          </Link>
        </div>

        <div className="vitrina__side vitrina__side--right reveal stagger-2">
          <p className="vitrina__eyebrow">{t.eyebrowRight}</p>
          <h2 className="vitrina__heading">{t.headingRight}</h2>
        </div>
      </div>
    </section>
  );
}
