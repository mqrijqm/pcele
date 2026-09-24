import Image from 'next/image';

import ProductCard from '@/components/products/ProductCard';
import TransitionLink from '@/components/ui/TransitionLink';
import { formatPrice, getProduct } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';
import type { productsEditorial } from '@/content/productsEditorial';

type Copy = (typeof productsEditorial)['sr'];
type ShopCopy = Copy['shop'];
type StorageCopy = Copy['storage'];

/*
 * Slike za osam artikala, u tacnom redoslijedu iz zadatka. Perga i med u sacu
 * cekaju svoje snimke i stoji im najblizi postojeci kadar (vidi TODO u
 * `productsEditorial`).
 */
const productImages: Record<number, string> = {
  0: '/images/proizvodi/livadski-1kg-new.webp',
  1: '/images/proizvodi/livadski-500g-new.webp',
  2: '/images/proizvodi/bagremov-1kg-new.webp',
  3: '/images/proizvodi/bagremov-500g-new.webp',
  4: '/images/proizvodi/propolis-20ml-new.webp',
  5: '/images/proizvodi/imuno-mix-450g-new.webp',
  6: '/images/proizvodi/perga-10g-new.webp',
  7: '/images/proizvodi/med-u-sacu-new.webp',
};

const lifestyle = {
  hero: '/images/products-editorial/jars-railing.webp',
  editorial: '/images/products-editorial/honeys-apiary.webp',
  final: '/images/products-editorial/honey-table.webp',
} as const;

/**
 * Jedino dugme na ovoj strani: crtana "Okusi slast" pilula, ista kao zavrsni
 * poziv ispod (`CtaMovingImage`) i kao dugme u heroju pocetne. Sajt ima samo
 * dvije vrste brendiranih poziva — ovu pilulu i okrugli pecat — pa prodavnica
 * ne nosi svoje.
 */
function BrandPill({ href, label }: { href: string; label: string }) {
  return (
    <TransitionLink
      href={href}
      className="brand-cta brand-cta--pill pe-shop__cta"
      aria-label={label}
    >
      <Image
        className="brand-cta__art"
        src="/hero/okusi-slast.svg"
        alt=""
        aria-hidden="true"
        width={367}
        height={136}
      />
    </TransitionLink>
  );
}

/**
 * Podnaslov grupe proizvoda: sitan crtez, oznaka i naslov, sve u sredini.
 */
function GroupHead({
  mark,
  tags,
  title,
}: {
  mark: string;
  tags: string[];
  title: string;
}) {
  return (
    <header className="pe-shop__group-head">
      <Image src={mark} alt="" aria-hidden="true" width={48} height={48} className="pe-shop__mark" />
      <p className="pe-shop__eyebrow">{tags.join('  ·  ')}</p>
      <h3 className="pe-shop__group-title">{title}</h3>
    </header>
  );
}

/**
 * Katalog na strani proizvoda.
 *
 * Isti jezik kao ostatak strane: papir i smedje mastilo, Gazpacho za sve krupno
 * (obicnom debljinom, malim slovima — kao "Godina kod pcela."), Inter za sve
 * sitno. Nema bijele i nema verzala u serifu.
 *
 * Redoslijed: uvod, traka natpisa, medovi, kako se med cuva, pcelinji
 * proizvodi, dostava. Tekst o cuvanju i kristalizaciji stoji ovdje, uz veliku
 * fotografiju, a ne kao zasebna sekcija — tu je prije stajao samo spisak
 * naziva koji se ponavljao ispod u karticama.
 */
export default function ProductShowcase({
  locale,
  copy,
  storage,
}: {
  locale: Locale;
  copy: ShopCopy;
  storage: StorageCopy;
}) {
  const [honeys, beeProducts] = copy.editorial;

  return (
    <section className="pe-shop">
      {/* --- 01 · uvod: tekst lijevo, fotografija desno --------------------- */}
      <div className="pe-shop__split">
        <div className="pe-shop__panel">
          <p className="pe-shop__eyebrow">{copy.eyebrow}</p>
          <h2 className="pe-shop__heading">{copy.headline}</h2>
          <p className="pe-body pe-shop__text">{copy.intro}</p>
          <BrandPill href="#proizvodi" label={copy.oval} />
        </div>

        <div className="pe-shop__photo">
          <Image
            src={lifestyle.hero}
            alt={copy.alt.hero}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="pe-shop__photo-img"
          />
        </div>
      </div>

      {/* --- 02 · traka sa kratkim natpisima ------------------------------- */}
      <div className="pe-shop__strip" aria-hidden="true">
        <div className="pe-shop__strip-track">
          {[0, 1].map((grupa) => (
            <span key={grupa} className="pe-shop__strip-group">
              {[...copy.strip, ...copy.strip].map((natpis, i) => (
                <span key={i} className="pe-shop__strip-item">
                  <span className="pe-shop__strip-text">{natpis}</span>
                  <Image
                    src={i % 2 === 0 ? '/images/brand/sunce.svg' : '/images/brand/teglica.svg'}
                    alt=""
                    aria-hidden="true"
                    width={34}
                    height={34}
                    className="pe-shop__strip-mark"
                  />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* --- 03 · medovi ---------------------------------------------------- */}
      <div id="proizvodi" className="pe-shop__group">
        <GroupHead mark="/images/brand/teglica.svg" tags={honeys.list} title={honeys.title} />
        <div className="pe-shop__grid">
          {copy.products.slice(0, 4).map((p, i) => (
            <CatalogCard key={p.name + p.unit} product={p} image={productImages[i]} locale={locale} />
          ))}
        </div>
      </div>

      {/* --- 04 · kako se med cuva: fotografija lijevo, tekst desno --------- */}
      <div className="pe-shop__split pe-shop__split--flip">
        <div className="pe-shop__panel">
          <p className="pe-shop__eyebrow">{storage.label}</p>
          <h2 className="pe-shop__heading pe-shop__heading--long">{storage.heading}</h2>
          <p className="pe-body pe-shop__text">{storage.body}</p>
          <dl className="pe-shop__facts">
            {storage.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="pe-shop__photo">
          <Image
            src={lifestyle.editorial}
            alt={copy.alt.editorial}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="pe-shop__photo-img"
          />
        </div>
      </div>

      {/* --- 05 · pcelinji proizvodi ---------------------------------------- */}
      <div className="pe-shop__group">
        <GroupHead mark="/images/brand/cvijet-krug.svg" tags={beeProducts.list} title={beeProducts.title} />
        <div className="pe-shop__grid">
          {copy.products.slice(4).map((p, i) => (
            <CatalogCard key={p.name + p.unit} product={p} image={productImages[i + 4]} locale={locale} />
          ))}
        </div>
      </div>

      {/* --- 06 · dostava i zavrsni poziv ----------------------------------- */}
      <div className="pe-shop__split pe-shop__split--photo-first-mobile">
        <div className="pe-shop__panel">
          <p className="pe-shop__eyebrow">{copy.final.eyebrow}</p>
          <h2 className="pe-shop__heading">{copy.final.title}</h2>
          <p className="pe-body pe-shop__text">{copy.final.note}</p>
          <BrandPill href="#proizvodi" label={copy.final.cta} />
        </div>

        <div className="pe-shop__photo">
          <Image
            src={lifestyle.final}
            alt={copy.alt.final}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="pe-shop__photo-img"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Kartica iz kataloga: ista komponenta kao "Možda će vam se dopasti" na strani
 * proizvoda (`ProductCard`). Cijena se uzima iz kataloga po `slug`-u; artikli
 * koji još nemaju svoju stranu (perga, med u saću) je nemaju ni na kartici.
 */
function CatalogCard({
  product,
  image,
  locale,
}: {
  product: ShopCopy['products'][number];
  image: string;
  locale: Locale;
}) {
  const item = product.slug ? getProduct(product.slug) : undefined;

  return (
    <ProductCard
      href={product.slug ? localeHref(locale, `/products/${product.slug}`) : '#proizvodi'}
      image={image}
      imageAlt={product.slug ? `${product.name}, ${product.unit}` : product.name}
      name={product.name}
      unit={product.unit}
      price={item ? formatPrice(item.variants[0].price) : undefined}
      heading="h4"
    />
  );
}
