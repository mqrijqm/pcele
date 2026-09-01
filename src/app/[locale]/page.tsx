import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import HeroLand from '@/components/home/HeroLand';
import HeroJar from '@/components/home/HeroJar';
import Apiary from '@/components/home/Apiary';
import Priroda from '@/components/home/Priroda';
import Drip from '@/components/home/Drip';
import Geslo from '@/components/home/Geslo';
import Podjela from '@/components/home/Podjela';
import Ponuda from '@/components/home/Ponuda';
import PhotoRail from '@/components/home/PhotoRail';
import Vitrina from '@/components/home/Vitrina';
import Testimonials from '@/components/home/Testimonials';
import Origin from '@/components/home/Origin';
import Livada from '@/components/home/Livada';
import Krajolik from '@/components/home/Krajolik';
import Propolis from '@/components/home/Propolis';
import Faq from '@/components/home/Faq';
import Newsletter from '@/components/home/Newsletter';
import BeeFlight from '@/components/bee/BeeFlight';

/**
 * Pocetna, jedan tok bez ponavljanja:
 *
 *   crtez livade -> prelaz na smedju i natrag -> tegla -> album ->
 *   porodicna tradicija -> mjesto -> dvije sorte -> utisci -> pitanja ->
 *   sorte -> poziv
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

      {/*
        Vitrina stoji u drugoj kapi: med se opet prelije preko papira, sekcija
        se odvija u njemu, pa se istim potezom vrati na papir. Isti prelaz kao
        na pojasu s geslom — dva medena pojasa drze stranu, jedan pri vrhu i
        jedan pri kraju.
      */}
      <Drip>
        <Vitrina locale={locale} />
      </Drip>


      {/* Mjesto i porijeklo. */}
      <Origin locale={locale} />

      {/*
        Odmah iza karte, a prije crteza pcelinjaka: dvije sorte jedna nasuprot
        druge. Sekcija se otvara kao jedna fotografija presjecena po sredini,
        pa je skrol skupi u dvije karte na papiru.

        Stoji tu jer je karta upravo rekla odakle med dolazi — a ovo je prvo
        mjesto na strani gdje se vidi sta iz toga izlazi.
      */}
      <Podjela locale={locale} />

      {/*
        Iza karte, na istom papiru: crtez pcelinjaka preko gotovo cijele
        mjere, recenica pod njim, pa tri snimka u stepenicu.
      */}
      <Livada locale={locale} />

      {/*
        Livadski med: tegla na medenoj plohi, kamilica oko nje, slog desno.
        Stoji pred propolisom — prvo ono glavno iz kosnice, pa ostalo.
      */}
      <Ponuda locale={locale} sorta="livadski" />

      {/* Propolis: bocica, grancica koja se iscrta oko nje, pa natpisi. */}
      <Propolis locale={locale} />

      {/*
        Bagremov med: ista sekcija, okrenuta. Slog lijevo, tegla i grana desno,
        papir umjesto meda, medeni krug umjesto krem — dvije sorte razmjenjuju
        iste dvije boje i stoje jedna nasuprot druge, da niz ne bude niz istih
        strana.

        Stoji iza propolisa, ne odmah uz livadski: dvije iste sekcije jedna za
        drugom se citaju kao jedna duga, ma koliko bile okrenute.
      */}
      <Ponuda locale={locale} sorta="bagremov" />

      {/*
        Med koji pamti krajolik. Dolazi poslije tri sorte i kaze zasto se
        razlikuju: ne po receptu nego po tome sta je te godine cvjetalo. Zato
        stoji tek ovdje — prije nego se sorte vide, nema sta da objasni.
      */}
      <div className="bloomfield">
        <Krajolik locale={locale} />
      </div>

      <Testimonials locale={locale} />

      {/*
        Ovdje dolazi nova sekcija. Do tada stoji sam vazduh i jedna recenica —
        praznina je namjerna, da se vidi da tu nesto ide, a ne da je strana
        naglo zavrsila.
      */}
      <p className="urazvoju">{locale === 'sr' ? 'Sljedeće sekcije su u razvoju.' : 'The next sections are in progress.'}</p>

      <Faq locale={locale} />

      {/* Jedan poziv na kraju, ne tri. */}
      <Newsletter locale={locale} />
    </>
  );
}
