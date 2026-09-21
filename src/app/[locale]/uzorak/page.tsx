import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { meta, simplePages } from '@/content/pages';
import { isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].uzorak.title, description: meta[l].uzorak.description };
}

/**
 * "Probaj uzorak" — mali poziv prije prve tegle. Isto vizuelno pismo kao
 * korpa i kontakt: naslov u medenoj boji, zlatna linija, tekst i jedan poziv.
 */
export default async function UzorakPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const copy = simplePages.uzorak[locale];

  return (
    <section className="header-offset min-h-[80vh] pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <h1 className="pt-6 font-display text-7xl font-medium leading-none tracking-[-0.03em] text-[#EEC660] sm:text-8xl lg:text-[9rem]">
          {copy.heading}
        </h1>

        <div className="mt-8 h-[3px] w-full bg-[#EEC660]" aria-hidden="true" />

        <p className="mt-10 max-w-xl text-lg leading-8 text-[#885B27]">{copy.intro}</p>

        <a
          href="mailto:pcelarstvojevtic@gmail.com"
          className="mt-14 inline-flex items-center gap-3 rounded-full border border-[#885B27]/50 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#885B27] transition-colors duration-300 hover:border-[#EEC660] hover:bg-[#EEC660]"
        >
          {copy.cta}
        </a>

        <p className="mt-16 text-[11px] uppercase tracking-[0.2em] text-[#885B27]/60">
          {copy.note}
        </p>
      </div>
    </section>
  );
}
