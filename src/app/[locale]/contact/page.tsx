import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import PageHero from '@/components/ui/PageHero';
import ContactForm from '@/components/contact/ContactForm';
import { contactPage, meta } from '@/content/pages';
import { createTranslator, isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].contact.title, description: meta[l].contact.description };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = contactPage[locale];
  const t = createTranslator(locale);

  const details = [
    { Icon: MapPin, title: t('contact.addressLabel'), value: t('contact.info.address') },
    { Icon: Phone, title: locale === 'sr' ? 'Telefon' : 'Phone', value: t('contact.info.phone') },
    { Icon: Mail, title: 'Email', value: t('contact.info.email') },
    { Icon: Clock, title: t('contact.workingHoursLabel'), value: t('contact.info.hours') },
  ];

  return (
    <div className="header-offset">
      <PageHero
        eyebrow={copy.eyebrow}
        heading={copy.heading}
        description={copy.description}
        note={copy.note}
        image="/images/real/ram-2025.webp"
        imageAlt={copy.heroAlt}
        background="#FDF9DC"
        cardSide="right"
        imageWidth="lg:w-[78%]"
        cardWidth="lg:w-[42%]"
        headingClamp="max-w-[12ch]"
      />

      <section className="section-padding relative overflow-hidden bg-ivory">
        <div className="container relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="reveal-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#73552E]">
                {t('contact.sendMessage')}
              </p>
              <h2 className="mb-8 font-display text-display-sm text-[#73552E]">
                {t('contact.gladToHelp')}
              </h2>
              <ContactForm locale={locale} />
            </div>

            <div className="reveal-right space-y-6 bg-[#73552E]/[0.06] p-7 sm:p-9 rounded-[1.75rem]">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#73552E]">
                  {t('contact.information')}
                </p>
                <h2 className="text-2xl text-[#73552E]">{t('contact.info.title')}</h2>

                <div className="mt-8 border-t border-[#73552E]/18">
                  {details.map(({ Icon, title, value }) => (
                    <div
                      key={title}
                      className="flex items-start gap-4 border-b border-[#73552E]/18 py-5"
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#73552E]" />
                      <div>
                        <h3 className="text-sm font-medium text-[#73552E]">{title}</h3>
                        <p className="mt-0.5 text-sm text-[#73552E]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#73552E]">
                  {t('contact.ourLocation')}
                </p>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem]">
                  <Image
                    src="/images/real/kosnice-livada.webp"
                    alt={t('contact.mapAlt')}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover saturate-[0.82]"
                  />
                </div>
                <p className="mt-4 text-sm text-[#73552E]">{t('contact.locationDescription')}</p>
              </div>

              <div className="aspect-video overflow-hidden border border-[#73552E]/15 rounded-[2rem]">
                <iframe
                  title={t('contact.mapAlt')}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d90547.90831565396!2d17.538!3d44.867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475e0146f7b9c739%3A0x1a5a5e5cd4c66f6b!2sPrnjavor!5e0!3m2!1sen!2sba!4v1700000000000!5m2!1sen!2sba"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
