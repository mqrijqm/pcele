import Image from 'next/image';

import { declaration } from '@/content/pages';
import type { Locale } from '@/i18n/config';

/**
 * The four facts printed down the side of every jar label, repeated on the
 * product page so the site and the thing in your hand say the same thing.
 * `labelImage` is only passed for varieties whose artwork actually exists.
 */
export default function Declaration({
  locale,
  labelImage,
}: {
  locale: Locale;
  labelImage?: string;
}) {
  const copy = declaration[locale];

  const facts = [
    { label: copy.apiaryLabel, value: copy.apiary },
    { label: copy.locationsLabel, value: copy.locations },
    { label: copy.originLabel, value: copy.origin },
    { label: copy.usageLabel, value: copy.usage },
  ];

  return (
    <section className="border-t border-[#73552E]/15 bg-[#FDF9DC]">
      <div className="container py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#73552E]">
              <span aria-hidden="true" className="h-px w-8 bg-[#C79A3B]" />
              {copy.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-3xl font-medium tracking-[-0.03em] text-[#73552E] sm:text-4xl">
              {copy.heading}
            </h2>

            <dl className="mt-8 space-y-5">
              {facts.map((fact) => (
                <div key={fact.label} className="border-t border-[#73552E]/15 pt-4">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#73552E]">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-base leading-7 text-[#73552E]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {labelImage ? (
            <div className="overflow-hidden rounded-[2rem] border border-[#73552E]/12">
              <Image
                src={labelImage}
                alt={copy.labelAlt}
                width={1365}
                height={644}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="h-auto w-full"
              />
            </div>
          ) : (
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/images/brand/seal.svg"
                alt=""
                aria-hidden="true"
                width={260}
                height={260}
                className="w-48 max-w-full sm:w-60"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
