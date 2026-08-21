import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { home } from '@/content/pages';
import { getProduct } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';

// The bento grid: one tall card on the left, two wide cards stacked on the right.
const layout = [
  {
    tile: 'lg:col-span-5 lg:row-span-2',
    bg: 'bg-[#8A5A2B]/[0.06]',
    variant: 'tall' as const,
  },
  {
    tile: 'lg:col-span-7 lg:row-span-1',
    bg: 'bg-[#8A5A2B]/[0.06]',
    variant: 'wide' as const,
  },
  {
    tile: 'lg:col-span-7 lg:row-span-1',
    bg: 'bg-[#8A5A2B]/[0.06]',
    variant: 'wide' as const,
  },
];

export default function FeaturedProducts({ locale }: { locale: Locale }) {
  const copy = home.featured[locale];

  return (
    <section className="bg-[#FFF7E6] py-24 lg:py-32">
      <div className="container">
        <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5A2B]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[17ch] font-display text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-[#8A5A2B] sm:text-5xl lg:text-[3.6rem]">
              {copy.heading}
            </h2>
          </div>
          <Link
            href={localeHref(locale, '/products')}
            className="group inline-flex w-fit items-center gap-3 border-b border-[#8A5A2B]/35 pb-2 text-sm font-semibold text-[#8A5A2B] hover:border-[#8A5A2B] hover:text-[#8A5A2B]"
          >
            {copy.viewAll}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[21rem_21rem]">
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
                      <Image
                        src={product.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                    </div>
                    <div className="relative z-10 p-7 sm:p-9">
                      <span className="inline-block rounded-full bg-[#FFF7E6]/90 px-5 py-2 text-sm font-semibold tracking-[0.06em] text-[#8A5A2B]">
                        {item.name}
                      </span>
                      <p className="mt-4 max-w-[16rem] text-sm leading-6 text-[#8A5A2B]">
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
                      <span className="inline-block rounded-full bg-[#FFF7E6]/90 px-5 py-2 text-sm font-semibold tracking-[0.06em] text-[#8A5A2B]">
                        {item.name}
                      </span>
                      <p className="mt-4 max-w-[16rem] text-sm leading-6 text-[#8A5A2B]">
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
