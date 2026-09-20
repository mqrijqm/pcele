import Image from 'next/image';
import styles from './productTriptych.module.css';

const images = [
  {
    src: '/images/izdvojeno/bagremov-pasa.webp',
    alt: 'Bagremov med u prirodi',
    slot: 'landing-bagrem',
  },
  {
    src: '/images/izdvojeno/livadski-red.webp',
    alt: 'Livadski med iz pčelinjaka',
    slot: 'landing-livadski',
  },
  {
    src: '/images/izdvojeno/propolis-ruka.webp',
    alt: 'Pčelinji propolis u ruci',
    slot: 'landing-propolis',
  },
] as const;

export default function ProductTriptych() {
  return (
    <section className={styles.section} aria-label="Proizvodi iz našeg pčelinjaka">
      <div className={styles.grid}>
        {images.map((image) => (
          <figure className={styles.image} data-image-slot={image.slot} key={image.src}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 33vw, 31vw"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
