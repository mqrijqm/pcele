import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import ProductDetail from '@/components/products/ProductDetail';
import { formatPrice, getProduct, products } from '@/data/products';
import { createTranslator, isLocale, locales, localeHref, type Locale } from '@/i18n/config';

/** Related cards show only the opening of the description, as on the original site. */
const truncate = (text: string, length = 60) =>
  text.length > length ? `${text.slice(0, length)}...` : text;

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

  return {
    title: product.name[l],
    description: product.description[l],
    openGraph: {
      title: product.name[l],
      description: product.description[l],
      images: [{ url: product.image }],
    },
  };
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
    image: [`https://pcelarstvo-jevtic.ba${product.image}`],
    brand: { '@type': 'Brand', name: 'Pčelarstvo Jevtić' },
    offers: product.variants.map((variant) => ({
      '@type': 'Offer',
      name: variant.title,
      sku: variant.id,
      price: variant.price.toFixed(2),
      priceCurrency: 'BAM',
      availability: 'https://schema.org/InStock',
      url: `https://pcelarstvo-jevtic.ba/${locale}/products/${product.slug}`,
    })),
  };

  return (
    <div className="bg-[#f3e8d6] pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-sand/60">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-xs text-stone">
            <Link href={localeHref(locale, '/')} className="transition-colors hover:text-honey">
              {t('nav.home')}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={localeHref(locale, '/products')}
              className="transition-colors hover:text-honey"
            >
              {t('products.breadcrumb')}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-walnut">{product.name[locale]}</span>
          </nav>
        </div>
      </div>

      <ProductDetail product={product} locale={locale} />

      <div className="border-t border-sand/60 bg-linen">
        <div className="container py-20 lg:py-28">
          <div className="reveal mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-honey">
              {t('products.related.eyebrow')}
            </span>
            <h2 className="font-display text-display-md text-espresso">
              {t('products.related.heading')}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Link
                key={item.slug}
                href={localeHref(locale, `/products/${item.slug}`)}
                className={`reveal stagger-${index + 1} group block`}
              >
                <div className="overflow-hidden rounded-lg border border-sand/70 bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                  <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
                    <Image
                      src={item.image}
                      alt={item.name[locale]}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl text-espresso transition-colors duration-300 group-hover:text-honey-600">
                        {item.name[locale]}
                      </h3>
                      <span className="shrink-0 text-base font-semibold text-honey">
                        {formatPrice(item.variants[0].price)}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-stone">
                      {truncate(item.description[locale])}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
