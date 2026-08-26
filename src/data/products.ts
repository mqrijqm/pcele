// Cijene su u KM (BAM).
import type { Locale } from '@/i18n/config';

export type Variant = { id: string; title: string; price: number; stock: number };

export type Product = {
  slug: string;
  order: number;
  category: 'honey' | 'other';
  image: string;
  cardBg: string;
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
    image: '/images/proizvodi/bagremov-1kg.webp',
    cardBg: 'var(--shot)',
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
    image: '/images/proizvodi/bagremov-500g.webp',
    cardBg: '#FCF0DC',
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
    image: '/images/mockups/jar-front-studio.webp',
    cardBg: 'var(--shot)',
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
    image: '/images/proizvodi/livadski-500g.webp',
    cardBg: '#FCF0DC',
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
    image: '/images/proizvodi/propolis-20ml.webp',
    // Snimak nosi svoju ravnu podlogu, pa je i kartica te boje — inace bi se
    // vidio pravougaonik fotografije unutar kartice.
    cardBg: '#FCF0DC',
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
    image: '/images/proizvodi/imuno-mix-450g.webp',
    // Kao i kod propolisa: podloga kartice prati podlogu snimka.
    cardBg: '#FCF0DC',
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

export const lowestPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));

export const formatPrice = (value: number) =>
  `${value.toFixed(2).replace('.', ',')} KM`;
