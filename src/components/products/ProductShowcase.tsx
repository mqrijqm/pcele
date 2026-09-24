import ProductCard from '@/components/products/ProductCard';
import { formatPrice, getProduct } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';
import type { productsEditorial } from '@/content/productsEditorial';

type ShopCopy = (typeof productsEditorial)['sr']['shop'];

/**
 * Kartica iz kataloga: ista komponenta kao "Možda će vam se dopasti" na strani
 * proizvoda (`ProductCard`). Slika, cijena i zum se uzimaju iz kataloga po
 * `slug`-u, pa kartica i njena strana ne mogu da se razidju.
 */
function CatalogCard({
  product,
  locale,
}: {
  product: ShopCopy['products'][number];
  locale: Locale;
}) {
  const item = product.slug ? getProduct(product.slug) : undefined;
  if (!item) return null;

  return (
    <ProductCard
      href={localeHref(locale, `/products/${item.slug}`)}
      image={item.image}
      imageAlt={`${product.name}, ${product.unit}`}
      name={product.name}
      unit={product.unit}
      price={formatPrice(item.variants[0].price)}
      zoom={item.cardZoom}
      heading="h3"
    />
  );
}

/**
 * Katalog na strani proizvoda: osam kartica u jednoj mreži (4 x 2), bez
 * naslova i bez teksta između — samo proizvodi. Prva četiri su medovi, drugih
 * četiri pčelinji proizvodi; redoslijed je onaj iz `productsEditorial.shop`.
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
          {copy.products.map((p) => (
            <CatalogCard key={p.name + p.unit} product={p} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
