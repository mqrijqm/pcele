import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import PageHero from '@/components/ui/PageHero';
import ImageBreak from '@/components/ui/ImageBreak';
import PageOpener from '@/components/ui/PageOpener';
import BeeFlight from '@/components/bee/BeeFlight';
import { aboutPage, meta, photoBreaks } from '@/content/pages';
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
  const shot = photoBreaks[locale];

  return (
    <div className="bg-[var(--paper)] header-offset">
      {/*
        * Heroj je skinut, pa naslov strane stoji samo za citace ekrana i
        * pretrazivace — vizuelno strana pocinje odmah sadrzajem.
        */}
      <h1 className="sr-only">{copy.heading}</h1>

      {/* Pcela leti i ovom stranom. */}
      <BeeFlight route="about" />

      <PageOpener eyebrow={copy.eyebrow} heading={copy.heading} />
      <section className="border-b border-[#885B27]/15 bg-[var(--paper)]">
        <div className="container grid md:grid-cols-3">
          {copy.features.map((feature, index) => (
            <div
              key={feature.title}
              className="border-b border-[#885B27]/15 py-7 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <span className="text-[10px] font-bold tracking-[0.18em] text-[#885B27]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-2 text-2xl font-semibold text-[#885B27]">
                {feature.title}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#885B27]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pcelinjak kakav jeste, dva kadra. */}
      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/real/pcelinjak-1.webp', alt: shot.aboutHives.altA },
          { src: '/images/real/pcelinjak-6.webp', alt: shot.aboutHives.altB },
        ]}
        caption={shot.aboutHives.caption}
        meta={shot.aboutHives.meta}
        emblem
      />

      <ImageBreak
        images={[{ src: '/images/mockups/jar-smoker-frames.webp', alt: shot.aboutTools.alt }]}
        aspect="aspect-[3/4] sm:aspect-[16/9]"
        focus="object-[50%_35%]"
        caption={shot.aboutTools.caption}
        meta={shot.aboutTools.meta}
      />

      <section className="overflow-hidden bg-[var(--paper)] section-padding">
        <div className="container grid gap-20 lg:grid-cols-[0.38fr_0.62fr] lg:gap-24">
          <div className="lg:pt-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#885B27]">
              {copy.tradition.eyebrow}
            </p>
            <h2 className="mt-8 font-display text-display-md font-normal text-[#885B27]">
              {copy.tradition.heading}
            </h2>
            <div className="mt-7 space-y-5 text-base leading-7 text-[#885B27]">
              {copy.tradition.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 items-end gap-4">
            <div className="relative col-span-12 aspect-[4/3] overflow-hidden sm:col-span-8 rounded-[0.6rem]">
              <Image
                src="/images/real/kosnice-livada.webp"
                alt={copy.location.mapAlt}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="relative col-span-8 -mt-20 aspect-[4/5] overflow-hidden border-[10px] border-[var(--paper)] sm:col-span-4 sm:-ml-14 sm:mt-0 rounded-[0.6rem]">
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

      <section className="bg-[var(--paper)] section-padding">
        <div className="container grid gap-16 lg:grid-cols-[0.34fr_0.66fr] lg:gap-24">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#885B27]">
              {copy.journey.eyebrow}
            </p>
            <h2 className="mt-8 font-display text-display-md font-normal text-[#885B27]">
              {copy.journey.heading}
            </h2>
          </div>

          <div className="border-t border-[#885B27]/20">
            {copy.journey.timeline.map((entry) => (
              <article
                key={entry.year}
                className="grid gap-4 border-b border-[#885B27]/20 py-7 sm:grid-cols-[5rem_0.38fr_0.62fr] sm:gap-6"
              >
                <p className="font-display text-2xl text-[#885B27]">{entry.year}</p>
                <h3 className="text-2xl font-semibold text-[#885B27]">{entry.title}</h3>
                <p className="text-sm leading-6 text-[#885B27]">{entry.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/mockups/jars-fence-dawn.webp', alt: shot.aboutSeasons.altDawn },
          { src: '/images/mockups/jars-two-stump.webp', alt: shot.aboutSeasons.altDusk },
        ]}
        caption={shot.aboutSeasons.caption}
        meta={shot.aboutSeasons.meta}
      />

      <section className="bg-[var(--paper)] section-padding">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#885B27]">
              {copy.values.eyebrow}
            </p>
            <h2 className="mt-8 font-display text-display-md font-normal text-[#885B27]">
              {copy.values.heading}
            </h2>
          </div>

          <div className="mt-14 grid border-t border-[#885B27]/15 sm:grid-cols-2">
            {copy.values.items.map((value, index) => (
              <article
                key={value.title}
                className="border-b border-[#885B27]/15 py-8 sm:px-8 sm:odd:border-r sm:odd:pl-0"
              >
                <span className="text-[10px] font-bold tracking-[0.18em] text-[#885B27]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-3xl font-semibold text-[#885B27]">
                  {value.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#885B27]">{value.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-[42rem] overflow-hidden bg-[#885B27]">
        <Image
          src="/images/real/kosnice-livada.webp"
          alt={copy.location.mapAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#885B27]/65 via-transparent to-transparent" />
        <div className="container relative flex min-h-[42rem] items-end py-10 lg:items-center lg:py-20">
          <div className="max-w-xl border border-[#EEC660]/55 bg-[var(--paper)]/95 p-8 backdrop-blur-sm sm:p-12 rounded-[0.6rem]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#885B27]">
              {copy.location.eyebrow}
            </p>
            <h2 className="mt-8 font-display text-display-md font-normal text-[#885B27]">
              {copy.location.heading}
            </h2>
            <p className="mt-6 text-base leading-7 text-[#885B27]">{copy.location.description}</p>
            <p className="mt-7 border-t border-[#885B27]/15 pt-4 text-sm text-[#885B27]">
              {copy.location.note}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
