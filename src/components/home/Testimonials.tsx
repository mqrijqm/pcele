import Image from 'next/image';
import { Star } from 'lucide-react';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

export default function Testimonials({ locale }: { locale: Locale }) {
  const copy = home.testimonials[locale];
  const [featured, ...rest] = copy.quotes;

  return (
    <section className="relative overflow-hidden bg-[#faf4e8] py-24 lg:py-32">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-honey-700">
              {copy.eyebrow}
            </span>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.06] tracking-[-0.04em] text-espresso sm:text-5xl">
              {copy.heading}
            </h2>
            <div className="mt-7 flex items-center gap-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-honey text-honey" />
                ))}
              </div>
              <span className="text-xs text-stone">{copy.subheading}</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <figure className="reveal relative overflow-hidden bg-[#4f5d4d] p-7 text-white sm:col-span-2 sm:p-10 lg:grid lg:grid-cols-[0.42fr_0.58fr] lg:gap-10">
              <div className="relative min-h-[280px] overflow-hidden bg-sand lg:min-h-[390px]">
                <Image
                  src="/images/lifestyle/honey-jar-hands-brand-v1.webp"
                  alt={copy.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover saturate-[0.88]"
                />
              </div>
              <div className="flex flex-col justify-between pt-8 lg:pt-0">
                <span className="font-display text-6xl leading-none text-[#e8c47f]">&ldquo;</span>
                <blockquote className="font-display text-2xl font-medium leading-[1.22] text-white sm:text-3xl">
                  {featured.text}
                </blockquote>
                <figcaption className="mt-8 border-t border-white/20 pt-5 text-sm">
                  <span className="font-semibold text-white">{featured.author}</span>
                  <span className="ml-3 text-white/45">{featured.city}</span>
                </figcaption>
              </div>
            </figure>

            {rest.map((quote, index) => (
              <figure
                key={quote.author}
                className={`reveal stagger-${index + 1} border-t border-sand px-1 py-7 sm:p-7`}
              >
                <blockquote className="font-display text-xl font-medium leading-snug text-espresso lg:text-2xl">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                <figcaption className="mt-7 text-xs">
                  <span className="font-semibold text-espresso">{quote.author}</span>
                  <span className="ml-3 text-stone">{quote.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
