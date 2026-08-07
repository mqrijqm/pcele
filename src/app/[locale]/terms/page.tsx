import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LegalPage from '@/components/legal/LegalPage';
import { legal } from '@/data/legal';
import { meta } from '@/content/pages';
import { createTranslator, isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].terms.title, description: meta[l].terms.description };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = createTranslator(locale);

  return (
    <LegalPage
      locale={locale}
      doc={legal[locale].terms}
      eyebrow={t('terms.eyebrow')}
      title={t('terms.title')}
      subtitle={t('terms.subtitle')}
    />
  );
}
