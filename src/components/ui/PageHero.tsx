import Image from 'next/image';

type Props = {
  eyebrow: string;
  heading: string;
  description: string;
  note: string;
  image: string;
  /**
   * Vise kadrova istog motiva, od najsireg do najblizeg. Kad ih ima, heroj ih
   * pretapa u petlji i uz to uvecava — jedan neprekidan zum u fotografiju.
   * `image` tada sluzi samo kao zamjena bez JS-a i bez animacije.
   */
  images?: string[];
  imageAlt: string;
  /** Background band behind the hero. */
  /** Boja iza heroja. Podrazumevano papir — isti kao cela strana. */
  background?: string;
  /** Which side the copy card sits on for large screens. */
  cardSide?: 'left' | 'right';
  imageWidth?: string;
  cardWidth?: string;
  headingClamp?: string;
};

/**
 * The recurring editorial hero: a wide photo with an overlapping copy card.
 * Used by the products, about, process, blog and contact pages.
 */
export default function PageHero({
  eyebrow,
  heading,
  description,
  note,
  image,
  images,
  imageAlt,
  background = 'var(--paper)',
  cardSide = 'left',
  imageWidth = 'lg:w-[78%]',
  cardWidth = 'lg:w-[42%]',
  headingClamp = '',
}: Props) {
  return (
    <section
      className="relative overflow-hidden header-offset pb-24 lg:pb-36"
      style={{ backgroundColor: background }}
    >
      <div className="mx-auto max-w-[1440px] px-5 pt-8 sm:px-8 lg:px-12 lg:pt-12">
        <div className="relative flex flex-col">
          <div
            className={`relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] ${imageWidth} ${
              cardSide === 'left' ? 'ml-auto' : ''
            } rounded-[2rem]`}
          >
            {(images?.length ? images : [image]).map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={i === 0 ? imageAlt : ''}
                aria-hidden={i === 0 ? undefined : true}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 78vw"
                className={images?.length ? 'page-hero__frame object-cover' : 'object-cover'}
              />
            ))}
          </div>

          <div
            className={`relative z-10 -mt-10 w-[94%] border border-[#C79A3B]/55 bg-[var(--paper)] p-7 shadow-[0_24px_70px_rgba(115,85,46,0.12)] sm:w-[76%] sm:p-10 lg:absolute lg:top-1/2 lg:mt-0 lg:-translate-y-1/2 lg:p-14 ${cardWidth} ${
              cardSide === 'left' ? 'lg:left-0' : 'ml-auto lg:right-0'
            } rounded-[1.5rem]`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#73552E]">
              {eyebrow}
            </p>
            <h1
              className={`mt-5 font-display text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-[#73552E] sm:text-6xl ${headingClamp}`}
            >
              {heading}
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#73552E]">{description}</p>
            <p className="mt-8 border-t border-[#73552E]/15 pt-4 font-display text-lg italic text-[#73552E]">
              {note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
