'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

import { createTranslator, localeHref, type Locale } from '@/i18n/config';
import { formatPrice } from '@/data/products';
import { useCart } from '@/lib/cart';

export default function CartDrawer({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const cart = useCart();

  return (
    // The wrapper clips the off-screen drawer so it never widens the document.
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={cart.close}
        aria-hidden="true"
        className={`absolute inset-0 bg-[#8A5A2B]/60 backdrop-blur-sm transition-opacity duration-300 ${
          cart.isOpen ? 'pointer-events-auto opacity-100' : 'opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#FFF7E6] shadow-2xl transition-transform duration-500 ease-out-expo ${
          cart.isOpen ? 'pointer-events-auto translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#8A5A2B]/15 px-6 py-4">
            <h2 className="font-display text-xl text-[#8A5A2B]">{t('cart.title')}</h2>
            <button
              type="button"
              onClick={cart.close}
              aria-label="Close cart"
              className="text-[#8A5A2B] transition-colors hover:text-[#8A5A2B]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="h-16 w-16 text-[#8A5A2B]/25" />
                <p className="mt-4 font-display text-xl text-[#8A5A2B]">{t('cart.empty')}</p>
                <p className="mt-2 text-sm text-[#8A5A2B]">{t('cart.emptyMessage')}</p>
                <Link
                  href={localeHref(locale, '/products')}
                  onClick={cart.close}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#8A5A2B] px-6 text-sm font-semibold tracking-wide text-[#FFF7E6] transition-all duration-300 hover:bg-[#C89B3C] hover:text-[#8A5A2B] hover:shadow-md active:scale-[0.98]"
                >
                  {t('cart.continueShopping')}
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-[#8A5A2B]/12">
                {cart.items.map((item) => (
                  <li key={item.variantId} className="flex gap-4 py-5">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[1rem] bg-[#8A5A2B]/[0.06]">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-lg leading-tight text-[#8A5A2B]">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs tracking-wider text-[#8A5A2B]">
                            {item.variantTitle}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => cart.remove(item.variantId)}
                          aria-label={t('cart.remove')}
                          className="text-[#8A5A2B] transition-colors hover:text-[#8A5A2B]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-full border border-[#8A5A2B]/15">
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(item.variantId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-l-full text-[#8A5A2B] transition-colors hover:bg-linen hover:text-[#8A5A2B]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="flex h-8 w-9 items-center justify-center text-sm font-medium text-[#8A5A2B]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(item.variantId, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center rounded-r-full text-[#8A5A2B] transition-colors hover:bg-linen hover:text-[#8A5A2B]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-honey-700">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="border-t border-[#8A5A2B]/15 px-6 py-5">
              <div className="flex items-center justify-between text-sm text-[#8A5A2B]">
                <span>{t('cart.subtotal')}</span>
                <span className="font-display text-xl text-[#8A5A2B]">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#8A5A2B]">
                {t('cart.shipping')}: {t('cart.shippingCalculated')}
              </p>
              <Link
                href={localeHref(locale, '/contact')}
                onClick={cart.close}
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-[#8A5A2B] px-6 text-sm font-semibold tracking-wide text-[#FFF7E6] transition-all duration-300 hover:bg-[#C89B3C] hover:text-[#8A5A2B] hover:shadow-md active:scale-[0.98]"
              >
                {t('cart.checkout')}
              </Link>
              <button
                type="button"
                onClick={cart.close}
                className="mt-3 w-full text-center text-xs font-semibold uppercase tracking-widest text-[#8A5A2B] transition-colors hover:text-[#8A5A2B]"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
