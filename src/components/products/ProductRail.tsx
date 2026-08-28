'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { railScrub } from '@/components/ui/railScrub';
import { products } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * Polica: proizvodi koji se listaju skrolom.
 *
 * Ista traka kao album na pocetnoj — jedna tegla stoji u sredini, susjedne
 * vire iza rubova, i nista se ne krece dok se ne skroluje. Mehanizam je u
 * `railScrub`, ovdje je samo ono sto je za prodavnicu drugacije: krug uz
 * teglu, koji s njom mijenja i natpis i boju.
 *
 * Krug nije slika nego kruzic iscrtan u CSS-u, upravo zato sto mu se boja
 * mijenja. Kao SVG bi trebao sest fajlova za sest proizvoda.
 */

/**
 * Boja kruga po proizvodu. Tri boje iz palete, po jedna za svaku vrstu:
 * bagrem je svijetao pa nosi papir, livadski zlatnu, a propolis i imuno
 * zelenu. Mastilo se bira uz boju, ne uz proizvod — na zelenoj se smedje ne
 * cita.
 */
const BADGE = {
  paper: { bg: 'var(--paper)', ink: 'var(--brown)' },
  gold: { bg: 'var(--gold)', ink: 'var(--brown)' },
  sage: { bg: 'var(--sage)', ink: 'var(--paper)' },
} as const;

const TONE: Record<string, keyof typeof BADGE> = {
  'bagremov-med-1kg': 'paper',
  'bagremov-med-500g': 'paper',
  'livadski-med-1kg': 'gold',
  'livadski-med-500g': 'gold',
  'pcelinji-propolis-20ml': 'sage',
  'imuno-mix-450g': 'sage',
};

/*
 * Prvi i posljednji okvir nikad ne dodju u sredinu — oni samo vire iza
 * rubova. Da bi svaki proizvod dosao na red, red se zatvara u krug: zadnji
 * ide na pocetak, prvi na kraj.
 */
const ORDERED = [...products].sort((a, b) => a.order - b.order);
const SHELF = [ORDERED[ORDERED.length - 1], ...ORDERED, ORDERED[0]];

export default function ProductRail({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  /* Krece od prvog pravog proizvoda, jer nulti okvir samo viri s lijeva. */
  const [centre, setCentre] = useState(1);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];
      railScrub(el, q, setCentre);
    }, el);
    return () => ctx.revert();
  }, []);

  const shown = SHELF[centre] ?? SHELF[1];
  const tone = BADGE[TONE[shown.slug] ?? 'gold'];
  /* Natpis je naziv bez gramaze: "Bagremov med, 1 kg" -> "Bagremov med". */
  const label = shown.name[locale].split(',')[0];

  return (
    <section className="rail rail--shelf" ref={root} style={{ '--rail-count': SHELF.length } as React.CSSProperties}>
      <div className="rail__stage">
        <div className="rail__viewport">
          <ul className="rail__track">
            {SHELF.map((product, i) => (
              <li className="rail__item plate rail__item--square" key={`${product.slug}-${i}`}>
                <Link href={localeHref(locale, `/products/${product.slug}`)} tabIndex={i === centre ? 0 : -1}>
                  <Image
                    className="rail__img rail__img--fit"
                    src={product.image}
                    alt={product.name[locale]}
                    fill
                    sizes="(max-width: 900px) 80vw, 40vw"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/*
            Krug stoji na jednom mjestu i ceka da mu tegla dodje. Mijenja se
            samo ono sto je u njemu: boja i naziv onoga sto je trenutno u
            sredini.
          */}
          <span
            className="rail__badge"
            style={{ '--badge-bg': tone.bg, '--badge-ink': tone.ink } as React.CSSProperties}
          >
            <span className="rail__badgeRing" aria-hidden="true" />
            <span className="rail__badgeText" key={shown.slug}>
              {label}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
