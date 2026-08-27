import HeroFilm from '@/components/home/HeroFilm';
import type { Locale } from '@/i18n/config';

/**
 * Pocetni ekran: crtez livade, sa wordmarkom i pisanim natpisom polozenim
 * preko njega.
 *
 * Pozadina je snimak, ne crtez: pcela preleti livadu i pred njom se podignu
 * kosnice. Na snimku nema slova, sve sto se vidi preko njega je zaseban
 * element. Zato se lockup moze pomerati i prevoditi, i ostaje ostar na svakoj
 * velicini.
 *
 * Snimak ne ide u krug. Vrti se jednom i stane na zadnjem kadru — pcelinjak
 * ostaje kao mirna slika, kao sto je crtez i bio. Vracanje na pocetak bi na
 * naguravanju kamere bilo trzaj, ne petlja.
 *
 * Kadar je cio kadar iz originala, nista nije isjeceno. Razlika do omjera
 * plate je dopunjena bojom papira u samom fajlu, i to sva gore: gornji rub je
 * prazno nebo pa se dopuna tamo ne vidi, a prednji plan s kosnicama sjeda na
 * donji rub — tamo gdje ga maska u CSS-u gasi u papir.
 *
 * Svaka pozicija je procenat plate, a plata je container, pa se ceo sklop
 * skalira kao jedan komad na bilo kojoj sirini.
 *
 * Natpis i strelica su razdvojeni u dva fajla iz istog crteza (rati.svg), sa
 * istim viewBox-om — zato se preklapaju tacno, a mogu da se ispisuju jedno za
 * drugim: prvo se napise recenica, pa onda strelica krene ka pceli.
 */
export default function HeroLand({ locale }: { locale: Locale }) {
  const alt =
    locale === 'sr'
      ? 'Crtež livade oko Mračaja: pčela dolijeće do reda košnica'
      : 'A drawing of the meadows around Mračaj: a bee flying in to a row of hives';

  const script = locale === 'sr' ? 'Listaj i prati pčelu' : 'Scroll and follow the bee';

  return (
    <section className="hero-land">
      <div className="hero-land__plate">
        <HeroFilm alt={alt} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-land__script" src="/hero/rati-script.svg" alt={script} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-land__arrow" src="/hero/rati-arrow.svg" alt="" aria-hidden="true" />

        <h1 className="hero-land__wordmark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/foot.svg" alt="Pčelarstvo Jevtić" />
        </h1>
      </div>
    </section>
  );
}
