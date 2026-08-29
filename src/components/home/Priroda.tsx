import Image from 'next/image';
import Link from 'next/link';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

/**
 * "U dodiru sa prirodom": tri stupca u jednom redu.
 *
 * Snimak lijevo, naslov u sredini, tekst desno — sve troje pocinje na istoj
 * visini, pa red gore drzi sekciju na okupu iako su stupci razlicite duzine.
 *
 * Iza svega je uzorak cvijeca. On je ukras i ne nosi znacenje, pa ide u CSS
 * kao pozadina a ne u slog kao slika: citac ekrana nema sta da procita, a
 * preglednik ga ucitava tek kad sekcija dodje na red.
 *
 * Naslov je u slogu malim slovima a u prikazu verzalom. Tako ostaje citljiv
 * kad se prekopira i kad ga procita glas, a i dalje se vidi kao natpis.
 */
export default function Priroda({ locale }: { locale: Locale }) {
  const t = home.priroda[locale];

  return (
    <section className="priroda">
      <div className="priroda__inner">
        <figure className="priroda__shot reveal">
          <Image
            src="/images/priroda/pcela-na-dlanu.webp"
            alt={t.photoAlt}
            width={716}
            height={1073}
            sizes="(max-width: 900px) 70vw, 26vw"
          />
        </figure>

        <h2 className="priroda__heading reveal stagger-1">{t.heading}</h2>

        <div className="priroda__copy reveal stagger-2">
          {t.body.map((par) => (
            <p key={par.slice(0, 24)}>{par}</p>
          ))}

          <Link className="priroda__link" href={localeHref(locale, '/#porijeklo')}>
            {t.link}
          </Link>
        </div>
      </div>
    </section>
  );
}
