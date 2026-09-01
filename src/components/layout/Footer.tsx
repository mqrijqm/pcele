import TransitionLink from '@/components/ui/TransitionLink';

import { createTranslator, localeHref, type Locale } from '@/i18n/config';

/** Lijeva kolona: tri odredista, jedno pod drugim. */
const stubLinks = [
  { href: '/products', key: 'footer.linkProducts' },
  { href: '/process', key: 'footer.linkProcess' },
  { href: '/pcelinjak', key: 'footer.linkApiary' },
];

/*
 * Facebook stranica jos ne postoji, pa i on vodi na Instagram — bolje nego
 * veza koja nigdje ne stize. Kad stranica bude, mijenja se samo ova adresa.
 */
const INSTAGRAM = 'https://www.instagram.com/pcelarstvojevtic';

const socials = [
  { href: INSTAGRAM, label: 'Instagram' },
  { href: INSTAGRAM, label: 'Facebook' },
];

/** Pcelinjak na karti — tacka iznad Mracaja, ne sredina opstine. */
const MAPA =
  "https://www.google.com/maps/place/44%C2%B053'57.1%22N+17%C2%B032'03.8%22E/@44.8639906,17.5661831,11.71z/data=!4m4!3m3!8m2!3d44.8992!4d17.5344";

/**
 * Podnozje.
 *
 * Tri polja u jednom redu, po uzoru koji je stigao uz zadatak: odredista
 * lijevo, znak i ime kuce u sredini, mreze desno. Pod odredistima, u istoj
 * lijevoj koloni, stoje podaci firme — adresa, registarski broj, radno vrijeme
 * i kako se javiti.
 *
 * **Papir, ne bijelo.** Uz zadatak je stigao i opis koji trazi bijelu plohu i
 * narandzastu liniju na vrhu; na samom uzoru ni jednog ni drugog nema, a
 * narandzaste nema ni u paleti sajta. Slijedim uzor: ploha je papir kao i
 * ostatak strane, bez linije, pa se podnozje ne odvaja od strane nego je
 * zavrsava.
 *
 * **Ime je crtez, ne slog.** `wordmark-jevtic.svg` nosi i "Jevtić" i
 * "PČELARSTVO" u jednom potezu, sa razmacima kakvi su nacrtani.
 *
 * Ulazak je jedan i tih; znak se pod misem okrene za nekoliko stepeni.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const t = createTranslator(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="stopa">
      <div className="stopa__inner">
        {/* --- lijevo: odredista, pa podaci firme --------------------------- */}
        <div className="stopa__stub stopa__stub--lijevo reveal">
          <nav className="stopa__veze" aria-label={t('footer.navLabel')}>
            {stubLinks.map((link) => (
              <TransitionLink key={link.href} href={localeHref(locale, link.href)}>
                {t(link.key)}
              </TransitionLink>
            ))}
          </nav>

          <div className="stopa__podaci">
            <p>
              <a href={MAPA} target="_blank" rel="noopener noreferrer">
                {t('contact.info.address')}
              </a>
              <br />
              {t('footer.registry')}
            </p>
            <p>{t('footer.hours')}</p>
            <p>
              <span className="stopa__oznaka">T:</span>{' '}
              <a href="tel:+38766030550">066 030 550</a>
              <br />
              <a href="mailto:pcelarstvojevtic@gmail.com">pcelarstvojevtic@gmail.com</a>
            </p>
          </div>
        </div>

        {/* --- sredina: znak, ime, pecat ------------------------------------ */}
        <div className="stopa__sredina reveal stagger-1">
          <TransitionLink
            href={localeHref(locale, '/')}
            className="stopa__znak"
            aria-label="Pčelarstvo Jevtić"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/mark-footer.svg" alt="" aria-hidden="true" />
          </TransitionLink>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="stopa__ime"
            src="/images/brand/wordmark-jevtic.svg"
            alt="Jevtić — Pčelarstvo"
            width={694}
            height={279}
            loading="lazy"
            decoding="async"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="stopa__krug"
            src="/images/brand/znak-krug.svg"
            alt=""
            aria-hidden="true"
            width={178}
            height={178}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* --- desno: mreze -------------------------------------------------- */}
        <div className="stopa__stub stopa__stub--desno reveal stagger-2">
          <nav className="stopa__veze" aria-label={t('footer.socialLabel')}>
            {socials.map(({ href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* --- sitno na dnu --------------------------------------------------- */}
      <div className="stopa__dno">
        <p>{t('footer.copyright', { year })}</p>
        <p className="stopa__pravno">
          <TransitionLink href={localeHref(locale, '/privacy')}>
            {t('footer.privacy')}
          </TransitionLink>
          <span className="stopa__crta" aria-hidden="true" />
          <TransitionLink href={localeHref(locale, '/terms')}>{t('footer.terms')}</TransitionLink>
        </p>
      </div>
    </footer>
  );
}
