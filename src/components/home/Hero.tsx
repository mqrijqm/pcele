import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

export default function Hero({ locale }: { locale: Locale }) {
  const copy = home.hero[locale];

  return (
    <section className="relative overflow-hidden bg-[#8A5A2B]/[0.06] pt-24 text-[#8A5A2B]">
      <div className="relative mx-auto min-h-[46rem] max-w-[1440px] px-5 pb-8 pt-14 sm:px-10 lg:min-h-[50rem] lg:px-16 lg:pb-0 lg:pt-16 xl:px-20">
        <div className="relative z-20 max-w-[36rem] lg:pt-24">
          <p className="mb-7 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.19em] text-[#8A5A2B]">
            <span className="h-px w-10 bg-[#C89B3C]" aria-hidden="true" />
            {copy.badge}
          </p>
          <h1 className="max-w-[12ch] font-display text-[3.35rem] font-medium leading-[1.02] tracking-[-0.045em] text-[#8A5A2B] sm:text-[4.25rem] lg:text-[4.7rem]">
            {copy.heading}
          </h1>
          <p className="mt-7 max-w-[31rem] text-[1.02rem] leading-7 text-[#8A5A2B]/75 sm:text-lg sm:leading-8">
            {copy.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-7">
            <Link
              href={localeHref(locale, '/products')}
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#8A5A2B] px-7 py-3.5 text-sm font-semibold text-[#FFF7E6] transition-colors duration-300 hover:bg-[#8A5A2B]"
            >
              {copy.ctaProducts}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href={localeHref(locale, '/about')}
              className="border-b border-[#8A5A2B]/35 pb-1 text-sm font-semibold text-[#8A5A2B]/75 transition-colors hover:border-[#C89B3C] hover:text-[#8A5A2B]"
            >
              {copy.ctaAbout}
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-14 h-[31rem] lg:absolute lg:bottom-0 lg:right-0 lg:top-16 lg:mt-0 lg:h-auto lg:w-[57%]">
          <div className="absolute inset-x-0 top-0 h-[75%] overflow-hidden rounded-[9rem_9rem_2.5rem_2.5rem] bg-[#8A5A2B] lg:left-[12%]">
            <Image
              src="/images/real/ram-2025.webp"
              alt={copy.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 57vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#8A5A2B]/[0.08]" />
          </div>
          <div className="absolute bottom-0 left-[-4%] h-[72%] w-[55%] overflow-hidden rounded-[2.5rem] bg-[#8A5A2B]/[0.06] shadow-[0_24px_70px_rgba(138,90,43,0.16)] lg:left-0 lg:w-[53%]">
            <Image
              src="/images/real/kante-med.webp"
              alt={copy.jarAlt}
              fill
              priority
              sizes="(max-width: 1024px) 55vw, 30vw"
              className="object-cover object-[50%_62%]"
            />
          </div>
          <div className="absolute bottom-5 right-0 w-[55%] rounded-[1.5rem] border border-[#8A5A2B]/15 bg-[#FFF7E6]/95 px-6 py-5 backdrop-blur-sm sm:w-auto sm:min-w-64">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A5A2B]">
              {copy.captionTitle}
            </p>
            <p className="mt-1 text-sm text-[#8A5A2B]/75">{copy.captionNote}</p>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 hidden h-[5.25rem] w-full rounded-t-[3rem] bg-[#8A5A2B] lg:block"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
