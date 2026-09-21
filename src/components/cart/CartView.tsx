'use client';

import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';

import { createTranslator, localeHref, type Locale } from '@/i18n/config';
import { formatPrice } from '@/data/products';
import { useCart } from '@/lib/cart';

/**
 * Stranica korpe — jedna editorialna ploha, po uzoru na meracinque cart:
 * krupan naslov u medenoj boji, zlatna linija, a ispod prazna korpa u jednoj
 * mirnoj traci. Kad korpa ima artikal, ispod se nizu redovi.
 */
export default function CartView({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const cart = useCart();

  return (
    <section className="header-offset min-h-[80vh] pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <h1 className="pt-6 font-display text-7xl font-medium leading-none tracking-[-0.03em] text-[#EEC660] sm:text-8xl lg:text-[9rem]">
          {t('nav.cart')}
        </h1>

        {/* Zlatna linija ispod naslova — ista mera kao na referenci. */}
        <div className="mt-8 h-[3px] w-full bg-[#EEC660]" aria-hidden="true" />

        {cart.items.length === 0 ? (
          <>
            <div className="flex items-center gap-3 border-b border-[#885B27]/10 bg-[#885B27]/[0.04] px-4 py-5 sm:px-6">
              <span
                aria-hidden="true"
                className="h-4 w-4 shrink-0 border border-[#885B27]/40"
              />
              <p className="text-lg text-[#885B27]">{t('cart.empty')}.</p>
            </div>

            <TransitionLink
              href={localeHref(locale, '/products')}
              className="group mt-24 inline-flex items-center gap-3 rounded-full border border-[#885B27]/50 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#885B27] transition-colors duration-300 hover:bg-[#EEC660] hover:border-[#EEC660]"
            >
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={2}
              />
              {t('cart.continueShopping')}
            </TransitionLink>
          </>
        ) : (
          <>
            <ul className="divide-y divide-[#885B27]/10">
              {cart.items.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-6 sm:gap-6">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[0.4rem] bg-[#885B27]/[0.05]">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-2xl leading-tight text-[#885B27]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs tracking-wider text-[#885B27]/70">
                          {item.variantTitle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => cart.remove(item.variantId)}
                        aria-label={t('cart.remove')}
                        className="p-1 text-[#885B27]/60 transition-colors hover:text-[#885B27]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center rounded-full border border-[#885B27]/15">
                        <button
                          type="button"
                          onClick={() => cart.setQuantity(item.variantId, item.quantity - 1)}
                          aria-label="−"
                          className="flex h-8 w-8 items-center justify-center rounded-l-full text-[#885B27] transition-colors hover:bg-[#885B27]/[0.06]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="flex h-8 w-9 items-center justify-center text-sm font-medium tabular-nums text-[#885B27]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => cart.setQuantity(item.variantId, item.quantity + 1)}
                          aria-label="+"
                          className="flex h-8 w-8 items-center justify-center rounded-r-full text-[#885B27] transition-colors hover:bg-[#885B27]/[0.06]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-display text-xl text-[#885B27]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-[#885B27]/15 pt-6 text-[#885B27]">
              <span className="text-sm uppercase tracking-[0.18em]">{t('cart.subtotal')}</span>
              <span className="font-display text-3xl">{formatPrice(cart.subtotal)}</span>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <span className="btn">{t('cart.checkout')}</span>
              <TransitionLink
                href={localeHref(locale, '/products')}
                className="group inline-flex items-center gap-3 rounded-full border border-[#885B27]/50 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#885B27] transition-colors duration-300 hover:bg-[#EEC660] hover:border-[#EEC660]"
              >
                <ArrowLeft
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
                  strokeWidth={2}
                />
                {t('cart.continueShopping')}
              </TransitionLink>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
