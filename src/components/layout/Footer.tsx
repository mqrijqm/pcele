import Image from 'next/image';
import Link from 'next/link';

import { createTranslator, localeHref, type Locale } from '@/i18n/config';

const navLinks = [
  { href: '/products', key: 'nav.shop' },
  { href: '/about', key: 'nav.about' },
  { href: '/process', key: 'nav.process' },
  { href: '/contact', key: 'nav.contact' },
];

const socials = [
  { href: 'https://instagram.com/pcelarstvojevtic', label: 'Instagram' },
  { href: 'https://facebook.com', label: 'Facebook' },
];

export default function Footer({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#73552E] text-[#FDF9DC]">
      <div className="container pt-20 lg:pt-28">
        {/* Only what someone actually needs: where we are, how to reach us, where to go next. */}
        <div className="reveal grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto]">
          <div className="max-w-sm">
            {/* The seal off the jar label, on its own cream disc so it reads on the dark ground. */}
            <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#FDF9DC] p-3">
              <Image
                src="/images/brand/seal.svg"
                alt="Pčelarstvo Jevtić — tradicija od 1980."
                width={96}
                height={96}
                className="h-full w-full"
              />
            </span>
            <p className="mt-6 text-base leading-7 text-[#FDF9DC]/90">{t('footer.tagline')}</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-14 lg:gap-20">
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localeHref(locale, link.href)}
                    className="text-sm text-[#FDF9DC]/90 transition-colors hover:text-[#FDF9DC]"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5 text-sm">
              <p className="text-[#FDF9DC]/90">{t('contact.info.address')}</p>
              <p>
                <a
                  href="tel:+38766030550"
                  className="text-[#FDF9DC] transition-colors hover:underline hover:decoration-[#C79A3B] hover:decoration-2 hover:underline-offset-4"
                >
                  {t('contact.info.phone')}
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@pcelarstvo-jevtic.ba"
                  className="text-[#FDF9DC] transition-colors hover:underline hover:decoration-[#C79A3B] hover:decoration-2 hover:underline-offset-4"
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
                    className="text-sm text-[#FDF9DC]/90 underline-offset-4 transition-colors hover:underline hover:decoration-[#C79A3B] hover:decoration-2 hover:underline-offset-4 hover:underline"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-[#FDF9DC]/15 pt-5 text-xs text-[#FDF9DC]/90 md:flex-row md:items-center">
          <p>{t('footer.copyright', { year })}</p>
          <div className="flex items-center gap-5">
            <Link
              href={localeHref(locale, '/privacy')}
              className="transition-colors hover:text-[#FDF9DC]"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              href={localeHref(locale, '/terms')}
              className="transition-colors hover:text-[#FDF9DC]"
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
          className="-mb-[0.16em] select-none pt-[0.16em] text-center font-display font-medium leading-[0.95] tracking-[-0.045em] text-[#FDF9DC] text-[clamp(4rem,23vw,21rem)]"
        >
          JEVTIĆ
        </p>
      </div>
    </footer>
  );
}
