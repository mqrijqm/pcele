import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PageHero from '@/components/ui/PageHero';
import ProductsGrid from '@/components/products/ProductsGrid';
import { meta, productsPage } from '@/content/pages';
import { isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].products.title, description: meta[l].products.description };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = productsPage[locale];

  return (
    <div className="bg-ivory">
      <PageHero
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        description={copy.description}
        note={copy.note}
        image="/images/blog/real-raw-honey-v1.webp"
        imageAlt={copy.heroAlt}
        background="#c9dadd"
        cardSide="left"
      />

      <section className="bg-ivory py-16 lg:py-24">
        <div className="container">
          <ProductsGrid locale={locale} />
        </div>
      </section>

      <section className="border-y border-[#332a24]/14 bg-[#9aa58c] py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {copy.trustFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`reveal stagger-${index + 1} border-b border-[#332a24]/18 py-6 md:px-7 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0`}
              >
                <span className="text-[10px] font-bold tracking-[0.18em] text-[#fff8eb]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 font-display text-2xl leading-tight text-espresso">
                  {feature.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#4f493f]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
