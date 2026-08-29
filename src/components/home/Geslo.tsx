import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

/**
 * Geslo: jedan red preko cijelog pojasa.
 *
 * Pojas izmedju heroja i tegle je dosad bio prazan — samo prelaz s papira na
 * med i natrag. Sada nosi jednu recenicu, dovoljno krupnu da bude sve sto se
 * na njoj vidi, i tri crteza oko nje.
 *
 * Recenica je u dva glasa: mastilo, pa sredina u bijelom kurzivu, pa opet
 * mastilo. Zato je i pisana u tri dijela a ne jednim tekstom — obiljeziti
 * sredinu jednog niza znacilo bi vezati se za odredjenu sirinu ekrana.
 *
 * Uz recenicu su jos dva crteza: pecat nad njom, na istoj osi, i sunce koje
 * je zavrsava, u njenom redu. Crtez kosnice u desnom uglu je otisao — pojas
 * je pun kad je recenica ovoliko krupna, i uz nju je smetao.
 *
 * Sunce je ukras i nosi `aria-hidden`; pecat nesto znaci, pa ima opis.
 */
export default function Geslo({ locale }: { locale: Locale }) {
  const t = home.geslo[locale];

  return (
    <section className="geslo" aria-label={`${t.lead} ${t.accent}`}>
      <div className="geslo__inner">
        {/* Pecat stoji nad recenicom, na istoj osi s njom. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="geslo__seal reveal" src="/images/brand/pecat-cvijet.svg" alt={t.sealAlt} />

        <p className="geslo__line reveal stagger-1">
          {t.lead}{' '}
          <span className="geslo__accent">{t.accent}</span> {t.tail}
          {/*
            * Sunce zavrsava recenicu, u istom redu s njom — mjera mu je u `em`
            * pa raste i pada zajedno sa slogom. Jedino se ono vrti.
            */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="geslo__sun" src="/images/brand/sunce.svg" alt="" aria-hidden="true" />
        </p>
      </div>
    </section>
  );
}
