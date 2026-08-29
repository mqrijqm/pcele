import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

/**
 * Geslo: jedan red preko cijelog pojasa.
 *
 * Pojas izmedju heroja i tegle je dosad bio prazan — samo prelaz s papira na
 * med i natrag. Sada nosi jednu recenicu, dovoljno krupnu da bude sve sto se
 * na njoj vidi, i tri crteza oko nje.
 *
 * Recenica je u dva glasa: pocetak u mastilu, kraj u bijelom kurzivu. Ta dva
 * su tu da se jedno od drugog razlikuju, pa se i pisu kao dva `span`-a a ne
 * jednim tekstom s prelomom — prelom bi na uzem ekranu pao gdje mu se prohtije.
 *
 * Crtezi su ukras i nose `aria-hidden`; jedini koji nesto znaci je pecat, pa
 * on ima opis.
 */
export default function Geslo({ locale }: { locale: Locale }) {
  const t = home.geslo[locale];

  return (
    <section className="geslo" aria-label={`${t.lead} ${t.accent}`}>
      <div className="geslo__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="geslo__seal reveal" src="/images/brand/pecat-cvijet.svg" alt={t.sealAlt} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="geslo__sun reveal stagger-1"
          src="/images/brand/sunce.svg"
          alt=""
          aria-hidden="true"
        />

        <p className="geslo__line reveal stagger-2">
          <span className="geslo__lead">{t.lead}</span>{' '}
          <span className="geslo__accent">{t.accent}</span>
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="geslo__hive reveal stagger-3"
          src="/images/brand/kosnica.svg"
          alt={t.hiveAlt}
        />
      </div>
    </section>
  );
}
