import Image from 'next/image';
import { Star } from 'lucide-react';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

export default function Testimonials({ locale }: { locale: Locale }) {
  const copy = home.testimonials[locale];
  const [featured, ...rest] = copy.quotes;

  return (
    <section className="relative overflow-hidden bg-[#FDF9DC] py-24 lg:py-32">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-honey-700">
              {copy.eyebrow}
            </span>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.06] tracking-[-0.04em] text-[#73552E] sm:text-5xl">
              {copy.heading}
            </h2>
            <div className="mt-7 flex items-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-[#C79A3B] text-[#C79A3B]" />
                ))}
              </div>
              <span className="text-xs text-[#73552E]">{copy.subheading}</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <figure className="reveal relative overflow-hidden bg-[#73552E] p-7 text-[#FDF9DC] sm:col-span-2 sm:p-10 lg:grid lg:grid-cols-[0.42fr_0.58fr] lg:gap-10 rounded-[2rem]">
              <div className="relative min-h-[280px] overflow-hidden bg-[#73552E]/[0.06] lg:min-h-[390px] rounded-[2rem]">
                <Image
                  src="/images/real/kosnice-prikolica.webp"
                  alt={copy.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover saturate-[0.88]"
                />
              </div>
              <div className="flex flex-col justify-between pt-8 lg:pt-0">
                <span aria-hidden="true" className="font-display text-6xl leading-none text-[#C79A3B]">
                  &ldquo;
                </span>
                <blockquote className="font-display text-2xl font-medium leading-[1.22] text-[#FDF9DC] sm:text-3xl">
                  {featured.text}
                </blockquote>
                <figcaption className="mt-8 border-t border-[#FDF9DC]/20 pt-5 text-sm">
                  <span className="font-semibold text-[#FDF9DC]">{featured.author}</span>
                  <span className="ml-3 text-[#FDF9DC]/90">{featured.city}</span>
                </figcaption>
              </div>
            </figure>

            {rest.map((quote, index) => (
              <figure
                key={quote.author}
                className={`reveal stagger-${index + 1} border-t border-[#73552E]/15 px-1 py-7 sm:p-7`}
              >
                <blockquote className="font-display text-xl font-medium leading-snug text-[#73552E] lg:text-2xl">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                <figcaption className="mt-7 text-xs">
                  <span className="font-semibold text-[#73552E]">{quote.author}</span>
                  <span className="ml-3 text-[#73552E]">{quote.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
