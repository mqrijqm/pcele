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
  /** Koliko se proizvod povecava na kartici (1 = bez promjene). Za tegle koje u svom kadru izgledaju sitno. */
  cardZoom?: number;
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
 * Cijene je 24.9.2026. odredila Marija: livadski 30 / 17 KM, bagremov 32 / 18 KM
 * (bagrem je na trzistu skuplji; cijena od 500 g nije zadata, uzeta je
 * srazmjerno), propolis 5 KM, imuno mix 20 KM. Zalihe su iz ranijeg kataloga.
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
    variants: [{ id: 'bagremov-1kg', title: '1 kg', price: 32, stock: 50 }],
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
    variants: [{ id: 'bagremov-500', title: '500 g', price: 18, stock: 100 }],
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
    variants: [{ id: 'livadski-1kg', title: '1 kg', price: 30, stock: 60 }],
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
    // Tegla od 500 g zauzima samo 60% sirine svog kadra, pa na kartici izgleda sitno.
    cardZoom: 1.22,
    gallery: [
      { src: '/images/products-editorial/meadow-hand.webp', alt: { sr: 'Tegla livadskog meda na dlanu, na livadi', en: 'A jar of meadow honey on a palm, in a meadow' } },
      { src: '/images/products-editorial/jars-railing.webp', alt: { sr: 'Red tegli livadskog meda na drvenoj ogradi', en: 'A row of meadow honey jars on a wooden railing' } },
      { src: '/images/products-editorial/honeys-apiary.webp', alt: { sr: 'Bagremov i livadski med na drvenom stolu u pčelinjaku', en: 'Acacia and meadow honey on a wooden table in the apiary' } },
    ],
    variants: [{ id: 'livadski-500', title: '500 g', price: 17, stock: 120 }],
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
    // Cijena potvrđena (Marija, 24.9.2026). TODO: zaliha je još privremena.
    variants: [{ id: 'propolis-20ml', title: '20 ml', price: 5, stock: 40 }],
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
    // Cijena potvrđena (Marija, 24.9.2026). TODO: zaliha je još privremena.
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
  {
    slug: 'perga-10g',
    order: 7,
    category: 'other',
    // Isjecena slika (samo tegla i malo zraka): u originalu je tegla zauzimala
    // 31% x 28% kadra od 1000x1000 i na kartici je bila jedva vidljiva.
    image: '/images/proizvodi/perga-10g-crop.webp',
    gallery: [
      { src: '/images/real/pcele-cvijet.webp', alt: { sr: 'Pčele na cvijetu kamilice', en: 'Bees on a chamomile flower' } },
      { src: '/images/real/ram-pcele.webp', alt: { sr: 'Ram sa pčelama u pčelinjaku', en: 'A frame with bees in the apiary' } },
      { src: '/images/real/ramovi-sace.webp', alt: { sr: 'Ramovi sa saćem', en: 'Frames with comb' } },
    ],
    // Cijena potvrđena (Marija, 24.9.2026). TODO: zaliha je privremena.
    variants: [{ id: 'perga-10g', title: '10 g', price: 10, stock: 30 }],
    name: {
      sr: 'Perga, 10 g',
      en: 'Bee bread, 10 g',
    },
    tagline: {
      sr: 'Polen iz saća, zrno po zrno',
      en: 'Pollen from the comb, grain by grain',
    },
    description: {
      sr: 'Perga je polen koji pčele same pakuju u ćelije saća, miješaju sa medom i enzimima i ostavljaju da fermentira. Nastane tvrdo, zrnasto zrno blago kiselkastog ukusa, koje se jede kao grickalica ili dodaje kaši, jogurtu i voću. Ne kuva se. Naša perga dolazi iz košnica oko Mračaja. Ko je alergičan na polen ili pčelinje proizvode, neka se prvo posavjetuje sa ljekarom.',
      en: 'Bee bread is pollen that the bees pack into the cells of the comb themselves, mix with honey and enzymes and leave to ferment. What forms is a hard, granular pellet with a mildly sour taste, eaten as a snack or added to porridge, yoghurt and fruit. It is not cooked. Our bee bread comes from the hives around Mračaj. If you are allergic to pollen or bee products, ask your doctor first.',
    },
  },
  {
    slug: 'med-u-sacu',
    order: 8,
    category: 'other',
    image: '/images/proizvodi/med-u-sacu-new.webp',
    gallery: [
      { src: '/images/real/sace-posuda.webp', alt: { sr: 'Komadi saća u posudi', en: 'Pieces of comb in a tray' } },
      { src: '/images/real/sace-u-rukama.webp', alt: { sr: 'Svježe saće u rukama pčelara', en: 'Fresh comb in the hands of a beekeeper' } },
      { src: '/images/products-editorial/medeni-proizvod-3.webp', alt: { sr: 'Saće u tegli meda, u ruci', en: 'Comb in a jar of honey, held in a hand' } },
    ],
    // Cijena potvrđena (Marija, 24.9.2026). TODO: gramaža komada i zaliha nisu
    // zadate — "1 komad" je privremena oznaka, zaliha je privremena.
    variants: [{ id: 'med-u-sacu', title: '1 komad', price: 2, stock: 50 }],
    name: {
      sr: 'Med u saću',
      en: 'Comb honey',
    },
    tagline: {
      sr: 'Med onakav kakav je u košnici',
      en: 'Honey just as it is in the hive',
    },
    description: {
      sr: 'Med u saću nije vrcan. Ostaje u voštanim ćelijama, tačno onako kako su ga pčele zatvorile. Jede se zajedno sa saćem: vosak je jestiv, a što ostane poslije žvakanja slobodno izbacite. Jedite ga sam kao slatki zalogaj, na hljebu, uz sir ili u salati. Čuvajte ga u zatvorenoj posudi, dalje od jakih mirisa, jer med lako upija miris.',
      en: 'Comb honey is not spun. It stays in the wax cells exactly as the bees capped it, and it is eaten together with the comb: the wax is edible, and whatever is left after chewing you can simply spit out. Eat it on its own as a sweet bite, on bread, with cheese or in a salad. Keep it in a closed container away from strong smells, because honey takes up scents easily.',
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
