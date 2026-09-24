import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LegalPage from '@/components/legal/LegalPage';
import { legal } from '@/data/legal';
import { meta } from '@/content/pages';
import { createTranslator, isLocale, type Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return pageMetadata({ locale: l, path: '/privacy', ...meta[l].privacy });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = createTranslator(locale);

  return (
    <LegalPage
      locale={locale}
      doc={legal[locale].privacy}
      eyebrow={t('privacy.eyebrow')}
      title={t('privacy.title')}
      subtitle={t('privacy.subtitle')}
    />
  );
}
