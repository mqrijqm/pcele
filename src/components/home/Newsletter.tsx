import Image from 'next/image';

import TransitionLink from '@/components/ui/TransitionLink';
import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * Poziv na kraju strane.
 *
 * Sirok je preko mjere ostatka strane: slog ide ulijevo, snimak udesno, i
 * izmedju njih ostaje vazduh koji sekcija na kraju moze sebi da priusti.
 *
 * **Nema vise polja za email.** Stajalo je tu kao poziv na prijavu, a iza
 * njega nije bilo nikakvog spiska — dugme je samo cekalo pola sekunde i reklo
 * hvala. Umjesto obecanja koje se ne odrzava, sekcija sada vodi na ponudu:
 * pecat na uglu snimka je isti onaj koji stoji uz propolis, pa se prepozna.
 */
export default function Newsletter({ locale }: { locale: Locale }) {
  const copy = home.newsletter[locale];

  return (
    <section className="poziv section-padding text-[#885B27]">
      <div className="poziv__inner">
        <div className="poziv__copy">
          <span className="reveal mb-5 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#885B27]">
            <span className="h-px w-9 bg-[#EEC660]" aria-hidden="true" />
            {copy.eyebrow}
          </span>
          <h2 className="reveal max-w-[18ch] font-display text-display-md font-normal text-[#885B27]">
            {copy.heading}
          </h2>
          <p className="reveal stagger-1 mt-6 max-w-xl text-base leading-7 text-[#885B27]">
            {copy.description}
          </p>
        </div>

        {/*
          Snimak i pecat u istom omotacu: pecat sjedi na donjem lijevom uglu
          snimka i dijelom izlazi iz njega, pa mu mjesto racuna snimak a ne
          sekcija — isto kao znak uz bocicu propolisa.
        */}
        <div className="poziv__slika reveal stagger-2">
          <div className="poziv__okvir">
            <Image
              src="/images/real/tegle-red.webp"
              alt={copy.jarAlt}
              fill
              sizes="(max-width: 1024px) 80vw, 26rem"
              className="object-cover"
            />
          </div>

          <TransitionLink
            className="poziv__znak pecat"
            href={localeHref(locale, '/products')}
            aria-label={home.znakCta[locale]}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/pecat-okusi-tamni.svg" alt="" aria-hidden="true" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
