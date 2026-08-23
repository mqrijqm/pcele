import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { home } from '@/content/pages';
import { getProduct } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';

/*
 * Dvije vrste meda, dvije jednake kartice u jednom redu.
 *
 * Ranije su bile tri — jedna visoka i dvije siroke — ali sa dvije vrste taj
 * raspored ostavlja rupu u rasteru, pa su sada obje visoke i jednake.
 */
const layout = [
  {
    tile: 'lg:col-span-6',
    bg: 'bg-[#73552E]/[0.06]',
    variant: 'tall' as const,
  },
  {
    tile: 'lg:col-span-6',
    bg: 'bg-[#73552E]/[0.06]',
    variant: 'tall' as const,
  },
];

export default function FeaturedProducts({ locale }: { locale: Locale }) {
  const copy = home.featured[locale];

  return (
    <section className="bg-[var(--paper)] section-padding">
      <div className="container">
        <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#73552E]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-8 max-w-[17ch] font-display text-display-md font-normal text-[#73552E] lg:text-[3.6rem]">
              {copy.heading}
            </h2>
          </div>
          <Link
            href={localeHref(locale, '/products')}
            className="group inline-flex w-fit items-center gap-3 border-b border-[#73552E]/35 pb-2 text-sm font-semibold text-[#73552E] hover:border-[#73552E] hover:text-[#73552E]"
          >
            {copy.viewAll}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[32rem]">
          {copy.items.map((item, index) => {
            const product = getProduct(item.slug);
            const style = layout[index];
            if (!product) return null;

            return (
              <Link
                key={item.slug}
                href={localeHref(locale, `/products/${item.slug}`)}
                className={`group relative min-h-[28rem] overflow-hidden rounded-[2rem] ${style.bg} lg:min-h-0 ${style.tile}`}
              >
                {style.variant === 'tall' ? (
                  <div className="absolute inset-0">
                    <div className="absolute inset-x-0 bottom-0 top-[25%]">
                      {/*
                        * `contain`, ne `cover`: snimci tegli su kvadratni, a
                        * kutija je siroka — `cover` bi od tegle ostavio samo
                        * srednju traku.
                        */}
                      <Image
                        src={product.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                    </div>
                    <div className="relative z-10 p-7 sm:p-9">
                      <span className="block font-display text-3xl font-normal leading-none tracking-[-0.02em] text-[#73552E] sm:text-4xl">
                        {item.name}
                      </span>
                      <p className="mt-4 max-w-[16rem] text-sm leading-6 text-[#73552E]">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 grid grid-cols-[0.55fr_0.45fr] items-center">
                    <div className="relative order-2 h-full">
                      <Image
                        src={product.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 1024px) 45vw, 26vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                    </div>
                    <div className="relative z-10 order-1 px-7 py-8 sm:px-10">
                      <span className="inline-block rounded-full bg-[var(--paper)]/90 px-5 py-2 text-sm font-semibold tracking-[0.06em] text-[#73552E]">
                        {item.name}
                      </span>
                      <p className="mt-4 max-w-[16rem] text-sm leading-6 text-[#73552E]">
                        {item.note}
                      </p>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
