import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * "Znanje koje se prenosi rukama" — jedna centrirana kolona na papiru.
 *
 * Ranije je ovo bila smedja traka sa fotografijom preko dvije trecine sirine
 * i tekstom stisnutim u usku karticu pored nje. Slika je nosila sekciju a
 * tekst se gusio; sada je obrnuto — tekst stoji u sredini, a fotografija je
 * spustena na krug koji ga samo najavljuje.
 *
 * Nema kartice ni okvira: sirinu drzi samo mjera citljivosti reda, pa red
 * ostaje isti i na 1440 i na 1920.
 */
export default function AboutPreview({ locale }: { locale: Locale }) {
  const copy = home.aboutPreview[locale];

  return (
    <section className="about-preview">
      <div className="about-preview__inner">
        <p className="about-preview__eyebrow">{copy.eyebrow}</p>

        {/*
         * Krug. `aspect-square` + `rounded-full` drze oblik bez obzira na
         * rez fotografije, a `object-cover` bira sredinu kadra.
         */}
        <div className="about-preview__circle">
          <Image
            src="/images/real/sace-u-rukama.webp"
            alt={copy.imageAlt}
            fill
            sizes="(max-width: 640px) 60vw, 22rem"
            className="object-cover"
          />
        </div>

        <p className="about-preview__caption">{copy.imageCaption}</p>

        <h2 className="about-preview__heading">{copy.heading}</h2>

        <p className="about-preview__lead">{copy.description}</p>

        {/*
         * Koraci. Broj je sada glavni glas reda — krupan, u istoj serifi kao
         * naslovi — a naziv koraka stoji ispod njega kao potpis.
         */}
        <ol className="about-preview__steps">
          {copy.steps.map((step, index) => (
            <li key={step} className="about-preview__step">
              <span className="about-preview__num">{String(index + 1).padStart(2, '0')}</span>
              <span className="about-preview__label">{step}</span>
            </li>
          ))}
        </ol>

        <Link href={localeHref(locale, '/process')} className="about-preview__cta group">
          {copy.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
