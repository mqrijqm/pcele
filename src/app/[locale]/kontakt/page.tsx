import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { meta, simplePages } from '@/content/pages';
import { isLocale, localeHref, type Locale } from '@/i18n/config';
import TransitionLink from '@/components/ui/TransitionLink';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].contact.title, description: meta[l].contact.description };
}

/**
 * Kontakt — mala, mirna editorialna ploha u istom pismu kao korpa: krupan
 * naslov u medenoj boji, zlatna linija, pa podaci red po red.
 */
export default async function KontaktPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const copy = simplePages.kontakt[locale];

  return (
    <section className="header-offset min-h-[80vh] pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <h1 className="pt-6 font-display text-7xl font-medium leading-none tracking-[-0.03em] text-[#EEC660] sm:text-8xl lg:text-[9rem]">
          {copy.heading}
        </h1>

        <div className="mt-8 h-[3px] w-full bg-[#EEC660]" aria-hidden="true" />

        <p className="mt-10 max-w-xl text-lg leading-8 text-[#885B27]">{copy.intro}</p>

        <dl className="mt-14 max-w-2xl">
          {copy.items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 border-b border-[#885B27]/10 py-6 sm:flex-row sm:items-baseline sm:gap-10"
            >
              <dt className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-[0.22em] text-[#885B27]/60">
                {item.label}
              </dt>
              <dd className="font-display text-2xl text-[#885B27]">
                {item.href ? (
                  <a
                    href={item.href}
                    className="transition-colors hover:text-[#C39C4A] hover:underline hover:decoration-[#EEC660] hover:decoration-2 hover:underline-offset-8"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-16 text-[11px] uppercase tracking-[0.2em] text-[#885B27]/60">
          {copy.note}
        </p>

        <TransitionLink
          href={localeHref(locale, '/uzorak')}
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#885B27]/50 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#885B27] transition-colors duration-300 hover:border-[#EEC660] hover:bg-[#EEC660]"
        >
          {locale === 'sr' ? 'Probaj uzorak' : 'Try a sample'}
        </TransitionLink>
      </div>
    </section>
  );
}
