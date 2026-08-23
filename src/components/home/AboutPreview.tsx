import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

export default function AboutPreview({ locale }: { locale: Locale }) {
  const copy = home.aboutPreview[locale];

  return (
    <section className="overflow-hidden bg-[#73552E] text-[#FDF9DC]">
      <div className="mx-auto grid max-w-[1440px] gap-5 px-[var(--container-padding)] py-6 sm:py-8 lg:grid-cols-[0.7fr_0.3fr]">
        <div className="relative min-h-[31rem] overflow-hidden rounded-[1rem] lg:min-h-[44rem]">
          <Image
            src="/images/real/sace-u-rukama.webp"
            alt={copy.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover"
          />
          {/*
            * Natpis stoji direktno na slici, bez pilule. Da bi se citao i kad
            * ispod njega padne osvijetljeno sace, nosi ga tanka sjenka pri dnu.
            */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2E2109]/60 via-[#2E2109]/25 to-transparent px-6 pb-6 pt-20 sm:px-9 sm:pb-8">
            <p className="about-preview__quote">
              <span className="about-preview__mark">&ldquo;</span>
              {copy.imageCaption}
              <span className="about-preview__mark">&rdquo;</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-[1rem] bg-[var(--paper)] px-6 py-20 lg:py-28 sm:px-10 lg:px-14 lg:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#73552E]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-8 font-display text-display-md font-normal">
            {copy.heading}
          </h2>
          <p className="mt-7 text-base leading-7 text-[#73552E]">{copy.description}</p>

          <div className="mt-9 grid grid-cols-2 border-y border-[#73552E]/15">
            {copy.steps.map((step, index) => (
              <div
                key={step}
                className="border-b border-r border-[#73552E]/15 px-3 py-4 text-xs leading-5 text-[#73552E] odd:pl-0 even:border-r-0 [&:nth-child(n+3)]:border-b-0"
              >
                <span className="mr-2 text-[9px] font-bold tracking-[0.15em] text-[#73552E]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </div>
            ))}
          </div>

          <Link
            href={localeHref(locale, '/process')}
            className="group mt-9 inline-flex w-fit items-center gap-3 border-b border-[#73552E] pb-2 text-sm font-semibold text-[#73552E]"
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
