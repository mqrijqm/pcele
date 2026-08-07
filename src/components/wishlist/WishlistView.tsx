'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, X } from 'lucide-react';

import { formatPrice, getProduct, lowestPrice } from '@/data/products';
import { createTranslator, localeHref, type Locale } from '@/i18n/config';
import { useWishlist } from '@/lib/wishlist';

export default function WishlistView({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const wishlist = useWishlist();
  const items = wishlist.slugs.map(getProduct).filter((p) => p !== undefined);

  return (
    <div className="bg-ivory pt-24">
      <section className="section-padding">
        <div className="container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#82601f]">
            {t('nav.account')}
          </p>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-espresso">
            {t('wishlist.title')}
          </h1>

          {items.length === 0 ? (
            <div className="mt-14 flex flex-col items-center border border-sand/70 bg-white px-6 py-20 text-center">
              <Heart className="h-14 w-14 text-sand" />
              <p className="mt-5 font-display text-2xl text-espresso">{t('wishlist.empty')}</p>
              <p className="mt-2 max-w-sm text-sm text-stone">{t('wishlist.emptyMessage')}</p>
              <Link
                href={localeHref(locale, '/products')}
                className="mt-7 inline-flex min-h-12 items-center rounded-full bg-honey px-7 text-sm font-semibold text-white transition-colors hover:bg-honey-600"
              >
                {t('wishlist.continueShopping')}
              </Link>
            </div>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {items.map((product) => (
                <div key={product.slug} className="relative">
                  <button
                    type="button"
                    onClick={() => wishlist.remove(product.slug)}
                    aria-label={t('wishlist.removeItem')}
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center border border-[#332a24]/15 bg-[#faf4e8]/85 text-espresso backdrop-blur-sm transition-colors hover:border-honey hover:text-honey"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Link
                    href={localeHref(locale, `/products/${product.slug}`)}
                    className="group block"
                  >
                    <div
                      className="relative flex aspect-[4/4.8] items-center justify-center overflow-hidden p-8"
                      style={{ backgroundColor: product.cardBg }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name[locale]}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    </div>
                    <div className="border-b border-[#332a24]/15 px-1 py-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-2xl leading-tight text-espresso">
                          {product.name[locale]}
                        </h3>
                        <p className="shrink-0 text-sm font-semibold text-honey-700">
                          {t('products.priceFrom')} {formatPrice(lowestPrice(product))}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-stone">{product.tagline[locale]}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
