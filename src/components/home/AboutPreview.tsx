import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

export default function AboutPreview({ locale }: { locale: Locale }) {
  const copy = home.aboutPreview[locale];

  return (
    <section className="overflow-hidden bg-[#9aa58c] text-[#332a24]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.63fr_0.37fr]">
        <div className="relative min-h-[31rem] lg:min-h-[44rem]">
          <Image
            src="/images/hero/uncapping-documentary-v1.webp"
            alt={copy.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 63vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#35504a]/[0.08]" />
          <div className="absolute bottom-6 left-6 border-l border-white/65 bg-[#324038]/85 px-5 py-4 text-[#fff8eb] backdrop-blur-sm sm:bottom-8 sm:left-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c47f]">
              {copy.imageCaption}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-[#f3e8d6] px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#82601f]">
            {copy.eyebrow}
          </p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-[1.06] tracking-[-0.04em] sm:text-5xl">
            {copy.heading}
          </h2>
          <p className="mt-7 text-base leading-7 text-[#66594f]">{copy.description}</p>

          <div className="mt-9 grid grid-cols-2 border-y border-[#332a24]/15">
            {copy.steps.map((step, index) => (
              <div
                key={step}
                className="border-b border-r border-[#332a24]/15 px-3 py-4 text-xs leading-5 text-[#5e5147] odd:pl-0 even:border-r-0 [&:nth-child(n+3)]:border-b-0"
              >
                <span className="mr-2 text-[9px] font-bold tracking-[0.15em] text-[#82601f]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </div>
            ))}
          </div>

          <Link
            href={localeHref(locale, '/process')}
            className="group mt-9 inline-flex w-fit items-center gap-3 border-b border-[#82601f] pb-2 text-sm font-semibold text-[#332a24]"
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
