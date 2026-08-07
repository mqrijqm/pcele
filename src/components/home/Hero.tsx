import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

export default function Hero({ locale }: { locale: Locale }) {
  const copy = home.hero[locale];

  return (
    <section className="relative overflow-hidden bg-[#f3e8d6] pt-24 text-[#332a24]">
      <div className="relative mx-auto min-h-[46rem] max-w-[1440px] px-5 pb-8 pt-14 sm:px-10 lg:min-h-[50rem] lg:px-16 lg:pb-0 lg:pt-16 xl:px-20">
        <div className="relative z-20 max-w-[36rem] lg:pt-24">
          <p className="mb-7 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.19em] text-[#82601f]">
            <span className="h-px w-10 bg-[#b9822c]" aria-hidden="true" />
            {copy.badge}
          </p>
          <h1 className="max-w-[12ch] font-display text-[3.35rem] font-medium leading-[1.02] tracking-[-0.045em] text-[#332a24] sm:text-[4.25rem] lg:text-[4.7rem]">
            {copy.heading}
          </h1>
          <p className="mt-7 max-w-[31rem] text-[1.02rem] leading-7 text-[#66594f] sm:text-lg sm:leading-8">
            {copy.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-7">
            <Link
              href={localeHref(locale, '/products')}
              className="group inline-flex min-h-12 items-center gap-3 rounded-[3px] bg-[#332a24] px-6 py-3 text-sm font-semibold text-[#fff8eb] transition-colors duration-300 hover:bg-[#52604e]"
            >
              {copy.ctaProducts}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href={localeHref(locale, '/about')}
              className="border-b border-[#332a24]/35 pb-1 text-sm font-semibold text-[#4f443c] transition-colors hover:border-[#b9822c] hover:text-[#82601f]"
            >
              {copy.ctaAbout}
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-14 h-[31rem] lg:absolute lg:bottom-0 lg:right-0 lg:top-16 lg:mt-0 lg:h-auto lg:w-[57%]">
          <div className="absolute inset-x-0 top-0 h-[75%] overflow-hidden bg-[#7897a0] lg:left-[12%]">
            <Image
              src="/images/editorial/family-hive-frame-v1.webp"
              alt={copy.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 57vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#45616a]/[0.08]" />
          </div>
          <div className="absolute bottom-0 left-[-4%] h-[72%] w-[55%] overflow-hidden bg-[#f0e6d5] shadow-[0_24px_70px_rgba(65,48,34,0.16)] lg:left-0 lg:w-[53%]">
            <Image
              src="/images/products/livadski-med-brand-v3.webp"
              alt={copy.jarAlt}
              fill
              priority
              sizes="(max-width: 1024px) 55vw, 30vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute bottom-5 right-0 w-[55%] border-t border-[#332a24]/20 bg-[#f3e8d6]/95 px-5 py-4 backdrop-blur-sm sm:w-auto sm:min-w-64">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#82601f]">
              {copy.captionTitle}
            </p>
            <p className="mt-1 text-sm text-[#66594f]">{copy.captionNote}</p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 hidden h-[5.25rem] w-full bg-[#9aa58c] lg:block"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
