'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, ChevronDown, Play } from 'lucide-react';
import TransitionLink from '@/components/ui/TransitionLink';
import MenuSun from '@/components/layout/MenuSun';

import { simplePages } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';
import {
  CONTACT_FIELD_ORDER,
  CONTACT_LIMITS,
  validateContact,
  type ContactErrors,
  type ContactField,
} from '@/lib/contact';

/**
 * Kontakt po uzoru na meracinque contact-us, preslojen u Jevtić paleto:
 * roza pozadina je postala medena (#EEC660), tamniji naslov u tonu pozadine,
 * a bijelo-beige polja forme ostala beige (papir). Lijevo uvod i dva pillova,
 * desno forma.
 *
 * Forma se šalje na /api/contact (vidi tamo šta treba podesiti da mejl stigne).
 * Dok to nije podešeno, server odgovori "not-configured" i forma se sama
 * prebaci na mailto — pa upit ne nestane. Pravila provjere su u lib/contact.ts
 * i ista su u browseru i na serveru.
 */

type Status = 'idle' | 'sending' | 'sent' | 'fallback' | 'error';

const ERROR_COLOR = 'text-[#6B1F0C]'; // 7:1 na medenoj podlozi

export default function ContactView({ locale }: { locale: Locale }) {
  const copy = simplePages.kontakt[locale];
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });

  // Od kad je forma otvorena — server po tome prepoznaje bota koji je "popuni" u tren oka.
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const polje = (kljuc: keyof typeof form, vrijednost: string) => {
    setForm((stanje) => ({ ...stanje, [kljuc]: vrijednost }));
    // Kad počne da ispravlja polje, njegova greška odmah nestaje.
    setErrors((e) => (e[kljuc] ? { ...e, [kljuc]: undefined } : e));
  };

  const mailto = () => {
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
  };

  const pokaziGreske = (found: ContactErrors) => {
    setErrors(found);
    const prvo = CONTACT_FIELD_ORDER.find((k) => found[k]);
    if (prvo) (formRef.current?.elements.namedItem(prvo) as HTMLElement | null)?.focus();
  };

  const posalji = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'sending') return;

    const found = validateContact({ ...form, consent });
    if (Object.keys(found).length > 0) {
      pokaziGreske(found);
      return;
    }
    setErrors({});
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          consent,
          hp_company: honeypot,
          elapsedMs: Date.now() - openedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        reason?: string;
        errors?: ContactErrors;
      };

      if (res.ok && data.ok) {
        setStatus('sent');
        setForm({ firstName: '', lastName: '', email: '', phone: '', interest: '', message: '' });
        setConsent(false);
      } else if (data.reason === 'not-configured') {
        mailto();
        setStatus('fallback');
      } else if (res.status === 422 && data.errors) {
        setStatus('idle');
        pokaziGreske(data.errors);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  /* Jedna ponudjena stavka za select; opciona je, kao na uzoru. */
  const inputBase =
    'scroll-mt-28 h-12 w-full rounded-full border bg-[var(--paper)] px-5 text-[#885B27] placeholder:text-[#885B27]/80 outline-none transition-shadow focus:ring-2 focus:ring-[#885B27]/25';
  const inputClass = (polje: ContactField) =>
    `${inputBase} ${errors[polje] ? 'border-[#6B1F0C]' : 'border-transparent'}`;

  const poruka = (polje: ContactField) => {
    const code = errors[polje];
    if (!code) return null;
    return (
      <p
        id={`${polje}-greska`}
        className={`mt-1.5 px-5 text-xs font-semibold leading-4 ${ERROR_COLOR}`}
      >
        {polje === 'consent' ? copy.form.errors.consent : copy.form.errors[code]}
      </p>
    );
  };

  /* Zajednički atributi za polje: ime (po njemu se fokusira), stanje i veza sa porukom. */
  const aria = (polje: ContactField) => ({
    name: polje,
    'aria-invalid': errors[polje] ? (true as const) : undefined,
    'aria-describedby': errors[polje] ? `${polje}-greska` : undefined,
  });

  return (
    <section className="header-offset bg-[#EEC660] pb-28">
      {/* --- marquee naslov ------------------------------------------- */}
      {/*
        Pravi naslov za čitač ekrana stoji ovdje, izvan `aria-hidden` omotača
        ispod — ranije je bio unutar njega pa ga čitač nikad nije dobio.
        Marquee ispod je samo slika riječi ponovljene osam puta.
      */}
      <h1 className="sr-only">{copy.heading}</h1>
      {/* `relative` da `overflow-hidden` drži i apsolutno pozicionirane potomke. */}
      <div
        className="relative overflow-hidden whitespace-nowrap pt-16 sm:pt-20"
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
                  <MenuSun
                    className="mx-8 h-10 w-auto shrink-0 sm:mx-12 sm:h-14"
                    reversed
                    white
                  />
                </span>
              ))}
            </span>
          ))}
        </h1>
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
        {/* noValidate: provjeru radimo sami (poruke na našem jeziku i u našem stilu). */}
        <form ref={formRef} onSubmit={posalji} noValidate className="relative flex flex-col gap-4">
          {/*
            Zamka za botove: polje koje čovjek nikad ne vidi (van ekrana, van
            tab-redoslijeda, sakriveno od čitača ekrana). Ako ga neko popuni,
            server zna da to nije čovjek.
          */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Company
              <input
                type="text"
                name="hp_company"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="contents">
                <span className="sr-only">{copy.form.firstName}</span>
                <input
                  {...aria('firstName')}
                  type="text"
                  autoComplete="given-name"
                  maxLength={CONTACT_LIMITS.firstName}
                  value={form.firstName}
                  onChange={(e) => polje('firstName', e.target.value)}
                  placeholder={`${copy.form.firstName} *`}
                  className={inputClass('firstName')}
                />
              </label>
              {poruka('firstName')}
            </div>
            <div>
              <label className="contents">
                <span className="sr-only">{copy.form.lastName}</span>
                <input
                  {...aria('lastName')}
                  type="text"
                  autoComplete="family-name"
                  maxLength={CONTACT_LIMITS.lastName}
                  value={form.lastName}
                  onChange={(e) => polje('lastName', e.target.value)}
                  placeholder={`${copy.form.lastName} *`}
                  className={inputClass('lastName')}
                />
              </label>
              {poruka('lastName')}
            </div>
            <div>
              <label className="contents">
                <span className="sr-only">{copy.form.email}</span>
                <input
                  {...aria('email')}
                  type="email"
                  autoComplete="email"
                  maxLength={CONTACT_LIMITS.email}
                  value={form.email}
                  onChange={(e) => polje('email', e.target.value)}
                  placeholder={`${copy.form.email} *`}
                  className={inputClass('email')}
                />
              </label>
              {poruka('email')}
            </div>
            <div>
              <label className="contents">
                <span className="sr-only">{copy.form.phone}</span>
                <input
                  {...aria('phone')}
                  type="tel"
                  autoComplete="tel"
                  maxLength={CONTACT_LIMITS.phone}
                  value={form.phone}
                  onChange={(e) => polje('phone', e.target.value)}
                  placeholder={copy.form.phone}
                  className={inputClass('phone')}
                />
              </label>
              {poruka('phone')}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#885B27]">
                {copy.form.interest} *
              </span>
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">{copy.form.interest}</span>
                <select
                  {...aria('interest')}
                  value={form.interest}
                  onChange={(e) => polje('interest', e.target.value)}
                  className={`${inputClass('interest')} appearance-none pr-10 ${
                    form.interest ? '' : 'text-[#885B27]/80'
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
            {poruka('interest')}
          </div>

          <div>
            <label className="block">
              <span className="sr-only">{copy.form.message}</span>
              <textarea
                {...aria('message')}
                maxLength={CONTACT_LIMITS.message}
                value={form.message}
                onChange={(e) => polje('message', e.target.value)}
                placeholder={copy.form.message}
                rows={5}
                className={`scroll-mt-28 w-full resize-y rounded-[1.75rem] border bg-[var(--paper)] px-5 py-4 text-[#885B27] placeholder:text-[#885B27]/80 outline-none transition-shadow focus:ring-2 focus:ring-[#885B27]/25 ${
                  errors.message ? 'border-[#6B1F0C]' : 'border-transparent'
                }`}
              />
            </label>
            {poruka('message')}
          </div>

          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xs">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  {...aria('consent')}
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setErrors((er) => (er.consent ? { ...er, consent: undefined } : er));
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 scroll-mt-28 accent-[#885B27]"
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
              {errors.consent && (
                <p id="consent-greska" className={`mt-1.5 text-xs font-semibold leading-4 ${ERROR_COLOR}`}>
                  {copy.form.errors.consent}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center gap-3 rounded-full border border-[#885B27]/60 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#885B27] transition-colors duration-300 hover:bg-[#885B27] hover:text-[var(--paper)] disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-[#885B27]"
            >
              {status === 'sending' ? copy.form.sending : copy.form.submit}
              <Play className="h-3 w-3 fill-current" />
            </button>
          </div>

          {/* Jedan živi region za sve ishode — čitač ekrana ga izgovori kad se promijeni. */}
          <div role="status" aria-live="polite">
            {status === 'sent' && (
              <p className="font-display text-xl text-[#885B27]">{copy.form.success}</p>
            )}
            {status === 'fallback' && (
              <p className="font-display text-xl text-[#885B27]">{copy.form.fallback}</p>
            )}
            {status === 'error' && (
              <p className={`text-sm font-semibold leading-6 ${ERROR_COLOR}`}>
                {copy.form.error}{' '}
                <a href={`mailto:${copy.email}`} className="underline underline-offset-2">
                  {copy.email}
                </a>
                .
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
