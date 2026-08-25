import Image from 'next/image';

import OriginMap from './OriginMap';
import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

/**
 * Odakle smo — karta opstine sa tri sela u kojima stoje pcelinjaci.
 *
 * Sekcija je namjerno mirna: sve je centrirano u jednoj koloni, bez kartica i
 * bez okvira, na istom papiru kao ostatak strane. Nosi je kolicina vazduha oko
 * teksta, pa ide na puni `section-padding`.
 *
 * Karta je rasterska. Isporucena je i kao .svg, ali je to bio isti PNG upakovan
 * u <image> u base64 — 932 kB naspram 37 kB koliko ima ovaj WebP, i ni jedan
 * jedini vektorski oblik.
 */
export default function Origin({ locale }: { locale: Locale }) {
  const copy = home.origin[locale];

  return (
    <section className="origin section-padding">
      <div className="container">
        <p className="origin__eyebrow reveal">{copy.eyebrow}</p>

        <h2 className="origin__heading reveal stagger-1">{copy.heading}</h2>

        <OriginMap alt={copy.mapAlt} />

        <p className="origin__note reveal stagger-3">{copy.note}</p>
      </div>

      {/*
        * Znak stoji izvan `.container` jer se drzi donjeg desnog ugla sekcije,
        * a ne mjere teksta.
        */}
      <span className="origin__badge" aria-hidden="true">
        <Image src="/images/brand/znak-krug.svg" alt="" width={120} height={120} />
      </span>
    </section>
  );
}
