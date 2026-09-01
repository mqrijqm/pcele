import type { CSSProperties } from 'react';
import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

/*
 * Tri stupca, pet snimaka.
 *
 * Redoslijed u kojem se citaju je cik-cak: prva tri silaze udesno, druga dva
 * se vracaju ulijevo, i svaki je nizi od prethodnog. Zato su ovdje slozeni po
 * stupcima a ne po redu citanja — stupac je ono sto layout drzi, a `i` je
 * mjesto natpisa u sadrzaju.
 *
 * `label` kaze na kojoj strani snimka stoji natpis. Nije ukras: gornji natpis
 * najavljuje snimak, donji ga potpisuje, i tako se pet natpisa ne poredaju u
 * liniju.
 */
const COLUMNS = [
  [
    { i: 0, src: '/images/real/tegla-stub-livada.webp', w: 684, h: 1040, label: 'top' },
    { i: 4, src: '/images/real/pcele-leto.webp', w: 701, h: 1028, label: 'bottom' },
  ],
  [
    { i: 1, src: '/images/real/tegla-kafa-sto.webp', w: 684, h: 1028, label: 'top' },
    { i: 3, src: '/images/real/vrcaljka-tegla.webp', w: 684, h: 1028, label: 'bottom' },
  ],
  [{ i: 2, src: '/images/real/ramovi-sace.webp', w: 684, h: 1028, label: 'bottom' }],
] as const;

/**
 * Livada: crtez pcelinjaka, recenica pod njim, pa pet snimaka u stepenicu.
 *
 * Sekcija stoji na istom papiru kao karta prije nje, bez svog pojasa i bez
 * okvira — crtez je taj koji je drzi. Ide preko gotovo cijele mjere strane,
 * jer je crtan kao pogled a ne kao ilustracija uz tekst.
 *
 * Crtez i recenica su vektori, oba kao `<img>` a ne umetnuta u stranu. Crtez
 * ima cetiri puta koji zajedno nose deset hiljada poteza; umetnut, to bi bilo
 * deset hiljada cvorova u DOM-u koje preglednik racuna pri svakom skrolu.
 * Ovako ih rasterizuje jednom i dalje se ponasa kao slika.
 *
 * Recenica je slog pretvoren u krivulje, pa je za pretragu i citac ekrana
 * nema — zato ista ta recenica stoji u `alt`-u.
 */
export default function Livada({ locale }: { locale: Locale }) {
  const t = home.livada[locale];

  return (
    <section className="livada section-padding">
      {/*
        * Crtez i pecat u istom omotacu: pecat sjedi na donjem desnom uglu
        * crteza, pa mu mjesto racuna crtez a ne sekcija.
        */}
      <div className="livada__scene reveal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="livada__pejzaz"
          src="/images/brand/pejzaz-kosnice.svg"
          alt={t.pejzazAlt}
          width={393}
          height={187}
          loading="lazy"
          decoding="async"
        />

        {/*
          * Pecat je crtez: rijec u njemu je savijena u luk i niko je ne moze
          * procitati, pa ista ta rijec stoji kao `aria-label` na vezi — isto
          * kao pecat na vitrini.
          */}
        <TransitionLink
          className="livada__seal pecat"
          href={localeHref(locale, '/pcelinjak')}
          aria-label={t.sealLabel}
        >
          <Image src="/images/brand/pecat-pcelinjak.svg" alt="" width={423} height={423} />
        </TransitionLink>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="livada__recenica reveal stagger-1"
        src="/images/brand/recenica-vrcamo.svg"
        alt={t.recenica}
        width={2600}
        height={507}
        loading="lazy"
        decoding="async"
      />

      {/*
        * Snimci u stepenicu: svaki sljedeci je nize za nesto manje od pola
        * svoje visine. Pomak je u postocima, ne u pikselima — tako stepenica
        * ostaje ista i kad se stupci suze.
        */}
      <div className="livada__photos">
        {COLUMNS.map((column, c) => (
          <div className={`livada__column livada__column--${c + 1}`} key={c}>
            {column.map((photo) => (
              <figure
                className={`livada__photo livada__photo--${photo.label} reveal stagger-${photo.i + 1}`}
                key={photo.src}
                /* Na uskom ekranu stupci nestaju, pa poredak vraca ovaj broj. */
                style={{ '--i': photo.i } as CSSProperties}
              >
                <figcaption className="livada__label">{t.photoLabels[photo.i]}</figcaption>
                <Image
                  src={photo.src}
                  alt={t.photoAlts[photo.i]}
                  width={photo.w}
                  height={photo.h}
                  sizes="(max-width: 899px) 78vw, 26vw"
                />
              </figure>
            ))}
          </div>
        ))}
      </div>

    </section>
  );
}
