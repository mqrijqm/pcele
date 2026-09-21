import Image from 'next/image';

/**
 * Zvjezdica koja stoji pored aktivne stavke u meniju.
 *
 * Cijeli crtez je ovdje, na jednom mjestu — kad stigne finalni SVG, mijenja
 * se samo `src` ispod (ili se `Image` zamijeni inline `<svg>`) i sav efekat
 * (pojava, animacija, mjerenje) ostaje kakav jeste.
 */
export default function MenuSun({ className }: { className?: string }) {
  return (
    <Image
      src="/images/brand/sunce.svg"
      alt=""
      aria-hidden="true"
      width={200}
      height={219}
      className={className}
    />
  );
}
