import type { CSSProperties } from 'react';
import Image from 'next/image';

import { home } from '@/content/pages';
import { type Locale } from '@/i18n/config';

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
 * Livada: recenica, pa pet snimaka u stepenicu.
 *
 * Crtez pcelinjaka je odavde otisao — zauzimao je gotovo cio kadar i drzao
 * stranu na mjestu na kojem se nista nije desavalo. S njim je otisao i pecat
 * koji je vodio na pcelinjake; ta veza sada stoji u sekciji o krajoliku, gdje
 * je i tekst koji je uvodi.
 *
 * Recenica je vektor, i to kao `<img>` a ne umetnuta u stranu: slog je
 * pretvoren u krivulje, pa je za pretragu i citac ekrana nema — zato ista ta
 * recenica stoji u `alt`-u.
 */
export default function Livada({ locale }: { locale: Locale }) {
  const t = home.livada[locale];

  return (
    <section className="livada section-padding">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="livada__recenica reveal"
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
