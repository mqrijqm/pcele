import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

export default function Hero({ locale }: { locale: Locale }) {
  const copy = home.hero[locale];

  return (
    <section className="relative bg-[var(--paper)] header-offset text-[#73552E]">
      {/* `header-offset` vec nosi razmak ispod fiksnog menija — zato je pt mali. */}
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 pb-20 pt-8 sm:px-10 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:pb-32 lg:pl-16 lg:pr-0 lg:pt-10 xl:pl-20">
        {/* Tekst nosi hero. Nista ne stoji iza njega ni preko njega. */}
        <div className="max-w-[34rem]">
          <p className="mb-10 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.19em]">
            <span className="h-px w-10 bg-[#C79A3B]" aria-hidden="true" />
            {copy.badge}
          </p>

          <h1 className="font-display text-display-lg font-normal">{copy.heading}</h1>

          <p className="mt-10 max-w-[30rem] text-[1.02rem] leading-8 sm:text-lg sm:leading-9">
            {copy.description}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-8">
            <Link
              href={localeHref(locale, '/products')}
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#73552E] px-7 py-3.5 text-sm font-semibold text-[#FDF9DC] transition-colors duration-300 hover:bg-[#C79A3B] hover:text-[#73552E]"
            >
              {copy.ctaProducts}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href={localeHref(locale, '/about')}
              className="border-b border-[#73552E]/35 pb-1 text-sm font-semibold transition-colors hover:border-[#C79A3B]"
            >
              {copy.ctaAbout}
            </Link>
          </div>
        </div>

        {/*
         * Jedna slika, izlazi na desnu ivicu ekrana. Bez okvira, bez natpisa
         * preko nje, bez druge slike ispod — hero ima samo dva glasa.
         */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[0.6rem] lg:aspect-[4/5] lg:rounded-l-[3rem] lg:rounded-r-none">
          <Image
            src="/images/real/tegle-red.webp"
            alt={copy.jarAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover object-[60%_45%]"
          />
        </div>
      </div>
    </section>
  );
}
