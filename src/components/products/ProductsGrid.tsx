'use client';

import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import { ArrowUpRight, Heart } from 'lucide-react';

import { formatPrice, lowestPrice, products } from '@/data/products';
import { createTranslator, localeHref, type Locale } from '@/i18n/config';
import { useWishlist } from '@/lib/wishlist';

/**
 * Polica s proizvodima.
 *
 * Iznad mreze je stajao alat prodavnice — polje za pretragu, brojac artikala,
 * dugmad za kategorije i padajuci izbor za redoslijed. Sest tegli se ne
 * pretrazuje i ne sortira: to je ponuda koja stane u jedan pogled, a alat je
 * govorio da je iza njega katalog. Sada se vidi samo ono sto se prodaje.
 *
 * Redoslijed je onaj iz `products.ts`, jedan i jedini — nema ga ko mijenjati.
 */
const shelf = [...products].sort((a, b) => a.order - b.order);

export default function ProductsGrid({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const wishlist = useWishlist();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
      {shelf.map((product, index) => {
        const saved = wishlist.has(product.slug);
        return (
          <div key={product.slug} className={`reveal stagger-${Math.min(index + 1, 6)}`}>
            <TransitionLink href={localeHref(locale, `/products/${product.slug}`)} className="group block">
              <article className="relative transition-transform duration-300 group-hover:-translate-y-1">
                <span className="absolute left-5 top-5 z-10 text-[10px] font-bold tracking-[0.18em] text-[#885B27]">
                  {String(product.order).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  aria-pressed={saved}
                  aria-label={saved ? t('wishlist.remove') : t('wishlist.add')}
                  onClick={(event) => {
                    event.preventDefault();
                    wishlist.toggle(product.slug);
                  }}
                  className="absolute right-5 top-5 z-10 rounded-full flex h-9 w-9 items-center justify-center border border-[#885B27]/15 bg-[var(--paper)]/85 text-[#885B27] backdrop-blur-sm transition-all duration-300 hover:border-[#EEC660] hover:bg-[var(--paper)] active:scale-[0.98]"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      saved ? 'fill-[#EEC660] text-[#EEC660]' : 'text-[#885B27]'
                    }`}
                  />
                </button>

                <div
                  className="relative flex aspect-[4/4.8] items-center justify-center plate overflow-hidden p-8"
                  style={{ backgroundColor: product.cardBg }}
                >
                  <Image
                    src={product.image}
                    alt={product.name[locale]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </div>

                <div className="border-b border-[#885B27]/15 px-1 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="flex items-center gap-2 text-2xl leading-tight text-[#885B27]">
                        {product.name[locale]}
                        <ArrowUpRight className="h-4 w-4 text-[#885B27] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#885B27]">
                        {product.tagline[locale]}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-honey-700">
                      {t('products.priceFrom')} {formatPrice(lowestPrice(product))}
                    </p>
                  </div>
                </div>
              </article>
            </TransitionLink>
          </div>
        );
      })}
    </div>
  );
}
