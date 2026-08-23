import Image from 'next/image';

import type { Locale } from '@/i18n/config';

/**
 * The opening screen: the drawn meadow, with the wordmark and the script line
 * set live on top of it rather than baked into the picture.
 *
 * The supplied artwork had both burned into the pixels. They were painted out
 * (the drawing behind them was empty, so nothing was lost) and are laid back
 * over the plate as real text and as rati.svg — crisp at any size, selectable,
 * and translatable.
 *
 * Every overlay position is a percentage of the plate, and the plate is a
 * container, so the whole lockup scales as one piece at any width.
 *
 * Measured off the original composite (1447 × 969):
 *   script      ink x 413–867  y 169–246
 *   PČELARSTVO  ink x 337–549  y 322–348
 *   Jevtić      ink x 299–629  y 361–448
 *   the bee stays part of the plate, at x 325–374  y 282–321
 */
export default function HeroLand({ locale }: { locale: Locale }) {
  const alt =
    locale === 'sr'
      ? 'Crtež livada i brda oko Mračaja'
      : 'A drawing of the meadows and hills around Mračaj';

  return (
    <section className="hero-land">
      <div className="hero-land__plate">
        <Image
          className="hero-land__drawing"
          src="/hero/livada.webp"
          alt={alt}
          width={1447}
          height={969}
          priority
          sizes="100vw"
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="hero-land__script" src="/hero/rati.svg" alt="Listaj i prati pčelu" />

        <h1 className="hero-land__wordmark">
          <span className="hero-land__caps">Pčelarstvo</span>
          <span className="hero-land__name">Jevtić</span>
        </h1>
      </div>
    </section>
  );
}
