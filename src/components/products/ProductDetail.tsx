'use client';

import Image from 'next/image';
import { Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TransitionLink from '@/components/ui/TransitionLink';
import { formatPrice, type Product } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import DiscoverHoney from './DiscoverHoney';
import styles from './productDetail.module.css';

gsap.registerPlugin(ScrollTrigger);

const copy = {
  sr: {
    back: 'Nazad na proizvode', natural: 'Iz našeg pčelinjaka', vat: 'PDV uračunat',
    size: 'Pakovanje', quantity: 'Količina', add: 'Dodaj u korpu', added: 'Dodano u korpu',
    addWish: 'Sačuvaj', removeWish: 'Sačuvano', stock: 'Dostupno',
    gallery: 'Galerija proizvoda', photo: 'Fotografija',
    infoEyebrow: 'Informacije o proizvodu', facts: ['Neto količina', 'Porijeklo', 'Čuvanje', 'Proizvođač'],
    factValues: ['', 'Mračaj, Prnjavor', 'Na suvom i tamnom mjestu', 'Pčelarstvo Jevtić'],
  },
  en: {
    back: 'Back to products', natural: 'From our apiary', vat: 'VAT included', size: 'Pack size',
    quantity: 'Quantity', add: 'Add to cart', added: 'Added to cart', addWish: 'Save', removeWish: 'Saved',
    stock: 'In stock', gallery: 'Product gallery', photo: 'Photo',
    infoEyebrow: 'Product information', facts: ['Net quantity', 'Origin', 'Storage', 'Producer'],
    factValues: ['', 'Mračaj, Prnjavor', 'Keep in a cool, dark place', 'Jevtić Beekeeping'],
  },
} as const;

/** Koliko se od riječi vidi dok čeka svoj red (isto kao `.geslo__w`). */
const FAINT = 0.3;

/**
 * Stranica jednog proizvoda.
 *
 * Tri poteza, sve na papiru: gore galerija lijevo i kupovina desno (naslov,
 * količina i cijena, dugmad); zatim opis i podaci koji se čitaju uz zaustavljen
 * skrol (`ProductStory`, isti obrazac kao rečenica na početnoj); na kraju poziv
 * da se otkrije kako nastaje med (`DiscoverHoney`).
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

  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const saved = wishlist.has(product.slug);
  const facts = c.facts.map((label, index) => ({ label, value: index === 0 ? variant.title : c.factValues[index] }));

  const gallery = [
    { src: product.image, alt: product.name[locale], fit: 'contain' as const },
    ...(product.gallery ?? []).map((g) => ({ src: g.src, alt: g.alt[locale], fit: 'cover' as const })),
  ];

  function handleAdd() {
    cart.add({ productSlug: product.slug, variantId: variant.id, variantTitle: variant.title,
      name: product.name[locale], image: product.image, price: variant.price }, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <TransitionLink href={localeHref(locale, '/products')} className={styles.back}>
            <span aria-hidden="true">←</span> {c.back}
          </TransitionLink>

          <div className={styles.grid}>
            {/* --- lijevo: galerija --------------------------------------- */}
            <div className={styles.gallery}>
              {/*
               * Svi snimci stoje jedan preko drugog, aktivan je vidljiv. Tako se
               * promjena vidi kao prelaz, a ne kao prazna ploha dok se novi snimak
               * ne učita (fotografije su velike).
               */}
              <div className={styles.stage}>
                {gallery.length > 1 && (
                  <span className={styles.counter} aria-hidden="true">{active + 1} / {gallery.length}</span>
                )}
                {gallery.map((item, index) => (
                  <Image
                    key={item.src}
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={index === 0}
                    aria-hidden={index === active ? undefined : true}
                    sizes="(max-width: 900px) min(100vw, 34rem), 44vw"
                    className={[
                      styles.stageImage,
                      item.fit === 'cover' ? styles.cover : styles.contain,
                      index === active ? styles.stageOn : '',
                    ].join(' ')}
                  />
                ))}
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

            <span className={styles.divider} aria-hidden="true" />

            {/* --- desno: naslov i kupovina ------------------------------- */}
            <div className={styles.info}>
              <p className={styles.eyebrow}>{c.natural}</p>
              <h1 data-no-type>{product.name[locale].replace(/(\d) (kg|g|ml)/, '$1\u00a0$2')}</h1>
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
            </div>
          </div>
        </div>
      </section>

      <ProductStory text={product.description[locale]} eyebrow={c.infoEyebrow} facts={facts} />

      {/* Cvjetno polje sa slikom i pecatom; ista sekcija stoji i na strani Proizvodi. */}
      <DiscoverHoney locale={locale} />
    </main>
  );
}

/**
 * Prijanjanje jednoslovnih rijeci ("u", "i", "a"...) uz sljedecu, i crtice uz
 * prethodnu, da red ne zavrsi rijecju od jednog slova ni pocne crticom.
 */
function glue(text: string) {
  return text
    .replace(/(^| )([uiakosz]) /gi, '$1$2\u00a0')
    .replace(/(^| )([uiakosz]) /gi, '$1$2\u00a0')
    .replace(/ — /g, '\u00a0— ');
}

/**
 * Opis i podaci o proizvodu, uz zaustavljen skrol.
 *
 * Isti obrazac kao rečenica "U Republici Srpskoj..." (`Geslo.tsx`): visoka
 * sekcija sa "ljepljivim" kadrom od 100svh, a skrol vodi otkrivanje teksta
 * riječ po riječ; poslije zadnje riječi se otkriju i podaci, pa kratko držanje
 * punog teksta prije otpuštanja. Visina skrola je srazmjerna dužini opisa
 * (`--words`), da kratak opis ne drži strani duže nego što treba.
 *
 * Ko je u sistemu isključio kretanje, dobija običnu sekciju sa svim vidljivim.
 */
function ProductStory({
  text,
  eyebrow,
  facts,
}: {
  text: string;
  eyebrow: string;
  facts: { label: string; value: string }[];
}) {
  const root = useRef<HTMLElement>(null);
  const body = useRef<HTMLParagraphElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const words = glue(text).split(' ');

  useEffect(() => {
    const section = root.current;
    const line = body.current;
    if (!section || !line) return;
    const items = Array.from(line.querySelectorAll<HTMLElement>('[data-w]'));
    if (strip.current) items.push(strip.current);
    if (!items.length) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(items, { opacity: 1 });
      return () => gsap.set(items, { clearProps: 'opacity' });
    });
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const setters = items.map((item) => gsap.quickSetter(item, 'opacity'));
      const count = items.length;
      const render = (scrollProgress: number) => {
        // Zadnjih 18% skrola drži pun tekst prije otpuštanja.
        const progress = Math.min(1, scrollProgress / 0.82);
        setters.forEach((setOpacity, index) => {
          setOpacity(Math.min(1, Math.max(FAINT, (progress * (count + 3) - index) / 3)));
        });
      };

      render(0);
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: ({ progress }) => render(progress),
        onUpdate: ({ progress }) => render(progress),
      });
      return () => {
        trigger.kill();
        gsap.set(items, { clearProps: 'opacity' });
      };
    });

    return () => mm.revert();
  }, [text]);

  return (
    <section className={styles.story} ref={root} style={{ '--words': words.length } as CSSProperties}>
      <div className={styles.storyInner}>
        {/* Čitač ekrana i pretraživač dobiju cio tekst; oko vidi riječi koje se otkrivaju. */}
        <p className="sr-only">{text}</p>
        <p className={styles.storyText} ref={body} aria-hidden="true">
          {words.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span className={styles.w} data-w>{word}</span>{' '}
            </Fragment>
          ))}
        </p>

        <div className={styles.facts} ref={strip}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <dl>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
