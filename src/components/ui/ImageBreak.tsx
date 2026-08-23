import Image from 'next/image';

type Shot = { src: string; alt: string };

type Props = {
  /**
   * `band`   — jedna slika preko cele sirine, kao predah izmedju sekcija
   * `pair`   — dve uspravne slike, druga spustena nize (editorijalni ritam)
   * `framed` — slika u okviru, sa kratkim tekstom pored nje
   */
  variant?: 'band' | 'pair' | 'framed';
  images: Shot[];
  /** Sitan natpis levo ispod slike. */
  caption?: string;
  /** Sitan natpis desno — mesto, serija, godina. */
  meta?: string;
  /** Samo za `framed`: recenica koja stoji pored slike. */
  heading?: string;
  body?: string;
  /** Boja trake iza slike. Podrazumevano papir — isti kao cela strana. */
  background?: string;
  /** `framed`: da li slika stoji levo ili desno. */
  side?: 'left' | 'right';
  /** Prva slika iznad preloma se ucitava ranije. */
  priority?: boolean;
  /** Odnos stranica slike — uspravnim snimcima treba drugaciji rez. */
  aspect?: string;
  /**
   * `band`: koliko traka sme da bude siroka. `wide` ide skoro preko cele
   * strane, `narrow` je za uspravne snimke — njih siroki rez unakazi.
   */
  frame?: 'wide' | 'narrow';
  /**
   * Tezisna tacka reza (`object-[50%_35%]`). Kad se sirok kadar sece na
   * panoramu, podrazumevani centar zna da odsece poklopac tegle.
   */
  focus?: string;
};

/**
 * Foto-pauza izmedju dve sadrzajne sekcije. Nema dugmad i nema linkove —
 * posao joj je da spusti tempo citanja i pokaze proizvod u prostoru.
 */
export default function ImageBreak({
  variant = 'band',
  images,
  caption,
  meta,
  heading,
  body,
  background = 'var(--paper)',
  side = 'left',
  priority = false,
  aspect,
  focus,
  frame = 'wide',
}: Props) {
  const hasFooter = Boolean(caption || meta);

  /*
   * Natpis se poravnava sa ivicom slike iznad sebe, a slika i tekst nemaju
   * istu meru — zato omotac dolazi spolja.
   */
  const footerIn = (wrap: string) =>
    hasFooter ? (
      <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2`}>
        {caption && (
          <p className="max-w-md text-[11px] font-bold uppercase tracking-[0.2em] text-[#73552E]">
            {caption}
          </p>
        )}
        {meta && <p className="font-display text-base italic text-[#73552E]/70">{meta}</p>}
      </div>
    ) : null;

  if (variant === 'pair') {
    const [first, second] = images;
    return (
      <section className="section-padding-sm" style={{ backgroundColor: background }}>
        <div className="container">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:gap-12">
            <div className="reveal relative aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem]">
              <Image
                src={first.src}
                alt={first.alt}
                fill
                sizes="(max-width: 640px) 46vw, 44vw"
                className="object-cover"
              />
            </div>
            {second && (
              /*
               * Pomak nosi spoljni div: `reveal` na kraju animacije postavlja
               * `transform: none`, pa bi na istom elementu pojeo translate.
               */
              <div className="translate-y-8 sm:translate-y-16 lg:translate-y-24">
                <div className="reveal stagger-2 relative aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem]">
                  <Image
                    src={second.src}
                    alt={second.alt}
                    fill
                    sizes="(max-width: 640px) 46vw, 44vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {footerIn('container mt-14 sm:mt-[5.5rem] lg:mt-[7.5rem]')}
      </section>
    );
  }

  if (variant === 'framed') {
    const [only] = images;
    return (
      <section className="section-padding-sm" style={{ backgroundColor: background }}>
        <div className="container">
          <div
            className={`grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 ${
              side === 'right' ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div
              className={`reveal relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] ${
                aspect ?? 'aspect-[4/3]'
              }`}
            >
              <Image
                src={only.src}
                alt={only.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className={`object-cover ${focus ?? ''}`}
              />
            </div>

            <div className="reveal stagger-2 max-w-[30rem]">
              {caption && (
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#73552E]">
                  {caption}
                </p>
              )}
              {heading && (
                <p className="mt-5 font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-[#73552E] sm:text-4xl">
                  {heading}
                </p>
              )}
              {body && <p className="mt-6 text-base leading-8 text-[#73552E]">{body}</p>}
              {meta && (
                <p className="mt-8 border-t border-[#73552E]/15 pt-4 font-display text-lg italic text-[#73552E]/75">
                  {meta}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const [wide] = images;
  return (
    <section className="section-padding-sm" style={{ backgroundColor: background }}>
      {/* Traka vise ne ide od ivice do ivice — uvucena je kao i ostatak sajta. */}
      <div className={frame === 'narrow' ? 'container-narrow' : 'container-wide'}>
        <div
          className={`reveal-scale relative w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] ${
            aspect ?? 'aspect-[3/4] sm:aspect-[16/9] lg:aspect-[21/9]'
          }`}
        >
          <Image
            src={wide.src}
            alt={wide.alt}
            fill
            priority={priority}
            sizes="(max-width: 1600px) 100vw, 1600px"
            className={`object-cover ${focus ?? ''}`}
          />
        </div>
      </div>
      {footerIn(frame === 'narrow' ? 'container-narrow mt-6' : 'container-wide mt-6')}
    </section>
  );
}
