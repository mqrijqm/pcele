import Image from 'next/image';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

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
          * Oblaci su isti crtez dva puta, drugi izvrnut — jeftinije od dva
          * fajla, a oko ionako ne prepoznaje da je isti oblik.
          */}
        <span className="legacy__cloud legacy__cloud--left" aria-hidden="true">
          <Image src="/images/brand/oblak.svg" alt="" width={594} height={317} />
        </span>
        <span className="legacy__cloud legacy__cloud--right" aria-hidden="true">
          <Image src="/images/brand/oblak.svg" alt="" width={594} height={317} />
        </span>

        <Image
          className="legacy__figure reveal"
          src="/images/brand/pcelar.svg"
          alt={copy.figureAlt}
          width={791}
          height={787}
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
