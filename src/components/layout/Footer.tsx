import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

import { createTranslator, localeHref, type Locale } from '@/i18n/config';

const quickLinks = [
  { href: '/products', key: 'nav.shop' },
  { href: '/about', key: 'nav.about' },
  { href: '/process', key: 'nav.process' },
  { href: '/blog', key: 'blog.navLabel' },
  { href: '/contact', key: 'nav.contact' },
];

const productLinks = [
  { href: '/products/bagremov-med', index: 0 },
  { href: '/products/livadski-med', index: 1 },
  { href: '/products/sumski-med', index: 2 },
];

const socials = [
  { href: 'https://instagram.com/pcelarstvo_jevtic', label: 'Instagram', Icon: Instagram },
  { href: 'https://facebook.com', label: 'Facebook', Icon: Facebook },
  { href: 'mailto:info@pcelarstvo-jevtic.ba', label: 'Email', Icon: Mail },
];

export default function Footer({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const year = new Date().getFullYear();

  const productNames =
    locale === 'sr'
      ? ['Bagremov med', 'Livadski med', 'Šumski med']
      : ['Acacia honey', 'Meadow honey', 'Forest honey'];

  return (
    <footer className="bg-espresso text-[#FFF7E6]">
      <div className="container py-16 lg:py-20">
        <div className="reveal grid gap-10 border-b border-[#FFF7E6]/10 pb-12 lg:grid-cols-[1.1fr_0.7fr_0.7fr_1fr] lg:gap-12">
          <div>
            <Link
              href={localeHref(locale, '/')}
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/logo-mark.svg"
                alt="Pčelarstvo Jevtić"
                width={64}
                height={64}
                className="h-12 w-12 rounded-full bg-[#FFF7E6] p-2"
              />
              <span className="font-display text-2xl text-[#FFF7E6]">{t('common.brandName')}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#FFF7E6]/60">
              {t('footer.tagline')}
            </p>
            <div className="mt-7 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FFF7E6]/12 text-[#FFF7E6]/70 transition-colors duration-300 hover:border-[#C89B3C] hover:bg-[#8A5A2B] hover:text-[#FFF7E6]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-normal text-honey-200">
              {t('footer.quickLinks')}
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localeHref(locale, link.href)}
                    className="text-sm text-[#FFF7E6]/60 transition-colors hover:text-[#FFF7E6]"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-normal text-honey-200">
              {t('nav.shop')}
            </h3>
            <ul className="mt-5 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localeHref(locale, link.href)}
                    className="text-sm text-[#FFF7E6]/60 transition-colors hover:text-[#FFF7E6]"
                  >
                    {productNames[link.index]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-normal text-honey-200">
              {t('footer.contact')}
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-honey-200" />
                <div>
                  <span className="block text-sm text-[#FFF7E6]/75">{t('contact.info.address')}</span>
                  <span className="text-xs text-[#FFF7E6]/35">Republika Srpska, BiH</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-honey-200" />
                <div>
                  <span className="block text-sm text-[#FFF7E6]/75">{t('contact.info.phone')}</span>
                  <span className="text-xs text-[#FFF7E6]/35">{t('footer.hours')}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-honey-200" />
                <div>
                  <span className="block text-sm text-[#FFF7E6]/75">{t('contact.info.email')}</span>
                  <span className="text-xs text-[#FFF7E6]/35">{t('footer.emailReplyTime')}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-6 md:flex-row md:items-center">
          <p className="text-xs text-[#FFF7E6]/35">{t('footer.copyright', { year })}</p>
          <div className="flex items-center gap-5">
            <Link
              href={localeHref(locale, '/privacy')}
              className="text-xs text-[#FFF7E6]/35 transition-colors hover:text-[#FFF7E6]/60"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href={localeHref(locale, '/terms')}
              className="text-xs text-[#FFF7E6]/35 transition-colors hover:text-[#FFF7E6]/60"
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
