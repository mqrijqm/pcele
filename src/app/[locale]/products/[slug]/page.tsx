import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductCard from '@/components/products/ProductCard';
import ProductDetail from '@/components/products/ProductDetail';
import { formatPrice, getProduct, products, splitName } from '@/data/products';
import { createTranslator, isLocale, locales, localeHref, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-url';

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((product) => ({ locale, slug: product.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  const product = getProduct(slug);
  if (!product) return {};

  return pageMetadata({
    locale: l,
    path: `/products/${product.slug}`,
    title: product.name[l],
    description: product.description[l],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const product = getProduct(slug);
  if (!product) notFound();

  const t = createTranslator(locale);
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description: product.description[locale],
    image: [`${SITE_URL}${product.image}`],
    brand: { '@type': 'Brand', name: 'Pčelarstvo Jevtić' },
    offers: product.variants.map((variant) => ({
      '@type': 'Offer',
      name: variant.title,
      sku: variant.id,
      price: variant.price.toFixed(2),
      priceCurrency: 'BAM',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/${locale}/products/${product.slug}`,
    })),
  };

  return (
    <div className="bg-[var(--paper)] header-offset">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProductDetail product={product} locale={locale} />

      {/* Ostali proizvodi: ista kartica kao u katalogu. */}
      <section className="border-t border-[#885B27]/30">
        <div className="container section-padding">
          <div className="reveal mb-12 flex flex-col items-center text-center">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#885B27]">
              {t('products.related.eyebrow')}
            </p>
            <h2 className="mt-4 font-display text-display-md font-normal text-[#885B27]">
              {t('products.related.heading')}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {related.map((item) => {
              const { title, unit } = splitName(item.name[locale]);
              return (
                <ProductCard
                  key={item.slug}
                  href={localeHref(locale, `/products/${item.slug}`)}
                  image={item.image}
                  imageAlt={item.name[locale]}
                  name={title}
                  unit={unit || item.variants[0].title}
                  price={formatPrice(item.variants[0].price)}
                  zoom={item.cardZoom}
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
