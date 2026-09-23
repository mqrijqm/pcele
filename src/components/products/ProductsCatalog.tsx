'use client';

import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';

import TransitionLink from '@/components/ui/TransitionLink';
import { formatPrice, products } from '@/data/products';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import styles from './productsEditorial.module.css';

type Filter = 'all' | 'honey' | 'other';
type Sort = 'featured' | 'price-asc' | 'price-desc';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Svi proizvodi' },
  { value: 'honey', label: 'Med' },
  { value: 'other', label: 'Propolis i mješavine' },
];

export default function ProductsCatalog() {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('featured');
  const cart = useCart();
  const wishlist = useWishlist();

  const shown = useMemo(() => {
    const selected = filter === 'all' ? products : products.filter((product) => product.category === filter);
    return [...selected].sort((a, b) => {
      if (sort === 'price-asc') return a.variants[0].price - b.variants[0].price;
      if (sort === 'price-desc') return b.variants[0].price - a.variants[0].price;
      return a.order - b.order;
    });
  }, [filter, sort]);

  return (
    <section className={styles.catalog} aria-labelledby="catalog-title">
      <header className={styles.catalogHeader}>
        <div>
          <span className={styles.eyebrow}>Prodavnica</span>
          <h2 id="catalog-title">Naši proizvodi</h2>
        </div>
        <p>Med i pčelinji proizvodi iz malih sezonskih serija.</p>
      </header>

      <div className={styles.catalogToolbar}>
        <div className={styles.catalogFilters} aria-label="Filtriraj proizvode">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={filter === item.value ? styles.catalogFilterActive : styles.catalogFilter}
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.catalogSort}>
          <span>{shown.length} proizvoda</span>
          <label>
            <span className="sr-only">Sortiranje</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              <option value="featured">Preporučeno</option>
              <option value="price-asc">Cijena: niža prvo</option>
              <option value="price-desc">Cijena: viša prvo</option>
            </select>
          </label>
        </div>
      </div>

      <div className={styles.catalogGrid} aria-live="polite">
        {shown.map((product) => {
          const variant = product.variants[0];
          const saved = wishlist.has(product.slug);
          return (
            <article className={styles.catalogCard} key={product.slug}>
              <div className={styles.catalogCardImage}>
                <TransitionLink href={`/sr/products/${product.slug}`} aria-label={`Otvori ${product.name.sr}`}>
                  <Image
                    src={product.image}
                    alt={product.name.sr}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  />
                </TransitionLink>
                <button
                  type="button"
                  className={styles.wishlistButton}
                  onClick={() => wishlist.toggle(product.slug)}
                  aria-label={saved ? `Ukloni ${product.name.sr} iz liste želja` : `Sačuvaj ${product.name.sr}`}
                  aria-pressed={saved}
                >
                  <Heart aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
                </button>
                <span className={styles.catalogBadge}>{product.category === 'honey' ? 'Med' : 'Pčelinji proizvod'}</span>
              </div>

              <div className={styles.catalogCardBody}>
                <div className={styles.catalogCardTop}>
                  <div>
                    <h3><TransitionLink href={`/sr/products/${product.slug}`}>{product.name.sr}</TransitionLink></h3>
                    <p>{product.tagline.sr}</p>
                  </div>
                  <strong>{formatPrice(variant.price)}</strong>
                </div>
                <div className={styles.catalogCardActions}>
                  <TransitionLink href={`/sr/products/${product.slug}`}>Detalji</TransitionLink>
                  <button
                    type="button"
                    onClick={() =>
                      cart.add({
                        productSlug: product.slug,
                        variantId: variant.id,
                        variantTitle: variant.title,
                        name: product.name.sr,
                        image: product.image,
                        price: variant.price,
                      })
                    }
                  >
                    Dodaj u korpu <ShoppingBag aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
