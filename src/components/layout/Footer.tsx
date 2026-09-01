import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';

import { createTranslator, localeHref, type Locale } from '@/i18n/config';

const navLinks = [
  { href: '/products', key: 'nav.shop' },
  { href: '/about', key: 'nav.about' },
  { href: '/pcelinjak', key: 'nav.apiaries' },
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
    <footer className="bg-[#C39C4A] text-[#FCF0DC]">
      <div className="container pt-28 lg:pt-40">
        {/* Only what someone actually needs: where we are, how to reach us, where to go next. */}
        <div className="reveal grid gap-14 sm:grid-cols-2 lg:grid-cols-[1fr_auto]">
          <div className="max-w-sm">
            {/* The seal off the jar label, on its own cream disc so it reads on the dark ground. */}
            <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[var(--paper)] p-3">
              <Image
                src="/images/brand/seal.svg"
                alt="Pčelarstvo Jevtić — tradicija od 1980."
                width={96}
                height={96}
                className="h-full w-full"
              />
            </span>
            <p className="mt-6 text-base leading-7 text-[#FCF0DC]/90">{t('footer.tagline')}</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-14 lg:gap-20">
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={localeHref(locale, link.href)}
                    className="text-sm text-[#FCF0DC]/90 transition-colors hover:text-[#FCF0DC]"
                  >
                    {t(link.key)}
                  </TransitionLink>
                </li>
              ))}
            </ul>

            <div className="space-y-2.5 text-sm">
              <p className="text-[#FCF0DC]/90">{t('contact.info.address')}</p>
              <p>
                <a
                  href="tel:+38766030550"
                  className="text-[#FCF0DC] transition-colors hover:underline hover:decoration-[#EEC660] hover:decoration-2 hover:underline-offset-4"
                >
                  {t('contact.info.phone')}
                </a>
              </p>
              <p>
                <a
                  href="mailto:info@pcelarstvo-jevtic.ba"
                  className="text-[#FCF0DC] transition-colors hover:underline hover:decoration-[#EEC660] hover:decoration-2 hover:underline-offset-4"
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
                    className="text-sm text-[#FCF0DC]/90 underline-offset-4 transition-colors hover:underline hover:decoration-[#EEC660] hover:decoration-2 hover:underline-offset-4 hover:underline"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-[#FCF0DC]/15 pt-5 text-xs text-[#FCF0DC]/90 md:flex-row md:items-center">
          <p>{t('footer.copyright', { year })}</p>
          <div className="flex items-center gap-5">
            <TransitionLink
              href={localeHref(locale, '/privacy')}
              className="transition-colors hover:text-[#FCF0DC]"
            >
              {t('footer.privacy')}
            </TransitionLink>
            <TransitionLink
              href={localeHref(locale, '/terms')}
              className="transition-colors hover:text-[#FCF0DC]"
            >
              {t('footer.terms')}
            </TransitionLink>
          </div>
        </div>
      </div>

      {/*
       * Potpis na dnu strane, preko cele sirine.
       *
       * Slozen je iz Gazpacha, a ne iz FOOT.svg: u tom fajlu su donji delovi
       * slova odsečeni pri izvozu (cetiri putanje se zavrsavaju ravnim rezom
       * na donjoj ivici), pa se "Jevtić" nikako ne bi video ceo. Font daje
       * isto pismo, celo slovo i bilo koju velicinu.
       *
       * `pb` cuva kvacicu na Ć i rep slova J od donje ivice stranice.
       */}
      <div className="mt-16 w-full px-4 pb-6 sm:px-6 lg:px-8">
        <p className="text-center text-[clamp(0.58rem,1.15vw,1rem)] font-semibold uppercase tracking-[0.4em] text-[#FCF0DC]">
          Pčelarstvo
        </p>
        <p className="-mt-[0.22em] select-none text-center font-display text-[clamp(4rem,33.5vw,30rem)] font-normal leading-[1.22] tracking-[-0.02em] text-[#FCF0DC]">
          Jevtić
        </p>
      </div>
    </footer>
  );
}
