import type { Locale } from '@/i18n/config';

type L<T> = Record<Locale, T>;

/**
 * Page copy as it is actually rendered on the site. A few sections (the home hero
 * above all) use wording that differs from the shared message catalogue, so the
 * literal strings live here instead of in the dictionaries.
 */

export const meta: L<Record<string, { title: string; description: string }>> = {
  sr: {
    home: {
      title: 'Pčelarstvo Jevtić | Tradicija u svakoj kapi',
      description:
        'Porodični med i pčelinji proizvodi iz Mračaja kod Prnjavora. Pčelarska tradicija od 1985.',
    },
    products: { title: 'Naši proizvodi', description: 'Izaberite savršen med za vas' },
    about: {
      title: 'O nama',
      description:
        'Pčelarstvo Jevtić započelo je kao mala porodična djelatnost u mirnom selu Mračaj, u blizini Prnjavora. Kroz tri generacije, prenijeli smo znanje i ljubav prema pčelama, čuvajući tradiciju proizvodnje čistog, prirodnog meda.',
    },
    process: { title: 'Naš proces', description: 'Od košnice do vaše kutije - svaki korak s pažnjom' },
    blog: {
      title: 'Iz našeg pčelinjaka',
      description:
        'Priče o medu, pčelama i sezonskom radu na imanju u Mračaju — pisane iz iskustva tri generacije pčelara.',
    },
    contact: { title: 'Kontaktirajte nas', description: 'Rado ćemo odgovoriti na sva vaša pitanja' },
    terms: {
      title: 'Uslovi kupovine',
      description: 'Pravila koja važe za svaku narudžbu u našoj online prodavnici',
    },
    privacy: {
      title: 'Politika privatnosti',
      description: 'Kako prikupljamo, koristimo i štitimo vaše lične podatke',
    },
    wishlist: { title: 'Lista želja', description: 'Sačuvani proizvodi' },
    account: { title: 'Moj nalog', description: 'Upravljajte svojim nalogom i pregledajte narudžbe.' },
  },
  en: {
    home: {
      title: 'Pčelarstvo Jevtić | Tradition in every drop',
      description:
        'Family honey and bee products from Mračaj near Prnjavor. A beekeeping tradition since 1985.',
    },
    products: { title: 'Our Products', description: 'Choose the perfect honey for you' },
    about: {
      title: 'About Us',
      description:
        'Pčelarstvo Jevtić began as a small family business in the peaceful village of Mračaj, near Prnjavor. Through three generations, we have passed down knowledge and love for bees, preserving the tradition of producing pure, natural honey.',
    },
    process: { title: 'Our Process', description: 'From hive to your jar - every step with care' },
    blog: {
      title: 'From our apiary',
      description:
        'Stories about honey, bees, and seasonal work on the Mračaj homestead — written from three generations of beekeeping experience.',
    },
    contact: { title: 'Contact Us', description: "We're happy to answer all your questions" },
    terms: {
      title: 'Terms of purchase',
      description: 'The rules that apply to every order in our online store',
    },
    privacy: {
      title: 'Privacy policy',
      description: 'How we collect, use, and protect your personal data',
    },
    wishlist: { title: 'Wishlist', description: 'Saved products' },
    account: { title: 'My account', description: 'Manage your account and review your orders.' },
  },
};

// ---------------------------------------------------------------- home -------

export const home = {
  hero: {
    sr: {
      badge: 'Porodica Jevtić · pčelari od 1985.',
      heading: 'Porodični med od 1985.',
      description:
        'Iz naših košnica u Mračaju kod Prnjavora — med koji već generacijama punimo i šaljemo direktno iz porodice.',
      ctaProducts: 'Pogledaj medove',
      ctaAbout: 'Naša priča',
      imageAlt: 'Porodični pregled saća u Mračaju',
      jarAlt: 'Livadski med Pčelarstvo Jevtić',
      captionTitle: 'Mračaj · Prnjavor',
      captionNote: 'Mala serija · bez dodataka',
    },
    en: {
      badge: 'The Jevtic family · beekeepers since 1985',
      heading: 'Family honey since 1985.',
      description:
        'From our hives in Mracaj near Prnjavor — honey our family has harvested, jarred and sent for generations.',
      ctaProducts: 'Explore our honey',
      ctaAbout: 'Our story',
      imageAlt: 'A family hive inspection in Mračaj',
      jarAlt: 'Meadow honey by Pčelarstvo Jevtić',
      captionTitle: 'Mracaj · Prnjavor',
      captionNote: 'Small batch · no additives',
    },
  } satisfies L<Record<string, string>>,

  aboutPreview: {
    sr: {
      imageAlt: 'Ručno otklapanje saća',
      imageCaption: 'Ručno · polako · porodično',
      eyebrow: 'Porodično pčelarstvo od 1985.',
      heading: 'Znanje koje se prenosi rukama.',
      description:
        'Pčelarstvo Jevtić nije nastalo kao brend, već kao porodični posao. Znanje se prenosi kroz generacije, a ista pažnja prati svaki korak — od rada oko košnica do punjenja posljednje tegle.',
      steps: ['Pregled košnica', 'Ručno vrcanje', 'Mirno cijeđenje', 'Punjenje tegli'],
      cta: 'Pogledaj proces',
    },
    en: {
      imageAlt: 'Uncapping the comb by hand',
      imageCaption: 'By hand · slowly · as a family',
      eyebrow: 'Family beekeeping since 1985',
      heading: 'Knowledge passed on by hand.',
      description:
        'Pcelarstvo Jevtic did not begin as a brand, but as a family trade. Knowledge passes from one generation to the next, and the same care follows every step — from tending the hives to filling the last jar.',
      steps: ['Hive care', 'Hand extraction', 'Slow filtering', 'Jar filling'],
      cta: 'See the process',
    },
  } satisfies L<{
    imageAlt: string;
    imageCaption: string;
    eyebrow: string;
    heading: string;
    description: string;
    steps: string[];
    cta: string;
  }>,

  featured: {
    sr: {
      eyebrow: 'Iz naših košnica',
      heading: 'Tri meda. Svaki nosi svoj kraj.',
      viewAll: 'Svi proizvodi',
      items: [
        { slug: 'livadski-med', name: 'Livadski Med', note: 'Blag, cvjetan i uravnotežen.' },
        { slug: 'bagremov-med', name: 'Bagremov Med', note: 'Nježan, svijetao i dugo tečan.' },
        { slug: 'sumski-med', name: 'Šumski Med', note: 'Pun, aromatičan i postojan.' },
      ],
    },
    en: {
      eyebrow: 'From our hives',
      heading: 'Three honeys. Each carries its landscape.',
      viewAll: 'All products',
      items: [
        { slug: 'livadski-med', name: 'Meadow Honey', note: 'Mild, floral and balanced.' },
        { slug: 'bagremov-med', name: 'Acacia Honey', note: 'Delicate, light and slow to crystallize.' },
        { slug: 'sumski-med', name: 'Forest Honey', note: 'Deep, aromatic and lasting.' },
      ],
    },
  } satisfies L<{
    eyebrow: string;
    heading: string;
    viewAll: string;
    items: { slug: string; name: string; note: string }[];
  }>,

  testimonials: {
    sr: {
      eyebrow: 'Riječi kupaca',
      heading: 'Kvalitet se najlakše prepozna kad se proba.',
      subheading: 'Lokalne preporuke i stalni kupci',
      imageAlt: 'Tegla meda u rukama',
      quotes: [
        {
          text: 'Livadski med uzimam za čaj i kolače. Stigne lijepo upakovan i uvijek istog kvaliteta.',
          author: 'Ana Kovačević',
          city: 'Doboj',
        },
        {
          text: 'Bagremov med je čist, blag i bez onog teškog ukusa koji često osjetim kod industrijskog meda.',
          author: 'Marija Petrović',
          city: 'Banja Luka',
        },
        {
          text: 'Šumski med ima dubinu i miris kao pravi domaći proizvod. Vidi se da iza njega stoji porodica, ne fabrika.',
          author: 'Nikola Jovanović',
          city: 'Prijedor',
        },
      ],
    },
    en: {
      eyebrow: 'Customer words',
      heading: 'Quality is easiest to recognize when tasted.',
      subheading: 'Local recommendations and returning customers',
      imageAlt: 'A jar of honey held in two hands',
      quotes: [
        {
          text: 'I buy meadow honey for tea and cakes. It arrives nicely packed and always with the same quality.',
          author: 'Ana Kovačević',
          city: 'Doboj',
        },
        {
          text: 'The acacia honey is clean, mild, and without the heavy taste I often notice in industrial honey.',
          author: 'Marija Petrović',
          city: 'Banja Luka',
        },
        {
          text: 'The forest honey has depth and aroma like a true homemade product. You can tell there is a family behind it, not a factory.',
          author: 'Nikola Jovanović',
          city: 'Prijedor',
        },
      ],
    },
  } satisfies L<{
    eyebrow: string;
    heading: string;
    subheading: string;
    imageAlt: string;
    quotes: { text: string; author: string; city: string }[];
  }>,

  faq: {
    sr: {
      eyebrow: 'O medu',
      heading: 'Mala pitanja prije prve tegle.',
      intro: 'Kratki odgovori o čuvanju, kristalizaciji i tome šta se nalazi u našim teglama.',
      items: [
        {
          question: 'Kako čuvati med?',
          answer:
            'Čuvajte ga na sobnoj temperaturi, zatvorenog i dalje od direktnog sunca. Frižider nije potreban jer hladnoća ubrzava kristalizaciju.',
        },
        {
          question: 'Da li prirodan med kristališe?',
          answer:
            'Da. Kristalizacija je prirodan proces i ne znači da je med pokvaren. Teglu možete lagano zagrijati u toploj vodi do 40°C.',
        },
        {
          question: 'Da li dodajete šećer ili aditive?',
          answer:
            'Ne. Med punimo bez suvišnih dodataka, mirisa, boja ili konzervansa. Karakter zavisi od paše i sezone.',
        },
        {
          question: 'Koji med izabrati za početak?',
          answer:
            'Bagremov je najblaži, livadski je cvjetan i svakodnevan, a šumski je tamniji i intenzivniji.',
        },
      ],
    },
    en: {
      eyebrow: 'About honey',
      heading: 'Small questions before the first jar.',
      intro: 'Straight answers about storage, crystallization, and what goes into every jar.',
      items: [
        {
          question: 'How should honey be stored?',
          answer:
            'Store it closed at room temperature and away from direct sunlight. Refrigeration is not needed because cold speeds crystallization.',
        },
        {
          question: 'Does natural honey crystallize?',
          answer:
            'Yes. Crystallization is natural and does not mean the honey is spoiled. You can gently warm the jar in water up to 40°C.',
        },
        {
          question: 'Do you add sugar or additives?',
          answer:
            'No. We pack honey without unnecessary additives, aromas, colors, or preservatives. Its character depends on forage and season.',
        },
        {
          question: 'Which honey should I try first?',
          answer:
            'Acacia is the mildest, meadow honey is floral and everyday, while forest honey is darker and more intense.',
        },
      ],
    },
  } satisfies L<{
    eyebrow: string;
    heading: string;
    intro: string;
    items: { question: string; answer: string }[];
  }>,

  newsletter: {
    sr: {
      eyebrow: 'Naruči direktno',
      heading: 'Prva tegla je najbolji način da nas upoznate.',
      description:
        'Pogledajte dostupne vrste meda ili nam pošaljite poruku za količine, poklon pakovanja i sezonske serije.',
      ctaProducts: 'Pogledaj proizvode',
      ctaContact: 'Kontakt',
      placeholder: 'Email za sezonske novosti',
      join: 'Prijavi se',
      sending: 'Slanje...',
      joined: 'Upisano',
      success: 'Hvala na prijavi! Sezonske novosti stižu na vaš email.',
      jarAlt: 'Bagremov med',
    },
    en: {
      eyebrow: 'Order direct',
      heading: 'The first jar is the best way to know us.',
      description:
        'Browse available honey types or message us for quantities, gift packaging, and seasonal batches.',
      ctaProducts: 'View products',
      ctaContact: 'Contact',
      placeholder: 'Email for seasonal news',
      join: 'Join',
      sending: 'Sending...',
      joined: 'Subscribed',
      success: 'Thanks for joining! Seasonal news is on its way to your inbox.',
      jarAlt: 'Acacia honey',
    },
  } satisfies L<Record<string, string>>,
};

// ------------------------------------------------------------ products -------

export const productsPage = {
  sr: {
    eyebrow: 'Naša kolekcija',
    heading: 'Med i pčelinji proizvodi.',
    description:
      'Mala sezonska proizvodnja, jasne vrste meda i proizvodi koje punimo direktno iz našeg pčelinjaka.',
    note: 'Mračaj · Prnjavor · od 1985.',
    heroAlt: 'Saće i med',
    trustFeatures: [
      { title: 'Dostava', desc: 'Dogovor za lokaciju i količinu' },
      { title: 'Čist sastav', desc: 'Bez aditiva i boja' },
      { title: 'Poklon pakovanje', desc: 'Za slavlja i poslovne poklone' },
      { title: 'Sezonske serije', desc: 'Okus zavisi od paše' },
    ],
  },
  en: {
    eyebrow: 'Our collection',
    heading: 'Honey and bee products.',
    description:
      'Small seasonal production, clear honey types, and products packed directly from our apiary.',
    note: 'Mracaj · Prnjavor · since 1985',
    heroAlt: 'Honeycomb and honey',
    trustFeatures: [
      { title: 'Delivery', desc: 'Arranged by location and quantity' },
      { title: 'Clean composition', desc: 'No additives or colors' },
      { title: 'Gift packaging', desc: 'For celebrations and business gifts' },
      { title: 'Seasonal batches', desc: 'Taste follows the forage' },
    ],
  },
} satisfies L<{
  eyebrow: string;
  heading: string;
  description: string;
  note: string;
  heroAlt: string;
  trustFeatures: { title: string; desc: string }[];
}>;

// --------------------------------------------------------------- about -------

export const aboutPage = {
  sr: {
    eyebrow: 'Naša priča',
    heading: 'Četiri decenije. Isti posao.',
    description:
      'Pčelarstvo Jevtić počelo je kao porodični posao u Mračaju kod Prnjavora. Tako ga vodimo i danas.',
    note: '1985 — danas',
    heroAlt: 'Naše košnice na livadi',
    features: [
      { title: 'Netaknuta priroda', desc: 'Naše pčele lete nad livadama i šumama oko Mračaja' },
      { title: '100% prirodno', desc: 'Bez aditiva, konzervansa ili umjetnih sastojaka' },
      { title: 'Vrhunski kvalitet', desc: 'Tradicionalne metode garantuju najbolji ukus' },
    ],
    tradition: {
      eyebrow: 'Porodična tradicija',
      heading: 'Priča koja traje generacijama',
      paragraphs: [
        'U selu Mračaj kod Prnjavora, okruženi šumama i livadama ovog kraja, naša porodica već četiri decenije njeguje pčelarsku tradiciju.',
        'Svaka kap našeg meda nosi priču o posvećenosti, strpljenju i dubokom poštovanju prema prirodi. Naše pčele slobodno lete nad livadama punim divljeg cvijeća, sakupljajući nektar koji se pretvara u najčistiji med.',
      ],
    },
    journey: {
      eyebrow: 'Naš put',
      heading: 'Kroz godine',
      timeline: [
        { year: '1985', title: 'Početak', desc: 'Porodica Jevtić započinje pčelarstvo sa prvih 10 košnica.' },
        { year: '1995', title: 'Širenje', desc: 'Proširenje na 50 košnica i prvi prodaja na lokalnom tržištu.' },
        { year: '2010', title: 'Modernizacija', desc: 'Usvajanje modernih tehnika uz očuvanje tradicije.' },
        { year: '2024', title: 'Danas', desc: 'Preko 200 košnica i dostava širom zemlje.' },
      ],
    },
    values: {
      eyebrow: 'Naše vrijednosti',
      heading: 'Ono u šta vjerujemo',
      items: [
        { title: 'Tradicija', desc: 'Tri generacije znanja i iskustva u pčelarstvu' },
        { title: 'Kvalitet', desc: 'Samo čist, prirodan med bez ikakvih dodataka' },
        { title: 'Priroda', desc: 'Pčele slobodno pasu po netaknutim livadama i šumama' },
        { title: 'Porodica', desc: 'Svaki proizvod napravljen s ljubavlju i pažnjom' },
      ],
    },
    location: {
      eyebrow: 'Naša lokacija',
      heading: 'Mračaj, Prnjavor',
      description:
        'Naši pčelinjaci nalaze se u selu Mračaj kod Prnjavora, okruženi šumama, livadama i raznovrsnom florom ovog kraja.',
      note: 'Republika Srpska · Bosna i Hercegovina',
      mapAlt: 'Mapa regije',
    },
  },
  en: {
    eyebrow: 'Our Story',
    heading: 'Four decades. The same craft.',
    description:
      'Jevtic Beekeeping began as a family trade in Mracaj near Prnjavor. That is how we still run it today.',
    note: '1985 — today',
    heroAlt: 'Our beehives on the meadow',
    features: [
      { title: 'Pristine Nature', desc: 'Our bees forage across the meadows and forests around Mračaj' },
      { title: '100% Natural', desc: 'No additives, preservatives, or artificial ingredients' },
      { title: 'Premium Quality', desc: 'Traditional methods guarantee the best taste' },
    ],
    tradition: {
      eyebrow: 'Family Tradition',
      heading: 'A story spanning generations',
      paragraphs: [
        'In the village of Mračaj near Prnjavor, surrounded by the forests and meadows of the area, our family has continued its beekeeping tradition for four decades.',
        'Every drop of our honey carries a story of dedication, patience, and deep respect for nature. Our bees roam freely over meadows full of wildflowers, collecting nectar that transforms into the purest honey.',
      ],
    },
    journey: {
      eyebrow: 'Our Journey',
      heading: 'Through the Years',
      timeline: [
        { year: '1985', title: 'Beginning', desc: 'The Jevtić family starts beekeeping with the first 10 beehives.' },
        { year: '1995', title: 'Expansion', desc: 'Expansion to 50 beehives and first sales at the local market.' },
        { year: '2010', title: 'Modernization', desc: 'Adopting modern techniques while preserving tradition.' },
        { year: '2024', title: 'Today', desc: 'Over 200 beehives and delivery nationwide.' },
      ],
    },
    values: {
      eyebrow: 'Our Values',
      heading: 'What We Believe In',
      items: [
        { title: 'Tradition', desc: 'Three generations of beekeeping knowledge and experience' },
        { title: 'Quality', desc: 'Only pure, natural honey without any additives' },
        { title: 'Nature', desc: 'Bees freely forage in pristine meadows and forests' },
        { title: 'Family', desc: 'Every product made with love and care' },
      ],
    },
    location: {
      eyebrow: 'Our Location',
      heading: 'Mračaj, Prnjavor',
      description:
        'Our apiaries are located in the village of Mračaj near Prnjavor, surrounded by the forests, meadows, and varied flora of the area.',
      note: 'Republika Srpska · Bosna i Hercegovina',
      mapAlt: 'Map of the region',
    },
  },
};

// ------------------------------------------------------------- process -------

export const processPage = {
  sr: {
    eyebrow: 'Od košnice do tegle',
    heading: 'Naš proces',
    description: 'Od košnice do vaše kutije - svaki korak s pažnjom',
    note: 'Pet koraka. Bez prečica.',
    heroAlt: 'Naš proces',
    sectionEyebrow: 'Kako radimo',
    sectionHeading: 'Pažnja se vidi u svakom koraku.',
    steps: [
      {
        title: 'Priprema košnica',
        desc: 'Na proljeće pripremamo košnice za novu sezonu, osiguravajući zdravlje pčela i optimalne uslove za proizvodnju meda.',
      },
      {
        title: 'Oprašivanje i sakupljanje',
        desc: 'Naše pčele slobodno lete po livadama i šumama oko Mračaja, sakupljajući nektar sa bagrema, lipe i raznovrsnog livadskog cvijeća.',
      },
      {
        title: 'Vrcanje meda',
        desc: 'Pažljivo vrcamo med u pravo vrijeme, kad je saće zatvoreno i med dostigao savršenu zrelost.',
      },
      {
        title: 'Proceđivanje',
        desc: 'Med se nježno procjeđuje kako bi se uklonile nečistoće, zadržavajući sve prirodne enzime i hranljive tvari.',
      },
      {
        title: 'Punjenje i pakovanje',
        desc: 'Ručno punimo staklene tegle i pripremamo proizvod za vas - čist, prirodan, onakav kakav treba biti.',
      },
    ],
    outroEyebrow: 'Poslije procesa',
    outroHeading: 'Ostaje čista tegla meda.',
    outroCta: 'Pogledaj medove',
  },
  en: {
    eyebrow: 'From hive to jar',
    heading: 'Our Process',
    description: 'From hive to your jar - every step with care',
    note: 'Five steps. No shortcuts.',
    heroAlt: 'Our process',
    sectionEyebrow: 'How we work',
    sectionHeading: 'Care shows in every step.',
    steps: [
      {
        title: 'Hive Preparation',
        desc: 'In spring, we prepare the hives for the new season, ensuring bee health and optimal conditions for honey production.',
      },
      {
        title: 'Pollination & Collection',
        desc: 'Our bees freely fly across the meadows and forests around Mračaj, collecting nectar from acacia, linden, and diverse wildflowers.',
      },
      {
        title: 'Honey Harvest',
        desc: 'We carefully extract honey at the right time, when the comb is sealed and the honey has reached perfect maturity.',
      },
      {
        title: 'Filtering',
        desc: 'The honey is gently filtered to remove impurities while preserving all natural enzymes and nutrients.',
      },
      {
        title: 'Bottling & Packaging',
        desc: 'We hand-fill glass jars and prepare the product for you - pure, natural, just as it should be.',
      },
    ],
    outroEyebrow: 'After the process',
    outroHeading: 'What remains is a pure jar of honey.',
    outroCta: 'Explore our honey',
  },
};

export const processStepImages = [
  '/images/blog/spring-apiary-v1.webp',
  '/images/hero/apiary-documentary-v1.webp',
  '/images/editorial/family-hive-frame-v1.webp',
  '/images/apiary/honey-buckets-optimized.webp',
  '/images/products/livadski-med-brand-v3.webp',
];

// ---------------------------------------------------------------- blog -------

export const blogPage = {
  sr: {
    eyebrow: 'Blog',
    heading: 'Iz našeg pčelinjaka',
    description:
      'Priče o medu, pčelama i sezonskom radu na imanju u Mračaju — pisane iz iskustva tri generacije pčelara.',
    note: 'Pčelinjak · sezona · porodica',
    heroAlt: 'Košnice u pčelinjaku',
  },
  en: {
    eyebrow: 'Blog',
    heading: 'From our apiary',
    description:
      'Stories about honey, bees, and seasonal work on the Mračaj homestead — written from three generations of beekeeping experience.',
    note: 'Apiary · season · family',
    heroAlt: 'Beehives in the apiary',
  },
};

// ------------------------------------------------------------- contact -------

export const contactPage = {
  sr: {
    eyebrow: 'Informacije',
    heading: 'Kontaktirajte nas',
    description: 'Rado ćemo odgovoriti na sva vaša pitanja',
    note: 'Mračaj · Prnjavor',
    heroAlt: 'Mapa regije Mračaj, Prnjavor',
  },
  en: {
    eyebrow: 'Information',
    heading: 'Contact Us',
    description: "We're happy to answer all your questions",
    note: 'Mračaj · Prnjavor',
    heroAlt: 'Map of the Mračaj, Prnjavor region',
  },
};
