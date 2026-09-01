import Image from 'next/image';

/**
 * Mjesto slike.
 *
 * Kutija koja drzi tacan omjer, i u njoj ili fotografija ili siva ploha sa
 * upisanim omjerom dok fotografije nema. Visinu odredjuje `aspect-ratio`, ne
 * sadrzaj — zato se raspored ne pomjeri ni za piksel kad slika stigne ili ode.
 *
 * `alt` stoji i kad slike nema: dotle govori sta na to mjesto ide.
 */
export default function ImagePlaceholder({
  ratio,
  label,
  alt,
  src,
  sizes = '(max-width: 767px) 90vw, 40vw',
  priority = false,
  className = '',
  zoom = false,
}: {
  /** Omjer kutije, sirina/visina. */
  ratio: number;
  /** Natpis u sredini dok slike nema, npr. "3:2". */
  label: string;
  /** Sta se na slici vidi. */
  alt: string;
  /** Fotografija; bez nje mjesto ostaje sivo. */
  src?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Ploha koja pri ulasku sjedne iz uvecanja, kao slike na uzoru. */
  zoom?: boolean;
}) {
  return (
    <div
      className={`pcl-ph${src ? ' pcl-ph--slika' : ''}${zoom ? ' pcl-ph--zoom' : ''}${
        className ? ` ${className}` : ''
      }`}
      style={{ ['--ratio' as string]: String(ratio) }}
      {...(src ? {} : { role: 'img', 'aria-label': alt })}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="pcl-ph__img" />
      ) : (
        <span className="pcl-ph__label" aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
}
