// Cijene su u KM (BAM).
import type { Locale } from '@/i18n/config';

export type Variant = { id: string; title: string; price: number; stock: number };

/** Dodatna fotografija uz glavni snimak proizvoda (stranica proizvoda, galerija). */
export type GalleryImage = { src: string; alt: Record<Locale, string> };

export type Product = {
  slug: string;
  order: number;
  category: 'honey' | 'other';
  image: string;
  /** Snimci koji idu iza glavnog; galerija na stranici proizvoda ih pokazuje kao sličice. */
  gallery?: GalleryImage[];
  variants: Variant[];
  name: Record<Locale, string>;
  tagline: Record<Locale, string>;
  description: Record<Locale, string>;
};

/*
 * Ono sto se stvarno prodaje: dvije vrste meda, svaka u dvije tegle.
 *
 * Svaka tegla je zaseban artikal, a ne velicina unutar jednog proizvoda, jer
 * svaka ima svoju fotografiju sa svojom etiketom — na etiketi pise gramaza,
 * pa jedna slika ne moze pokrivati dvije tegle.
 *
 * Cijene i zalihe prenesene su iz ranijeg kataloga.
 */
export const products: Product[] = [
  {
    slug: 'bagremov-med-1kg',
    order: 1,
    category: 'honey',
    image: '/images/proizvodi/bagremov-1kg-new.webp',
    gallery: [
      { src: '/images/products-editorial/acacia-hand.webp', alt: { sr: 'Tegla bagremovog meda u ruci, u pčelinjaku', en: 'A jar of acacia honey in a hand, in the apiary' } },
      { src: '/images/products-editorial/acacia-hive.webp', alt: { sr: 'Tegla bagremovog meda na košnici', en: 'A jar of acacia honey on a hive' } },
      { src: '/images/products-editorial/medeni-proizvod-2.webp', alt: { sr: 'Dijete zahvata bagremov med iz tegle', en: 'A child reaching into a jar of acacia honey' } },
    ],
    variants: [{ id: 'bagremov-1kg', title: '1 kg', price: 40, stock: 50 }],
    name: {
      sr: 'Bagremov med, 1 kg',
      en: 'Acacia honey, 1 kg',
    },
    tagline: {
      sr: 'Svijetao, blag i elegantan',
      en: 'Light, mild, and elegant',
    },
    description: {
      sr: 'Naš bagremov med dolazi iz čistih šuma oko Prnjavora, gdje naše pčele sakupljaju nektar sa stoljetnih stabala bagrema. Poznat po svojoj svijetloj boji i nježnom, blagom ukusu, idealan je za svakodnevnu upotrebu i zaslađivanje napitaka.',
      en: 'Our acacia honey comes from the pristine forests around Prnjavor, where our bees collect nectar from centuries-old acacia trees. Known for its light color and gentle, mild taste, it is ideal for everyday use and sweetening beverages.',
    },
  },
  {
    slug: 'bagremov-med-500g',
    order: 2,
    category: 'honey',
    image: '/images/proizvodi/bagremov-500g-new.webp',
    gallery: [
      { src: '/images/products-editorial/acacia-hand.webp', alt: { sr: 'Tegla bagremovog meda u ruci, u pčelinjaku', en: 'A jar of acacia honey in a hand, in the apiary' } },
      { src: '/images/products-editorial/acacia-hive.webp', alt: { sr: 'Tegla bagremovog meda na košnici', en: 'A jar of acacia honey on a hive' } },
      { src: '/images/products-editorial/medeni-proizvod-2.webp', alt: { sr: 'Dijete zahvata bagremov med iz tegle', en: 'A child reaching into a jar of acacia honey' } },
    ],
    variants: [{ id: 'bagremov-500', title: '500 g', price: 22, stock: 100 }],
    name: {
      sr: 'Bagremov med, 500 g',
      en: 'Acacia honey, 500 g',
    },
    tagline: {
      sr: 'Svijetao, blag i elegantan',
      en: 'Light, mild, and elegant',
    },
    description: {
      sr: 'Naš bagremov med dolazi iz čistih šuma oko Prnjavora, gdje naše pčele sakupljaju nektar sa stoljetnih stabala bagrema. Poznat po svojoj svijetloj boji i nježnom, blagom ukusu, idealan je za svakodnevnu upotrebu i zaslađivanje napitaka.',
      en: 'Our acacia honey comes from the pristine forests around Prnjavor, where our bees collect nectar from centuries-old acacia trees. Known for its light color and gentle, mild taste, it is ideal for everyday use and sweetening beverages.',
    },
  },
  {
    slug: 'livadski-med-1kg',
    order: 3,
    category: 'honey',
    // TODO: privremeno studijski render — fotografija tegle od 1 kg jos nije
    // snimljena. Ostale tri kartice su prave fotografije.
    image: '/images/proizvodi/livadski-1kg-new.webp',
    gallery: [
      { src: '/images/products-editorial/meadow-hand.webp', alt: { sr: 'Tegla livadskog meda na dlanu, na livadi', en: 'A jar of meadow honey on a palm, in a meadow' } },
      { src: '/images/products-editorial/jars-railing.webp', alt: { sr: 'Red tegli livadskog meda na drvenoj ogradi', en: 'A row of meadow honey jars on a wooden railing' } },
      { src: '/images/products-editorial/honeys-apiary.webp', alt: { sr: 'Bagremov i livadski med na drvenom stolu u pčelinjaku', en: 'Acacia and meadow honey on a wooden table in the apiary' } },
    ],
    variants: [{ id: 'livadski-1kg', title: '1 kg', price: 32, stock: 60 }],
    name: {
      sr: 'Livadski med, 1 kg',
      en: 'Meadow honey, 1 kg',
    },
    tagline: {
      sr: 'Cvjetan, pun i svakodnevan',
      en: 'Floral, full and everyday',
    },
    description: {
      sr: 'Livadski med nastaje iz mnogo različitih cvjetova sa livada oko Mračaja, pa mu se karakter mijenja iz sezone u sezonu. Zaokružen je i cvjetan, dovoljno blag za svaki dan, a dovoljno izražen da se osjeti odakle dolazi.',
      en: 'Meadow honey comes from many different flowers on the meadows around Mračaj, so its character shifts from one season to the next. It is rounded and floral — mild enough for every day, yet distinct enough to taste where it comes from.',
    },
  },
  {
    slug: 'livadski-med-500g',
    order: 4,
    category: 'honey',
    image: '/images/proizvodi/livadski-500g-new.webp',
    gallery: [
      { src: '/images/products-editorial/meadow-hand.webp', alt: { sr: 'Tegla livadskog meda na dlanu, na livadi', en: 'A jar of meadow honey on a palm, in a meadow' } },
      { src: '/images/products-editorial/jars-railing.webp', alt: { sr: 'Red tegli livadskog meda na drvenoj ogradi', en: 'A row of meadow honey jars on a wooden railing' } },
      { src: '/images/products-editorial/honeys-apiary.webp', alt: { sr: 'Bagremov i livadski med na drvenom stolu u pčelinjaku', en: 'Acacia and meadow honey on a wooden table in the apiary' } },
    ],
    variants: [{ id: 'livadski-500', title: '500 g', price: 18, stock: 120 }],
    name: {
      sr: 'Livadski med, 500 g',
      en: 'Meadow honey, 500 g',
    },
    tagline: {
      sr: 'Cvjetan, pun i svakodnevan',
      en: 'Floral, full and everyday',
    },
    description: {
      sr: 'Livadski med nastaje iz mnogo različitih cvjetova sa livada oko Mračaja, pa mu se karakter mijenja iz sezone u sezonu. Zaokružen je i cvjetan, dovoljno blag za svaki dan, a dovoljno izražen da se osjeti odakle dolazi.',
      en: 'Meadow honey comes from many different flowers on the meadows around Mračaj, so its character shifts from one season to the next. It is rounded and floral — mild enough for every day, yet distinct enough to taste where it comes from.',
    },
  },
  {
    slug: 'pcelinji-propolis-20ml',
    order: 5,
    // Prvi artikal koji nije med — zato se na spisku proizvoda tek sad
    // pojavljuje i filter "Ostalo": grid nudi kategoriju samo ako u njoj
    // stvarno ima nesto.
    category: 'other',
    image: '/images/proizvodi/propolis-20ml-new.webp',
    gallery: [
      { src: '/images/products-editorial/propolis-hand.webp', alt: { sr: 'Bočica propolisa u ruci', en: 'A bottle of propolis in a hand' } },
      { src: '/images/products-editorial/propolis-meadow.webp', alt: { sr: 'Bočica propolisa na livadi, uz cvijeće', en: 'A bottle of propolis in a meadow, among flowers' } },
      { src: '/images/products-editorial/propolis-tea.webp', alt: { sr: 'Propolis iz kapaljke uz šolju čaja', en: 'Propolis from a dropper beside a cup of tea' } },
    ],
    // TODO: cijena i zaliha su privremene — nisu dobijene uz fotografije.
    variants: [{ id: 'propolis-20ml', title: '20 ml', price: 12, stock: 40 }],
    name: {
      sr: 'Pčelinji propolis, 20 ml',
      en: 'Bee propolis, 20 ml',
    },
    tagline: {
      sr: 'Smolast, gorak i koncentrisan',
      en: 'Resinous, bitter and concentrated',
    },
    description: {
      sr: 'Propolis je smola kojom pčele zatvaraju i čuvaju košnicu. Sakupljamo ga iz naših košnica oko Mračaja i cijedimo u tamnu bočicu sa kapaljkom, bez razblaživanja. Ukus je smolast i gorak — nekoliko kapi je dovoljno.',
      en: 'Propolis is the resin bees use to seal and protect the hive. We collect it from our hives around Mračaj and draw it into a dark dropper bottle, undiluted. The taste is resinous and bitter — a few drops are enough.',
    },
  },
  {
    slug: 'imuno-mix-450g',
    order: 6,
    category: 'other',
    image: '/images/proizvodi/imuno-mix-450g-new.webp',
    gallery: [
      { src: '/images/products-editorial/imuno-spoon.webp', alt: { sr: 'Imuno mix na kašici, uz otvorenu teglu', en: 'Imuno mix on a spoon, beside the open jar' } },
      { src: '/images/products-editorial/imuno-meadow.webp', alt: { sr: 'Tegla imuno mixa u travi, uz cvijeće', en: 'A jar of imuno mix in the grass, among flowers' } },
    ],
    // TODO: cijena i zaliha su privremene — nisu dobijene uz fotografije.
    variants: [{ id: 'imuno-mix-450', title: '450 g', price: 20, stock: 60 }],
    name: {
      sr: 'Imuno mix, 450 g',
      en: 'Imuno mix, 450 g',
    },
    tagline: {
      sr: '70% med, 30% polen',
      en: '70% honey, 30% pollen',
    },
    description: {
      sr: 'Imuno mix je med i cvjetni polen umiješani u istoj tegli — sedamdeset posto meda, trideset posto polena. Polen ostaje u zrnu, pa se osjeti pod zubom i daje smjesi gust, pun ukus. Kašičica ujutru je uobičajena mjera.',
      en: 'Imuno mix is honey and flower pollen stirred together in one jar — seventy per cent honey, thirty per cent pollen. The pollen stays whole, so you feel the grains and the mix tastes dense and full. A spoonful in the morning is the usual measure.',
    },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Naziv artikla nosi i mjeru ("Livadski med, 1 kg"); kartice ih prikazuju odvojeno. */
export const splitName = (name: string): { title: string; unit: string } => {
  const m = name.match(/^(.*?),\s*(\d[\d.,]*\s*(?:kg|g|ml))$/i);
  return m ? { title: m[1], unit: m[2] } : { title: name, unit: '' };
};

export const lowestPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));

export const formatPrice = (value: number) =>
  `${value.toFixed(2).replace('.', ',')} KM`;
