import Link from 'next/link';

import ImageSlot from '@/components/products/ImageSlot';
import SplitTitle from '@/components/products/SplitTitle';

/**
 * Zavrsni poziv.
 *
 * Naslov je najkrupniji na strani i stoji sam u sredini; dvije fotografije
 * su izvan kadra i ulaze tek kad se predje misem preko sadrzaja. Pokret je
 * cisti CSS (`:hover` na sadrzaju pomjera slike), pa sekcija ostaje serverska
 * komponenta i ne nosi ni gram JavaScripta.
 */
export default function CtaMovingImage({
  title,
  button,
  href,
  left,
  right,
}: {
  title: string;
  button: string;
  href: string;
  left: { slot: string; label: string };
  right: { slot: string; label: string };
}) {
  return (
    <section data-snap="off" className="pe-cta">
      <div className="pe-cta__content">
        <SplitTitle text={title} className="pe-display pe-cta__title" />
        <Link className="pe-pill pe-cta__button" href={href}>
          {button}
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            <path
              d="M1 13 13 1M4.6 1H13v8.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <div className="pe-cta__image pe-cta__image--left">
        <ImageSlot slot={left.slot} label={left.label} />
      </div>
      <div className="pe-cta__image pe-cta__image--right">
        <ImageSlot slot={right.slot} label={right.label} />
      </div>
    </section>
  );
}
