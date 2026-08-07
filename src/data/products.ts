// Generated from the original site's data. Prices are in KM (BAM).
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

export const products: Product[] = [
  {
    "slug": "bagremov-med",
    "order": 1,
    "category": "honey",
    "image": "/images/products/bagremov-med-brand-v3.webp",
    "cardBg": "#f3e8d6",
    "variants": [
      {
        "id": "bagremov-500",
        "title": "500g",
        "price": 22,
        "stock": 100
      },
      {
        "id": "bagremov-250",
        "title": "250g",
        "price": 14,
        "stock": 100
      },
      {
        "id": "bagremov-1kg",
        "title": "1kg",
        "price": 40,
        "stock": 50
      }
    ],
    "name": {
      "sr": "Bagremov Med",
      "en": "Acacia Honey"
    },
    "tagline": {
      "sr": "Svijetao, blag i elegantan",
      "en": "Light, mild, and elegant"
    },
    "description": {
      "sr": "Naš bagremov med dolazi iz čistih šuma oko Prnjavora, gdje naše pčele sakupljaju nektar sa stoljetnih stabala bagrema. Poznat po svojoj svijetloj boji i nježnom, blagom ukusu, idealan je za svakodnevnu upotrebu i zaslađivanje napitaka.",
      "en": "Our acacia honey comes from the pristine forests around Prnjavor, where our bees collect nectar from centuries-old acacia trees. Known for its light color and gentle, mild taste, it is ideal for everyday use and sweetening beverages."
    }
  },
  {
    "slug": "lipov-med",
    "order": 2,
    "category": "honey",
    "image": "/images/products/lipov-med-brand-v3.webp",
    "cardBg": "#c9dadd",
    "variants": [
      {
        "id": "lipov-500",
        "title": "500g",
        "price": 26,
        "stock": 80
      },
      {
        "id": "lipov-250",
        "title": "250g",
        "price": 16,
        "stock": 100
      },
      {
        "id": "lipov-1kg",
        "title": "1kg",
        "price": 48,
        "stock": 40
      }
    ],
    "name": {
      "sr": "Lipov Med",
      "en": "Linden Honey"
    },
    "tagline": {
      "sr": "Aromatičan med cvjetnog karaktera",
      "en": "Aromatic honey with a floral character"
    },
    "description": {
      "sr": "Lipov med je poznat po svom prepoznatljivom, intenzivnom mirisu i ljekovitim svojstvima. Sakupljen sa lipovih stabala u okolini Mračaja kod Prnjavora, ovaj med je odličan za ublažavanje prehlade i jačanje imuniteta.",
      "en": "Linden honey is known for its distinctive, intense aroma and healing properties. Collected from linden trees around Mračaj near Prnjavor, this honey is excellent for relieving colds and strengthening immunity."
    }
  },
  {
    "slug": "livadski-med",
    "order": 3,
    "category": "honey",
    "image": "/images/products/livadski-med-brand-v3.webp",
    "cardBg": "#d9aa92",
    "variants": [
      {
        "id": "livadski-500",
        "title": "500g",
        "price": 18,
        "stock": 120
      },
      {
        "id": "livadski-250",
        "title": "250g",
        "price": 11,
        "stock": 150
      },
      {
        "id": "livadski-1kg",
        "title": "1kg",
        "price": 32,
        "stock": 60
      }
    ],
    "name": {
      "sr": "Livadski Med",
      "en": "Meadow Honey"
    },
    "tagline": {
      "sr": "Cvjetan, bogat i sezonski",
      "en": "Floral, rich, and seasonal"
    },
    "description": {
      "sr": "Livadski med je naš najpopularniji proizvod. Sakupljen sa raznovrsnih livadskih cvjetova oko Mračaja kod Prnjavora, ovaj med ima bogat, složen ukus koji odražava raznolikost biljnog svijeta naših pčelinjaka.",
      "en": "Meadow honey is our most popular product. Collected from diverse meadow flowers around Mračaj near Prnjavor, this honey has a rich, complex taste that reflects the variety of plant life around our apiaries."
    }
  },
  {
    "slug": "propolis",
    "order": 4,
    "category": "other",
    "image": "/images/products/propolis-brand-v3.webp",
    "cardBg": "#dfe4d7",
    "variants": [
      {
        "id": "propolis-30",
        "title": "30ml",
        "price": 15,
        "stock": 200
      },
      {
        "id": "propolis-50",
        "title": "50ml",
        "price": 22,
        "stock": 150
      }
    ],
    "name": {
      "sr": "Propolis Kapi",
      "en": "Propolis Drops"
    },
    "tagline": {
      "sr": "Prirodni propolis iz naših košnica",
      "en": "Natural propolis from our hives"
    },
    "description": {
      "sr": "Naše propolis kapi su 100% prirodan proizvod, pažljivo pripremljen od propolisa sakupljenog iz naših košnica. Propolis je poznat po svojim antibakterijskim i antivirusnim svojstvima, idealan za jačanje imuniteta.",
      "en": "Our propolis drops are a 100% natural product, carefully prepared from propolis collected from our beehives. Propolis is known for its antibacterial and antiviral properties, ideal for strengthening immunity."
    }
  },
  {
    "slug": "cvjetni-prah",
    "order": 5,
    "category": "other",
    "image": "/images/products/cvjetni-prah-brand-v3.webp",
    "cardBg": "#f3e8d6",
    "variants": [
      {
        "id": "polen-200",
        "title": "200g",
        "price": 12,
        "stock": 100
      },
      {
        "id": "polen-500",
        "title": "500g",
        "price": 25,
        "stock": 60
      }
    ],
    "name": {
      "sr": "Cvjetni Prah",
      "en": "Bee Pollen"
    },
    "tagline": {
      "sr": "Polen pažljivo sušen i pakovan",
      "en": "Carefully dried and packed pollen"
    },
    "description": {
      "sr": "Cvjetni prah (polen) je supernamirnica bogata proteinima, vitaminima i mineralima. Naše pčele sakupljaju polen sa raznovrsnog cvijeća oko Mračaja kod Prnjavora, a mi ga pažljivo sušimo i pakujemo kako bi zadržao sve hranjive vrijednosti.",
      "en": "Bee pollen is a superfood rich in proteins, vitamins, and minerals. Our bees collect pollen from diverse flowers around Mračaj near Prnjavor, and we carefully dry and package it to retain its nutritional value."
    }
  },
  {
    "slug": "sumski-med",
    "order": 6,
    "category": "honey",
    "image": "/images/products/sumski-med-brand-v3.webp",
    "cardBg": "#c9dadd",
    "variants": [
      {
        "id": "sumski-500",
        "title": "500g",
        "price": 24,
        "stock": 70
      },
      {
        "id": "sumski-250",
        "title": "250g",
        "price": 15,
        "stock": 100
      },
      {
        "id": "sumski-1kg",
        "title": "1kg",
        "price": 44,
        "stock": 30
      }
    ],
    "name": {
      "sr": "Šumski Med",
      "en": "Forest Honey"
    },
    "tagline": {
      "sr": "Tamniji, dublji karakter",
      "en": "Darker, deeper character"
    },
    "description": {
      "sr": "Šumski med je tamniji med sa intenzivnim, punim ukusom i visokim sadržajem minerala. Naše pčele ga sakupljaju iz šuma oko Mračaja kod Prnjavora, od medljike i šumskog cvijeća, dajući mu poseban, nezaboravan karakter.",
      "en": "Forest honey is a darker honey with an intense, full taste and high mineral content. Our bees collect it from forests around Mračaj near Prnjavor, from honeydew and forest flowers, giving it a distinctive character."
    }
  }
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const lowestPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));

export const formatPrice = (value: number) =>
  `${value.toFixed(2).replace('.', ',')} KM`;
