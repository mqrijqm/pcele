import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ContactView from '@/components/contact/ContactView';
import { meta } from '@/content/pages';
import { isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].contact.title, description: meta[l].contact.description };
}

export default async function KontaktPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ContactView locale={locale} />;
}
