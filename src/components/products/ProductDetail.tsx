'use client';

import Image from 'next/image';
import {
  Award,
  Check,
  Droplets,
  Heart,
  Leaf,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useState } from 'react';

import { formatPrice, type Product } from '@/data/products';
import { createTranslator, type Locale } from '@/i18n/config';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';

const trustIcons = [Truck, ShieldCheck, RotateCcw, Award];
const featureIcons = [Leaf, Droplets, Award, ShieldCheck, Heart];

type Tab = 'description' | 'shipping' | 'reviews';

export default function ProductDetail({ product, locale }: { product: Product; locale: Locale }) {
  const t = createTranslator(locale);
  const cart = useCart();
  const wishlist = useWishlist();

  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>('description');
  const [justAdded, setJustAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const saved = wishlist.has(product.slug);

  const badges = [0, 1, 2, 3].map((index) => ({
    title: t(`products.trustBadges.${index}.title`),
    desc: t(`products.trustBadges.${index}.desc`),
  }));

  const features = [0, 1, 2, 3, 4].map((index) => t(`products.tabs.features.${index}`));

  function handleAdd() {
    cart.add({
      productSlug: product.slug,
      variantId: variant.id,
      variantTitle: variant.title,
      name: product.name[locale],
      image: product.image,
      price: variant.price,
    }, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <>
      <div className="container section-padding-sm">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <div className="relative aspect-square overflow-hidden border border-[#73552E]/15 bg-linen rounded-[2rem]">
              <div className="absolute left-4 top-4 z-10">
                <span className="inline-block bg-[#73552E] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FDF9DC]">
                  Premium
                </span>
              </div>
              <div className="relative flex h-full w-full items-center justify-center p-12">
                <Image
                  src={product.image}
                  alt={product.name[locale]}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="border border-[#73552E]/12 bg-[#FDF9DC] p-7 sm:p-9 lg:p-11 rounded-[1.5rem]">
            <div className="mb-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#73552E]">
                <Leaf className="h-4 w-4" />
                {t('products.naturalBadge')}
              </span>
            </div>

            <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-[#73552E] lg:text-6xl">
              {product.name[locale]}
            </h1>

            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-3xl text-[#73552E]">{formatPrice(variant.price)}</p>
              <span className="text-sm text-[#73552E]">{t('products.inclVat')}</span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-[#73552E]">
              {product.description[locale]}
            </p>

            <div className="my-8 h-px bg-[#73552E]/[0.06]" />

            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-[#73552E]">
                {t('products.size')}
              </span>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setVariantId(option.id)}
                    className={`rounded-full border px-6 py-3 text-sm font-medium transition-all duration-300 ${
                      option.id === variant.id
                        ? 'border-[#C79A3B] bg-[#73552E] text-[#FDF9DC]'
                        : 'border-[#73552E]/15 text-[#73552E] hover:border-[#C79A3B] hover:text-[#73552E]'
                    }`}
                  >
                    {option.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
              <div>
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-[#73552E]">
                  {t('products.quantity')}
                </span>
                <div className="inline-flex items-center rounded-full border border-[#73552E]/15">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-l-full text-[#73552E] transition-colors hover:bg-linen hover:text-[#73552E] disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-10 w-12 items-center justify-center font-medium text-[#73552E]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-r-full text-[#73552E] transition-colors hover:bg-linen hover:text-[#73552E]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex h-14 min-w-[13rem] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#73552E] px-8 text-base font-semibold tracking-wide text-[#FDF9DC] transition-all duration-300 hover:bg-[#C79A3B] hover:text-[#73552E] hover:shadow-md active:scale-[0.98] sm:max-w-xs"
              >
                <ShoppingBag className="h-5 w-5" />
                {justAdded ? t('products.added') : t('common.addToCart')}
              </button>

              <button
                type="button"
                aria-pressed={saved}
                onClick={() => wishlist.toggle(product.slug)}
                className={`flex h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap border px-6 text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${
                  saved
                    ? 'border-[#C79A3B] text-[#73552E]'
                    : 'border-[#73552E]/15 text-[#73552E] hover:border-[#C79A3B] hover:text-[#73552E]'
                }`}
              >
                <Heart className={`h-4 w-4 ${saved ? 'fill-[#C79A3B]' : ''}`} />
                {saved ? t('wishlist.remove') : t('wishlist.add')}
              </button>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#73552E]">
                <Check className="h-4 w-4 text-[#C79A3B]" aria-hidden="true" />
                {t('common.inStock')}
              </span>
            </div>

            <div className="mt-10 grid grid-cols-2 border-t border-[#73552E]/15">
              {badges.map((badge, index) => {
                const Icon = trustIcons[index];
                return (
                  <div
                    key={badge.title}
                    className="flex items-start gap-3 border-b border-[#73552E]/15 py-4 odd:pr-4 even:border-l even:pl-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center text-[#73552E]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#73552E]">
                        {badge.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#73552E]">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#73552E]/15">
        <div className="container">
          <div className="flex border-b border-[#73552E]/15">
            {(
              [
                ['description', t('products.tabs.descriptionTab')],
                ['shipping', t('products.tabs.shippingTab')],
                ['reviews', t('products.tabs.reviewsTab')],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`relative px-6 py-5 text-sm font-medium uppercase tracking-wider transition-colors ${
                  tab === id ? 'text-[#73552E]' : 'text-[#73552E] hover:text-[#73552E]'
                }`}
              >
                {label}
                {tab === id && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#73552E]" />
                )}
              </button>
            ))}
          </div>

          <div className="section-padding-sm">
            {tab === 'description' && (
              <div className="grid gap-16 lg:grid-cols-2">
                <div>
                  <h3 className="mb-6 text-2xl text-[#73552E]">
                    {t('products.tabs.aboutProduct')}
                  </h3>
                  <div className="space-y-4 leading-relaxed text-[#73552E]">
                    <p>{product.description[locale]}</p>
                    <p>{t('products.tabs.qualityNote')}</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-6 text-2xl text-[#73552E]">
                    {t('products.tabs.featuresTitle')}
                  </h3>
                  <ul className="space-y-4">
                    {features.map((feature, index) => {
                      const Icon = featureIcons[index];
                      return (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C79A3B]/25">
                            <Icon className="h-4 w-4 text-[#73552E]" />
                          </div>
                          <span className="text-sm text-[#73552E]">{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {tab === 'shipping' && (
              <div className="grid gap-16 lg:grid-cols-2">
                <div>
                  <h3 className="mb-6 text-2xl text-[#73552E]">
                    {t('products.tabs.shippingInfoTitle')}
                  </h3>
                  <p className="leading-relaxed text-[#73552E]">
                    {t('products.tabs.shippingInfoText')}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-[#73552E]">
                    <li>
                      <span className="font-semibold text-[#73552E]">
                        {t('products.tabs.standardDeliveryLabel')}
                      </span>{' '}
                      {t('products.tabs.standardDeliveryValue')}
                    </li>
                    <li>
                      <span className="font-semibold text-[#73552E]">
                        {t('products.tabs.expressDeliveryLabel')}
                      </span>{' '}
                      {t('products.tabs.expressDeliveryValue')}
                    </li>
                    <li>
                      <span className="font-semibold text-[#73552E]">
                        {t('products.tabs.freeShippingLabel')}
                      </span>{' '}
                      {t('products.freeShippingNote')}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-6 text-2xl text-[#73552E]">
                    {t('products.tabs.returnPolicyTitle')}
                  </h3>
                  <p className="leading-relaxed text-[#73552E]">
                    {t('products.tabs.returnPolicyText')}
                  </p>
                </div>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="max-w-2xl">
                <h3 className="mb-4 text-2xl text-[#73552E]">{t('reviews.heading')}</h3>
                <p className="text-[#73552E]">{t('reviews.noReviewsYet')}</p>
                <p className="mt-2 text-sm text-[#73552E]">{t('reviews.beFirst')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
