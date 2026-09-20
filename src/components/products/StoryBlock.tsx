import Image from 'next/image';

import ImageSlot from '@/components/products/ImageSlot';

/**
 * Miran blok: sitan natpis, krupna recenica, i â€” kad ih ima â€” podaci u redu
 * ispod. Crtez u donjem lijevom uglu je nas, iz brenda, i sluzi samo da
 * prekine prazninu; zato je `aria-hidden`.
 *
 * Isti blok nosi i bagremov med i napomenu o cuvanju: oba su kratki, oba se
 * citaju u jednom dahu, i oba traze istu tisinu oko sebe.
 */
export default function StoryBlock({
  label,
  lede,
  body,
  facts,
  art,
  artAlt,
  photo,
  photoLabel,
}: {
  label: string;
  lede: string;
  body?: string;
  facts?: { label: string; value: string }[];
  art?: { src: string; width: number; height: number };
  artAlt?: string;
  photo?: string;
  photoLabel?: string;
}) {
  return (
    <section data-snap="off" className="pe-story">
      <div className="pe-wrap">
        <div className="pe-story__inner">
          <h2 className="pe-label pe-story__label reveal">{label}</h2>

          <p className="pe-title pe-story__lede reveal stagger-1">{lede}</p>

          {body ? <p className="pe-body pe-story__body reveal stagger-2">{body}</p> : null}

          {photo ? (
            <div className="pe-story__photo reveal stagger-2">
              <ImageSlot slot={photo} label={photoLabel ?? label} />
            </div>
          ) : null}

          {facts?.length ? (
            <dl className={`pe-facts reveal stagger-2${art ? ' pe-facts--roomy' : ''}`}>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {art ? (
            <span className="pe-story__art" aria-hidden="true">
              <Image src={art.src} alt={artAlt ?? ''} width={art.width} height={art.height} />
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
