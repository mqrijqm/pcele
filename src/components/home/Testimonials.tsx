import Image from 'next/image';
import { Star } from 'lucide-react';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

export default function Testimonials({ locale }: { locale: Locale }) {
  const copy = home.testimonials[locale];
  const [featured, ...rest] = copy.quotes;

  return (
    <section className="relative overflow-hidden bg-[var(--paper)] section-padding">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-honey-700">
              {copy.eyebrow}
            </span>
            <h2 className="mt-8 font-display text-display-md font-normal text-[#73552E]">
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
            <figure className="reveal relative overflow-hidden bg-[#73552E] p-4 text-[#F5E8D8] sm:col-span-2 sm:p-5 lg:grid lg:grid-cols-[0.52fr_0.48fr] lg:gap-9 rounded-[0.6rem]">
              <div className="relative min-h-[320px] overflow-hidden bg-[#73552E]/[0.06] lg:min-h-[460px] rounded-[0.6rem]">
                <Image
                  src="/images/real/sace-kasika.webp"
                  alt={copy.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between pt-7 lg:py-4 lg:pr-3">
                <span aria-hidden="true" className="font-display text-6xl leading-none text-[#C79A3B]">
                  &ldquo;
                </span>
                <blockquote className="font-display text-2xl font-medium leading-[1.22] text-[#F5E8D8] sm:text-3xl">
                  {featured.text}
                </blockquote>
                <figcaption className="mt-8 border-t border-[#F5E8D8]/20 pt-5 text-sm">
                  <span className="font-semibold text-[#F5E8D8]">{featured.author}</span>
                  <span className="ml-3 text-[#F5E8D8]/90">{featured.city}</span>
                </figcaption>
              </div>
            </figure>

            {rest.map((quote, index) => (
              <figure
                key={quote.author}
                className={`reveal stagger-${index + 1} border-t border-[#73552E]/15 px-1 py-7 sm:p-7`}
              >
                <blockquote className="review">
                  {/*
                    * Navodnik je crtez, ne slovo: u zlatnoj i krupniji od
                    * teksta, pa citat pocinje znakom a ne recenicom.
                    */}
                  <span className="review__mark" aria-hidden="true" />
                  {quote.text}
                </blockquote>
                <figcaption className="review__by">
                  <span>{quote.author}</span>
                  <span className="ml-3 opacity-80">{quote.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
