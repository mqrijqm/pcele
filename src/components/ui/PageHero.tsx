import Image from 'next/image';

type Props = {
  eyebrow: string;
  heading: string;
  description: string;
  note: string;
  image: string;
  imageAlt: string;
  /** Background band behind the hero. */
  background: string;
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
  imageAlt,
  background,
  cardSide = 'left',
  imageWidth = 'lg:w-[78%]',
  cardWidth = 'lg:w-[42%]',
  headingClamp = '',
}: Props) {
  return (
    <section
      className="relative overflow-hidden pb-20 pt-24 lg:pb-28"
      style={{ backgroundColor: background }}
    >
      <div className="mx-auto max-w-[1440px] px-5 pt-8 sm:px-8 lg:px-12 lg:pt-12">
        <div className="relative flex flex-col">
          <div
            className={`relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] ${imageWidth} ${
              cardSide === 'left' ? 'ml-auto' : ''
            } rounded-[2rem]`}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 78vw"
              className="object-cover"
            />
          </div>

          <div
            className={`relative z-10 -mt-10 w-[94%] border border-[#C89B3C]/55 bg-[#FFF7E6] p-7 shadow-[0_24px_70px_rgba(138,90,43,0.12)] sm:w-[76%] sm:p-10 lg:absolute lg:top-1/2 lg:mt-0 lg:-translate-y-1/2 lg:p-14 ${cardWidth} ${
              cardSide === 'left' ? 'lg:left-0' : 'ml-auto lg:right-0'
            } rounded-[1.5rem]`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5A2B]">
              {eyebrow}
            </p>
            <h1
              className={`mt-5 font-display text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-[#8A5A2B] sm:text-6xl ${headingClamp}`}
            >
              {heading}
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#8A5A2B]">{description}</p>
            <p className="mt-8 border-t border-[#8A5A2B]/15 pt-4 font-display text-lg italic text-[#8A5A2B]">
              {note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
