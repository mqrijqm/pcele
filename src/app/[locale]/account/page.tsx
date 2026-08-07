import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Package, Settings, User } from 'lucide-react';

import { meta } from '@/content/pages';
import { createTranslator, isLocale, localeHref, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].account.title, description: meta[l].account.description };
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = createTranslator(locale);

  const shortcuts = [
    { Icon: Package, label: t('account.orders'), note: t('account.noOrdersMessage') },
    { Icon: User, label: t('account.addresses'), note: t('account.noAddresses') },
    { Icon: Settings, label: t('account.settings'), note: t('account.settingsSubtitle') },
  ];

  return (
    <div className="bg-ivory pt-24">
      <section className="section-padding">
        <div className="container max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#82601f]">
            {t('nav.account')}
          </p>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-espresso">
            {t('account.title')}
          </h1>
          <p className="mt-5 text-base leading-7 text-walnut">{t('account.subtitle')}</p>

          <div className="mt-10 border border-sand/80 bg-white p-8">
            <p className="font-display text-2xl text-espresso">{t('account.signInPrompt')}</p>
            <p className="mt-3 text-sm text-walnut">{t('account.guestCheckoutNote')}</p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href={localeHref(locale, '/products')}
                className="inline-flex min-h-12 items-center rounded-full bg-honey px-7 text-sm font-semibold text-white transition-colors hover:bg-honey-600"
              >
                {t('account.startShopping')}
              </Link>
              <Link
                href={localeHref(locale, '/contact')}
                className="inline-flex min-h-12 items-center border-b border-[#332a24]/35 pb-1 text-sm font-semibold text-espresso transition-colors hover:border-honey hover:text-honey-700"
              >
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-px border border-[#332a24]/12 bg-[#332a24]/12 sm:grid-cols-3">
            {shortcuts.map(({ Icon, label, note }) => (
              <div key={label} className="bg-ivory p-6">
                <Icon className="h-5 w-5 text-[#82601f]" />
                <p className="mt-4 font-display text-xl text-espresso">{label}</p>
                <p className="mt-2 text-xs leading-5 text-stone">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
