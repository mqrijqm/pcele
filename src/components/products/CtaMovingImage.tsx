import Link from 'next/link';

import ImageSlot from '@/components/products/ImageSlot';
import SplitTitle from '@/components/products/SplitTitle';
import Image from 'next/image';

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
        <Link
          className="brand-cta brand-cta--pill pe-cta__button"
          href={href}
          aria-label={button}
        >
          <Image
            className="brand-cta__art"
            src="/hero/okusi-slast.svg"
            alt=""
            aria-hidden="true"
            width={367}
            height={136}
          />
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
