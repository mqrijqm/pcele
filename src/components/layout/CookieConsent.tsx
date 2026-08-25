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
      <div className="rounded-[0.6rem] border border-[#73552E]/15 bg-[var(--paper)] p-6 text-[#73552E] shadow-[0_24px_70px_rgba(115,85,46,0.35)]">
        <h2 className="text-xl text-[#73552E]">{t('cookieConsent.title')}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#73552E]">
          {t('cookieConsent.description')}{' '}
          <Link
            href={localeHref(locale, '/privacy')}
            className="border-b border-[#C79A3B] text-[#73552E] transition-colors hover:border-[#73552E]"
          >
            {t('cookieConsent.learnMore')}
          </Link>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => decide('essential')}
            className="min-h-11 rounded-full border border-[#73552E]/30 px-5 text-sm font-semibold text-[#73552E] transition-colors hover:border-[#73552E] hover:text-[#73552E]"
          >
            {t('cookieConsent.essentialOnly')}
          </button>
          <button
            type="button"
            onClick={() => decide('all')}
            className="min-h-11 rounded-full bg-[#73552E] px-6 text-sm font-semibold text-[#F5E8D8] transition-colors hover:bg-[#C79A3B] hover:text-[#73552E]"
          >
            {t('cookieConsent.accept')}
          </button>
        </div>
      </div>
    </section>
  );
}
