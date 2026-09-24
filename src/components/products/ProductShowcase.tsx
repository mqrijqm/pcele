import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import TransitionLink from '@/components/ui/TransitionLink';
import { localeHref, type Locale } from '@/i18n/config';
import type { productsEditorial } from '@/content/productsEditorial';

type ShopCopy = (typeof productsEditorial)['sr']['shop'];

/*
 * Slike za osam artikala, u tacnom redoslijedu iz zadatka. Sest teglica su
 * studijski snimci na crnoj podlozi — crna je tu dio kadra, pa kartica nosi
 * sliku preko cijele povrsine, bez okvira unutar kartice. Perga i med u sacu
 * cekaju svoje snimke i stoji im najblizi postojeci kadar (vidi TODO u
 * `productsEditorial`).
 */
const productImages: Record<number, string> = {
  0: '/images/proizvodi/livadski-1kg-new.webp',
  1: '/images/proizvodi/livadski-500g-new.webp',
  2: '/images/proizvodi/bagremov-1kg-new.webp',
  3: '/images/proizvodi/bagremov-500g-new.webp',
  4: '/images/proizvodi/propolis-20ml-new.webp',
  5: '/images/proizvodi/imuno-mix-450g-new.webp',
  6: '/images/proizvodi/perga-10g-new.webp',
  7: '/images/proizvodi/med-u-sacu-new.webp',
};

const lifestyle = {
  hero: '/images/products-editorial/jars-railing.webp',
  editorial: '/images/products-editorial/honeys-apiary.webp',
  final: '/images/products-editorial/honey-table.webp',
} as const;

/**
 * Ovao dugme iz referenca — tanki elipticni okvir, sitno verzalno pismo.
 */
function OvalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <TransitionLink href={href} className="btn btn--ghost pe-shop__button">
      {children}
    </TransitionLink>
  );
}

/**
 * E-commerce showcase na stranici proizvoda, po uzoru na editorial katalog:
 * modulni grid sa tankim linijama, krupni verzalni naslovi bez serifa i
 * product kartice cije fotografije nose cijeli kvadrat. Sve linije i tekst
 * su topli braon — crna se ne koristi kao boja teksta nigdje u bloku.
 */
export default function ProductShowcase({ locale, copy }: { locale: Locale; copy: ShopCopy }) {
  return (
    <section className="pe-shop border-y border-[#885B27]/20 bg-[#FDFBF7] text-[#885B27]">
      {/* --- 01 · uvod: tekst lijevo, velika lifestyle fotografija desno --- */}
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-between border-b border-[#885B27]/20 px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-20">
          <p className="max-w-md text-sm leading-6 text-[#885B27]/85">{copy.intro}</p>

          <div className="mt-10 lg:mt-16">
            <OvalLink href="#proizvodi">{copy.oval}</OvalLink>
          </div>

          <h2 className="mt-14 whitespace-pre-line font-sans text-[2.1rem] font-semibold uppercase leading-[1.1] tracking-[0.06em] sm:text-5xl lg:mt-24 lg:text-[3.2rem]">
            {copy.headline}
          </h2>
        </div>

        <div className="relative min-h-[340px] lg:min-h-[600px]">
          <Image
            src={lifestyle.hero}
            alt={copy.alt.hero}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* --- 02 · traka sa kratkim natpisima --------------------------- */}
      <div className="overflow-hidden border-b border-[#885B27]/20 py-4" aria-hidden="true">
        <div className="animate-[kontakt-marquee_46s_linear_infinite] flex w-max items-center">
          {[0, 1].map((grupa) => (
            <span key={grupa} className="flex w-max shrink-0 items-center">
              {[...copy.strip, ...copy.strip].map((natpis, i) => (
                <span
                  key={i}
                  className="flex items-center text-[11px] font-medium uppercase tracking-[0.3em] text-[#885B27]/70"
                >
                  <span className="px-10">{natpis}</span>
                  <Image
                    src={i % 2 === 0 ? '/images/brand/sunce.svg' : '/images/brand/travcica.svg'}
                    alt=""
                    aria-hidden="true"
                    width={34}
                    height={34}
                    className="h-8 w-8 shrink-0 object-contain"
                  />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 03 · medovi: cetiri kartice, tanke vertikalne linije ------ */}
      <div className="grid grid-cols-2 gap-px border-b border-[#885B27]/20 bg-[#885B27]/20 lg:grid-cols-4">
        {copy.products.slice(0, 4).map((p, i) => (
          <ProductCard key={p.name + p.unit} product={p} image={productImages[i]} locale={locale} />
        ))}
      </div>

      {/* --- 04 · lifestyle fotografija + editorial tekstualni blokovi -- */}
      <div className="grid border-b border-[#885B27]/20 lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[680px]">
          <Image
            src={lifestyle.editorial}
            alt={copy.alt.editorial}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          {copy.editorial.map((blok, i) => (
            <div
              key={blok.title}
              className={`flex flex-1 flex-col justify-center px-6 py-14 sm:px-10 lg:px-14 lg:py-20 ${
                i > 0 ? 'border-t border-[#885B27]/20 lg:border-t' : ''
              }`}
            >
              <h3 className="whitespace-pre-line font-sans text-[1.7rem] font-semibold uppercase leading-[1.12] tracking-[0.06em] sm:text-4xl">
                {blok.title}
              </h3>
              <ul className="mt-6 space-y-1.5">
                {blok.list.map((stavka) => (
                  <li key={stavka} className="text-sm text-[#885B27]/80">
                    {stavka}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <OvalLink href="#proizvodi">{copy.oval}</OvalLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 05 · pcelinji proizvodi: cetiri kartice ------------------- */}
      <div className="grid grid-cols-2 gap-px border-b border-[#885B27]/20 bg-[#885B27]/20 lg:grid-cols-4">
        {copy.products.slice(4).map((p, i) => (
          <ProductCard key={p.name + p.unit} product={p} image={productImages[i + 4]} locale={locale} />
        ))}
      </div>

      {/* --- 06 · zavrsni poziv ---------------------------------------- */}
      <div className="grid lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-6 py-14 sm:px-10 lg:order-1 lg:px-14 lg:py-24">
          <p className="max-w-md text-sm leading-6 text-[#885B27]/85">{copy.final.note}</p>

          <div className="mt-10">
            <OvalLink href="#proizvodi">{copy.final.oval}</OvalLink>
          </div>

          <h2 className="mt-14 whitespace-pre-line font-sans text-[2.1rem] font-semibold uppercase leading-[1.1] tracking-[0.06em] sm:text-5xl lg:text-[3.2rem]">
            {copy.final.title}
          </h2>

          <TransitionLink
            href="#proizvodi"
            className="btn group mt-12 w-fit"
          >
            {copy.final.cta}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
              strokeWidth={1.7}
            />
          </TransitionLink>
        </div>

        <div className="relative order-1 min-h-[340px] lg:order-2 lg:min-h-[620px]">
          <Image
            src={lifestyle.final}
            alt={copy.alt.final}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Jedna product kartica: fotografija preko cijele povrsine, naziv i gramaza
 * uvijek ispod, nikad preko proizvoda. Hover je srodan referenci — blagi
 * zoom fotografije i tanak pomak strijelice.
 */
function ProductCard({
  product,
  image,
  locale,
}: {
  product: ShopCopy['products'][number];
  image: string;
  locale: Locale;
}) {
  const href = product.slug ? localeHref(locale, `/products/${product.slug}`) : '#proizvodi';

  return (
    <TransitionLink href={href} className="group block bg-white">
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        <Image
          src={image}
          alt={product.slug ? `${product.name}, ${product.unit}` : product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-[12%] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />
      </div>

      <div className="px-5 py-6 sm:px-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] transition-colors duration-300 group-hover:text-[#6B4A2F] group-hover:underline group-hover:decoration-[#EEC660] group-hover:decoration-2 group-hover:underline-offset-[6px]">
          {product.name}
        </h3>
        {product.unit && (
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.22em] text-[#885B27]/60">
            {product.unit}
          </p>
        )}
      </div>
    </TransitionLink>
  );
}
