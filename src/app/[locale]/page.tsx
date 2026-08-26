import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { photoBreaks } from '@/content/pages';
import HeroLand from '@/components/home/HeroLand';
import HeroJar from '@/components/home/HeroJar';
import Drip from '@/components/home/Drip';
import AboutPreview from '@/components/home/AboutPreview';
import Legacy from '@/components/home/Legacy';
import SorteMeda from '@/components/products/SorteMeda';
import Testimonials from '@/components/home/Testimonials';
import Origin from '@/components/home/Origin';
import Faq from '@/components/home/Faq';
import Newsletter from '@/components/home/Newsletter';
import ImageBreak from '@/components/ui/ImageBreak';
import BeeFlight from '@/components/bee/BeeFlight';

/**
 * Pocetna, jedan tok bez ponavljanja:
 *
 *   hero i identitet -> prelaz na smedju -> porodicna tradicija -> proces ->
 *   mjesto -> utisci -> pitanja -> sorte -> jedan poziv na kraju
 *
 * Sorte su sisle s vrha. Odmah iza heroja su tri sorte trazile odluku od
 * citaoca koji jos nije cuo ciji je to med; sada stoje pri dnu, kad je prica
 * ispricana, i vode pravo u poziv na kraju.
 *
 * Strana je ranije bila za trecinu duza i istu poruku je govorila po tri puta:
 * dva odvojena bloka o tradiciji od 1980, mreza webshop kartica odmah uz
 * sekciju sorti, i pet foto-pauza od kojih su cetiri bile makete tegli u travi
 * i na lanu. Ostalo je ono sto nosi pricu.
 *
 * Od fotografija su otisle makete tegli u travi i na lanu — izgledale su kao
 * reklamna kampanja. Ostale su dvije dokumentarne pauze: proces (tocenje meda
 * i ram iz sezone) i sam pcelinjak prije price o mjestu.
 */
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

      {/*
        Med se prelije preko ruba i strana prelazi na smedju. Sekcija ispod
        je zasad prazna — vazan je prelaz.
      */}
      <Drip />

      {/* Porodicna tradicija: crtez pcelara i arhivski snimci. */}
      <Legacy locale={locale} />

      {/* Proces — cetiri koraka od kosnice do tegle. */}
      <AboutPreview locale={locale} />

      {/* Jedina foto-pauza na strani, i jedina koja nosi novu informaciju. */}
      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/real/punjenje-tegle.webp', alt: shot.homeProces.altPunjenje },
          { src: '/images/real/ram-2025.webp', alt: shot.homeProces.altRam },
        ]}
        caption={shot.homeProces.caption}
        meta={shot.homeProces.meta}
      />

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

      {/* Mjesto i porijeklo. */}
      <Origin locale={locale} />

      <Testimonials locale={locale} />

      <Faq locale={locale} />

      {/* Tri sorte na papiru, tik pred poziv na kraju. */}
      <SorteMeda locale={locale} />

      {/* Jedan poziv na kraju, ne tri. */}
      <Newsletter locale={locale} />
    </>
  );
}
