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
 * **Mreza svojstava** ispod redova je bento: jedna fotografija drzi ugao, a
 * plocice oko nje nose ono sto se ponavlja u svakoj tegli. Sirine plocica su
 * zakucane u rasporedu (vidi `MREZA`), pa se sadrzaj samo redja.
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

/**
 * Bento mreza: cetiri kolone na sirokom ekranu, dvije na telefonu.
 *
 * Red 1  [ fotografiija 2x2 ][ plocica 2x1 ]
 * Red 2  [      —          ][ 1x1 ][ 1x1 ]
 * Red 3  [    plocica 2x1        ][    plocica 2x1    ]
 */
const MREZA = {
  fotografija: { slika: '/images/izdvojeno/bagremov-kosnica.webp' },
  /** Sirine plocica, istim redom kojim stoje i u `content/pages`. */
  sirine: ['2x1', '1x1', '1x1', '2x1', '2x1'] as const,
};

const SIRINE: Record<(typeof MREZA.sirine)[number], string> = {
  '2x1': 'col-span-2',
  '1x1': 'col-span-1',
};

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
                {/*
                  Fotografija nosi svoj okvir: jedan ugao je otvoren vise od
                  ostalih (isti potez kao na slikama kroz sajt). Prelaz pod
                  misem je na slici, ne na okviru, da se okvir ne mijenja.
                */}
                <figure className="izdvojeno__slika">
                  <Image
                    src={red.slika}
                    alt={p.slikaAlt}
                    fill
                    sizes="(max-width: 900px) 92vw, 44vw"
                    className="izdvojeno__foto"
                  />
                  <figcaption className="izdvojeno__etiketa">{p.etiketa}</figcaption>
                </figure>

                <div className="izdvojeno__slog">
                  <p className="izdvojeno__eyebrow">{p.eyebrow}</p>
                  <h3 className="izdvojeno__ime">{p.ime}</h3>
                  <p className="izdvojeno__podnaslov">{p.podnaslov}</p>

                  <dl className="izdvojeno__cinjenice">
                    {p.cinjenice.map((c) => (
                      <div key={c.oznaka}>
                        <dt>{c.oznaka}</dt>
                        <dd>{c.vrijednost}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="izdvojeno__tekst measure">{p.tekst}</p>

                  <TransitionLink
                    className="btn izdvojeno__dugme"
                    href={localeHref(locale, `/products/${red.slug}`)}
                  >
                    {t.cta}
                    <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.5} />
                  </TransitionLink>
                </div>
              </article>
            );
          })}
        </div>

        {/* --- mreza svojstava: sta stoji u svakoj tegli --- */}
        <div className="izdvojeno__mreza">
          <p className="izdvojeno__mreza-naslov eyebrow reveal">{t.mreza.heading}</p>

          <div className="izdvojeno__ploce">
            <figure className="izdvojeno__plocica izdvojeno__plocica--foto reveal-scale">
              <Image
                src={MREZA.fotografija.slika}
                alt={t.mreza.fotoAlt}
                fill
                sizes="(max-width: 900px) 92vw, 42vw"
                className="izdvojeno__foto"
              />
              <figcaption className="izdvojeno__plocica-natpis">{t.mreza.fotoNatpis}</figcaption>
            </figure>

            {t.mreza.plocice.map((p, i) => (
              <div
                key={p.naslov}
                className={`izdvojeno__plocica reveal ${SIRINE[MREZA.sirine[i]]}${
                  i === 0 ? ' izdvojeno__plocica--zlato' : ''
                }`}
              >
                <h3 className="izdvojeno__plocica-naslov">{p.naslov}</h3>
                <p className="izdvojeno__plocica-tekst">{p.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
