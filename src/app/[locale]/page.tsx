import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { photoBreaks } from '@/content/pages';
import HeroLand from '@/components/home/HeroLand';
import HeroJar from '@/components/home/HeroJar';
import AboutPreview from '@/components/home/AboutPreview';
import FeaturedProducts from '@/components/home/FeaturedProducts';
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

      {/* Poslije heroja — ista tegla, ali stvarna, u pcelinjaku. */}
      <ImageBreak
        images={[{ src: '/images/real/tegla-livada.webp', alt: shot.homeApiary.alt }]}
        caption={shot.homeApiary.caption}
        meta={shot.homeApiary.meta}
        // Uspravan snimak: siroka traka bi mu odsekla i teglu i lice, pa ide
        // u uzi okvir i zadrzava svoj prirodni rez.
        frame="narrow"
        aspect="aspect-[4/5]"
      />

      <AboutPreview locale={locale} />

      {/* Poslije price o porodici — med poslije vrcanja, pa etiketa rukom. */}
      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/real/kante-med.webp', alt: shot.homeHands.altFrame },
          { src: '/images/mockups/label-in-hands.webp', alt: shot.homeHands.altLabel },
        ]}
        caption={shot.homeHands.caption}
        meta={shot.homeHands.meta}
      />

      <FeaturedProducts locale={locale} />

      {/* Poslije proizvoda — studijski raster, kao katalog. */}
      <ImageBreak
        images={[{ src: '/images/real/tegle-raster.webp', alt: shot.homeStudio.alt }]}
        caption={shot.homeStudio.caption}
        meta={shot.homeStudio.meta}
      />

      <Testimonials locale={locale} />

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
