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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5A2B]">
            {t('nav.account')}
          </p>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-[#8A5A2B]">
            {t('account.title')}
          </h1>
          <p className="mt-5 text-base leading-7 text-[#8A5A2B]/80">{t('account.subtitle')}</p>

          <div className="mt-10 border border-[#8A5A2B]/15 bg-[#FFF7E6] p-8 rounded-[1.5rem]">
            <p className="font-display text-2xl text-[#8A5A2B]">{t('account.signInPrompt')}</p>
            <p className="mt-3 text-sm text-[#8A5A2B]/80">{t('account.guestCheckoutNote')}</p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href={localeHref(locale, '/products')}
                className="inline-flex min-h-12 items-center rounded-full bg-[#8A5A2B] px-7 text-sm font-semibold text-[#FFF7E6] transition-colors hover:bg-[#C89B3C] hover:text-[#8A5A2B]"
              >
                {t('account.startShopping')}
              </Link>
              <Link
                href={localeHref(locale, '/contact')}
                className="inline-flex min-h-12 items-center border-b border-[#8A5A2B]/35 pb-1 text-sm font-semibold text-[#8A5A2B] transition-colors hover:border-[#C89B3C] hover:text-[#8A5A2B]/70"
              >
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {shortcuts.map(({ Icon, label, note }) => (
              <div key={label} className="rounded-[1.5rem] bg-[#F6EEDB] p-6">
                <Icon className="h-5 w-5 text-[#8A5A2B]" />
                <p className="mt-4 font-display text-xl text-[#8A5A2B]">{label}</p>
                <p className="mt-2 text-xs leading-5 text-[#8A5A2B]/70">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
