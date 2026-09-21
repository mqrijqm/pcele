import ImageSlot from '@/components/products/ImageSlot';
import SplitTitle from '@/components/products/SplitTitle';

/**
 * "Zasto nas bagrem" — krupna naslov preko cijele sirine, pa ispod njega
 * snimak i stubac teksta odvojen tankom crtom.
 *
 * Crta nije ukras: ona drzi lijevu ivicu teksta i na sirokom ekranu spaja
 * naslov sa onim sto ga objasnjava. Zato je `border-left` na stubcu, a ne
 * okvir oko svega.
 *
 * Na telefonu se redoslijed obrce — tekst ide prije snimka (vidi products.css).
 */
export default function WhyBlock({
  title,
  slot,
  slotLabel,
  intro,
  list,
  outro,
}: {
  title: string;
  slot: string;
  slotLabel: string;
  intro: string;
  list: string[];
  outro: string;
}) {
  return (
    <section data-snap="off" className="pe-why">
      <div className="pe-wrap--small pe-why__inner">
        <SplitTitle text={title} className="pe-display pe-why__title" />

        <div className="pe-why__content">
          <div className="pe-why__image reveal reveal-scale">
            <ImageSlot slot={slot} label={slotLabel} />
          </div>

          <div className="pe-why__text">
            <div>
              <p className="pe-title reveal">{intro}</p>

              <ul className="pe-why__list pe-body reveal stagger-1">
                {list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="pe-body pe-why__outro reveal">{outro}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
