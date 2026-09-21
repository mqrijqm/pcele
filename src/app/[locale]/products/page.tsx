import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CtaMovingImage from '@/components/products/CtaMovingImage';
import FullBleed from '@/components/products/FullBleed';
import HeroMarquee from '@/components/products/HeroMarquee';
import MovingTitles from '@/components/products/MovingTitles';
import ProductBand from '@/components/products/ProductBand';
import ScatterGallery from '@/components/products/ScatterGallery';
import SeasonTimeline from '@/components/products/SeasonTimeline';
import StoryBlock from '@/components/products/StoryBlock';
import WhyBlock from '@/components/products/WhyBlock';
import { meta } from '@/content/pages';
import { imageSlots, productsEditorial } from '@/content/productsEditorial';
import { isLocale, localeHref, type Locale } from '@/i18n/config';

/**
 * Strana proizvoda.
 *
 * Nije webshop spisak nego tekst o medu: uvodni red koji se krece, snimak
 * preko cijelog ekrana, pa red sekcija koje naizmjenicno nose tipografiju i
 * fotografiju. Bagremov med dobija najvise prostora — dvije sekcije i pojas
 * u boji — a livadski, propolis i imuno mix ulaze kroz rasutu plohu i pojas,
 * bez ijedne kartice sa cijenom.
 *
 * Fotografije su zasad sivi blokovi; svaki nosi `data-image-slot` po kojem
 * se nalazi u kodu.
 */

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

  const copy = productsEditorial[locale];

  return (
    <div className="pe bg-ivory header-offset">
      {/* 01 — naslov koji se krece preko cijele sirine */}
      <HeroMarquee title={copy.heroTitle} note={copy.heroNote} />

      {/* 02 — snimak preko cijelog ekrana, sa krugom koji vodi na proizvode */}
      <FullBleed
        slot={imageSlots.banner}
        label={copy.bannerAlt}
        cta={copy.bannerCta}
        href="#proizvodi"
      />

      {/* 03 — bagremov med: natpis, krupna recenica, podaci */}
      <StoryBlock
        label={copy.bagrem.label}
        lede={copy.bagrem.lede}
        facts={copy.bagrem.facts}
        art={{ src: '/images/brand/bagremov-grana.svg', width: 1271, height: 1213 }}
        artAlt="Grana bagrema u cvatu"
      />

      {/* 04 — zasto nas bagrem */}
      <WhyBlock
        title={copy.why.title}
        slot={imageSlots.why}
        slotLabel={copy.why.imageAlt}
        intro={copy.why.intro}
        list={copy.why.list}
        outro={copy.why.outro}
      />

      {/* 05 — dva krupna naslova koja ulaze sa strane */}
      <MovingTitles
        items={[
          { ...copy.features[0], icon: '/images/brand/bagremov-grana.svg' },
          { ...copy.features[1], icon: '/images/brand/teglica.svg' },
        ]}
      />

      {/* 06 — livadski med, u pojasu u boji */}
      <ProductBand
        locale={locale}
        label={copy.meadow.label}
        heading={copy.meadow.heading}
        body={copy.meadow.body}
        cta={copy.meadow.cta}
        href="/products/livadski-med-500g"
        slot={imageSlots.meadow}
        slotLabel={copy.meadow.imageAlt}
      />

      {/* 07 — ostali proizvodi, rasuti preko pune plohe */}
      <ScatterGallery
        id="proizvodi"
        title={copy.others.title}
        lede={copy.others.lede}
        slots={imageSlots.others.map((slot) => ({ slot, label: copy.others.alt }))}
      />

      {/* 08 — sezona u pcelinjaku */}
      <SeasonTimeline
        label={copy.season.label}
        heading={copy.season.heading}
        steps={copy.season.steps}
        slots={[...imageSlots.season]}
      />

      {/* 09 — cuvanje i kristalizacija */}
      <StoryBlock
        label={copy.storage.label}
        lede={copy.storage.heading}
        body={copy.storage.body}
        facts={copy.storage.facts}
      />

      {/* 10 — zavrsni poziv */}
      <CtaMovingImage
        title={copy.cta.title}
        button={copy.cta.button}
        href="#proizvodi"
        left={{ slot: imageSlots.ctaLeft, label: copy.cta.alt }}
        right={{ slot: imageSlots.ctaRight, label: copy.cta.alt }}
      />
    </div>
  );
}
