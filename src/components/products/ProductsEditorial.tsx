import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import { localeHref } from '@/i18n/config';
import ProductsTimeline, { type TimelineStep } from './ProductsTimeline';
import ProductsCatalog from './ProductsCatalog';
import styles from './productsEditorial.module.css';

const steps: TimelineStep[] = [
  {
    number: '01',
    season: 'Februar—mart',
    title: 'Priprema pčelinjaka',
    body: 'Pregledamo svako društvo, pripremamo ramove i ostavljamo pčelama dovoljno vremena da u proljeće uđu snažne.',
    image: '/images/real/pcelinjak-1.webp',
    slot: 'pcelinjak-process-01',
  },
  {
    number: '02',
    season: 'Maj—jun',
    title: 'Bagremova paša',
    body: 'Cvat traje kratko. Košnice su uz bagremove šume, a svaki miran i sunčan dan mijenja ovu berbu.',
    image: '/images/real/bagrem-cvat.webp',
    slot: 'pcelinjak-process-02',
  },
  {
    number: '03',
    season: 'Jun—avgust',
    title: 'Livadska paša',
    body: 'Poslije bagrema dolazi duga smjena livadskog cvijeća. Zato je livadski med svake godine malo drugačiji.',
    image: '/images/real/pcele-cvijet.webp',
    slot: 'pcelinjak-process-03',
  },
  {
    number: '04',
    season: 'Kraj paše',
    title: 'Vrcanje',
    body: 'Uzimamo samo zrele, zatvorene ramove. Med izlazi iz saća bez pregrijavanja i bez prečica.',
    image: '/images/real/vrcaljka-tegla.webp',
    slot: 'pcelinjak-process-04',
  },
  {
    number: '05',
    season: 'Isti dan',
    title: 'Cijeđenje i odležavanje',
    body: 'Med prolazi kroz grubo sito, zatim miruje. Ne oduzimamo mu ono što nosi iz košnice.',
    image: '/images/real/kante-med.webp',
    slot: 'pcelinjak-process-05',
  },
  {
    number: '06',
    season: 'Po narudžbi',
    title: 'Punjenje',
    body: 'Tegle punimo u malim serijama. Tako znamo kojoj paši i kojem dijelu sezone pripada svaka od njih.',
    image: '/images/real/punjenje-tegle.webp',
    slot: 'pcelinjak-process-06',
  },
  {
    number: '07',
    season: 'Završni korak',
    title: 'Pakovanje',
    body: 'Etiketa i zaštita idu rukom, teglu po teglu, tek kada je med spreman da napusti pčelinjak.',
    image: '/images/mockups/label-in-hands.webp',
    slot: 'pcelinjak-process-07',
  },
  {
    number: '08',
    season: 'Po dogovoru',
    title: 'Dostava',
    body: 'Lokalne narudžbe predajemo lično, a za ostale dogovaramo način na koji tegla stiže sigurno i mirno.',
    image: '/images/products-editorial/jars-railing.webp',
    slot: 'pcelinjak-process-08',
  },
];

const featureFacts = [
  ['Paša', 'Maj—jun'],
  ['Ukus', 'Blag'],
  ['Boja', 'Svijetlozlatna'],
];

export default function ProductsEditorial() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="products-title">
        <div className={styles.marquee}>
          <h1 id="products-title" className={styles.marqueeLine}>
            <span>Med i pčelinji proizvodi.</span>
            <span aria-hidden="true">Med i pčelinji proizvodi.</span>
          </h1>
        </div>

        <div className={styles.heroImage} data-image-slot="bagrem-hero">
          <Image
            src="/images/products-editorial/acacia-hand.webp"
            alt="Tegla bagremovog meda podignuta ispred pčelinjaka"
            fill
            priority
            sizes="100vw"
          />
          <div className={styles.heroStamp} aria-hidden="true">
            <Image src="/images/brand/pecat-prirodan.svg" alt="" width={150} height={150} />
          </div>
          <span className={styles.heroCaption}>Bagremov med · berba 2026.</span>
        </div>
      </section>

      <section className={`${styles.intro} reveal`}>
        <span className={styles.eyebrow}>Porodični pčelinjak · Mračaj</span>
        <p>
          Četiri proizvoda iz istog pčelinjaka. Svaki nosi drugačiji dio sezone, ali isti pristup:
          malo miješanja, bez dodataka i dovoljno vremena da med ostane svoj.
        </p>
        <Image className={styles.introBee} src="/images/brand/pcelar.svg" alt="" width={170} height={220} aria-hidden="true" />
        <Image className={styles.introSpark} src="/images/brand/cvijet-krug.svg" alt="" width={84} height={84} aria-hidden="true" />
      </section>

      <ProductsCatalog />

      <section className={styles.bagrem} aria-labelledby="bagrem-title">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Glavna berba</span>
          <h2 id="bagrem-title">Bagremov med</h2>
        </div>

        <div className={styles.bagremGrid}>
          <div className={`${styles.bagremImage} reveal`} data-image-slot="bagrem-main">
            <Image
              src="/images/products-editorial/acacia-hive.webp"
              alt="Bagremov med na košnici"
              fill
              sizes="(max-width: 768px) 90vw, 38vw"
            />
          </div>
          <div className={`${styles.bagremCopy} reveal`}>
            <p className={styles.lead}>
              Svijetao i tih med kratke proljetne paše. Njegov blag ukus ne krije odakle dolazi — iz
              bagremovih šuma oko Prnjavora.
            </p>
            <dl className={styles.facts}>
              {featureFacts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <TransitionLink className={styles.textLink} href="/sr/products/bagremov-med-1kg">
              Pogledaj bagremov med <span aria-hidden="true">↗</span>
            </TransitionLink>
          </div>
        </div>
        <Image className={styles.acaciaBranch} src="/images/brand/bagremov-grana.svg" alt="" width={330} height={420} aria-hidden="true" />
      </section>

      <section className={styles.why} aria-labelledby="why-title">
        <div className={styles.whyTitleWrap}>
          <h2 id="why-title">Zašto naš bagrem?</h2>
        </div>
        <div className={styles.whyGrid}>
          <div className={styles.whyImage} data-image-slot="bagrem-detail">
            <Image
              src="/images/products-editorial/honeys-apiary.webp"
              alt="Bagremov i livadski med u pčelinjaku"
              fill
              sizes="(max-width: 768px) 100vw, 34vw"
            />
          </div>
          <div className={styles.whyCopy}>
            <p>
              Bagrem ne cvjeta dugo, zato je svaka berba mala i zavisi od nekoliko mirnih proljetnih dana.
            </p>
            <ul>
              <li>Kratka proljetna paša</li>
              <li>Blag, čist ukus</li>
              <li>Prirodno svijetla boja</li>
              <li>Bez dodataka i zagrijavanja</li>
              <li>Direktno iz našeg pčelinjaka</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.twoFeatures} aria-label="O bagremovoj paši i punjenju">
        <div className={styles.featureHeadline}>
          <div><span>Bagremova paša</span><small>desetak dana</small></div>
          <div><small>iz iste košnice</small><span>Od košnice do tegle</span></div>
        </div>
        <div className={styles.featurePair}>
          <figure className={styles.featureTall} data-image-slot="bagremova-pasa">
            <Image src="/images/real/bagrem-cvat.webp" alt="Bagrem u cvatu" fill sizes="(max-width: 768px) 100vw, 42vw" />
            <figcaption>Paša počinje tek kada se otvori prvi mirisni grozd.</figcaption>
          </figure>
          <figure className={styles.featureWide} data-image-slot="od-kosnice-do-tegle">
            <Image src="/images/real/punjenje-tegle.webp" alt="Ručno punjenje tegle medom" fill sizes="(max-width: 768px) 100vw, 48vw" />
            <figcaption>Med punimo mirno, u malim serijama.</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.otherProducts} aria-labelledby="other-title">
        <div className={styles.collage}>
          <h2 id="other-title">Iz iste košnice.</h2>
          <figure className={styles.collageOne} data-image-slot="livadski-detail">
            <Image src="/images/products-editorial/meadow-hand.webp" alt="Livadski med na dlanu" fill sizes="30vw" />
          </figure>
          <figure className={styles.collageTwo} data-image-slot="propolis">
            <Image src="/images/products-editorial/propolis-hand.webp" alt="Bočica pčelinjeg propolisa" fill sizes="28vw" />
          </figure>
          <figure className={styles.collageThree} data-image-slot="imuno-mix">
            <Image src="/images/products-editorial/imuno-spoon.webp" alt="Imuno mix i kašika" fill sizes="25vw" />
          </figure>
          <figure className={styles.collageFour} data-image-slot="pcelinjak-products">
            <Image src="/images/products-editorial/jars-railing.webp" alt="Tegle meda u nizu" fill sizes="30vw" />
          </figure>
          <Image className={styles.collageFlower} src="/images/brand/livadski-cvijet.svg" alt="" width={120} height={120} aria-hidden="true" />
        </div>

        <div className={styles.productStories}>
          <article className={styles.story}>
            <span className={styles.storyIndex}>01 / Livada</span>
            <h3>Livadski med</h3>
            <p>Cvjetan i pun. Njegov ukus se mijenja sa cvijećem koje je te godine raslo oko naših košnica.</p>
            <TransitionLink href={localeHref('sr', '/products/livadski-med-500g')}>Pogledaj proizvod ↗</TransitionLink>
          </article>
          <article className={styles.story}>
            <span className={styles.storyIndex}>02 / Košnica</span>
            <h3>Pčelinji propolis</h3>
            <p>Koncentrisan, smolast i gorak. Nekoliko kapi nosi karakter materijala kojim pčele štite košnicu.</p>
            <TransitionLink href={localeHref('sr', '/products/pcelinji-propolis-20ml')}>Pogledaj proizvod ↗</TransitionLink>
          </article>
          <article className={styles.story}>
            <span className={styles.storyIndex}>03 / Med + polen</span>
            <h3>Imuno mix</h3>
            <p>Med i cvjetni polen u istoj tegli. Gusta, zrnasta smjesa za malu svakodnevnu mjeru.</p>
            <TransitionLink href={localeHref('sr', '/products/imuno-mix-450g')}>Pogledaj proizvod ↗</TransitionLink>
          </article>
        </div>
      </section>

      <section className={styles.process} aria-labelledby="process-title">
        <div className={styles.processIntro}>
          <span className={styles.eyebrow}>Jedna sezona · osam koraka</span>
          <h2 id="process-title">Kako nastaje naš med?</h2>
          <p>Od prvog proljetnog pregleda do trenutka kada tegla krene prema vama.</p>
        </div>
        <ProductsTimeline steps={steps} />
      </section>

      <section className={styles.storage} aria-labelledby="storage-title">
        <div className={styles.storageArt} data-image-slot="honey-storage">
          <Image src="/images/products-editorial/honey-table.webp" alt="Med poslužen uz hljeb" fill sizes="(max-width: 768px) 100vw, 38vw" />
        </div>
        <div className={styles.storageCopy}>
          <span className={styles.eyebrow}>Dobro je znati</span>
          <h2 id="storage-title">Kristalizacija nije kvar.</h2>
          <p>
            To je prirodan proces i znak da med nije pregrijavan. Čuvajte ga zatvorenog, na suhom i tamnom
            mjestu. Ako želite tečan med, teglu polako zagrijte u vodi do 40°C.
          </p>
          <dl>
            <div><dt>Čuvanje</dt><dd>Suho i tamno mjesto</dd></div>
            <div><dt>Temperatura</dt><dd>Do 25°C</dd></div>
            <div><dt>Sastav</dt><dd>Bez dodataka</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="cta-title">
        <div>
          <span className={styles.eyebrow}>Mračaj · Prnjavor</span>
          <h2 id="cta-title">Med iz našeg pčelinjaka.</h2>
          <TransitionLink className={styles.ctaButton} href="/sr#kontakt">Kontaktirajte nas <span aria-hidden="true">↗</span></TransitionLink>
        </div>
        <div className={styles.ctaImage} data-image-slot="products-final">
          <Image src="/images/products-editorial/imuno-meadow.webp" alt="Imuno mix u livadi" fill sizes="(max-width: 768px) 42vw, 18vw" />
        </div>
        <Image className={styles.ctaSun} src="/images/brand/sunce.svg" alt="" width={160} height={160} aria-hidden="true" />
      </section>
    </div>
  );
}
