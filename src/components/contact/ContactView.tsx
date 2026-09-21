'use client';

import { useState } from 'react';
import { Mail, Phone, ChevronDown, Play } from 'lucide-react';
import TransitionLink from '@/components/ui/TransitionLink';
import MenuSun from '@/components/layout/MenuSun';

import { simplePages } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * Kontakt po uzoru na meracinque contact-us, preslojen u Jevtić paleto:
 * roza pozadina je postala medena (#EEC660), tamniji naslov u tonu pozadine,
 * a bijelo-beige polja forme ostala beige (papir). Lijevo uvod i dva pillova,
 * desno forma.
 *
 * Forma nema backend — slanje ide kroz mailto koji se sastavi od polja, pa
 * nakon poziva pokažemo poruku da je upit poslan.
 */
export default function ContactView({ locale }: { locale: Locale }) {
  const copy = simplePages.kontakt[locale];
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });

  const polje = (kljuc: keyof typeof form, vrijednost: string) =>
    setForm((stanje) => ({ ...stanje, [kljuc]: vrijednost }));

  const posalji = (event: React.FormEvent) => {
    event.preventDefault();
    const body = [
      `${copy.form.firstName}: ${form.firstName}`,
      `${copy.form.lastName}: ${form.lastName}`,
      `${copy.form.email}: ${form.email}`,
      `${copy.form.phone}: ${form.phone}`,
      `${copy.form.interest}: ${form.interest}`,
      '',
      form.message,
    ].join('\n');
    window.location.href = `mailto:${copy.email}?subject=${encodeURIComponent(
      copy.form.subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  /* Jedna ponudjena stavka za select; opciona je, kao na uzoru. */
  const inputClass =
    'h-12 w-full rounded-full border border-transparent bg-[var(--paper)] px-5 text-[#885B27] placeholder:text-[#885B27]/55 outline-none transition-shadow focus:ring-2 focus:ring-[#885B27]/25';

  return (
    <section className="header-offset bg-[#EEC660] pb-28">
      {/* --- marquee naslov ------------------------------------------- */}
      <div
        className="overflow-hidden whitespace-nowrap pt-16 sm:pt-20"
        aria-hidden="true"
      >
        <h1 className="kontakt-marquee inline-flex w-max items-center">
          {[0, 1].map((grupa) => (
            <span key={grupa} className="inline-flex w-max shrink-0 items-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="inline-flex shrink-0 items-center">
                  <span className="font-display text-[5rem] font-medium leading-none tracking-[-0.02em] text-[#885B27] sm:text-[7.5rem] lg:text-[9.5rem]">
                    {copy.heading}
                  </span>
                  <MenuSun className="mx-8 h-10 w-auto shrink-0 sm:mx-12 sm:h-14" />
                </span>
              ))}
            </span>
          ))}
        </h1>
        {/* Citac ekrana dobija jedan obican naslov umesto galerije ponavljanja. */}
        <span className="sr-only">{copy.heading}</span>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:mt-28 lg:grid-cols-2 lg:gap-20 lg:px-12">
        {/* --- lijevo: uvod + kontakt pillovi -------------------------- */}
        <div>
          <p className="max-w-lg font-display text-3xl leading-[1.15] tracking-[-0.02em] text-[#885B27] sm:text-4xl">
            {copy.intro[0]}
            <br />
            {copy.intro[1]}
            <br />
            {copy.intro[2]}
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href={`mailto:${copy.email}`}
              className="inline-flex items-center gap-3 rounded-full border border-[#885B27]/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#885B27] transition-colors duration-300 hover:bg-[#885B27] hover:text-[var(--paper)]"
            >
              <Mail className="h-4 w-4" strokeWidth={1.7} />
              {copy.email}
            </a>
            <a
              href="tel:+38766030550"
              className="inline-flex items-center gap-3 rounded-full border border-[#885B27]/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#885B27] transition-colors duration-300 hover:bg-[#885B27] hover:text-[var(--paper)]"
            >
              <Phone className="h-4 w-4" strokeWidth={1.7} />
              {copy.phone}
            </a>
          </div>
        </div>

        {/* --- desno: forma -------------------------------------------- */}
        <form onSubmit={posalji} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="contents">
              <span className="sr-only">{copy.form.firstName}</span>
              <input
                required
                type="text"
                value={form.firstName}
                onChange={(e) => polje('firstName', e.target.value)}
                placeholder={`${copy.form.firstName} *`}
                className={inputClass}
              />
            </label>
            <label className="contents">
              <span className="sr-only">{copy.form.lastName}</span>
              <input
                required
                type="text"
                value={form.lastName}
                onChange={(e) => polje('lastName', e.target.value)}
                placeholder={`${copy.form.lastName} *`}
                className={inputClass}
              />
            </label>
            <label className="contents">
              <span className="sr-only">{copy.form.email}</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => polje('email', e.target.value)}
                placeholder={`${copy.form.email} *`}
                className={inputClass}
              />
            </label>
            <label className="contents">
              <span className="sr-only">{copy.form.phone}</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => polje('phone', e.target.value)}
                placeholder={copy.form.phone}
                className={inputClass}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#885B27]">
              {copy.form.interest} *
            </span>
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">{copy.form.interest}</span>
              <select
                required
                value={form.interest}
                onChange={(e) => polje('interest', e.target.value)}
                className={`${inputClass} appearance-none pr-10 ${
                  form.interest ? '' : 'text-[#885B27]/55'
                }`}
              >
                <option value="" disabled>
                  {copy.form.selectPlaceholder}
                </option>
                {copy.form.interests.map((opcija) => (
                  <option key={opcija} value={opcija} className="text-[#885B27]">
                    {opcija}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#885B27]"
              />
            </label>
          </div>

          <label className="block">
            <span className="sr-only">{copy.form.message}</span>
            <textarea
              value={form.message}
              onChange={(e) => polje('message', e.target.value)}
              placeholder={copy.form.message}
              rows={5}
              className="w-full resize-y rounded-[1.75rem] border border-transparent bg-[var(--paper)] px-5 py-4 text-[#885B27] placeholder:text-[#885B27]/55 outline-none transition-shadow focus:ring-2 focus:ring-[#885B27]/25"
            />
          </label>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <label className="flex max-w-xs cursor-pointer items-start gap-3">
              <input
                required
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#885B27]"
              />
              <span className="text-xs leading-5 text-[#885B27]">
                {copy.form.privacy}{' '}
                <TransitionLink
                  href={localeHref(locale, '/privacy')}
                  className="underline underline-offset-2 hover:decoration-2"
                >
                  {copy.form.privacyLink}
                </TransitionLink>
                . *
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex items-center gap-3 rounded-full border border-[#885B27]/60 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#885B27] transition-colors duration-300 hover:bg-[#885B27] hover:text-[var(--paper)]"
            >
              {copy.form.submit}
              <Play className="h-3 w-3 fill-current" />
            </button>
          </div>

          {sent && (
            <p role="status" className="font-display text-xl text-[#885B27]">
              {copy.form.success}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
