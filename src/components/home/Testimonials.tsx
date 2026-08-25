import InkRule from '@/components/ui/InkRule';
import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

/**
 * Utisci — tri citata na papiru, bez ijednog okvira.
 *
 * Ranije je ovdje stajala smedja kartica preko dvije kolone, sa fotografijom
 * sa stocka u sebi (i to sa vodenim zigom), zlatnim navodnikom velicine tri
 * reda i pet zlatnih zvjezdica pored naslova. To je bio raspored sa SaaS
 * landing strane, ne preporuka komsije.
 *
 * Sada: citat, rucna linija, ime i mjesto. Tri, u miru, jedan pored drugog na
 * sirokom ekranu i jedan ispod drugog na uskom — isti razdjelnik i ista mreza
 * kao kod sorti, da strana ima jedan jezik a ne dva.
 */
export default function Testimonials({ locale }: { locale: Locale }) {
  const copy = home.testimonials[locale];

  return (
    <section className="utisci" aria-labelledby="utisci-naslov">
      <div className="utisci__inner">
        <p className="utisci__eyebrow reveal">{copy.eyebrow}</p>
        <h2 id="utisci-naslov" className="utisci__heading reveal stagger-1">
          {copy.heading}
        </h2>

        <InkRule className="reveal stagger-2" />

        <div className="utisci__lista">
          {copy.quotes.slice(0, 3).map((quote, i) => (
            <div key={quote.author} className="utisci__polje">
              {i > 0 && <InkRule className="utisci__razdjelnik" />}

              <figure className={`utisak reveal stagger-${i + 1}`}>
                <blockquote className="utisak__tekst">{quote.text}</blockquote>
                <figcaption className="utisak__potpis">
                  <span className="utisak__ime">{quote.author}</span>
                  <span className="utisak__mjesto">{quote.city}</span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
