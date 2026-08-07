'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { createTranslator, localeHref, type Locale } from '@/i18n/config';

const STORAGE_KEY = 'jevtic.cookie-consent';

export default function CookieConsent({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage blocked — do not nag */
    }
  }, []);

  function decide(choice: 'essential' | 'all') {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section
      aria-label={t('cookieConsent.ariaLabel')}
      className="fixed bottom-5 left-5 right-5 z-[100] sm:left-6 sm:right-auto sm:max-w-md"
    >
      <div className="border border-[#332a24]/20 bg-[#332a24] p-6 text-[#fff8eb] shadow-[0_24px_70px_rgba(30,22,16,0.35)]">
        <h2 className="font-display text-xl text-[#fff8eb]">{t('cookieConsent.title')}</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {t('cookieConsent.description')}{' '}
          <Link
            href={localeHref(locale, '/privacy')}
            className="border-b border-honey-200/60 text-honey-200 transition-colors hover:text-white"
          >
            {t('cookieConsent.learnMore')}
          </Link>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => decide('essential')}
            className="min-h-11 border border-white/25 px-5 text-sm font-semibold text-white/80 transition-colors hover:border-white hover:text-white"
          >
            {t('cookieConsent.essentialOnly')}
          </button>
          <button
            type="button"
            onClick={() => decide('all')}
            className="min-h-11 bg-honey px-6 text-sm font-semibold text-white transition-colors hover:bg-honey-600"
          >
            {t('cookieConsent.accept')}
          </button>
        </div>
      </div>
    </section>
  );
}
