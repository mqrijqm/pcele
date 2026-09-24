'use client';

import Image from 'next/image';
import { Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

import TransitionLink from '@/components/ui/TransitionLink';
import { formatPrice, type Product } from '@/data/products';
import { localeHref, type Locale } from '@/i18n/config';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import styles from './productDetail.module.css';

const copy = {
  sr: {
    back: 'Nazad na proizvode', natural: 'Iz našeg pčelinjaka', vat: 'PDV uračunat',
    size: 'Pakovanje', quantity: 'Količina', add: 'Dodaj u korpu', added: 'Dodano u korpu',
    addWish: 'Sačuvaj', removeWish: 'Sačuvano', stock: 'Dostupno',
    gallery: 'Galerija proizvoda', photo: 'Fotografija',
    infoEyebrow: 'Informacije o proizvodu', facts: ['Neto količina', 'Porijeklo', 'Čuvanje', 'Proizvođač'],
    factValues: ['', 'Mračaj, Prnjavor', 'Na suvom i tamnom mjestu', 'Pčelarstvo Jevtić'],
    reasonsEyebrow: 'Od košnice do stola', reasonsTitle: '5 razloga da izaberete naše proizvode',
    reasons: [
      ['01', 'Naše pčele', 'Proizvod počinje u košnicama o kojima brinemo kroz cijelu godinu.'],
      ['02', 'Čisto porijeklo', 'Pčelinjaci su smješteni uz šume i livade oko Mračaja i Prnjavora.'],
      ['03', 'Male serije', 'Punimo pažljivo i u manjim količinama, bez industrijskog pristupa.'],
      ['04', 'Bez žurbe', 'Prirodni ritam pčela i sezone određuje kada je proizvod spreman.'],
      ['05', 'Porodična tradicija', 'Znanje, rad i ukus prenosimo u porodici od 1980. godine.'],
    ],
  },
  en: {
    back: 'Back to products', natural: 'From our apiary', vat: 'VAT included', size: 'Pack size',
    quantity: 'Quantity', add: 'Add to cart', added: 'Added to cart', addWish: 'Save', removeWish: 'Saved',
    stock: 'In stock', gallery: 'Product gallery', photo: 'Photo',
    infoEyebrow: 'Product information', facts: ['Net quantity', 'Origin', 'Storage', 'Producer'],
    factValues: ['', 'Mračaj, Prnjavor', 'Keep in a cool, dark place', 'Jevtić Beekeeping'],
    reasonsEyebrow: 'From hive to table', reasonsTitle: '5 reasons to choose our products',
    reasons: [
      ['01', 'Our bees', 'The product begins in hives we care for throughout the year.'],
      ['02', 'Clear origin', 'Our apiaries sit beside the forests and meadows around Mračaj and Prnjavor.'],
      ['03', 'Small batches', 'We fill each pack carefully and in small quantities, never industrially.'],
      ['04', 'Never rushed', 'The natural rhythm of the bees and the season decides when a product is ready.'],
      ['05', 'Family tradition', 'Knowledge, work and taste have stayed in our family since 1980.'],
    ],
  },
} as const;

/**
 * Stranica jednog proizvoda.
 *
 * Minimalno i u tri poteza, po uzoru na referentni webshop: lijevo galerija u
 * zaobljenoj plohi, desno naslov, kutija sa količinom i cijenom, opis i
 * podaci; ispod pet razloga. Sve je na papiru — bez bijele, bez tamne trake.
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

      {/* --- pet razloga: mirno, na papiru, tanke linije ---------------- */}
      <section className={styles.reasons}>
        <header className={styles.reasonsHead}>
          <p className={styles.eyebrow}>{c.reasonsEyebrow}</p>
          <h2>{c.reasonsTitle}</h2>
        </header>
        <ol className={styles.reasonsList}>
          {c.reasons.map(([index, title, body]) => (
            <li className={styles.reason} key={index}><span>{index}</span><h3>{title}</h3><p>{body}</p></li>
          ))}
        </ol>
      </section>
    </main>
  );
}
