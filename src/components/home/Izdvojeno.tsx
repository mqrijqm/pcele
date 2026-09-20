import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

import TransitionLink from '@/components/ui/TransitionLink';
import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * Izdvojeni proizvodi: tegla je u prvom planu, ostalo stoji uz nju.
 *
 * Sekcija stoji odmah iza heroja, prije price — prvo se vidi sta se nudi, pa
 * odakle dolazi. Tri reda nose po jedan proizvod: fotografija s jedne strane i
 * slog s druge, pa se strana smjenjuje (slika lijevo, pa desno, pa opet
 * lijevo) da niz ne bude niz istih redova.
 *
 * **Sta se odakle cita.** Ime i cinjenice dolaze iz `content/pages`, a putanja
 * do proizvoda iz `data/products` — dakle iz istog kataloga iz kojeg zivi i
 * webshop. Cijena se ne pise: sekcija predstavlja proizvod, ne prodaje ga;
 * broj i korpa su na strani proizvoda, kuda vodi jedino dugme.
 *
 * **Otkrivanje** ide preko `.reveal*` klasa koje cita `RevealObserver`, istim
 * redom kojim se otkrivaju i ostale sekcije na strani.
 */

/** Jedan red i sve po cemu se razlikuje od drugog. */
type Red = {
  /** Iz kojeg polja u `content/pages` dolaze rijeci. */
  kljuc: 'bagremov' | 'livadski' | 'propolis';
  /** Artikal u katalogu — odatle se cita putanja do strane proizvoda. */
  slug: string;
  slika: string;
  /** `true` stavlja sliku desno; susjedni redovi se smjenjuju. */
  obrnuto: boolean;
};

const REDOVI: ReadonlyArray<Red> = [
  {
    kljuc: 'bagremov',
    slug: 'bagremov-med-1kg',
    slika: '/images/izdvojeno/bagremov-pasa.webp',
    obrnuto: false,
  },
  {
    kljuc: 'livadski',
    slug: 'livadski-med-1kg',
    slika: '/images/izdvojeno/livadski-red.webp',
    obrnuto: true,
  },
  {
    kljuc: 'propolis',
    slug: 'pcelinji-propolis-20ml',
    slika: '/images/izdvojeno/propolis-ruka.webp',
    obrnuto: false,
  },
];

export default function Izdvojeno({ locale }: { locale: Locale }) {
  const t = home.izdvojeno[locale];

  return (
    <section className="izdvojeno" aria-labelledby="izdvojeno-naslov">
      <div className="izdvojeno__inner">
        {/* --- uvod: nadnaslov, naslov, recenica i put do svih proizvoda --- */}
        <header className="izdvojeno__uvod">
          <p className="eyebrow reveal">{t.eyebrow}</p>

          <div className="izdvojeno__uvod-red">
            <h2 className="izdvojeno__naslov reveal" id="izdvojeno-naslov">
              {t.heading}
            </h2>

            <div className="izdvojeno__uvod-desno">
              <p className="izdvojeno__intro measure reveal">{t.intro}</p>

              <TransitionLink
                className="btn btn--ghost izdvojeno__svi reveal"
                href={localeHref(locale, '/products')}
              >
                {t.svi}
                <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.5} />
              </TransitionLink>
            </div>
          </div>
        </header>

        {/* --- tri reda: jedan proizvod, jedna fotografija --- */}
        <div className="izdvojeno__redovi">
          {REDOVI.map((red) => {
            const p = t.proizvod[red.kljuc];

            return (
              <article
                key={red.slug}
                className={`izdvojeno__red reveal${red.obrnuto ? ' izdvojeno__red--obrnuto' : ''}`}
              >
                <figure className="izdvojeno__slika">
                  <Image
                    src={red.slika}
                    alt={p.slikaAlt}
                    fill
                    sizes="(max-width: 899px) 86vw, 34rem"
                    className="izdvojeno__foto"
                  />
                  <figcaption className="izdvojeno__etiketa">{p.etiketa}</figcaption>
                </figure>

                <div className="izdvojeno__slog">
                  <h3 className="izdvojeno__ime">{p.ime}</h3>
                  <p className="izdvojeno__podnaslov">{p.podnaslov}</p>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
