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
      <div className="rounded-[1.5rem] border border-[#8A5A2B]/15 bg-[#FFF7E6] p-6 text-[#8A5A2B] shadow-[0_24px_70px_rgba(138,90,43,0.35)]">
        <h2 className="font-display text-xl text-[#8A5A2B]">{t('cookieConsent.title')}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#8A5A2B]">
          {t('cookieConsent.description')}{' '}
          <Link
            href={localeHref(locale, '/privacy')}
            className="border-b border-[#C89B3C] text-[#8A5A2B] transition-colors hover:border-[#8A5A2B]"
          >
            {t('cookieConsent.learnMore')}
          </Link>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => decide('essential')}
            className="min-h-11 rounded-full border border-[#8A5A2B]/30 px-5 text-sm font-semibold text-[#8A5A2B] transition-colors hover:border-[#8A5A2B] hover:text-[#8A5A2B]"
          >
            {t('cookieConsent.essentialOnly')}
          </button>
          <button
            type="button"
            onClick={() => decide('all')}
            className="min-h-11 rounded-full bg-[#8A5A2B] px-6 text-sm font-semibold text-[#FFF7E6] transition-colors hover:bg-[#C89B3C] hover:text-[#8A5A2B]"
          >
            {t('cookieConsent.accept')}
          </button>
        </div>
      </div>
    </section>
  );
}
