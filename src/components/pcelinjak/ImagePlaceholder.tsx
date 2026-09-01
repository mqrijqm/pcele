/**
 * Mjesto slike.
 *
 * Dok fotografije ne stignu, svaka slika na strani je siva ploha koja drzi
 * tacan omjer i tacnu kutiju, s natpisom omjera u sredini. Kad fotografija
 * dodje, mijenja se sadrzaj ove komponente — raspored oko nje se ne pomjera
 * ni za piksel, jer visinu odredjuje `aspect-ratio`, ne slika.
 *
 * `alt` nije ukras: stoji ovdje da se poslije prepise na pravu sliku, i da se
 * do tada zna sta na to mjesto ide.
 */
export default function ImagePlaceholder({
  ratio,
  label,
  alt,
  className = '',
  zoom = false,
}: {
  /** Omjer kutije, sirina/visina. */
  ratio: number;
  /** Natpis u sredini, npr. "3:2". */
  label: string;
  /** Sta na ovo mjesto ide kad stigne fotografija. */
  alt: string;
  className?: string;
  /** Ploha koja pri ulasku sjedne iz uvecanja, kao slike na uzoru. */
  zoom?: boolean;
}) {
  return (
    <div
      className={`pcl-ph${zoom ? ' pcl-ph--zoom' : ''}${className ? ` ${className}` : ''}`}
      style={{ ['--ratio' as string]: String(ratio) }}
      role="img"
      aria-label={alt}
      data-alt={alt}
    >
      <span className="pcl-ph__label" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}
