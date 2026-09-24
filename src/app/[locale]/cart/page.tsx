import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CartView from '@/components/cart/CartView';
import { meta } from '@/content/pages';
import { isLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return pageMetadata({ locale: l, path: '/cart', ...meta[l].cart, noindex: true });
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <CartView locale={locale} />;
}
