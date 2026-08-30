import Image from 'next/image';
import Link from 'next/link';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

/** Snimci idu redom kojim su i nacrtani — svaki sljedeci nize i desnije. */
const PHOTOS = [
  { src: '/images/real/tegla-stub-livada.webp', width: 684, height: 1040 },
  { src: '/images/real/tegla-kafa-sto.webp', width: 684, height: 1028 },
  { src: '/images/real/ramovi-sace.webp', width: 684, height: 1028 },
] as const;

/**
 * Livada: crtez pcelinjaka, recenica pod njim, pa tri snimka u stepenicu.
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

        <Link
          className="livada__seal"
          href={localeHref(locale, '/pcelinjak')}
          aria-label={t.sealLabel}
        >
          <svg viewBox="0 0 127 127" aria-hidden="true" focusable="false">
            <circle cx="63.5" cy="63.5" r="63.5" fill="var(--gold)" />

            {/*
              * Rijec ide po luku kao slog, ne kao crtez — tako se prevodi
              * zajedno s ostatkom strane i ostaje ostra na svakoj mjeri.
              *
              * Luk je siri od kruga i sredina mu je ispod njega, pa se rijec
              * jedva savija i sjedi blizu sredine pecata, kao na ostalima —
              * luk po samom rubu bi je odnio pod gornju ivicu.
              */}
            <path id="livada-seal-arc" d="M 22 68 A 62 62 0 0 1 105 68" fill="none" />
            <text className="livada__sealWord">
              <textPath href="#livada-seal-arc" startOffset="50%" textAnchor="middle">
                {t.seal}
              </textPath>
            </text>

            {/* Strelica pod rijecju: potez i vrh, u istom glasu kao ostali pecati. */}
            <path
              className="livada__sealArrow"
              d="M 55.5 78 H 71.5 M 67 73.5 L 71.5 78 L 67 82.5"
            />

            {/*
              * Prsten se vrti, natpis stoji — zato je zadnji i sam za sebe.
              */}
            <circle
              className="livada__sealRing"
              cx="63.5"
              cy="63.5"
              r="55.1187"
              fill="none"
              stroke="var(--paper)"
              strokeWidth="0.762519"
              strokeDasharray="7 7"
            />
          </svg>
        </Link>
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
        * Tri snimka u stepenicu: svaki sljedeci je nize za nesto manje od
        * pola svoje visine. Pomak je u postocima sirine omotaca, ne u
        * pikselima — tako stepenica ostaje ista i kad se stupci suze.
        */}
      <div className="livada__photos">
        {PHOTOS.map((photo, i) => (
          <figure className={`livada__photo reveal stagger-${i + 1}`} key={photo.src}>
            <Image
              src={photo.src}
              alt={t.photoAlts[i]}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 899px) 78vw, 26vw"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
