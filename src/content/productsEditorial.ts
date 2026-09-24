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

  /* 02 — fotografia preko cijelog ekrana */
  bannerAlt: string;
  bannerCta: string;

  /* 02b — e-commerce showcase (novi blok poslije heroja) */
  shop: {
    eyebrow: string;
    intro: string;
    oval: string;
    headline: string;
    strip: string[];
    products: { slug: string | null; name: string; unit: string }[];
    editorial: { title: string; list: string[] }[];
    final: {
      eyebrow: string;
      note: string;
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
    /* Oznake dugmeta na videu, za čitače ekrana. */
    video: { play: string; pause: string };
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
  heroTitle: 'med i pčelinji proizvodi',

  bannerAlt: 'Pčelinjak u bagremovoj šumi, rano ljeto',
  bannerCta: 'Pogledaj tegle',

  shop: {
    eyebrow: 'Ponuda',
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
        list: ['Propolis', 'Imuno mix', 'Perga', 'Med u saću'],
      },
    ],
    final: {
      note:
        'Tegle pakujemo ručno i vozimo sami — dostavu dogovaramo direktno s vama, za veće količine i poklon pakovanja.',
      eyebrow: 'Dostava',
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
    label: 'Naš med',
    lede:
      'Naš med nastaje kroz cijelu sezonu, od prvog proljetnog cvata do pune ljetne livade. Svaku pašu vrcamo odvojeno, u malim serijama, da u tegli ostanu ukus, miris i karakter mjesta iz kojeg dolazi.',
    facts: [
      { label: 'Pčelinjak', value: 'Mračaj' },
      { label: 'Sezona', value: 'Proljeće–ljeto' },
      { label: 'Obrada', value: 'Bez zagrijavanja' },
      { label: 'Sastav', value: '100% med' },
    ],
  },

  why: {
    title: 'Zašto naš med?',
    imageAlt: 'Ručno otklapanje saća prije vrcanja meda',
    intro:
      'Svaka tegla čuva ono što je sezona stvarno donijela.',
    list: [
      'Vlastiti pčelinjak u Mračaju',
      'Svaka paša čuvana zasebno',
      'Prirodna boja, miris i ukus',
      'Bez dodataka, ručno punjeno',
    ],
    outro:
      'Med cijedimo i ostavljamo da miruje bez zagrijavanja i filtriranja pod pritiskom. Tako u svakoj tegli ostaju prirodna aroma, boja i karakter paše. S vremenom može kristalisati — prirodan proces i znak da med nije nepotrebno obrađivan.',
  },

  features: [
    { title: 'Svaka paša zasebno', iconAlt: 'Grana u cvatu' },
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
    title: 'meden.',
    lede: '',
    alt: 'Propolis u bočici i imuno mix u tegli',
  },

  season: {
    label: 'Sezona u pčelinjaku',
    heading: 'Godina kod pčela.',
    video: { play: 'Pusti video', pause: 'Zaustavi video' },
    steps: [
      {
        when: 'Mart–April',
        title: 'Priprema pčelinjaka',
        body:
          'Pregledavamo košnice poslije zime, mijenjamo ramove, čistimo dna i hranimo zajednice koje su oslabile. Prvi topliji dani pokažu koliko je koja zajednica preživjela zimu. Svaku košnicu otvaramo samo koliko treba, da pčele ne izgube toplotu. Do prve paše moraju biti jake.',
      },
      {
        when: 'Maj',
        title: 'Bagremova paša',
        body:
          'Desetak dana, i to je sve. Selimo košnice u bagremovu šumu prije nego što pupoljci puknu i ne diramo ih dok cvijet ne opadne. Bagrem cvjeta kratko, pa jedan hladan ili kišovit dan može promijeniti cijelu berbu. Zato je bagremov med svake godine mala serija.',
      },
      {
        when: 'Jun–Jul',
        title: 'Livadska paša',
        body:
          'Kad bagrem procvjeta i opadne, pčele prelaze na livade. Ovdje med nije jedna vrsta nego mješavina svega što cvjeta u krugu leta — kamilice, maslačka, djeteline, lipe. Zato se livadski med razlikuje iz godine u godinu, prema tome šta je te sezone najviše cvjetalo. Ne miješamo ga sa medom iz druge sezone.',
      },
      {
        when: 'Jul',
        title: 'Vrcanje',
        body:
          'Vrcamo samo zatvoreno saće. Ako med nije zreo, ne izlazi iz košnice — vratimo ram i čekamo još koji dan. Saće otklapamo ručno, a ramove vrcamo bez zagrijavanja. Svaku pašu vrcamo posebno, da se u tegli ne pomiješa ono što nije trebalo.',
      },
      {
        when: 'Jul–Avgust',
        title: 'Cijeđenje i odležavanje',
        body:
          'Med se cijedi na hladno, kroz cjedilo, bez zagrijavanja. Poslije toga odležava u tanku, dok se ne skine pjena i dok se okus ne slegne. Ne filtriramo ga pod pritiskom, da mu ne oduzmemo ono što nosi iz košnice. Koliko će odležavati ne određuje kalendar nego sam med.',
      },
      {
        when: 'Avgust',
        title: 'Punjenje',
        body:
          'Punimo ručno, u staklo, iz slavine. Svaka tegla dobija etiketu s brojem serije i pašom iz koje dolazi. Punimo u malim serijama, pa uvijek znamo kojoj paši i kojem dijelu sezone pripada svaka tegla. Teglu zatvaramo odmah po punjenju, dok je med čist i miran.',
      },
      {
        when: 'Septembar',
        title: 'Pakovanje',
        body:
          'Tegle idu u kartonska ležišta, po jednu u svaki pretinac, da put ne pređu na staklo o staklo. Etiketu i zaštitu stavljamo rukom, teglu po teglu. Prije nego što krene dalje, svaka tegla se još jednom pregleda. Tako do vas stigne onakva kakva je izašla iz pčelinjaka.',
      },
      {
        when: 'Oktobar–Februar',
        title: 'Zimovanje',
        body:
          'Kad paša prestane, pčele se skupe u zimsku gromadu i miruju. Ostavljamo im dovoljno njihovog meda da preko zime imaju od čega da žive. Košnice ne otvaramo, samo ih obilazimo i slušamo da li su mirne. Zimi popravljamo ramove i opremu, da do proljeća sve bude spremno.',
      },
      {
        when: 'Godinu dana poslije',
        title: 'Tegla na vašem stolu',
        body:
          'Med u tegli i godinu dana poslije ostaje ono što je bio na dan punjenja. S vremenom se šećeri vežu u sitne kristale, med posvijetli i postane gušći — znak da nije zagrijavan. Teglu držite na sobnoj temperaturi, dalje od sunca, a ako se stvrdne, polako je zagrijte u mlakoj vodi. A mi smo tada već opet u pčelinjaku, na početku nove sezone.',
      },
    ],
  },

  storage: {
    label: 'Kako se čuva',
    heading: 'Kristalizacija nije kvar — to je dokaz da med nije zagrijavan.',
    body:
      'Sirov med vremenom stvrdne. Šećeri se vežu u sitne kristale, med posvijetli i postane gušći — to je znak da u njemu nije bilo ni zagrijavanja ni filtriranja pod pritiskom. Teglu držite na sobnoj temperaturi, dalje od sunca i pare. Ako je tvrda, stavite je u mlaku vodu do 40 °C i ostavite da se polako vrati.',
    facts: [
      { label: 'Temperatura', value: '15–25 °C' },
      { label: 'Rok', value: 'Bez roka' },
      { label: 'Zagrijavanje', value: 'Ne preko 40 °C' },
    ],
  },

  cta: {
    title: 'Med iz našeg pčelinjaka.',
    button: 'Pogledaj proizvode',
    alt: 'Dvije tegle meda na drvetu, u pčelinjaku',
  },
};

const en: Copy = {
  heroTitle: 'honey and bee products',

  bannerAlt: 'An apiary in an acacia forest, early summer',
  bannerCta: 'See the jars',

  shop: {
    eyebrow: 'Our range',
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
        list: ['Propolis', 'Imuno mix', 'Bee bread', 'Comb honey'],
      },
    ],
    final: {
      note:
        'We pack every jar by hand and deliver it ourselves — delivery is arranged directly with you, for larger quantities and gift packaging.',
      eyebrow: 'Delivery',
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
    label: 'Our honey',
    lede:
      'Our honey is made across the whole season, from the first spring blossom to the full summer meadow. We extract every forage separately in small batches, keeping the taste, scent and character of its place in every jar.',
    facts: [
      { label: 'Apiary', value: 'Mracaj' },
      { label: 'Season', value: 'Spring–summer' },
      { label: 'Process', value: 'Never heated' },
      { label: 'Contents', value: '100% honey' },
    ],
  },

  why: {
    title: 'Why our honey?',
    imageAlt: 'Honey from our apiary in Mracaj',
    intro:
      'Every jar follows the rhythm of the bees and the plants flowering around our apiary. We do not force the same taste every year — we preserve what the season truly brings.',
    list: [
      'Honey from our own apiary in Mracaj',
      'Every forage extracted and kept separately',
      'The natural colour, scent and taste of each season',
      'No additives, filled by hand',
    ],
    outro:
      'We strain the honey and leave it to settle without heating or pressure filtering. Its natural aroma, colour and the character of each forage remain in every jar. It may crystallise over time — a natural process and a sign that the honey has not been unnecessarily processed.',
  },

  features: [
    { title: 'Each forage kept separate', iconAlt: 'A flowering branch' },
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
    title: 'honey.',
    lede: '',
    alt: 'Propolis in a dropper bottle and imuno mix in a jar',
  },

  season: {
    label: 'The season in the apiary',
    heading: 'A year with the bees.',
    video: { play: 'Play video', pause: 'Pause video' },
    steps: [
      {
        when: 'March–April',
        title: 'Preparing the apiary',
        body:
          'We go through the hives after winter, swap frames, clean the floors and feed the colonies that came out weak. The first warm days show how well each colony got through the cold. We open each hive only as long as we need to, so the bees do not lose their warmth. They have to be strong before the first forage.',
      },
      {
        when: 'May',
        title: 'Acacia forage',
        body:
          'Ten days, and that is all. We move the hives into the acacia forest before the buds open and leave them alone until the blossom falls. Acacia flowers briefly, so a single cold or rainy day can change the whole harvest. That is why acacia honey is a small batch every year.',
      },
      {
        when: 'June–July',
        title: 'Meadow forage',
        body:
          'Once the acacia has flowered and dropped, the bees move to the meadows. This honey is not a single variety but a mix of everything in flying range — camomile, dandelion, clover, linden. That is why meadow honey differs from year to year, by whatever flowered most that season. We never blend it with honey from another season.',
      },
      {
        when: 'July',
        title: 'Extraction',
        body:
          'We only spin sealed comb. If the honey is not ripe it does not leave the hive — the frame goes back and we wait a few more days. We uncap the comb by hand and spin the frames without heating. Every forage is spun separately, so nothing ends up in a jar that should not be there.',
      },
      {
        when: 'July–August',
        title: 'Straining and settling',
        body:
          'The honey is cold-strained through a sieve, never heated. Then it settles in a tank until the foam is skimmed and the taste has come together. We do not pressure-filter it, so it keeps what it brings from the hive. How long it settles is decided by the honey, not the calendar.',
      },
      {
        when: 'August',
        title: 'Filling',
        body:
          'We fill by hand, into glass, straight from the tap. Every jar gets a label with its batch number and the forage it came from. We fill in small batches, so we always know which forage and which part of the season each jar belongs to. The jar is closed right after filling, while the honey is clean and still.',
      },
      {
        when: 'September',
        title: 'Packing',
        body:
          'Jars go into cardboard cradles, one per cell, so they never travel glass against glass. We put on the label and protection by hand, jar by jar. Before it goes any further, every jar is looked over once more. That way it reaches you just as it left the apiary.',
      },
      {
        when: 'October–February',
        title: 'Wintering',
        body:
          'When the forage ends, the bees gather into a winter cluster and rest. We leave them enough of their own honey to live on through the cold. We do not open the hives — we only walk the rows and listen for a calm hum. Winter is also when we mend frames and equipment, so everything is ready by spring.',
      },
      {
        when: 'A year later',
        title: 'The jar on your table',
        body:
          'A year on, the honey in the jar is still what it was on the day we filled it. Over time the sugars bind into fine crystals and the honey lightens and thickens — a sign that it was never heated. Keep the jar at room temperature, away from sun, and if it sets hard, warm it slowly in lukewarm water. By then we are back in the apiary, at the start of a new season.',
      },
    ],
  },

  storage: {
    label: 'How to keep it',
    heading: 'Crystallising is not spoilage — it is proof the honey was never heated.',
    body:
      'Raw honey sets in time. The sugars bind into fine crystals, the honey lightens and thickens — a sign that it was neither heated nor pressure filtered. Keep the jar at room temperature, away from sun and steam. If it has gone hard, stand it in warm water up to 40 °C and let it come back slowly.',
    facts: [
      { label: 'Temperature', value: '15–25 °C' },
      { label: 'Shelf life', value: 'No expiry' },
      { label: 'Heating', value: 'Never above 40 °C' },
    ],
  },

  cta: {
    title: 'Honey from our apiary.',
    button: 'See the products',
    alt: 'Two jars of honey on wood, in the apiary',
  },
};

export const productsEditorial: Record<Locale, Copy> = { sr, en };

/**
 * Snimak uz svaki korak "Godine kod pčela". Redoslijed je isti kao u
 * `season.steps`: mart–april, maj, livadska paša, vrcanje, cijeđenje,
 * punjenje, pakovanje, zimovanje, godinu dana poslije.
 *
 * Video se ne pušta sam — počinje tek kad se klikne na krug. `null` znači da
 * korak još nema snimak i ostaje prazan sivi blok.
 */
export type SeasonMedia =
  | { type: 'image'; src: string }
  | { type: 'video'; src: string; poster: string };

export const seasonMedia: (SeasonMedia | null)[] = [
  { type: 'video', src: '/images/season/mart-april.mp4', poster: '/images/season/mart-april-poster.webp' },
  { type: 'image', src: '/images/season/maj-bagrem.webp' },
  { type: 'image', src: '/images/season/livadska-pasa.webp' },
  { type: 'image', src: '/images/season/vrcanje.webp' },
  { type: 'video', src: '/images/season/jul-avgust.mp4', poster: '/images/season/jul-avgust-poster.webp' },
  /* Napunjene tegle — isti snimak koji stoji iznad podnožja na početnoj. */
  { type: 'image', src: '/images/real/tegle-red.webp' },
  { type: 'image', src: '/images/season/pakovanje.webp' },
  /* TODO: zimovanje — zasad mirni arhivski snimak pčelinjaka; čeka pravu zimsku fotografiju. */
  { type: 'image', src: '/images/real/pcelinjak-arhiva.webp' },
  /* Tegla kod kuće, na stolu. */
  { type: 'image', src: '/images/real/tegla-kafa-sto.webp' },
];

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
    'pcelinjak-proces-09',
  ],
} as const;
