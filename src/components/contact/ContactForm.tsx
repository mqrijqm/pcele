'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

import { createTranslator, type Locale } from '@/i18n/config';

const fieldClass =
  'w-full rounded-[0.6rem] border border-[#73552E]/15 bg-[var(--paper)] px-4 py-3 text-base text-[#73552E] transition-colors duration-200 placeholder:text-[#73552E] hover:border-[#73552E]/40 focus:border-[#C79A3B] focus:outline-none focus:ring-1 focus:ring-[#C79A3B]/30 disabled:cursor-not-allowed disabled:opacity-50';

const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-widest text-[#73552E]';

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  function update(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) return setError(t('contactForm.validation.nameRequired'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError(t('contactForm.validation.emailInvalid'));
    if (form.message.trim().length < 10)
      return setError(t('contactForm.validation.messageTooShort'));

    setStatus('sending');
    // There is no mail backend in this build — the message is acknowledged locally.
    window.setTimeout(() => setStatus('sent'), 700);
  }

  if (status === 'sent') {
    return (
      <div className="border border-[#73552E]/15 bg-[var(--paper)] p-8 rounded-[0.6rem]">
        <p className="text-2xl text-[#73552E]">{t('contact.form.success')}</p>
        <p className="mt-3 text-sm text-[#73552E]">{t('contact.willReply')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="w-full">
          <label htmlFor="contact-name" className={labelClass}>
            {t('contact.form.name')}
          </label>
          <input
            id="contact-name"
            required
            value={form.name}
            onChange={update('name')}
            className={fieldClass}
          />
        </div>
        <div className="w-full">
          <label htmlFor="contact-email" className={labelClass}>
            {t('contact.form.email')}
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="w-full">
        <label htmlFor="contact-phone" className={labelClass}>
          {t('contact.form.phone')}
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={form.phone}
          onChange={update('phone')}
          className={fieldClass}
        />
      </div>

      <div className="w-full">
        <label htmlFor="contact-message" className={labelClass}>
          {t('contact.form.message')}
        </label>
        <textarea
          id="contact-message"
          rows={6}
          required
          value={form.message}
          onChange={update('message')}
          className={`${fieldClass} resize-none rounded-[0.6rem]`}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-honey-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn w-full"
      >
        <Send className="mr-2 h-4 w-4" />
        {status === 'sending' ? t('common.loading') : t('contact.form.submit')}
      </button>
    </form>
  );
}
