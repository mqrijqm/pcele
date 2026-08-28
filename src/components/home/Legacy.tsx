import Image from 'next/image';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

/**
 * Nasljedje — dvije kolone, sire lijevo.
 *
 * Gornji red nosi naslov lijevo i crtez pcelara desno; donji dva snimka
 * lijevo i tekst desno. Sve cetiri celije dijele isti raster, pa se lijeva
 * ivica naslova i lijeva ivica arhivskog snimka poklapaju, a desna kolona
 * stoji u istoj liniji cijelom visinom.
 *
 * Snimak je jedan, u nazubljenom okviru u zelenoj. Sace koje je stajalo preko
 * njega je otislo: bila su to dva snimka koja se bore za isti pogled, a prica
 * ovdje je jedna — pcelinjak kakav je bio.
 *
 * Tekst desno je poravnat po dnu, ne po vrhu: zadnji red ("Med.Porodica.
 * Tradicija") zavrsava tacno tamo gdje i snimak, pa red ispod sekcije ide
 * cist.
 *
 * Raster sa linijama i cetiri oblaka iznad crteza su otisli — linije su
 * dijelile prazne celije koje nisu imale sta da nose, a oblaci su bili jedini
 * crtez na strani koji ne prikazuje nista.
 */
export default function Legacy({ locale }: { locale: Locale }) {
  const copy = home.legacy[locale];

  return (
    <section className="legacy">
      <div className="legacy__inner">
        <header className="legacy__intro reveal">
          <p className="legacy__eyebrow">{copy.eyebrow}</p>
          <span className="legacy__rule" aria-hidden="true" />
          <h2 className="legacy__heading">{copy.heading}</h2>
        </header>

        <Image
          className="legacy__figure reveal stagger-1"
          src="/images/brand/pcelar.svg"
          alt={copy.figureAlt}
          width={5335}
          height={6000}
        />

        <div className="legacy__plates reveal stagger-2">
          {/*
            * Arhivski snimak u okviru. Okvir je crtez, ne CSS obrub: rub mu je
            * nazubljen kao kod stare fotografije s reckastim rubom, a to nijedan
            * `border` ne moze. Zato stoji kao zaseban sloj preko snimka —
            * unutrasnjost mu je prazna, pa se snimak vidi kroz nju.
            */}
          <figure className="legacy__archive">
            <Image
              className="legacy__img"
              src="/images/real/pcelinjak-arhiva.webp"
              alt={copy.archiveAlt}
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="legacy__frame"
              src="/images/brand/okvir.svg"
              alt=""
              aria-hidden="true"
            />
          </figure>
        </div>

        <div className="legacy__copy reveal stagger-3">
          <p className="legacy__body">{copy.body}</p>
          <span className="legacy__rule" aria-hidden="true" />
          <p className="legacy__eyebrow">{copy.chapterEyebrow}</p>
          <p className="legacy__chapter">{copy.chapterHeading}</p>
        </div>
      </div>
    </section>
  );
}
