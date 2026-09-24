'use client';

import Image from 'next/image';
import { Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import TransitionLink from '@/components/ui/TransitionLink';
import { formatPrice, type Product } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import styles from './productDetail.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const copy = {
  sr: {
    back: 'Nazad na proizvode', natural: 'Iz našeg pčelinjaka', vat: 'PDV uračunat',
    size: 'Pakovanje', quantity: 'Količina', add: 'Dodaj u korpu', added: 'Dodano u korpu',
    addWish: 'Sačuvaj', removeWish: 'Sačuvano', stock: 'Dostupno',
    gallery: 'Galerija proizvoda', photo: 'Fotografija',
    infoEyebrow: 'Informacije o proizvodu', facts: ['Neto količina', 'Porijeklo', 'Čuvanje', 'Proizvođač'],
    factValues: ['', 'Mračaj, Prnjavor', 'Na suvom i tamnom mjestu', 'Pčelarstvo Jevtić'],
    discoverEyebrow: 'Od košnice do stola',
    discoverTitle: 'Otkrijte kako se vrca, kako nastaje med.',
    discoverAlt: 'Med se cijedi iz vrcaljke u teglu',
    discoverCta: 'Pčelinjak — otkrijte kako nastaje med',
  },
  en: {
    back: 'Back to products', natural: 'From our apiary', vat: 'VAT included', size: 'Pack size',
    quantity: 'Quantity', add: 'Add to cart', added: 'Added to cart', addWish: 'Save', removeWish: 'Saved',
    stock: 'In stock', gallery: 'Product gallery', photo: 'Photo',
    infoEyebrow: 'Product information', facts: ['Net quantity', 'Origin', 'Storage', 'Producer'],
    factValues: ['', 'Mračaj, Prnjavor', 'Keep in a cool, dark place', 'Jevtić Beekeeping'],
    discoverEyebrow: 'From hive to table',
    discoverTitle: 'Discover how honey is spun, how it comes to be.',
    discoverAlt: 'Honey pouring from the extractor into a jar',
    discoverCta: 'The apiary — discover how honey is made',
  },
} as const;

/**
 * Stranica jednog proizvoda.
 *
 * Minimalno i u tri poteza, po uzoru na referentni webshop: lijevo galerija u
 * zaobljenoj plohi, desno naslov, kutija sa količinom i cijenom, opis i
 * podaci; ispod poziv da se otkrije kako nastaje med. Sve je na papiru — bez
 * bijele, bez tamne trake.
 *
 * Galerija: prvi snimak je sam proizvod (na plohi), ostali su prave
 * fotografije uz njega (`product.gallery`). Sličice se pojave samo kad ih ima.
 */
export default function ProductDetail({ product, locale }: { product: Product; locale: Locale }) {
  const c = copy[locale];
  const cart = useCart();
  const wishlist = useWishlist();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [active, setActive] = useState(0);
  const discover = useRef<HTMLElement>(null);

  /*
   * Slika u sekciji ispod se blago zumira dok se strana skrola: krene od prave
   * velicine kad ulazi u kadar i naraste 14% dok izlazi. Zumira se sama slika
   * unutar svog okvira (okvir stoji), pa ivice ostaju mirne. Ko je iskljucio
   * kretanje u sistemu, dobija sliku bez zuma.
   */
  useGSAP(() => {
    const frame = discover.current?.querySelector<HTMLElement>('[data-zoom-frame]');
    const img = frame?.querySelector<HTMLElement>('img');
    if (!frame || !img) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const zoom = gsap.fromTo(
        img,
        { scale: 1 },
        {
          scale: 1.14,
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
      return () => {
        zoom.scrollTrigger?.kill();
        zoom.kill();
      };
    });
    return () => mm.revert();
  }, { scope: discover });

  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const saved = wishlist.has(product.slug);
  const facts = c.facts.map((label, index) => ({ label, value: index === 0 ? variant.title : c.factValues[index] }));

  const gallery = [
    { src: product.image, alt: product.name[locale], fit: 'contain' as const },
    ...(product.gallery ?? []).map((g) => ({ src: g.src, alt: g.alt[locale], fit: 'cover' as const })),
  ];
  const current = gallery[active];

  function handleAdd() {
    cart.add({ productSlug: product.slug, variantId: variant.id, variantTitle: variant.title,
      name: product.name[locale], image: product.image, price: variant.price }, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <TransitionLink href={localeHref(locale, '/products')} className={styles.back}>
          <span aria-hidden="true">←</span> {c.back}
        </TransitionLink>

        <div className={styles.grid}>
          {/* --- lijevo: galerija --------------------------------------- */}
          <div className={styles.gallery}>
            <div className={styles.stage}>
              {gallery.length > 1 && (
                <span className={styles.counter} aria-hidden="true">{active + 1} / {gallery.length}</span>
              )}
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                fill
                priority={active === 0}
                sizes="(max-width: 900px) 100vw, 52vw"
                className={`${styles.stageImage} ${current.fit === 'cover' ? styles.cover : styles.contain}`}
              />
            </div>

            {gallery.length > 1 && (
              <div className={styles.thumbs} aria-label={c.gallery}>
                {gallery.map((item, index) => (
                  <button
                    key={item.src}
                    type="button"
                    className={`${styles.thumb} ${index === active ? styles.thumbActive : ''}`}
                    aria-label={`${c.photo} ${index + 1}`}
                    aria-current={index === active ? 'true' : undefined}
                    onClick={() => setActive(index)}
                  >
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      sizes="8rem"
                      className={item.fit === 'cover' ? styles.cover : styles.thumbContain}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- desno: naslov, kupovina, opis, podaci ------------------ */}
          <div className={styles.info}>
            <p className={styles.eyebrow}>{c.natural}</p>
            <h1 data-no-type>{product.name[locale]}</h1>
            <p className={styles.tagline}>{product.tagline[locale]}</p>

            <div className={styles.box}>
              {product.variants.length > 1 && (
                <div className={styles.boxRow}>
                  <span className={styles.label}>{c.size}</span>
                  <div className={styles.variants}>
                    {product.variants.map((option) => (
                      <button key={option.id} type="button" onClick={() => setVariantId(option.id)}
                        className={option.id === variant.id ? styles.variantActive : styles.variant}>{option.title}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className={`${styles.boxRow} ${styles.qtyRow}`}>
                <div className={styles.qty}>
                  <span className={styles.label}>{c.quantity}</span>
                  <div className={styles.stepper}>
                    <button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus aria-hidden="true" /></button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus aria-hidden="true" /></button>
                  </div>
                </div>
                <strong className={styles.price}>{formatPrice(variant.price * quantity)}</strong>
              </div>

              <div className={`${styles.boxRow} ${styles.boxFoot}`}>
                <p className={styles.note}>
                  <Check aria-hidden="true" /> {c.stock}<span aria-hidden="true"> · </span>{c.vat}
                </p>
                <div className={styles.actions}>
                  <button type="button" onClick={handleAdd} className={styles.addButton}>
                    <ShoppingBag aria-hidden="true" />{justAdded ? c.added : c.add}
                  </button>
                  <button type="button" aria-pressed={saved} onClick={() => wishlist.toggle(product.slug)} className={styles.wishButton}>
                    <Heart className={saved ? styles.heartFilled : undefined} aria-hidden="true" />{saved ? c.removeWish : c.addWish}
                  </button>
                </div>
              </div>
            </div>

            <p className={styles.description}>{product.description[locale]}</p>

            <div className={styles.details}>
              <p className={styles.eyebrow}>{c.infoEyebrow}</p>
              <dl>{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
            </div>
          </div>
        </div>
      </section>

      {/*
        --- otkrijte kako nastaje med ------------------------------------
        Pozadina je cvjetno polje (.bloomfield) kao na pocetnoj i na strani
        pcelinjaka. Mala slika u sredini se zumira na skrol, a okrugli zeleni
        pecat "Pcelinjak" vodi na stranu pcelinjaka.
      */}
      <section className={`bloomfield ${styles.discover}`} ref={discover}>
        <div className={styles.discoverInner}>
          <p className={styles.eyebrow}>{c.discoverEyebrow}</p>
          <h2>{c.discoverTitle}</h2>

          <div className={styles.frameWrap}>
            <div className={styles.frame} data-zoom-frame>
              <Image
                src="/images/real/vrcaljka-tegla.webp"
                alt={c.discoverAlt}
                fill
                sizes="(max-width: 640px) 78vw, 24rem"
                className={styles.zoomImage}
              />
            </div>

            <TransitionLink
              href={localeHref(locale, '/pcelinjak')}
              className={`brand-cta brand-cta--seal pecat ${styles.seal}`}
              aria-label={c.discoverCta}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="brand-cta__art" src="/images/brand/pecat-pcelinjak.svg" alt="" aria-hidden="true" />
            </TransitionLink>
          </div>
        </div>
      </section>
    </main>
  );
}
