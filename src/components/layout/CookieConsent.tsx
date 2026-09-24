'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';

import TransitionLink from '@/components/ui/TransitionLink';
import { cookieConsent } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

/*
 * Saglasnost za mjerenje posjeta.
 *
 * Šta sajt čuva: korpu i listu želja (localStorage — to je potrebno da bi
 * korpa radila, pa se za to ne pita) i, tek uz saglasnost, Vercel Web
 * Analytics. Analitika se ne učitava dok posjetilac ne klikne "Prihvatam";
 * "Samo neophodno" znači da se ništa ne učitava.
 *
 * Izbor pamtimo šest mjeseci, pa pitamo ponovo. Do njega se uvijek može doći
 * iz podnožja ("Podešavanja kolačića"), jer odustati mora biti isto lako kao
 * pristati.
 *
 * Vercel skripta se ubacuje običnom <script> etiketom, bez paketa
 * (@vercel/analytics) — to je zvanični način za sajtove bez njihovog SDK-a i
 * jedna zavisnost manje. Radi samo u produkciji i tek kad je Web Analytics
 * uključen u Vercel dashboardu (Project -> Analytics -> Enable).
 */

const STORAGE_KEY = 'jevtic.consent';
const OPEN_EVENT = 'jevtic:cookie-settings';
const VALID_MS = 1000 * 60 * 60 * 24 * 183;

type Choice = 'all' | 'necessary';

function readChoice(): Choice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { choice, at } = JSON.parse(raw) as { choice?: string; at?: number };
    if ((choice !== 'all' && choice !== 'necessary') || typeof at !== 'number') return null;
    return Date.now() - at < VALID_MS ? choice : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, at: Date.now() }));
  } catch {
    /* privatni prozor ili blokiran storage — izbor važi do zatvaranja strane */
  }
}

export default function CookieConsent({ locale }: { locale: Locale }) {
  const copy = cookieConsent[locale];
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);
  const firstButton = useRef<HTMLButtonElement>(null);
  const openedByUser = useRef(false);

  useEffect(() => {
    const saved = readChoice();
    setChoice(saved);
    if (saved) return;

    // Ne preko zavjese: banner se pojavi tek kad preloader završi.
    const html = document.documentElement;
    if (!html.classList.contains('is-preloading')) {
      setOpen(true);
      return;
    }
    const observer = new MutationObserver(() => {
      if (!html.classList.contains('is-preloading')) {
        observer.disconnect();
        setOpen(true);
      }
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reopen = () => {
      openedByUser.current = true;
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  // Kad ga posjetilac sam otvori iz podnožja, fokus ide na banner (tastatura, čitač ekrana).
  useEffect(() => {
    if (open && openedByUser.current) {
      openedByUser.current = false;
      firstButton.current?.focus();
    }
  }, [open]);

  const decide = useCallback((next: Choice) => {
    saveChoice(next);
    setChoice(next);
    setOpen(false);
  }, []);

  const pill =
    'inline-flex items-center justify-center rounded-full border border-[#885B27]/60 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#885B27] transition-colors duration-300 hover:bg-[#885B27] hover:text-[var(--paper)] focus-visible:bg-[#885B27] focus-visible:text-[var(--paper)]';

  return (
    <>
      {choice === 'all' && process.env.NODE_ENV === 'production' && (
        <>
          <Script id="vercel-analytics-init" strategy="afterInteractive">
            {'window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };'}
          </Script>
          <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
        </>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          className="fixed inset-x-3 bottom-3 z-[45] rounded-[0.6rem] border border-[#885B27]/25 bg-[var(--paper)] p-5 shadow-[0_12px_40px_-12px_rgba(136,91,39,0.35)] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-[26rem] sm:p-6"
        >
          <h2 id="cookie-title" className="font-display text-xl leading-tight text-[#885B27]">
            {copy.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#885B27]">
            {copy.text}{' '}
            <TransitionLink
              href={localeHref(locale, '/privacy')}
              className="underline underline-offset-2 hover:decoration-2"
            >
              {copy.more}
            </TransitionLink>
            .
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button ref={firstButton} type="button" className={pill} onClick={() => decide('necessary')}>
              {copy.necessary}
            </button>
            <button type="button" className={pill} onClick={() => decide('all')}>
              {copy.accept}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Dugme za podnožje: ponovo otvara banner. */
export function CookieSettingsButton({ locale }: { locale: Locale }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {cookieConsent[locale].settings}
    </button>
  );
}
