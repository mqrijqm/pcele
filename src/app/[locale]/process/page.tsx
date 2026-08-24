import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import PageHero from '@/components/ui/PageHero';
import ImageBreak from '@/components/ui/ImageBreak';
import PageOpener from '@/components/ui/PageOpener';
import BeeFlight from '@/components/bee/BeeFlight';
import { meta, photoBreaks, processFrames, processPage, processStepImages } from '@/content/pages';
import { isLocale, localeHref, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].process.title, description: meta[l].process.description };
}

export default async function ProcessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = processPage[locale];
  const shot = photoBreaks[locale];
  const frames = processFrames[locale];

  return (
    <div className="bg-[var(--paper)] header-offset">
      {/* Heroj je skinut; naslov strane ostaje za citace ekrana. */}
      <h1 className="sr-only">{copy.heading}</h1>

      {/* Pcela leti i ovom stranom, svojom rutom kroz korake. */}
      <BeeFlight route="process" />
      <PageOpener eyebrow={copy.sectionEyebrow} heading={copy.sectionHeading} />

      <section className="pb-[var(--section-padding)]">
        <div className="container">
          <div className="border-t border-[#73552E]/15">
            {copy.steps.map((step, index) => {
              const flipped = index % 2 === 1;
              return (
                <article
                  key={step.title}
                  className="grid items-center gap-10 border-b border-[#73552E]/15 py-14 lg:py-20 lg:grid-cols-12 lg:gap-16 lg:py-14"
                >
                  <div
                    className={`relative aspect-[4/3] overflow-hidden lg:col-span-6 ${
                      flipped ? 'lg:order-2' : ''
                    } rounded-[0.6rem]`}
                  >
                    <Image
                      src={processStepImages[index]}
                      alt={step.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div
                    className={
                      flipped ? 'lg:col-span-5 lg:col-start-1 lg:row-start-1' : 'lg:col-span-5 lg:col-start-8'
                    }
                  >
                    <p className="text-[10px] font-bold tracking-[0.18em] text-[#73552E]">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-8 font-display text-display-md font-normal text-[#73552E]">
                      {step.title}
                    </h3>
                    <p className="mt-5 max-w-lg text-base leading-7 text-[#73552E]">{step.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Odakle sve krece — pcelinjak na livadi. */}
      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/real/pcelinjak-4.webp', alt: shot.processHives.altA },
          { src: '/images/real/pcelinjak-5.webp', alt: shot.processHives.altB },
        ]}
        caption={shot.processHives.caption}
        meta={shot.processHives.meta}
        emblem
      />

      {/* Umetak izmedju pcelinjaka i vrcanja — ramove pravimo sami. */}
      <section className="frames section-padding-sm">
        <div className="container frames__grid">
          <div className="frames__copy">
            <p className="frames__eyebrow">{frames.eyebrow}</p>
            <h2 className="frames__heading">{frames.heading}</h2>
            <p className="frames__body">{frames.body}</p>
          </div>

          <div className="frames__shots">
            <div className="frames__shot">
              <Image
                src="/images/real/ram-2025.webp"
                alt={frames.altA}
                fill
                sizes="(max-width: 1024px) 46vw, 24vw"
                className="object-cover"
              />
            </div>
            <div className="frames__shot frames__shot--low">
              <Image
                src="/images/real/otklapanje-rama.webp"
                alt={frames.altB}
                fill
                sizes="(max-width: 1024px) 46vw, 24vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <ImageBreak
        variant="pair"
        images={[
          { src: '/images/real/vrcaljka-kanta.webp', alt: shot.processJar.altTap },
          { src: '/images/real/tegle-stol.webp', alt: shot.processJar.altJars },
        ]}
        aspect="aspect-[3/4] sm:aspect-[16/9]"
        focus="object-[50%_40%]"
        caption={shot.processJar.caption}
        meta={shot.processJar.meta}
        frame="narrow"
      />

      {/* Posljednji korak: kad je tegla puna, etiketa ide rukom. */}
      <ImageBreak
        images={[{ src: '/images/mockups/label-in-hands.webp', alt: shot.processLabel.alt }]}
        caption={shot.processLabel.caption}
        meta={shot.processLabel.meta}
        frame="narrow"
      />

      <section className="bg-[var(--paper)] section-padding">
        <div className="container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#73552E]">
              {copy.outroEyebrow}
            </p>
            <h2 className="mt-8 font-display text-display-md font-normal text-[#73552E]">
              {copy.outroHeading}
            </h2>
          </div>
          <Link
            href={localeHref(locale, '/products')}
            className="group inline-flex w-fit items-center gap-3 border-b border-[#73552E]/35 pb-2 text-sm font-semibold text-[#73552E]"
          >
            {copy.outroCta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
