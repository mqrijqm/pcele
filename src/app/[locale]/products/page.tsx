import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/*
 * Editorial raspored ove strane. Uvozi se ovdje, a ne u `globals.css`, da ga
 * ne nosi svaka strana na sajtu — vazi samo za `/products`.
 */
import '@/app/products.css';

import ContactView from '@/components/contact/ContactView';
import CtaMovingImage from '@/components/products/CtaMovingImage';
import FullBleed from '@/components/products/FullBleed';
import HeroMarquee from '@/components/products/HeroMarquee';
import MovingTitles from '@/components/products/MovingTitles';
import ProductShowcase from '@/components/products/ProductShowcase';
import ScatterGallery from '@/components/products/ScatterGallery';
import SeasonTimeline from '@/components/products/SeasonTimeline';
import StoryBlock from '@/components/products/StoryBlock';
import WhyBlock from '@/components/products/WhyBlock';
import { meta } from '@/content/pages';
import { imageSlots, productsEditorial, seasonMedia } from '@/content/productsEditorial';
import { isLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/seo';

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
  return pageMetadata({ locale: l, path: '/products', ...meta[l].products });
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = productsEditorial[locale];

  return (
    <div className="pe bg-ivory header-offset">
      {/* 01 — naslov koji se krece preko cijele sirine */}
      <HeroMarquee title={copy.heroTitle} />

      {/* 02 — snimak preko cijelog ekrana, sa krugom koji vodi na proizvode */}
      <FullBleed
        image="/images/products-editorial/livadski-med-korpa.webp"
        label={copy.bannerAlt}
        cta={copy.bannerCta}
        href="#proizvodi"
      />

      {/* 02b — e-commerce showcase: editorial katalog svih artikala */}

      {/* 03 — bagremov med: natpis, krupna recenica, podaci */}
      <div className="pe-editorial">
      <StoryBlock
        label={copy.bagrem.label}
        lede={copy.bagrem.lede}
        art={{ src: '/images/brand/sunce.svg', width: 320, height: 320 }}
        artAlt={copy.why.imageAlt}
        scrollReveal
        highlightWords={locale === 'sr' ? ['proljetnog', 'ljetne', 'ukus', 'miris', 'karakter'] : ['spring', 'summer', 'taste', 'scent', 'character']}
      />

      {/* 04 — zasto nas bagrem */}
      <WhyBlock
        title={copy.why.title}
        slot={imageSlots.why}
        slotLabel={copy.why.imageAlt}
        intro={copy.why.intro}
        list={copy.why.list}
        outro={copy.why.outro}
        image="/images/products-editorial/vrcanje-sace.jpg"
      />

      {/* 05 — dva krupna naslova koja ulaze sa strane */}
      <MovingTitles
        items={[
          { ...copy.features[0], icon: '/images/brand/travcica.svg', tint: true },
          { ...copy.features[1], icon: '/images/brand/teglica.svg' },
        ]}
      />

      {/* 06 — zuta ploha sa kapima gore i dolje; snimci kruze oko naslova */}
      <ScatterGallery
        title={copy.others.title}
        slots={[
          { slot: imageSlots.others[0], label: copy.others.alt, image: '/images/products-editorial/medeni-proizvod-1.webp' },
          { slot: imageSlots.others[5], label: copy.others.alt, image: '/images/products-editorial/propolis-meadow.webp' },
          { slot: imageSlots.others[2], label: copy.others.alt, image: '/images/products-editorial/medeni-proizvod-3.webp' },
          { slot: imageSlots.others[1], label: copy.others.alt, image: '/images/products-editorial/medeni-proizvod-2.webp' },
          { slot: imageSlots.others[7], label: copy.others.alt, image: '/images/products-editorial/meadow-hand.webp' },
          { slot: imageSlots.others[3], label: copy.others.alt, image: '/images/products-editorial/medeni-proizvod-4.webp' },
          { slot: imageSlots.others[6], label: copy.others.alt, image: '/images/products-editorial/acacia-hive.webp' },
          { slot: imageSlots.others[4], label: copy.others.alt, image: '/images/products-editorial/medeni-proizvod-5.webp' },
        ]}
      />

      {/* 07 — sezona u pcelinjaku */}
      <SeasonTimeline
        label={copy.season.label}
        heading={copy.season.heading}
        steps={copy.season.steps}
        slots={[...imageSlots.season]}
        media={seasonMedia}
        videoLabels={copy.season.video}
      />
      </div>

      {/*
        Katalog: osam kartica u jednoj mrezi, odmah ispod sezone. Sidro
        #proizvodi (dugmad "Okusi slast" na strani) vodi na prvu karticu.
      */}
      <ProductShowcase locale={locale} copy={copy.shop} />

      {/* 10 — zavrsni poziv */}
      <CtaMovingImage
        title={copy.cta.title}
        button={copy.cta.button}
        href="#proizvodi"
        left={{ slot: imageSlots.ctaLeft, label: copy.cta.alt }}
        right={{ slot: imageSlots.ctaRight, label: copy.cta.alt }}
      />

      {/* 11 — kontakt: ista sekcija (i ista forma) kao na strani Kontakt */}
      <ContactView locale={locale} embedded />
    </div>
  );
}
