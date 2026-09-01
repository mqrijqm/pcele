import TransitionLink from '@/components/ui/TransitionLink';

import { createTranslator, localeHref, type Locale } from '@/i18n/config';

const navLinks = [
  { href: '/about', key: 'nav.about' },
  { href: '/pcelinjak', key: 'nav.apiaries' },
  { href: '/process', key: 'nav.process' },
  { href: '/contact', key: 'nav.contact' },
];

const socials = [
  { href: 'https://instagram.com/pcelarstvojevtic', label: 'Instagram' },
  { href: 'https://facebook.com', label: 'Facebook' },
];

/**
 * Podnozje.
 *
 * Cita se odozgo nadolje kao potpis: znak, pa ime kuce preko cijele mjere, pa
 * pecat, pa ono cime se kuca javlja — broj, adresa, mreze, strane. Na dnu
 * sitno, godina i dvije pravne veze.
 *
 * **Ploha ide iz medene u papir.** Gornja ivica je ista boja koju sekcija nad
 * njom nema, pa se podnozje odvaja bez linije; do dna se ugasi u papir, pa se
 * potpis cita na svijetlom, kao na etiketi.
 *
 * **Ime je crtez, ne slog.** `wordmark-jevtic.svg` nosi i "Jevtić" i
 * "PČELARSTVO" u jednom potezu, sa razmacima kakvi su nacrtani — slozeno iz
 * fonta to nikad ne sjedne isto. Zato u `alt`-u stoji ono sto crtez govori.
 *
 * Ulazak je jedan i tih: sve se podigne za nesto malo kad podnozje udje u
 * kadar. Znak se na prelazu misem okrene za nekoliko stepeni i vrati.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="stopa">
      <div className="stopa__inner">
        {/* --- znak, ime, pecat -------------------------------------------- */}
        <TransitionLink
          href={localeHref(locale, '/')}
          className="stopa__znak reveal"
          aria-label="Pčelarstvo Jevtić"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/mark-footer.svg" alt="" aria-hidden="true" />
        </TransitionLink>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="stopa__ime reveal stagger-1"
          src="/images/brand/wordmark-jevtic.svg"
          alt="Jevtić — Pčelarstvo"
          width={694}
          height={279}
          loading="lazy"
          decoding="async"
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="stopa__krug reveal stagger-2"
          src="/images/brand/znak-krug.svg"
          alt=""
          aria-hidden="true"
          width={178}
          height={178}
          loading="lazy"
          decoding="async"
        />

        {/* --- kako se kuca javlja ----------------------------------------- */}
        <div className="stopa__podaci reveal stagger-3">
          <p className="stopa__red">
            <a href="tel:+38766030550">{t('contact.info.phone')}</a>
          </p>
          <p className="stopa__red">
            <a href="mailto:info@pcelarstvo-jevtic.ba">{t('contact.info.email')}</a>
          </p>
          <p className="stopa__red stopa__red--tiho">{t('contact.info.address')}</p>

          <p className="stopa__red stopa__red--razmak">
            {socials.map(({ href, label }, i) => (
              <span key={label}>
                {i > 0 && <span className="stopa__crta" aria-hidden="true" />}
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              </span>
            ))}
          </p>

          <p className="stopa__red">
            {navLinks.map((link, i) => (
              <span key={link.href}>
                {i > 0 && <span className="stopa__crta" aria-hidden="true" />}
                <TransitionLink href={localeHref(locale, link.href)}>{t(link.key)}</TransitionLink>
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* --- sitno na dnu -------------------------------------------------- */}
      <div className="stopa__dno">
        <p>{t('footer.copyright', { year })}</p>
        <p className="stopa__pravno">
          <TransitionLink href={localeHref(locale, '/privacy')}>{t('footer.privacy')}</TransitionLink>
          <span className="stopa__crta" aria-hidden="true" />
          <TransitionLink href={localeHref(locale, '/terms')}>{t('footer.terms')}</TransitionLink>
        </p>
      </div>
    </footer>
  );
}
