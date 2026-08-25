import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { photoBreaks } from '@/content/pages';
import HeroLand from '@/components/home/HeroLand';
import HeroJar from '@/components/home/HeroJar';
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
 *   hero i identitet -> glavni proizvodi -> porodicna tradicija -> proces ->
 *   mjesto -> utisci -> pitanja -> jedan poziv na kraju
 *
 * Strana je ranije bila za trecinu duza i istu poruku je govorila po tri puta:
 * dva odvojena bloka o tradiciji od 1980, mreza webshop kartica odmah uz
 * sekciju sorti, i pet foto-pauza od kojih su cetiri bile makete tegli u travi
 * i na lanu. Ostalo je ono sto nosi pricu.
 *
 * Od fotografija na pocetnoj ostaje jedna pauza, i to dokumentarna: tocenje
 * meda i ram iz sezone. Makete su otisle jer su izgledale kao reklamna
 * kampanja, a snimci pcelinjaka jer su plave i zute kosnice na njima jace od
 * samog brenda.
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

      {/* Glavni proizvodi — tri sorte na papiru. */}
      <SorteMeda locale={locale} />

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

      {/* Mjesto i porijeklo. */}
      <Origin locale={locale} />

      <Testimonials locale={locale} />

      <Faq locale={locale} />

      {/* Jedan poziv na kraju, ne tri. */}
      <Newsletter locale={locale} />
    </>
  );
}
