import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import WishlistView from '@/components/wishlist/WishlistView';
import { meta } from '@/content/pages';
import { isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].wishlist.title, description: meta[l].wishlist.description };
}

export default async function WishlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <WishlistView locale={locale} />;
}
