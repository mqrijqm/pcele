import Link from 'next/link';

import ImageSlot from '@/components/products/ImageSlot';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * Pojas u boji: jedan proizvod, tegla i nekoliko recenica.
 *
 * Pojas je tu da razbije dugaÄak niz sekcija na papiru â€” isti posao koji na
 * referentnoj strani nosi rozi pojas sa dokumentacijom. Boja je iz nase
 * palete, izvedena iz zlatne, pa ne uvodi nista novo.
 */
export default function ProductBand({
  locale,
  label,
  heading,
  body,
  cta,
  href,
  slot,
  slotLabel,
}: {
  locale: Locale;
  label: string;
  heading: string;
  body: string;
  cta: string;
  href: string;
  slot: string;
  slotLabel: string;
}) {
  return (
    <section data-snap="off" className="pe-band">
      <div className="pe-band__inner">
        <div className="pe-band__image reveal reveal-scale">
          <ImageSlot slot={slot} label={slotLabel} />
        </div>

        <div className="pe-band__text">
          <p className="pe-label reveal">{label}</p>
          <h2 className="pe-title reveal stagger-1">{heading}</h2>
          <p className="pe-body pe-band__body reveal stagger-2">{body}</p>

          <Link className="pe-band__cta reveal stagger-3" href={localeHref(locale, href)}>
            {cta}
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true" focusable="false">
              <path
                d="M0 5h14M10 1l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
