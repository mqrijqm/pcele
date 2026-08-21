import Link from 'next/link';

import { createTranslator, localeHref, type Locale } from '@/i18n/config';

const navLinks = [
  { href: '/products', key: 'nav.shop' },
  { href: '/about', key: 'nav.about' },
  { href: '/process', key: 'nav.process' },
  { href: '/contact', key: 'nav.contact' },
];

const socials = [
  { href: 'https://instagram.com/pcelarstvo_jevtic', label: 'Instagram' },
  { href: 'https://facebook.com', label: 'Facebook' },
];

export default function Footer({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#8A5A2B] text-[#FFF7E6]">
      <div className="container pt-20 lg:pt-28">
        {/* Only what someone actually needs: where we are, how to reach us, where to go next. */}
        <div className="reveal grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto]">
          <div className="max-w-sm">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFF7E6]">
              <span aria-hidden="true" className="h-px w-8 bg-[#C89B3C]" />
              {locale === 'sr' ? 'Od 1985.' : 'Since 1985'}
            </p>
            <p className="mt-4 text-base leading-7 text-[#FFF7E6]/90">{t('footer.tagline')}</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-14 lg:gap-20">
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localeHref(locale, link.href)}
                    className="text-sm text-[#FFF7E6]/90 transition-colors hover:text-[#FFF7E6]"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5 text-sm">
              <p className="text-[#FFF7E6]/90">{t('contact.info.address')}</p>
              <p>
                <a
                  href="tel:+38765XXXXXX"
                  className="text-[#FFF7E6] transition-colors hover:underline hover:decoration-[#C89B3C] hover:decoration-2 hover:underline-offset-4"
                >
                  {t('contact.info.phone')}
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@pcelarstvo-jevtic.ba"
                  className="text-[#FFF7E6] transition-colors hover:underline hover:decoration-[#C89B3C] hover:decoration-2 hover:underline-offset-4"
                >
                  {t('contact.info.email')}
                </a>
              </p>
              <div className="flex gap-5 pt-1.5">
                {socials.map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#FFF7E6]/90 underline-offset-4 transition-colors hover:underline hover:decoration-[#C89B3C] hover:decoration-2 hover:underline-offset-4 hover:underline"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-[#FFF7E6]/15 pt-5 text-xs text-[#FFF7E6]/90 md:flex-row md:items-center">
          <p>{t('footer.copyright', { year })}</p>
          <div className="flex items-center gap-5">
            <Link
              href={localeHref(locale, '/privacy')}
              className="transition-colors hover:text-[#FFF7E6]"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href={localeHref(locale, '/terms')}
              className="transition-colors hover:text-[#FFF7E6]"
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>

      {/* The name, full width, sitting on the bottom edge of the page.
          Leading stays roomy enough for the acute on Ć — clipping it would be a typo. */}
      <div className="mt-12 overflow-hidden px-5 sm:px-8 lg:px-12">
        <p
          aria-hidden="true"
          className="-mb-[0.16em] select-none pt-[0.16em] text-center font-display font-medium leading-[0.95] tracking-[-0.045em] text-[#FFF7E6] text-[clamp(4rem,23vw,21rem)]"
        >
          JEVTIĆ
        </p>
      </div>
    </footer>
  );
}
