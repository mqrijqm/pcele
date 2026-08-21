import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import PageHero from '@/components/ui/PageHero';
import { meta, processPage, processStepImages } from '@/content/pages';
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

  return (
    <div className="bg-[#FFF7E6]">
      <PageHero
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        description={copy.description}
        note={copy.note}
        image="/images/real/otklapanje-rama.webp"
        imageAlt={copy.heroAlt}
        background="#8A5A2B"
        cardSide="left"
        imageWidth="lg:w-[82%]"
        cardWidth="lg:w-[40%]"
      />

      <section className="py-24 lg:py-32">
        <div className="container">
          <div className="mb-16 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5A2B]">
              {copy.sectionEyebrow}
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-[#8A5A2B] sm:text-5xl">
              {copy.sectionHeading}
            </h2>
          </div>

          <div className="border-t border-[#8A5A2B]/15">
            {copy.steps.map((step, index) => {
              const flipped = index % 2 === 1;
              return (
                <article
                  key={step.title}
                  className="grid items-center gap-8 border-b border-[#8A5A2B]/15 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14"
                >
                  <div
                    className={`relative aspect-[4/3] overflow-hidden lg:col-span-6 ${
                      flipped ? 'lg:order-2' : ''
                    } rounded-[2rem]`}
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
                    <p className="text-[10px] font-bold tracking-[0.18em] text-[#8A5A2B]">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-[#8A5A2B]">
                      {step.title}
                    </h3>
                    <p className="mt-5 max-w-lg text-base leading-7 text-[#8A5A2B]">{step.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#8A5A2B]/[0.06] py-20 lg:py-24">
        <div className="container flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5A2B]">
              {copy.outroEyebrow}
            </p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] text-[#8A5A2B] sm:text-5xl">
              {copy.outroHeading}
            </h2>
          </div>
          <Link
            href={localeHref(locale, '/products')}
            className="group inline-flex w-fit items-center gap-3 border-b border-[#8A5A2B]/35 pb-2 text-sm font-semibold text-[#8A5A2B]"
          >
            {copy.outroCta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
