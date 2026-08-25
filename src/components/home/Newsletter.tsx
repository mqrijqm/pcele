'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

export default function Newsletter({ locale }: { locale: Locale }) {
  const copy = home.newsletter[locale];
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || status !== 'idle') return;
    setStatus('sending');
    // No mailing backend is wired up — acknowledge locally, as the original does.
    window.setTimeout(() => setStatus('done'), 600);
  }

  const buttonLabel =
    status === 'sending' ? copy.sending : status === 'done' ? copy.joined : copy.join;

  return (
    <section className="relative overflow-hidden bg-[var(--paper)] section-padding text-[#73552E]">
      <div className="container">
        <div className="grid items-center gap-16 lg:grid-cols-[0.64fr_0.36fr] lg:gap-20">
          <div>
            <span className="reveal mb-5 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#73552E]">
              <span className="h-px w-9 bg-[#C79A3B]" aria-hidden="true" />
              {copy.eyebrow}
            </span>
            <h2 className="reveal max-w-[18ch] font-display text-display-md font-normal text-[#73552E]">
              {copy.heading}
            </h2>
            <p className="reveal stagger-1 mt-6 max-w-xl text-base leading-7 text-[#73552E]">
              {copy.description}
            </p>

            <div className="reveal stagger-2 mt-9 flex flex-wrap gap-6">
              <Link
                href={localeHref(locale, '/products')}
                className="inline-flex min-h-12 items-center gap-2 border-b border-[#73552E]/40 pb-1 text-sm font-semibold text-[#73552E] transition-colors duration-300 hover:border-[#73552E] hover:text-[#73552E]"
              >
                {copy.ctaProducts}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localeHref(locale, '/contact')}
                className="inline-flex min-h-12 items-center gap-2 border-b border-[#73552E]/25 pb-1 text-sm font-semibold text-[#73552E] transition-colors duration-300 hover:border-[#73552E] hover:text-[#73552E]"
              >
                {copy.ctaContact}
              </Link>
            </div>

            <form onSubmit={handleSubmit} noValidate className="reveal stagger-3 mt-12 max-w-2xl">
              <div className="flex flex-col gap-2 rounded-full border border-[#73552E]/20 bg-[var(--paper)] p-2 sm:flex-row sm:items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={status !== 'idle'}
                  placeholder={copy.placeholder}
                  aria-label={copy.placeholder}
                  className="min-h-12 flex-1 rounded-full border-0 bg-transparent px-5 py-3 text-[#73552E] placeholder:text-[#73552E] focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="btn"
                >
                  {buttonLabel}
                </button>
              </div>
              {status === 'done' && (
                <p className="mt-3 text-sm text-[#73552E]" role="status">
                  {copy.success}
                </p>
              )}
            </form>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[21rem] overflow-hidden bg-[#73552E]/[0.06] shadow-[0_20px_55px_rgba(115,85,46,0.13)] rounded-[0.6rem]">
            <Image
              src="/images/real/tegle-red.webp"
              alt={copy.jarAlt}
              fill
              sizes="(max-width: 1024px) 80vw, 21rem"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
