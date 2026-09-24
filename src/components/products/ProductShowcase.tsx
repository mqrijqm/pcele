import ProductCard from '@/components/products/ProductCard';
import { formatPrice, getProduct } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';
import type { productsEditorial } from '@/content/productsEditorial';

type ShopCopy = (typeof productsEditorial)['sr']['shop'];

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

/**
 * Kartica iz kataloga: ista komponenta kao "Možda će vam se dopasti" na strani
 * proizvoda (`ProductCard`). Cijena se uzima iz kataloga po `slug`-u; artikli
 * koji još nemaju svoju stranu (perga, med u saću) nose cijenu zadatu uz karticu.
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
  // Artikli sa stranom: cijena iz kataloga. Bez strane (perga, med u saću): zadata uz karticu.
  const price = item ? item.variants[0].price : product.price;

  return (
    <ProductCard
      href={product.slug ? localeHref(locale, `/products/${product.slug}`) : '#proizvodi'}
      image={image}
      imageAlt={product.slug ? `${product.name}, ${product.unit}` : product.name}
      name={product.name}
      unit={product.unit}
      price={price !== undefined ? formatPrice(price) : undefined}
      heading="h3"
    />
  );
}

/**
 * Katalog na strani proizvoda: osam kartica u jednoj mreži (4 x 2), bez
 * naslova i bez teksta između — samo proizvodi. Prva četiri su medovi, drugih
 * četiri pčelinji proizvodi; redoslijed je isti kao u `productImages`.
 *
 * Tekstovi koji su ovdje ranije stajali uz velike fotografije (uvod, "kako se
 * čuva", dostava) ostaju u `productsEditorial` (`shop`, `storage`), samo se ne
 * prikazuju.
 */
export default function ProductShowcase({ locale, copy }: { locale: Locale; copy: ShopCopy }) {
  return (
    <section className="pe-shop">
      {/* Sidro #proizvodi (dugmad "Okusi slast" na strani) vodi na prvu karticu. */}
      <div id="proizvodi" className="pe-shop__group">
        <div className="pe-shop__grid">
          {copy.products.map((p, i) => (
            <CatalogCard key={p.name + p.unit} product={p} image={productImages[i]} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
