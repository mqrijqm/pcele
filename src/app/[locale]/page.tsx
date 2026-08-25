import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { photoBreaks } from '@/content/pages';
import HeroLand from '@/components/home/HeroLand';
import HeroJar from '@/components/home/HeroJar';
import AboutPreview from '@/components/home/AboutPreview';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Legacy from '@/components/home/Legacy';
import SorteMeda from '@/components/products/SorteMeda';
import Testimonials from '@/components/home/Testimonials';
import Origin from '@/components/home/Origin';
import Faq from '@/components/home/Faq';
import Newsletter from '@/components/home/Newsletter';
import ImageBreak from '@/components/ui/ImageBreak';
import BeeFlight from '@/components/bee/BeeFlight';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const shot = photoBreaks[locale];

  return (
    <>
      {/* Pcela leti preko cele strane; sloj se portalom kaci na <body>. */}
      <BeeFlight />

      <HeroLand locale={locale} />
      <HeroJar locale={locale} />

      <AboutPreview locale={locale} />

      <FeaturedProducts locale={locale} />

      <Legacy locale={locale} />

      {/*
        * Poslije price o porodici — jedini par na strani koji ne pokazuje med.
        * Propolis je snimljen kao panorama sa bocom uz desnu ivicu, pa mu rez
        * ide na 74% umjesto po sredini; centriran bi ostavio prazan zid.
        *
        * Jedina tamna traka na strani. I ono prije nje i ono poslije nje je
        * papir, pa se ova sekcija — jedina koja ne pokazuje med — odvaja bojom
        * umjesto razmakom.
        */}
      <ImageBreak
        variant="pair"
        tone="dark"
        images={[
          { src: '/images/real/imuno-livada.webp', alt: shot.homeOther.altMix },
          {
            src: '/images/real/propolis-kadar.webp',
            alt: shot.homeOther.altPropolis,
            focus: 'object-[74%_50%]',
          },
        ]}
        frame="narrow"
        caption={shot.homeOther.caption}
      />

      <SorteMeda locale={locale} />

      <Testimonials locale={locale} />

      {/* Pravi pcelinjak, prije nego sto krene prica o mjestu. */}
      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/real/pcelinjak-2.webp', alt: shot.homeHives.altA },
          { src: '/images/real/pcelinjak-3.webp', alt: shot.homeHives.altB },
        ]}
        caption={shot.homeHives.caption}
        meta={shot.homeHives.meta}
        emblem
      />

      <Origin locale={locale} />

      {/* Livada iz koje sve dolazi — uvod u pricu o stolu. */}
      <ImageBreak
        images={[{ src: '/images/mockups/jars-grass-flatlay.webp', alt: shot.homeGrass.alt }]}
        caption={shot.homeGrass.caption}
        meta={shot.homeGrass.meta}
      />

      {/* Poslije utisaka — jedina pauza koja nosi i tekst. */}
      <ImageBreak
        variant="framed"
        images={[{ src: '/images/mockups/jars-linen-sunset.webp', alt: shot.homeTable.alt }]}
        caption={shot.homeTable.caption}
        heading={shot.homeTable.heading}
        body={shot.homeTable.body}
        meta={shot.homeTable.meta}
      />

      <Faq locale={locale} />

      {/* Poslije pitanja — bagrem, dva uspravna kadra jedan uz drugi. */}
      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/real/bagrem-sanduk.webp', alt: shot.homeAcacia.altCrate },
          { src: '/images/real/bagrem-cvat.webp', alt: shot.homeAcacia.altBloom },
        ]}
        caption={shot.homeAcacia.caption}
        meta={shot.homeAcacia.meta}
      />

      <Newsletter locale={locale} />
    </>
  );
}
