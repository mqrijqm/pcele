import Image from 'next/image';

import TransitionLink from '@/components/ui/TransitionLink';
import styles from './productCard.module.css';

/**
 * Kartica proizvoda — jedna za sve: katalog na strani proizvoda i "Možda će
 * vam se dopasti" ispod svakog proizvoda, pa izgledaju isto.
 *
 * Tanak obris, zaobljena ploha u tonu papira sa proizvodom, naziv u sredini,
 * tanka linija, pa mjera lijevo i cijena desno. Ništa više: kartica ne
 * objašnjava proizvod, samo ga pokaže i vodi na njegovu stranu.
 */
export default function ProductCard({
  href,
  image,
  imageAlt,
  name,
  unit,
  price,
  zoom = 1,
  heading: Heading = 'h3',
  sizes = '(max-width: 1024px) 50vw, 25vw',
  className,
}: {
  href: string;
  image: string;
  imageAlt: string;
  name: string;
  /** Mjera, npr. "1 kg". */
  unit?: string;
  /** Već formatirana cijena; izostavlja se za artikle bez svoje strane. */
  price?: string;
  /** Povecanje proizvoda na plohi (1 = bez promjene); vidi `Product.cardZoom`. */
  zoom?: number;
  heading?: 'h3' | 'h4';
  sizes?: string;
  /** Dodatna klasa na kartici (npr. da se sakrije na uskom ekranu). */
  className?: string;
}) {
  return (
    <TransitionLink
      href={href}
      className={className ? `${styles.card} ${className}` : styles.card}
      style={zoom !== 1 ? ({ '--zoom': zoom } as React.CSSProperties) : undefined}
    >
      <div className={styles.media}>
        <Image src={image} alt={imageAlt} fill sizes={sizes} className={styles.image} />
      </div>

      <Heading className={styles.name}>{name}</Heading>

      {(unit || price) && (
        <>
          <div className={styles.rule} aria-hidden="true" />
          <div className={styles.meta}>
            <span>{unit}</span>
            {price ? <span className={styles.price}>{price}</span> : null}
          </div>
        </>
      )}
    </TransitionLink>
  );
}
