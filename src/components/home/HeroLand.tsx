import type { Locale } from '@/i18n/config';

/**
 * Pocetni ekran: crtez livade, sa wordmarkom i pisanim natpisom polozenim
 * preko njega.
 *
 * Pozadina je crtez livade, u smedjoj, s redom kosnica na grebenu. Na crtezu
 * nema ni slova ni pcele, sve sto se vidi preko njega je zaseban element.
 * Zato se lockup moze pomerati i prevoditi, ostaje ostar na svakoj velicini,
 * i pcela koja leti kroz stranu je jedina pcela u heroju.
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
      ? 'Crtež livade oko Mračaja: niski brežuljci s drvoredima i grmljem'
      : 'A drawing of the meadows around Mračaj: low hills lined with trees and shrubs';

  const script = locale === 'sr' ? 'Listaj i prati pčelu' : 'Scroll and follow the bee';

  return (
    <section className="hero-land">
      <div className="hero-land__plate">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-land__drawing" src="/hero/livada-crtez.svg" alt={alt} />

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
