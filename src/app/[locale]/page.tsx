import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { photoBreaks } from '@/content/pages';
import HeroLand from '@/components/home/HeroLand';
import HeroJar from '@/components/home/HeroJar';
import Apiary from '@/components/home/Apiary';
import Drip from '@/components/home/Drip';
import Geslo from '@/components/home/Geslo';
import PhotoRail from '@/components/home/PhotoRail';
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
 *   crtez livade -> prelaz na smedju i natrag -> tegla -> album ->
 *   porodicna tradicija -> mjesto -> utisci -> pitanja -> sorte -> poziv
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
 * reklamna kampanja. Za njima je otisla i pauza sa vrcanjem i ramom: oba
 * snimka vec stoje tamo gdje im je mjesto, na strani o procesu i u blogu, pa
 * su ovdje samo usporavala tok. Ostala je jedna pauza, sam pcelinjak, prije
 * price o mjestu.
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

      {/*
        Odmah za herojem: med se prelije preko ruba, strana potamni, pa se na
        dnu pojasa istim potezom vrati na papir. U pojasu stoji geslo — jedan
        red preko cijele sirine, s crtezima oko njega.
      */}
      <Drip>
        <Geslo locale={locale} />
      </Drip>

      <HeroJar locale={locale} />

      {/* Pcelinjak: snimak preko cijelog kadra koji se odmakne i progovori. */}
      <Apiary locale={locale} />

      {/* Album: snimci s pcelinjaka koji se listaju skrolom. */}
      <PhotoRail locale={locale} />

      {/* Porodicna tradicija: crtez pcelara i arhivski snimci. */}
      <Legacy locale={locale} />

      {/* Jedina foto-pauza na strani: pcelinjak, prije nego sto krene prica o mjestu. */}
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
