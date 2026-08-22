import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { photoBreaks } from '@/content/pages';
import JarShowcase from '@/components/home/JarShowcase';
import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Testimonials from '@/components/home/Testimonials';
import Faq from '@/components/home/Faq';
import Newsletter from '@/components/home/Newsletter';
import ImageBreak from '@/components/ui/ImageBreak';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const shot = photoBreaks[locale];

  return (
    <>
      <Hero locale={locale} />
      <JarShowcase />

      {/* Poslije 3D tegle — ista tegla, ali stvarna, u pcelinjaku. */}
      <ImageBreak
        images={[{ src: '/images/mockups/jars-row-apiary.webp', alt: shot.homeApiary.alt }]}
        caption={shot.homeApiary.caption}
        meta={shot.homeApiary.meta}
      />

      <AboutPreview locale={locale} />

      {/* Poslije price o porodici — ruke koje taj posao rade. */}
      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/mockups/beekeeper-jar-frame.webp', alt: shot.homeHands.altFrame },
          { src: '/images/mockups/label-in-hands.webp', alt: shot.homeHands.altLabel },
        ]}
        caption={shot.homeHands.caption}
        meta={shot.homeHands.meta}
        background="#73552E0F"
      />

      <FeaturedProducts locale={locale} />

      {/* Poslije proizvoda — studijski raster, kao katalog. */}
      <ImageBreak
        images={[{ src: '/images/mockups/jars-pattern-studio.webp', alt: shot.homeStudio.alt }]}
        caption={shot.homeStudio.caption}
        meta={shot.homeStudio.meta}
      />

      <Testimonials locale={locale} />

      {/* Poslije utisaka — jedina pauza koja nosi i tekst. */}
      <ImageBreak
        variant="framed"
        images={[{ src: '/images/mockups/jars-linen-sunset.webp', alt: shot.homeTable.alt }]}
        caption={shot.homeTable.caption}
        heading={shot.homeTable.heading}
        body={shot.homeTable.body}
        meta={shot.homeTable.meta}
        background="#73552E0F"
      />

      <Faq locale={locale} />

      {/* Poslije pitanja — livada iz koje sve dolazi. */}
      <ImageBreak
        images={[{ src: '/images/mockups/jars-grass-flatlay.webp', alt: shot.homeGrass.alt }]}
        caption={shot.homeGrass.caption}
        meta={shot.homeGrass.meta}
      />

      <Newsletter locale={locale} />
    </>
  );
}
