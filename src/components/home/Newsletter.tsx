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
    <section className="relative overflow-hidden bg-[#d9aa92] py-20 text-[#332a24] lg:py-28">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-[0.64fr_0.36fr] lg:gap-16">
          <div>
            <span className="reveal mb-5 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6c4d1b]">
              <span className="h-px w-9 bg-honey" aria-hidden="true" />
              {copy.eyebrow}
            </span>
            <h2 className="reveal max-w-[18ch] font-display text-4xl font-medium leading-[1.06] tracking-[-0.045em] text-[#332a24] sm:text-5xl">
              {copy.heading}
            </h2>
            <p className="reveal stagger-1 mt-6 max-w-xl text-base leading-7 text-[#5f4c42]">
              {copy.description}
            </p>

            <div className="reveal stagger-2 mt-9 flex flex-wrap gap-6">
              <Link
                href={localeHref(locale, '/products')}
                className="inline-flex min-h-12 items-center gap-2 border-b border-[#332a24]/40 pb-1 text-sm font-semibold text-[#332a24] transition-colors duration-300 hover:border-[#82601f] hover:text-[#82601f]"
              >
                {copy.ctaProducts}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localeHref(locale, '/contact')}
                className="inline-flex min-h-12 items-center gap-2 border-b border-[#332a24]/25 pb-1 text-sm font-semibold text-[#5f4c42] transition-colors duration-300 hover:border-[#332a24] hover:text-[#332a24]"
              >
                {copy.ctaContact}
              </Link>
            </div>

            <form onSubmit={handleSubmit} noValidate className="reveal stagger-3 mt-12 max-w-2xl">
              <div className="flex flex-col gap-2 border-b border-[#332a24]/25 pb-2 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={status !== 'idle'}
                  placeholder={copy.placeholder}
                  aria-label={copy.placeholder}
                  className="min-h-14 flex-1 border-0 bg-transparent px-1 py-4 text-[#332a24] placeholder:text-[#79665a] focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="min-h-12 rounded-[3px] bg-[#332a24] px-7 py-3 text-sm font-semibold text-[#fff8eb] transition-colors duration-300 hover:bg-[#52604e] active:translate-y-px disabled:opacity-70"
                >
                  {buttonLabel}
                </button>
              </div>
              {status === 'done' && (
                <p className="mt-3 text-sm text-[#4a3b2f]" role="status">
                  {copy.success}
                </p>
              )}
            </form>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-[21rem] overflow-hidden bg-[#f3e8d6] shadow-[0_20px_55px_rgba(70,43,30,0.13)]">
            <Image
              src="/images/products/bagremov-med-brand-v3.webp"
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
