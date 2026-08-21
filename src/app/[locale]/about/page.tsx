import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import PageHero from '@/components/ui/PageHero';
import { aboutPage, meta } from '@/content/pages';
import { isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].about.title, description: meta[l].about.description };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = aboutPage[locale];

  return (
    <div className="bg-[#FFF7E6]">
      <PageHero
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        description={copy.description}
        note={copy.note}
        image="/images/real/ram-2025.webp"
        imageAlt={copy.heroAlt}
        background="#8A5A2B"
        cardSide="right"
        imageWidth="lg:w-[76%]"
        cardWidth="lg:w-[43%]"
        headingClamp="max-w-[12ch]"
      />

      <section className="border-b border-[#8A5A2B]/12 bg-[#FFF7E6]">
        <div className="container grid md:grid-cols-3">
          {copy.features.map((feature, index) => (
            <div
              key={feature.title}
              className="border-b border-[#8A5A2B]/12 py-7 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#8A5A2B]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-2 font-display text-2xl font-medium text-[#8A5A2B]">
                {feature.title}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#8A5A2B]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-[#FFF7E6] py-24 lg:py-32">
        <div className="container grid gap-14 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20">
          <div className="lg:pt-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5A2B]">
              {copy.tradition.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-[#8A5A2B] sm:text-5xl">
              {copy.tradition.heading}
            </h2>
            <div className="mt-7 space-y-5 text-base leading-7 text-[#8A5A2B]">
              {copy.tradition.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 items-end gap-4">
            <div className="relative col-span-12 aspect-[4/3] overflow-hidden sm:col-span-8 rounded-[2rem]">
              <Image
                src="/images/real/kosnice-livada.webp"
                alt={copy.location.mapAlt}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-8 -mt-20 aspect-[4/5] overflow-hidden border-[10px] border-[#FFF7E6] sm:col-span-4 sm:-ml-14 sm:mt-0 rounded-[2rem]">
              <Image
                src="/images/real/otklapanje-rama.webp"
                alt={copy.heroAlt}
                fill
                sizes="(max-width: 640px) 66vw, 20vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#8A5A2B]/[0.06] py-24 lg:py-32">
        <div className="container grid gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5A2B]">
              {copy.journey.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-[#8A5A2B] sm:text-5xl">
              {copy.journey.heading}
            </h2>
          </div>

          <div className="border-t border-[#8A5A2B]/20">
            {copy.journey.timeline.map((entry) => (
              <article
                key={entry.year}
                className="grid gap-4 border-b border-[#8A5A2B]/20 py-7 sm:grid-cols-[5rem_0.38fr_0.62fr] sm:gap-6"
              >
                <p className="font-display text-2xl italic text-[#8A5A2B]">{entry.year}</p>
                <h3 className="font-display text-2xl font-medium text-[#8A5A2B]">{entry.title}</h3>
                <p className="text-sm leading-6 text-[#8A5A2B]">{entry.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF7E6] py-24 lg:py-32">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5A2B]">
              {copy.values.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-[#8A5A2B] sm:text-5xl">
              {copy.values.heading}
            </h2>
          </div>

          <div className="mt-14 grid border-t border-[#8A5A2B]/15 sm:grid-cols-2">
            {copy.values.items.map((value, index) => (
              <article
                key={value.title}
                className="border-b border-[#8A5A2B]/15 py-8 sm:px-8 sm:odd:border-r sm:odd:pl-0"
              >
                <span className="text-[10px] font-bold tracking-[0.18em] text-[#8A5A2B]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-3xl font-medium text-[#8A5A2B]">
                  {value.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#8A5A2B]">{value.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[42rem] overflow-hidden bg-[#8A5A2B]">
        <Image
          src="/images/real/kosnice-livada.webp"
          alt={copy.location.mapAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#8A5A2B]/65 via-transparent to-transparent" />
        <div className="container relative flex min-h-[42rem] items-end py-10 lg:items-center lg:py-20">
          <div className="max-w-xl border border-[#C89B3C]/55 bg-[#FFF7E6]/95 p-8 backdrop-blur-sm sm:p-12 rounded-[1.5rem]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5A2B]">
              {copy.location.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] text-[#8A5A2B] sm:text-5xl">
              {copy.location.heading}
            </h2>
            <p className="mt-6 text-base leading-7 text-[#8A5A2B]">{copy.location.description}</p>
            <p className="mt-7 border-t border-[#8A5A2B]/15 pt-4 text-sm text-[#8A5A2B]">
              {copy.location.note}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
