import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import HeroLand from '@/components/home/HeroLand';
import HeroJar from '@/components/home/HeroJar';
import Apiary from '@/components/home/Apiary';
import Priroda from '@/components/home/Priroda';
import Drip from '@/components/home/Drip';
import Geslo from '@/components/home/Geslo';
import PhotoRail from '@/components/home/PhotoRail';
import Origin from '@/components/home/Origin';
import Livada from '@/components/home/Livada';
import Ponuda from '@/components/home/Ponuda';
import Propolis from '@/components/home/Propolis';
import Krajolik from '@/components/home/Krajolik';
import ProductTriptych from '@/components/home/ProductTriptych';
import Newsletter from '@/components/home/Newsletter';
import BeeFlight from '@/components/bee/BeeFlight';

/**
 * Pocetna vodi od identiteta kuce pravo ka proizvodima, pa tek onda pokazuje
 * pcelinjak, porijeklo i krajolik iz kojih ti proizvodi nastaju.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

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

      {/*
        Polje cvijeca ide ispod obje sekcije koje slijede, pa uzorak tece
        preko ruba medju njima — inace bi se vidjelo gdje jedna prestaje.
      */}
      <div className="bloomfield">
        {/* U dodiru s prirodom: snimak, naslov i tekst jedno uz drugo. */}
        <Priroda locale={locale} />

        {/* Album: snimci s pcelinjaka koji se listaju skrolom. */}
        <PhotoRail locale={locale} />
      </div>

      {/* Mjesto i porijeklo. */}
      <Origin locale={locale} />

      {/* Tri ilustrativne produktne scene, poslije odakle med dolazi. */}
      <Ponuda locale={locale} sorta="livadski" />
      <Propolis locale={locale} />
      <Ponuda locale={locale} sorta="bagremov" />

      {/*
        Iza karte, na istom papiru: crtez pcelinjaka preko gotovo cijele
        mjere, recenica pod njim, pa tri snimka u stepenicu.
      */}
      <Livada locale={locale} />

      {/*
        Med koji pamti krajolik. Poslije proizvoda i mjesta porijekla objasnjava
        zasto se svaka berba razlikuje: po onome sto je te godine cvjetalo.
      */}
      {/*
        Krajolik i poziv dijele jedno polje cvijeca: uzorak tece preko ruba
        medju njima i gasi se tek na dnu strane, pa se ne vidi gdje jedna
        sekcija prestaje a druga pocinje. Poziv je zato ostao bez svoje
        plohe — papir mu dolazi odavde.
      */}
      <div className="bloomfield">
        <Krajolik locale={locale} />

        {/* Tri proizvoda, bez teksta, kao čista fotografska traka. */}
        <ProductTriptych />

        {/* Jedan poziv na kraju, ne tri. */}
        <Newsletter locale={locale} />
      </div>
    </>
  );
}
