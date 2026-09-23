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
    addWish: 'Sačuvaj', removeWish: 'Sačuvano', stock: 'Dostupno', gallerySoon: 'Nova fotografija uskoro',
    containsEyebrow: 'Šta sadrži?', containsTitle: 'Jednostavan proizvod, poznatog porijekla.',
    containsBody: 'Bez suvišnih dodataka i bez prečica. Svako pakovanje čuva karakter proizvoda, mjesta i sezone iz koje dolazi.',
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
    visualEyebrow: 'Galerija proizvoda', visualTitle: 'Priča koja se vidi u svakom detalju',
    visualBody: 'Ovdje ostavljamo prostor za fotografije proizvoda, pčelinjaka i sezone. Nove kadrove možemo dodavati bez promjene dizajna stranice.',
  },
  en: {
    back: 'Back to products', natural: 'From our apiary', vat: 'VAT included', size: 'Pack size',
    quantity: 'Quantity', add: 'Add to cart', added: 'Added to cart', addWish: 'Save', removeWish: 'Saved',
    stock: 'In stock', gallerySoon: 'New photograph coming soon', containsEyebrow: 'What is inside?',
    containsTitle: 'A simple product with a known origin.',
    containsBody: 'No unnecessary additions and no shortcuts. Every pack preserves the character of the product, place and season it comes from.',
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
    visualEyebrow: 'Product gallery', visualTitle: 'A story visible in every detail',
    visualBody: 'This space is reserved for new product, apiary and seasonal photographs. New frames can be added without changing the page design.',
  },
} as const;

export default function ProductDetail({ product, locale }: { product: Product; locale: Locale }) {
  const c = copy[locale];
  const cart = useCart();
  const wishlist = useWishlist();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const saved = wishlist.has(product.slug);
  const facts = c.facts.map((label, index) => ({ label, value: index === 0 ? variant.title : c.factValues[index] }));

  function handleAdd() {
    cart.add({ productSlug: product.slug, variantId: variant.id, variantTitle: variant.title,
      name: product.name[locale], image: product.image, price: variant.price }, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <main className={styles.page}>
      <section className={styles.productHero}>
        <TransitionLink href={localeHref(locale, '/products')} className={styles.backLink}>
          <span aria-hidden="true">←</span> {c.back}
        </TransitionLink>

        <div className={styles.purchaseGrid}>
          <div className={styles.galleryColumn}>
            <div className={styles.mainImage}>
              <span className={styles.imageIndex}>01 / 04</span>
              <Image src={product.image} alt={product.name[locale]} fill priority
                sizes="(max-width: 900px) 100vw, 54vw" className={styles.productImage} />
            </div>
            <div className={styles.thumbnailRail} aria-label={c.visualEyebrow}>
              <div className={`${styles.thumbnail} ${styles.thumbnailActive}`}>
                <Image src={product.image} alt="" fill sizes="10rem" className={styles.thumbImage} />
                <span>01</span>
              </div>
              {[2, 3, 4].map((slot) => (
                <div className={styles.thumbnailPlaceholder} key={slot}>
                  <span className={styles.slotNumber}>0{slot}</span><small>{c.gallerySoon}</small>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.productInfo}>
            <div>
              <p className={styles.eyebrow}>{c.natural}</p>
              <h1 data-no-type>{product.name[locale]}</h1>
              <p className={styles.tagline}>{product.tagline[locale]}</p>
              <div className={styles.priceRow}><strong>{formatPrice(variant.price)}</strong><span>{c.vat}</span></div>
              <p className={styles.description}>{product.description[locale]}</p>
            </div>

            <div className={styles.purchaseControls}>
              <div className={styles.controlBlock}>
                <span className={styles.controlLabel}>{c.size}</span>
                <div className={styles.variants}>
                  {product.variants.map((option) => (
                    <button key={option.id} type="button" onClick={() => setVariantId(option.id)}
                      className={option.id === variant.id ? styles.variantActive : styles.variant}>{option.title}</button>
                  ))}
                </div>
              </div>
              <div className={styles.actionRow}>
                <div className={styles.quantityBlock}>
                  <span className={styles.controlLabel}>{c.quantity}</span>
                  <div className={styles.quantity}>
                    <button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus aria-hidden="true" /></button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus aria-hidden="true" /></button>
                  </div>
                </div>
                <button type="button" onClick={handleAdd} className={styles.addButton}>
                  <ShoppingBag aria-hidden="true" />{justAdded ? c.added : c.add}
                </button>
              </div>
              <div className={styles.secondaryActions}>
                <span><Check aria-hidden="true" /> {c.stock}</span>
                <button type="button" aria-pressed={saved} onClick={() => wishlist.toggle(product.slug)}>
                  <Heart className={saved ? styles.heartFilled : undefined} aria-hidden="true" />{saved ? c.removeWish : c.addWish}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.productStory}>
        <div className={styles.storyIntro}>
          <p className={styles.eyebrow}>{c.containsEyebrow}</p><h2>{c.containsTitle}</h2><p>{c.containsBody}</p>
        </div>
        <div className={styles.productFacts}>
          <p className={styles.eyebrow}>{c.infoEyebrow}</p>
          <dl>{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        </div>
      </section>

      <section className={styles.reasons}>
        <div className={styles.reasonsHeader}>
          <p className={styles.eyebrow}>{c.reasonsEyebrow}</p><h2>{c.reasonsTitle}</h2>
          <Image src="/images/brand/sunce.svg" alt="" width={190} height={190} className={styles.sun} />
        </div>
        <div className={styles.reasonsList}>
          {c.reasons.map(([index, title, body]) => (
            <article className={styles.reason} key={index}><span>{index}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.visualStory}>
        <div className={styles.visualCopy}>
          <p className={styles.eyebrow}>{c.visualEyebrow}</p><h2>{c.visualTitle}</h2><p>{c.visualBody}</p>
        </div>
        <div className={styles.futureGallery}>
          <div className={styles.futureMain}><Image src={product.image} alt={product.name[locale]} fill sizes="58vw" className={styles.productImage} /></div>
          <div className={styles.futureSlot}><span>02</span><small>{c.gallerySoon}</small></div>
          <div className={styles.futureSlot}><span>03</span><small>{c.gallerySoon}</small></div>
        </div>
      </section>
    </main>
  );
}
