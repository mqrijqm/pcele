import Image from 'next/image';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

/**
 * Visine su iz samih fajlova (svi su 400 siroki), da Next rezervise tacan
 * okvir i nista ne poskoci kad se crtez ucita.
 */
const CLOUDS = [
  { n: 1, h: 140 },
  { n: 2, h: 337 },
  { n: 3, h: 151 },
  { n: 4, h: 202 },
] as const;

/**
 * Nasljedje — puna strana, crtez gore, pa raster ispod.
 *
 * Sekcija ide od ivice do ivice ekrana, bez `.container`: donji raster zivi od
 * toga da arhivski snimak dodiruje lijevu ivicu, a linije koje dijele celije
 * idu do kraja. Zato se uvlacenje radi po celiji, a ne po sekciji.
 *
 * Linije nisu ukras nego jedini okvir koji raster ima — nema kartica, nema
 * sjenki. Crtaju se kao `border` na samim celijama, ukljucujuci i dvije prazne,
 * jer prazan prostor ovdje nosi isto koliko i sadrzaj.
 */
export default function Legacy({ locale }: { locale: Locale }) {
  const copy = home.legacy[locale];

  return (
    <section className="legacy">
      <div className="legacy__head">
        {/*
          * Cetiri razlicita oblaka, sitna i razbacana po nebu iza pcelara.
          * Svaki je svoj crtez, pa nema para koji se cita kao ponavljanje —
          * mjere i mjesta su u CSS-u, jer se oba mijenjaju sa sirinom ekrana.
          */}
        {CLOUDS.map((c) => (
          <span key={c.n} className={`legacy__cloud legacy__cloud--${c.n}`} aria-hidden="true">
            <Image src={`/images/brand/oblak-${c.n}.svg`} alt="" width={400} height={c.h} />
          </span>
        ))}

        <Image
          className="legacy__figure reveal"
          src="/images/brand/pcelar.svg"
          alt={copy.figureAlt}
          width={5335}
          height={6000}
          priority={false}
        />

        <h2 className="legacy__heading reveal stagger-1">{copy.heading}</h2>
      </div>

      <div className="legacy__grid">
        <figure className="legacy__archive">
          <Image
            src="/images/real/pcelinjak-arhiva.webp"
            alt={copy.archiveAlt}
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
            className="legacy__img"
          />
        </figure>

        <div className="legacy__copy">
          <p className="legacy__eyebrow">{copy.eyebrow}</p>
          <p className="legacy__body">{copy.body}</p>
        </div>

        {/* Prazne celije — nose linije rastera, nista drugo. */}
        <div className="legacy__void legacy__void--a" aria-hidden="true" />
        <div className="legacy__void legacy__void--b" aria-hidden="true" />
        <div className="legacy__void legacy__void--c" aria-hidden="true" />

        {/*
          * Sace presijeca liniju izmedju dva reda umjesto da stane u jedan —
          * jedini element koji izlazi iz rastera, pa mu i pogled prvo ide.
          */}
        <figure className="legacy__comb">
          <Image
            src="/images/real/sace-posuda.webp"
            alt={copy.combAlt}
            fill
            sizes="(max-width: 900px) 100vw, 34vw"
            className="legacy__img"
          />
        </figure>

        <div className="legacy__chapter">
          <p className="legacy__eyebrow">{copy.chapterEyebrow}</p>
          <p className="legacy__chapter-heading">{copy.chapterHeading}</p>
        </div>
      </div>
    </section>
  );
}
