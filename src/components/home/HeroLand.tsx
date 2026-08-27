import HeroFilm from '@/components/home/HeroFilm';
import type { Locale } from '@/i18n/config';

/**
 * Pocetni ekran: crtez livade, sa wordmarkom i pisanim natpisom polozenim
 * preko njega.
 *
 * Pozadina je snimak, ne crtez: kamera se spusta preko polja do pcelinjaka i
 * stane na pcelaru. Na snimku nema ni slova ni pcele, sve sto se vidi preko
 * njega je zaseban element. Zato se lockup moze pomerati i prevoditi, ostaje
 * ostar na svakoj velicini, i pcela koja leti kroz stranu je jedina pcela u
 * heroju.
 *
 * Snimak ne ide u krug. Vrti se jednom i stane na zadnjem kadru — pcelinjak
 * ostaje kao mirna slika, kao sto je crtez i bio. Vracanje na pocetak bi na
 * naguravanju kamere bilo trzaj, ne petlja.
 *
 * Kadar je cio kadar iz originala. Ranije je bio isjecen na omjer plate pa
 * naduvan na 1600 — crtez je zbog toga stajao zumiran i mekan. Sada snimak
 * nosi svoju punu sirinu, a razlika do omjera plate je dopunjena bojom papira
 * u samom fajlu, pa se dopuna ne vidi.
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
      ? 'Crtež livada i brda oko Mračaja'
      : 'A drawing of the meadows and hills around Mračaj';

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
