import type { Metadata } from 'next';
import TransitionLink from '@/components/ui/TransitionLink';
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
    <div className="bg-ivory header-offset">
      <section className="section-padding">
        <div className="container max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#885B27]">
            {t('nav.account')}
          </p>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.02] tracking-[-0.035em] text-[#885B27]">
            {t('account.title')}
          </h1>
          <p className="mt-5 text-base leading-7 text-[#885B27]">{t('account.subtitle')}</p>

          <div className="mt-10 border border-[#885B27]/15 bg-[var(--paper)] p-8 rounded-[0.6rem]">
            <p className="text-2xl text-[#885B27]">{t('account.signInPrompt')}</p>
            <p className="mt-3 text-sm text-[#885B27]">{t('account.guestCheckoutNote')}</p>
            <div className="mt-7 flex flex-wrap gap-4">
              <TransitionLink
                href={localeHref(locale, '/products')}
                className="btn"
              >
                {t('account.startShopping')}
              </TransitionLink>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {shortcuts.map(({ Icon, label, note }) => (
              <div key={label} className="rounded-[0.6rem] bg-[#885B27]/[0.06] p-6">
                <Icon className="h-5 w-5 text-[#885B27]" />
                <p className="mt-4 text-xl text-[#885B27]">{label}</p>
                <p className="mt-2 text-xs leading-5 text-[#885B27]">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
