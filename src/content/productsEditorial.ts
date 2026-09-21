import type { Locale } from '@/i18n/config';

/**
 * Sadrzaj editorial strane proizvoda.
 *
 * Strana je zamisljena kao prica o medu, a ne kao webshop spisak, pa je i
 * tekst pisan tako: kratke recenice, bez prodajnih fraza. Sve sto je ovdje
 * privremeno i ceka pravu kopiju stoji uz `TODO`.
 *
 * Engleska verzija nije prevod radi reda — strana /en je ziva strana i mora
 * da izgleda jednako puna.
 */

type Copy = {
  /* 01 — uvodni marquee */
  heroTitle: string;
  heroNote: string;

  /* 02 — fotografia preko cijelog ekrana */
  bannerAlt: string;
  bannerCta: string;

  /* 02b — e-commerce showcase (novi blok poslije heroja) */
  shop: {
    intro: string;
    oval: string;
    headline: string;
    strip: string[];
    products: { slug: string | null; name: string; unit: string }[];
    editorial: { title: string; list: string[] }[];
    final: {
      note: string;
      oval: string;
      title: string;
      cta: string;
    };
    alt: {
      hero: string;
      editorial: string;
      final: string;
    };
  };

  /* 03 — bagremov med */
  bagrem: {
    label: string;
    lede: string;
    facts: { label: string; value: string }[];
  };

  /* 04 — zasto nas bagrem */
  why: {
    title: string;
    imageAlt: string;
    intro: string;
    list: string[];
    outro: string;
  };

  /* 05 — dva krupna naslova */
  features: { title: string; iconAlt: string }[];

  /* 06 — livadski med */
  meadow: {
    label: string;
    heading: string;
    body: string;
    cta: string;
    imageAlt: string;
  };

  /* 07 — ostali proizvodi, rasuti po platnu */
  others: {
    title: string;
    lede: string;
    alt: string;
  };

  /* 08 — proces kroz sezonu */
  season: {
    label: string;
    heading: string;
    steps: { when: string; title: string; body: string }[];
  };

  /* 09 — cuvanje i kristalizacija */
  storage: {
    label: string;
    heading: string;
    body: string;
    facts: { label: string; value: string }[];
  };

  /* 10 — zavrsni poziv */
  cta: {
    title: string;
    button: string;
    alt: string;
  };
};

const sr: Copy = {
  heroTitle: 'Med i pčelinji proizvodi.',
  heroNote: 'Mračaj · Prnjavor · od 1980.',

  bannerAlt: 'Pčelinjak u bagremovoj šumi, rano ljeto',
  bannerCta: 'Pogledaj tegle',

  shop: {
    intro:
      'Pažljivo birani pčelinji proizvodi, nastali u skladu s prirodom. Od čistog livadskog i bagremovog meda do propolisa, perge i pažljivo odabranih proizvoda iz košnice.',
    oval: 'Svi proizvodi',
    headline: 'Više od meda.\nDar prirode\nu svakoj kašici.',
    strip: ['Sirovo vrcano', 'Bez dodataka', 'Direktno iz košnice', 'Mračaj · Prnjavor'],
    products: [
      { slug: 'livadski-med-1kg', name: 'Livadski med', unit: '1 kg' },
      { slug: 'livadski-med-500g', name: 'Livadski med', unit: '500 g' },
      { slug: 'bagremov-med-1kg', name: 'Bagremov med', unit: '1 kg' },
      { slug: 'bagremov-med-500g', name: 'Bagremov med', unit: '500 g' },
      { slug: 'pcelinji-propolis-20ml', name: 'Propolis', unit: 'Pčelinji proizvod' },
      { slug: 'imuno-mix-450g', name: 'Imuno mix', unit: '450 g' },
      // TODO: perga i med u sacu cekaju prave fotografije; dok ne stignu,
      // stoje najblize postojece snimke i vode na spisak proizvoda.
      { slug: null, name: 'Perga', unit: '10 g' },
      { slug: null, name: 'Med u saću', unit: '' },
    ],
    editorial: [
      {
        title: 'Iz košnice,\ndirektno u vaš dom.',
        list: ['Livadski med', 'Bagremov med'],
      },
      {
        title: 'Priroda koju\nmožete okusiti.',
        list: ['Propolis', 'Imuno mix'],
      },
    ],
    final: {
      note:
        'Tegle pakujemo ručno i vozimo sami — dostavu dogovaramo direktno s vama, za veće količine i poklon pakovanja.',
      oval: 'Naruči',
      title: 'Odaberite svoj\nomiljeni proizvod\niz košnice.',
      cta: 'Istražite ponudu',
    },
    alt: {
      hero: 'Red tegli livadskog meda na drvenoj ogradi, u zelenilu',
      editorial: 'Bagremov i livadski med, 1 kg, na drvenom stolu u pčelinjaku',
      final: 'Tegla meda na stolu uz hljeb i sir',
    },
  },

  bagrem: {
    label: 'Bagremov med',
    lede:
      'Bagremov med vrcamo prvi, dok se šuma još bijeli. To je jedini med u godini koji ima svoj rok — desetak dana cvjetanja, i onda ga nema.',
    facts: [
      { label: 'Paša', value: 'Maj–jun' },
      { label: 'Ukus', value: 'Blag' },
      { label: 'Boja', value: 'Svijetlozlatna' },
      { label: 'Kristalizacija', value: 'Spora' },
    ],
  },

  why: {
    title: 'Zašto naš bagrem?',
    imageAlt: 'Bagremova grana u cvatu, uz tegla bagremovog meda',
    intro:
      'Bagrem traje kratko i ne prašta. Ako se paša propusti, nema je do sljedećeg maja. Zato je cijela sezona posložena oko tih desetak dana.',
    list: [
      'Kratka proljetna paša, bez kasnijih vrsta meda',
      'Blag ukus, bez gorčine i bez jakog mirisa',
      'Prirodno svijetla boja, bez zagrijavanja',
      'Bez dodataka, bez boja i bez aroma',
      'Direktno iz našeg pčelinjaka u Mračaju',
    ],
    outro:
      'Med se cijedi na hladno i odležava u tegli, bez zagrijavanja i bez filtriranja pod pritiskom. Zato vremenom kristališe — i to je jedini dokaz da u tegli nije ništa dirano.',
  },

  features: [
    { title: 'Bagremova paša', iconAlt: 'Grana bagrema u cvatu' },
    { title: 'Od košnice do tegle', iconAlt: 'Tegla meda i košnica' },
  ],

  meadow: {
    label: 'Livadski med',
    heading: 'Livada u tegli.',
    body:
      'Livadski med nije jedna paša nego mnogo njih — kamilica, maslačak, djetelina, lipa i sve ono što procvjeta uz njih. Zato mu se ukus mijenja iz sezone u sezonu, i zato ga nikad ne miješamo u istu seriju.',
    cta: 'Livadski med',
    imageAlt: 'Tegla livadskog meda na livadi, u ruci',
  },

  others: {
    title: 'Pčelinji proizvodi.',
    lede:
      'Osim meda, iz košnice izlaze još dvije stvari koje punimo sami: propolis i imuno mix. Male serije, iste košnice.',
    alt: 'Propolis u bočici i imuno mix u tegli',
  },

  season: {
    label: 'Sezona u pčelinjaku',
    heading: 'Godina kod pčela.',
    steps: [
      {
        when: 'Mart–April',
        title: 'Priprema pčelinjaka',
        body:
          'Pregledavamo košnice poslije zime, mijenjamo ramove, čistimo dna i hranimo zajednice koje su oslabile. Do prve paše moraju biti jake.',
      },
      {
        when: 'Maj',
        title: 'Bagremova paša',
        body:
          'Desetak dana, i to je sve. Selimo košnice u bagremovu šumu prije nego što pupoljci puknu i ne diramo ih dok cvijet ne opadne.',
      },
      {
        when: 'Jun–Jul',
        title: 'Livadska paša',
        body:
          'Kad bagrem procvjeta i opadne, pčele prelaze na livade. Ovdje med nije jedna vrsta nego mješavina svega što cvjeta u krugu leta.',
      },
      {
        when: 'Jul',
        title: 'Vrcanje',
        body:
          'Vrcamo samo zatvoreno saće. Ako med nije zreo, ne izlazi iz košnice — vratimo ram i čekamo još koji dan.',
      },
      {
        when: 'Jul–Avgust',
        title: 'Cijeđenje i odležavanje',
        body:
          'Med se cijedi na hladno, kroz cjedilo, bez zagrijavanja. Poslije toga odležava u tanku, dok se ne skine pjena i dok se okus ne slegne.',
      },
      {
        when: 'Avgust',
        title: 'Punjenje',
        body:
          'Punimo ručno, u staklo, iz slavine. Svaka tegla dobija etiketu s brojem serije i pašom iz koje dolazi.',
      },
      {
        when: 'Septembar',
        title: 'Pakovanje',
        body:
          'Tegle idu u kartonska ležišta, po jednu u svaki pretinac, da put ne pređu na staklo o staklo.',
      },
      {
        when: 'Oktobar',
        title: 'Dostava',
        body:
          'Vozimo sami, u dogovoreno vrijeme. Za veće količine se dogovorimo oko lokacije i termina.',
      },
    ],
  },

  storage: {
    label: 'Kako se čuva',
    heading: 'Kristalizacija nije kvar — to je dokaz da med nije zagrijavan.',
    body:
      'Sirov med vremenom stvrdne. Šećeri se vežu u sitne kristale, med posvijetli i postane gušći — to je znak da u njemu nije bilo ni zagrijavanja ni filtriranja pod pritiskom. Teglu držite na sobnoj temperaturi, dalje od sunca i pare. Ako je tvrda, stavi je u mlaku vodu do 40 stepeni i ostavi da se polako vrati.',
    facts: [
      { label: 'Temperatura', value: '15–25 °C' },
      { label: 'Rok', value: 'Bez roka' },
      { label: 'Zagrijavanje', value: 'Ne preko 40 °C' },
    ],
  },

  cta: {
    title: 'Med iz našeg pčelinjaka.',
    button: 'Pogledaj proizvode',
    alt: 'Dvije tegle meda na drvetu, u pčelinjaku',
  },
};

const en: Copy = {
  heroTitle: 'Honey and bee products.',
  heroNote: 'Mracaj · Prnjavor · since 1980.',

  bannerAlt: 'An apiary in an acacia forest, early summer',
  bannerCta: 'See the jars',

  shop: {
    intro:
      'Carefully chosen bee products, made in step with nature. From pure meadow and acacia honey to propolis, bee bread and picks straight from the hive.',
    oval: 'All products',
    headline: 'More than honey.\nA gift of nature\nin every spoonful.',
    strip: ['Raw, unfiltered', 'No additives', 'Straight from the hive', 'Mracaj · Prnjavor'],
    products: [
      { slug: 'livadski-med-1kg', name: 'Meadow honey', unit: '1 kg' },
      { slug: 'livadski-med-500g', name: 'Meadow honey', unit: '500 g' },
      { slug: 'bagremov-med-1kg', name: 'Acacia honey', unit: '1 kg' },
      { slug: 'bagremov-med-500g', name: 'Acacia honey', unit: '500 g' },
      { slug: 'pcelinji-propolis-20ml', name: 'Propolis', unit: 'Bee product' },
      { slug: 'imuno-mix-450g', name: 'Imuno mix', unit: '450 g' },
      // TODO: waiting for real product shots of bee bread and comb honey.
      { slug: null, name: 'Bee bread', unit: '10 g' },
      { slug: null, name: 'Comb honey', unit: '' },
    ],
    editorial: [
      {
        title: 'From the hive,\nstraight to your home.',
        list: ['Meadow honey', 'Acacia honey'],
      },
      {
        title: 'Nature you\ncan taste.',
        list: ['Propolis', 'Imuno mix'],
      },
    ],
    final: {
      note:
        'We pack every jar by hand and deliver it ourselves — delivery is arranged directly with you, for larger quantities and gift packaging.',
      oval: 'Order',
      title: 'Choose your\nfavourite product\nfrom the hive.',
      cta: 'Explore the offer',
    },
    alt: {
      hero: 'A row of meadow honey jars on a wooden railing, in greenery',
      editorial: 'Acacia and meadow honey, 1 kg, on a wooden table in the apiary',
      final: 'A jar of honey on a table with bread and cheese',
    },
  },

  bagrem: {
    label: 'Acacia honey',
    lede:
      'Acacia is the first honey we spin, while the forest is still white. It is the only honey in the year with a deadline — ten days of flowering, and then it is gone.',
    facts: [
      { label: 'Forage', value: 'May–June' },
      { label: 'Taste', value: 'Mild' },
      { label: 'Colour', value: 'Light gold' },
      { label: 'Crystallising', value: 'Slow' },
    ],
  },

  why: {
    title: 'Why our acacia?',
    imageAlt: 'An acacia branch in bloom beside a jar of acacia honey',
    intro:
      'Acacia is short and unforgiving. Miss the forage and it is gone until next May. The whole season is built around those ten days.',
    list: [
      'A short spring forage, with no later honeys mixed in',
      'Mild taste, with no bitterness and no heavy scent',
      'Naturally light colour, never heated',
      'No additives, no colourings, no flavourings',
      'Straight from our apiary in Mracaj',
    ],
    outro:
      'The honey is cold-extracted and left to settle in the jar, with no heating and no pressure filtering. That is why it crystallises in time — and that is the only proof that nothing in the jar has been touched.',
  },

  features: [
    { title: 'A spring forage', iconAlt: 'An acacia branch in bloom' },
    { title: 'From hive to jar', iconAlt: 'A jar of honey and a hive' },
  ],

  meadow: {
    label: 'Meadow honey',
    heading: 'A meadow in a jar.',
    body:
      'Meadow honey is not one forage but many — camomile, dandelion, clover, linden and everything flowering alongside them. Its taste shifts from season to season, and that is why we never blend two years into one batch.',
    cta: 'Meadow honey',
    imageAlt: 'A jar of meadow honey held over a meadow',
  },

  others: {
    title: 'Bee products.',
    lede:
      'Beyond honey, two more things come out of the hive and we pack both ourselves: propolis and imuno mix. Small batches, the same hives.',
    alt: 'Propolis in a dropper bottle and imuno mix in a jar',
  },

  season: {
    label: 'The season in the apiary',
    heading: 'A year with the bees.',
    steps: [
      {
        when: 'March–April',
        title: 'Preparing the apiary',
        body:
          'We go through the hives after winter, swap frames, clean the floors and feed the colonies that came out weak. They have to be strong before the first forage.',
      },
      {
        when: 'May',
        title: 'Acacia forage',
        body:
          'Ten days, and that is all. We move the hives into the acacia forest before the buds open and leave them alone until the blossom falls.',
      },
      {
        when: 'June–July',
        title: 'Meadow forage',
        body:
          'Once the acacia has flowered and dropped, the bees move to the meadows. This honey is not a single variety but a mix of everything in flying range.',
      },
      {
        when: 'July',
        title: 'Extraction',
        body:
          'We only spin sealed comb. If the honey is not ripe it does not leave the hive — the frame goes back and we wait a few more days.',
      },
      {
        when: 'July–August',
        title: 'Straining and settling',
        body:
          'The honey is cold-strained through a sieve, never heated. Then it settles in a tank until the foam is skimmed and the taste has come together.',
      },
      {
        when: 'August',
        title: 'Filling',
        body:
          'We fill by hand, into glass, straight from the tap. Every jar gets a label with its batch number and the forage it came from.',
      },
      {
        when: 'September',
        title: 'Packing',
        body:
          'Jars go into cardboard cradles, one per cell, so they never travel glass against glass.',
      },
      {
        when: 'October',
        title: 'Delivery',
        body:
          'We drive it ourselves, at a time we agree on. For larger quantities we arrange the location and the date together.',
      },
    ],
  },

  storage: {
    label: 'How to keep it',
    heading: 'Crystallising is not spoilage — it is proof the honey was never heated.',
    body:
      'Raw honey sets in time. The sugars bind into fine crystals, the honey lightens and thickens — a sign that it was neither heated nor pressure filtered. Keep the jar at room temperature, away from sun and steam. If it has gone hard, stand it in warm water up to 40 °C and let it come back slowly.',
    facts: [
      { label: 'Temperature', value: '15–25 °C' },
      { label: 'Shelf life', value: 'No expiry' },
      { label: 'Heating', value: 'Never above 40 °C' },
    ],
  },

  cta: {
    title: 'Honey from our apiary.',
    button: 'See the products',
    alt: 'Two jars of honey on wood, in the apiary',
  },
};

export const productsEditorial: Record<Locale, Copy> = { sr, en };

/** Imena polja za `data-image-slot`, na jednom mjestu. */
export const imageSlots = {
  /* Snimak preko cijelog ekrana — ujedno i glavna fotografija bagrema. */
  banner: 'pcelinjak-hero',
  why: 'bagrem-detalj',
  meadow: 'livadski-tegla',
  others: ['propolis', 'imuno-mix', 'livadski-cvijet', 'pcelinjak-let', 'tegle-red'],
  ctaLeft: 'pcelinjak-cta-lijevo',
  ctaRight: 'pcelinjak-cta-desno',
  season: [
    'pcelinjak-proces-01',
    'pcelinjak-proces-02',
    'pcelinjak-proces-03',
    'pcelinjak-proces-04',
    'pcelinjak-proces-05',
    'pcelinjak-proces-06',
    'pcelinjak-proces-07',
    'pcelinjak-proces-08',
  ],
} as const;
