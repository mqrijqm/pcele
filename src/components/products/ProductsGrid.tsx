'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpDown, ArrowUpRight, ChevronDown, Filter, Heart, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { formatPrice, lowestPrice, products } from '@/data/products';
import { createTranslator, localeHref, type Locale } from '@/i18n/config';
import { useWishlist } from '@/lib/wishlist';

type CategoryFilter = 'all' | 'honey' | 'other';
type SortOption = 'default' | 'price-asc' | 'price-desc';

export default function ProductsGrid({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const wishlist = useWishlist();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<SortOption>('default');

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false;
      if (!needle) return true;
      return (
        product.name[locale].toLowerCase().includes(needle) ||
        product.tagline[locale].toLowerCase().includes(needle)
      );
    });

    const sorted = [...filtered];
    if (sort === 'price-asc') sorted.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    else if (sort === 'price-desc') sorted.sort((a, b) => lowestPrice(b) - lowestPrice(a));
    else sorted.sort((a, b) => a.order - b.order);
    return sorted;
  }, [query, category, sort, locale]);

  const filters: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: t('products.filter.all') },
    { id: 'honey', label: t('products.filter.honey') },
    { id: 'other', label: t('products.filter.other') },
  ];

  return (
    <>
      <div className="reveal mb-8">
        <div className="relative max-w-lg">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73552E]"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.ariaLabel')}
            className="min-h-12 w-full border-x-0 border-b border-t-0 border-[#73552E]/20 bg-transparent py-2 pl-11 pr-10 text-sm text-[#73552E] outline-none transition-colors placeholder:text-[#73552E] focus:border-[#C79A3B] rounded-[1.1rem]"
          />
        </div>
      </div>

      <div className="reveal mb-12 flex flex-col gap-5 border-b border-[#73552E]/15 pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-1 flex items-center gap-1.5 text-sm text-[#73552E]">
            <Filter className="h-4 w-4" />
            <span>{t('products.grid.resultCount', { count: visible.length })}</span>
          </div>
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setCategory(filter.id)}
              className={`min-h-10 px-3 text-sm font-semibold transition-colors duration-300 ${
                category === filter.id
                  ? 'border-b border-[#73552E] text-[#73552E]'
                  : 'border-b border-transparent text-[#73552E] hover:border-[#73552E]/30 hover:text-[#73552E]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-[#73552E]" />
          <div className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              aria-label={t('products.sort.label')}
              className="min-h-10 appearance-none border border-[#73552E]/20 bg-transparent py-2 pl-4 pr-9 text-sm text-[#73552E] outline-none transition-colors focus:border-[#C79A3B] rounded-[1.1rem]"
            >
              <option value="default">{t('products.grid.sort.default')}</option>
              <option value="price-asc">{t('products.grid.sort.priceAsc')}</option>
              <option value="price-desc">{t('products.grid.sort.priceDesc')}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73552E]" />
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-24 lg:py-32 text-center">
          <p className="text-2xl text-[#73552E]">{t('products.grid.noResults')}</p>
          <p className="mt-3 text-sm text-[#73552E]">
            {t('products.grid.noResultsMessage', { query })}
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-6 border-b border-[#73552E] pb-1 text-sm font-semibold text-[#73552E]"
          >
            {t('products.grid.showAll')}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {visible.map((product, index) => {
            const saved = wishlist.has(product.slug);
            return (
              <div key={product.slug} className={`reveal stagger-${Math.min(index + 1, 6)}`}>
                <Link href={localeHref(locale, `/products/${product.slug}`)} className="group block">
                  <article className="relative transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="absolute left-5 top-5 z-10 text-[10px] font-bold tracking-[0.18em] text-[#73552E]">
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
                      className="absolute right-5 top-5 z-10 rounded-full flex h-9 w-9 items-center justify-center border border-[#73552E]/15 bg-[var(--paper)]/85 text-[#73552E] backdrop-blur-sm transition-all duration-300 hover:border-[#C79A3B] hover:bg-[var(--paper)] active:scale-[0.98]"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          saved ? 'fill-[#C79A3B] text-[#C79A3B]' : 'text-[#73552E]'
                        }`}
                      />
                    </button>

                    <div
                      className="relative flex aspect-[4/4.8] items-center justify-center overflow-hidden p-8 rounded-[2rem]"
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

                    <div className="border-b border-[#73552E]/15 px-1 py-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="flex items-center gap-2 text-2xl leading-tight text-[#73552E]">
                            {product.name[locale]}
                            <ArrowUpRight className="h-4 w-4 text-[#73552E] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#73552E]">
                            {product.tagline[locale]}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-honey-700">
                          {t('products.priceFrom')} {formatPrice(lowestPrice(product))}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
