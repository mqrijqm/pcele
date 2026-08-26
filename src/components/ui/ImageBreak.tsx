import Image from 'next/image';

/*
 * `focus` je tezisna tacka reza za tu jednu sliku (`object-[75%_50%]`). Stoji
 * po snimku, a ne po komponenti, jer u paru dva kadra rijetko imaju motiv na
 * istom mjestu — panorama sa bocom uz desnu ivicu se u uspravnom rezu gubi
 * ako se sijece po sredini.
 */
type Shot = { src: string; alt: string; focus?: string };

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
  /**
   * `dark` okrece traku: smedja podloga, papirni tekst. Sluzi za predah izmedju
   * dvije svijetle sekcije — na cijeloj strani je papir, pa jedna tamna traka
   * radi rez koji se osjeti bez ijedne nove boje u paleti.
   */
  tone?: 'paper' | 'dark';
  /** `framed`: da li slika stoji levo ili desno. */
  side?: 'left' | 'right';
  /** Prva slika iznad preloma se ucitava ranije. */
  priority?: boolean;
  /** Odnos stranica slike — uspravnim snimcima treba drugaciji rez. */
  aspect?: string;
  /**
   * Bijeli znak u uglu fotografije. Bijel je iskljucivo zbog kontrasta — na
   * snimcima pcelinjaka nema mirne povrsine na kojoj bi smedji znak citao.
   */
  emblem?: boolean;
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
  background,
  tone = 'paper',
  side = 'left',
  priority = false,
  aspect,
  focus,
  frame = 'wide',
  emblem = false,
}: Props) {
  const hasFooter = Boolean(caption || meta);

  /*
   * Boje su ispisane, a ne sklopljene iz komada: Tailwind cita izvor kao tekst,
   * pa klasu koju nije vidio doslovno nikad i ne napravi.
   */
  const dark = tone === 'dark';
  const plate = background ?? (dark ? 'var(--brown)' : 'var(--paper)');
  const ink = dark ? 'text-[#FCF0DC]' : 'text-[#885B27]';
  const inkSoft = dark ? 'text-[#FCF0DC]/70' : 'text-[#885B27]/70';
  const rule = dark ? 'border-[#FCF0DC]/20' : 'border-[#885B27]/15';

  const mark = emblem ? (
    <span className="image-break__emblem" aria-hidden="true">
      <Image src="/images/brand/znak-krug-bijeli.svg" alt="" width={120} height={120} />
    </span>
  ) : null;

  /*
   * Natpis se poravnava sa ivicom slike iznad sebe, a slika i tekst nemaju
   * istu meru — zato omotac dolazi spolja.
   */
  const footerIn = (wrap: string) =>
    hasFooter ? (
      <div className={`${wrap} flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2`}>
        {caption && (
          <p className={`max-w-md text-[11px] font-bold uppercase tracking-[0.2em] ${ink}`}>
            {caption}
          </p>
        )}
        {meta && (
          <p className={`text-[11px] uppercase tracking-[0.2em] ${inkSoft}`}>{meta}</p>
        )}
      </div>
    ) : null;

  if (variant === 'pair') {
    const [first, second] = images;
    return (
      <section className="section-padding-sm" style={{ backgroundColor: plate }}>
        {/*
          * Par podrazumijevano ide preko cijele sirine, van mjere teksta:
          * dvije uspravne fotografije jedna uz drugu trebaju prostor. Sa
          * `frame="narrow"` staje u mjeru teksta, kad snimci ne trpe da budu
          * ovoliki.
          */}
        <div className={frame === 'narrow' ? 'container' : 'px-3 sm:px-5'}>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
            <div className="reveal relative aspect-[4/5] overflow-hidden rounded-[0.6rem]">
              <Image
                src={first.src}
                alt={first.alt}
                fill
                sizes="49vw"
                className={`object-cover ${first.focus ?? ''}`}
              />
              {mark}
            </div>
            {second && (
              /*
               * Pomak nosi spoljni div: `reveal` na kraju animacije postavlja
               * `transform: none`, pa bi na istom elementu pojeo translate.
               */
              <div className="translate-y-8 sm:translate-y-16 lg:translate-y-24">
                <div className="reveal stagger-2 relative aspect-[4/5] overflow-hidden rounded-[0.6rem]">
                  <Image
                    src={second.src}
                    alt={second.alt}
                    fill
                    sizes="49vw"
                    className={`object-cover ${second.focus ?? ''}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {footerIn(
          `${frame === 'narrow' ? 'container' : 'px-3 sm:px-5'} mt-14 sm:mt-[5.5rem] lg:mt-[7.5rem]`,
        )}
      </section>
    );
  }

  if (variant === 'framed') {
    const [only] = images;
    return (
      <section className="section-padding-sm" style={{ backgroundColor: plate }}>
        <div className="container">
          <div
            className={`grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 ${
              side === 'right' ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div
              className={`reveal relative overflow-hidden rounded-[0.6rem] sm:rounded-[0.6rem] ${
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
              {mark}
            </div>

            <div className="reveal stagger-2 max-w-[30rem]">
              {caption && (
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${ink}`}>
                  {caption}
                </p>
              )}
              {heading && (
                <p className={`mt-5 font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-4xl ${ink}`}>
                  {heading}
                </p>
              )}
              {body && <p className={`mt-6 text-base leading-8 ${ink}`}>{body}</p>}
              {meta && (
                <p className={`mt-8 border-t pt-4 text-[11px] uppercase tracking-[0.2em] ${rule} ${inkSoft}`}>
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
    <section className="section-padding-sm" style={{ backgroundColor: plate }}>
      {/* Traka vise ne ide od ivice do ivice — uvucena je kao i ostatak sajta. */}
      <div className={frame === 'narrow' ? 'container-narrow' : 'container-wide'}>
        <div
          className={`reveal-scale relative w-full overflow-hidden rounded-[0.6rem] sm:rounded-[0.6rem] ${
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
          {mark}
        </div>
      </div>
      {footerIn(frame === 'narrow' ? 'container-narrow mt-6' : 'container-wide mt-6')}
    </section>
  );
}
