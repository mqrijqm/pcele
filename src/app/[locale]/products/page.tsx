import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductsGrid from '@/components/products/ProductsGrid';
import SorteMeda from '@/components/products/SorteMeda';
import ImageBreak from '@/components/ui/ImageBreak';
import { meta, photoBreaks, productsPage } from '@/content/pages';
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
  const shot = photoBreaks[locale];

  return (
    <div className="bg-ivory header-offset">
      {/* Strana pocinje pretragom; naslov ostaje za citace ekrana. */}
      <h1 className="sr-only">{copy.heading}</h1>
      <section className="bg-ivory section-padding">
        <div className="container">
          <ProductsGrid locale={locale} />
        </div>
      </section>

      {/* Poslije prodavnice — od sanduka do police. */}
      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/real/bagrem-tegle-panj.webp', alt: shot.productsHarvest.altStump },
          { src: '/images/real/bagrem-sanduk.webp', alt: shot.productsHarvest.altCrate },
        ]}
        caption={shot.productsHarvest.caption}
        meta={shot.productsHarvest.meta}
        emblem
      />

      <SorteMeda locale={locale} />

      <section className="border-b border-[#73552E]/15 bg-[#73552E] py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {copy.trustFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`reveal stagger-${index + 1} border-b border-[#FDF9DC]/20 py-6 md:px-7 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0`}
              >
                <span className="text-[10px] font-bold tracking-[0.18em] text-[#C79A3B]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 font-display text-2xl leading-tight text-[#FDF9DC]">
                  {feature.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#FDF9DC]/75">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dva artikla koja nisu med, prije zavrsne fotografije. */}
      <ImageBreak
        variant="pair"
        images={[
          {
            src: '/images/real/imuno-studio.webp',
            alt: shot.productsOther.altMix,
            // Tegla stoji lijevo od sredine; centriran rez joj odsijeca ivicu.
            focus: 'object-[42%_50%]',
          },
          {
            src: '/images/real/propolis-kadar.webp',
            alt: shot.productsOther.altPropolis,
            focus: 'object-[74%_50%]',
          },
        ]}
        frame="narrow"
        caption={shot.productsOther.caption}
        meta={shot.productsOther.meta}
      />

      <ImageBreak
        variant="framed"
        side="right"
        images={[{ src: '/images/mockups/jars-pair-studio.webp', alt: shot.productsCare.alt }]}
        caption={shot.productsCare.caption}
        heading={shot.productsCare.heading}
        body={shot.productsCare.body}
        meta={shot.productsCare.meta}
      />
    </div>
  );
}
