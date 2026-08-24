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
        'Porodični med i pčelinji proizvodi iz Mračaja kod Prnjavora. Pčelarska tradicija od 1980.',
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
        'Family honey and bee products from Mračaj near Prnjavor. A beekeeping tradition since 1980.',
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
      badge: 'Porodica Jevtić · pčelari od 1980.',
      heading: 'Porodični med od 1980.',
      description:
        'Iz naših košnica u Mračaju kod Prnjavora — med koji već generacijama punimo i šaljemo direktno iz porodice.',
      ctaProducts: 'Pogledaj medove',
      ctaAbout: 'Naša priča',
      imageAlt: 'Ram sa medom iz sezone 2025, pčelinjak u Mračaju',
      jarAlt: 'Kante s netom istočenim medom',
      captionTitle: 'Mračaj · Prnjavor',
      captionNote: 'Mala serija · bez dodataka',
    },
    en: {
      badge: 'The Jevtic family · beekeepers since 1980',
      heading: 'Family honey since 1980.',
      description:
        'From our hives in Mracaj near Prnjavor — honey our family has harvested, jarred and sent for generations.',
      ctaProducts: 'Explore our honey',
      ctaAbout: 'Our story',
      imageAlt: 'A honey frame from the 2025 season, Mračaj apiary',
      jarAlt: 'Buckets of freshly extracted honey',
      captionTitle: 'Mracaj · Prnjavor',
      captionNote: 'Small batch · no additives',
    },
  } satisfies L<Record<string, string>>,

  aboutPreview: {
    sr: {
      imageAlt: 'Tegla livadskog meda na dlanu, iznad livade',
      imageCaption: 'Ručno · polako · porodično',
      eyebrow: 'Porodično pčelarstvo od 1980.',
      heading: 'Znanje koje se prenosi rukama.',
      description:
        'Pčelarstvo Jevtić nije nastalo kao brend, već kao porodični posao. Znanje se prenosi kroz generacije, a ista pažnja prati svaki korak — od rada oko košnica do punjenja posljednje tegle.',
      steps: ['Pregled košnica', 'Ručno vrcanje', 'Mirno cijeđenje', 'Punjenje tegli'],
      cta: 'Pogledaj proces',
    },
    en: {
      imageAlt: 'A jar of meadow honey held on an open palm above the meadow',
      imageCaption: 'By hand · slowly · as a family',
      eyebrow: 'Family beekeeping since 1980',
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
      heading: 'Ukusi koji se ne zaboravljaju.',
      viewAll: 'Svi proizvodi',
      items: [
        { slug: 'livadski-med-500g', name: 'Livadski Med', note: 'Blag, cvjetan i uravnotežen.' },
        { slug: 'bagremov-med-500g', name: 'Bagremov Med', note: 'Nježan, svijetao i dugo tečan.' },
        {
          slug: 'pcelinji-propolis-20ml',
          name: 'Pčelinji Propolis',
          note: 'Smolast, gorak i koncentrisan.',
        },
        { slug: 'imuno-mix-450g', name: 'Imuno Mix', note: '70% med, 30% cvjetni polen.' },
      ],
    },
    en: {
      eyebrow: 'From our hives',
      heading: 'Flavours you do not forget.',
      viewAll: 'All products',
      items: [
        { slug: 'livadski-med-500g', name: 'Meadow Honey', note: 'Mild, floral and balanced.' },
        { slug: 'bagremov-med-500g', name: 'Acacia Honey', note: 'Delicate, light and slow to crystallize.' },
        {
          slug: 'pcelinji-propolis-20ml',
          name: 'Bee Propolis',
          note: 'Resinous, bitter and concentrated.',
        },
        { slug: 'imuno-mix-450g', name: 'Imuno Mix', note: '70% honey, 30% flower pollen.' },
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
      imageAlt: 'Košnice na prikolici, spremne za seobu',
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
          text: 'Med ima dubinu i miris kao pravi domaći proizvod. Vidi se da iza njega stoji porodica, ne fabrika.',
          author: 'Nikola Jovanović',
          city: 'Prijedor',
        },
      ],
    },
    en: {
      eyebrow: 'Customer words',
      heading: 'Quality is easiest to recognize when tasted.',
      subheading: 'Local recommendations and returning customers',
      imageAlt: 'Hives loaded on the trailer, ready to move',
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
          text: 'The honey has depth and aroma like a true homemade product. You can tell there is a family behind it, not a factory.',
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

  legacy: {
    sr: {
      heading: 'Nasljeđe koje traje od 1980.',
      eyebrow: 'Porodična tradicija',
      body:
        'Naša porodična priča počela je 1980. godine, kada je porodica Jevtić, uz ribarstvo, počela njegovati još jednu granu domaćinstva — pčelarstvo. Od prvih košnica do danas, med proizvodimo strpljivo, poštujući prirodu i znanje koje se prenosi generacijama.',
      chapterEyebrow: '1980 — danas',
      chapterHeading: 'Med.Porodica.Tradicija',
      figureAlt: 'Crtež pčelara koji otvara košnicu',
      archiveAlt: 'Stari snimak reda košnica pod drvećem u pčelinjaku',
      combAlt: 'Komadi saća puni meda u bijeloj posudi, poslije vađenja',
    },
    en: {
      heading: 'A legacy that has lasted since 1980.',
      eyebrow: 'Family tradition',
      body:
        'Our family story began in 1980, when the Jevtić family, alongside fishing, took up one more branch of the household — beekeeping. From the first hives to this day we make honey patiently, respecting nature and the knowledge passed down through generations.',
      chapterEyebrow: '1980 — today',
      chapterHeading: 'Honey.Family.Tradition',
      figureAlt: 'A drawing of a beekeeper opening a hive',
      archiveAlt: 'An old photograph of a row of hives under the trees',
      combAlt: 'Pieces of honeycomb full of honey in a white tray after the harvest',
    },
  } satisfies L<{
    heading: string;
    eyebrow: string;
    body: string;
    chapterEyebrow: string;
    chapterHeading: string;
    figureAlt: string;
    archiveAlt: string;
    combAlt: string;
  }>,

  origin: {
    sr: {
      eyebrow: 'Odakle smo?',
      heading:
        'Naši pčelinjaci nalaze se u Mračaju, Orašju i Otpočivaljci, selima nadomak Prnjavora',
      note:
        'Čist vazduh i očuvana priroda sela nadomak Prnjavora daju našem medu prepoznatljiv miris, boju i ukus.',
      mapAlt: 'Karta opštine Prnjavor sa označenim selima Orašje, Mračaj i Otpočivaljka',
    },
    en: {
      eyebrow: 'Where we are from',
      heading:
        'Our apiaries stand in Mračaj, Orašje and Otpočivaljka, villages just outside Prnjavor',
      note:
        'The clean air and unspoiled nature of the villages around Prnjavor give our honey its distinctive scent, colour and taste.',
      mapAlt: 'A map of the Prnjavor municipality marking Orašje, Mračaj and Otpočivaljka',
    },
  } satisfies L<{
    eyebrow: string;
    heading: string;
    note: string;
    mapAlt: string;
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
            'Bagremov je najblaži, livadski je cvjetan i svakodnevan, a lipov je aromatičan i izražen.',
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
            'Acacia is the mildest, meadow honey is floral and everyday, while linden honey is aromatic and pronounced.',
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
      jarAlt: 'Napunjene tegle meda',
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
      jarAlt: 'Filled jars of honey',
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
    note: 'Mračaj · Prnjavor · od 1980.',
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
    note: 'Mracaj · Prnjavor · since 1980',
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
    note: '1980 — danas',
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
        { year: '1980', title: 'Početak', desc: 'Porodica Jevtić započinje pčelarstvo sa prvih 10 košnica.' },
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
    note: '1980 — today',
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
        { year: '1980', title: 'Beginning', desc: 'The Jevtić family starts beekeeping with the first 10 beehives.' },
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

/*
 * Slika uz svaki korak, redom kojim koraci idu:
 *
 *   1 priprema kosnica  — pcelinjak na livadi, prije nego sto sezona krene
 *   2 oprasivanje       — pcele na cvijetu
 *   3 vrcanje           — ram pun pcela, izvadjen iz kosnice
 *   4 procedjivanje     — kante u kojima se med slijeze
 *   5 punjenje          — tegla puni se ispod slavine
 */
/*
 * Kratak umetak izmedju pcelinjaka i vrcanja: ramovi se prave u kuci, pa to
 * stoji kao zaseban potez a ne kao jos jedan korak u nizu.
 */
export const processFrames = {
  sr: {
    eyebrow: 'Naša ruka',
    heading: 'Ramove pravimo sami',
    body:
      'Sklapamo ih od suve lipovine i jelovine, bez ljepila koje bi mirisalo u košnici. Razmak između satonoša mora biti isti u svakoj košnici — kad ramove praviš sam, ta mjera je tvoja i ne mijenja se od prvog do posljednjeg.',
    altA: 'Ram sa saćem iz sezone 2025',
    altB: 'Ručno otklapanje rama',
  },
  en: {
    eyebrow: 'Our own hand',
    heading: 'We build the frames ourselves',
    body:
      'Assembled from seasoned lime and fir, with no glue that would smell inside the hive. The spacing between top bars has to be identical in every hive — make the frames yourself and that measurement is yours, unchanged from the first to the last.',
    altA: 'A frame of comb from the 2025 season',
    altB: 'Uncapping a frame by hand',
  },
} satisfies L<{
  eyebrow: string;
  heading: string;
  body: string;
  altA: string;
  altB: string;
}>;

export const processStepImages = [
  '/images/real/kosnice-livada.webp',
  '/images/real/pcele-cvijet.webp',
  '/images/real/ram-pcele.webp',
  '/images/real/kante-med.webp',
  '/images/real/punjenje-tegle.webp',
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

// ------------------------------------------------------------ deklaracija ----
// Verbatim from the jar label, so the site and the physical product agree.
export const declaration = {
  sr: {
    eyebrow: 'Sa etikete',
    heading: 'Deklaracija',
    apiaryLabel: 'Broj pčelinjaka',
    apiary: 'RS 0212729',
    locationsLabel: 'Lokacije',
    locations: 'Mračaj, Orašje, Otpočivaljka',
    originLabel: 'Porijeklo',
    origin: 'Republika Srpska',
    usageLabel: 'Način upotrebe',
    usage: 'Kristalizacija je prirodno svojstvo meda. Čuvati na suhom mjestu.',
    labelAlt: 'Etiketa za livadski med, 1 kg',
  },
  en: {
    eyebrow: 'From the label',
    heading: 'Declaration',
    apiaryLabel: 'Apiary number',
    apiary: 'RS 0212729',
    locationsLabel: 'Locations',
    locations: 'Mračaj, Orašje, Otpočivaljka',
    originLabel: 'Origin',
    origin: 'Republika Srpska',
    usageLabel: 'How to use',
    usage: 'Crystallisation is a natural property of honey. Store in a dry place.',
    labelAlt: 'Meadow honey label, 1 kg',
  },
} as const;

// ---------------------------------------------------------- foto-pauze ------

/**
 * Natpisi uz mockup fotografije koje razdvajaju sadrzajne sekcije. Drze se
 * ovde da bi obe jezicke verzije stajale jedna pored druge.
 */
export const photoBreaks = {
  sr: {
    homeHives: {
      caption: 'Naš pčelinjak · Mračaj',
      meta: 'Košnice na livadi',
      altA: 'Red plavih i žutih košnica na livadi ispod brda',
      altB: 'Košnice u visokoj travi, u hladu voćaka',
    },
    aboutHives: {
      caption: 'Isti red košnica, iz godine u godinu',
      meta: 'Mračaj · Prnjavor',
      altA: 'Košnice poredane u hladu drveća na rubu livade',
      altB: 'Red košnica koji se gubi među stablima',
    },
    processHives: {
      caption: 'Odavde počinje svaka tegla',
      meta: 'Pčelinjak u julu',
      altA: 'Košnice na otvorenoj livadi pod vedrim nebom',
      altB: 'Pogled niz red košnica preko livade',
    },
    homeApiary: {
      caption: 'Pčelinjak Mračaj · jutarnja tura',
      meta: 'Sezona 2025.',
      alt: 'Djevojka drži teglu livadskog meda u livadi',
    },
    processLabel: {
      caption: 'Etiketa ide rukom, posljednja',
      meta: 'Teglu po teglu',
      alt: 'Ručno lijepljenje etikete na teglu',
    },
    homeStudio: {
      caption: 'Dvije paše · jedna etiketa',
      meta: 'Neto 500 g',
      alt: 'Tegle bagremovog i livadskog meda poredane u pravilnom rasteru',
    },
    homeTable: {
      caption: 'Sa livade na sto',
      heading: 'Ono što otvorite u decembru istočeno je u avgustu.',
      body:
        'Ne miješamo serije i ne dokupljujemo med. Svaka tegla nosi pašu jednog dijela ljeta, pa se ukus vidljivo mijenja od proljeća do jeseni — i to je namjerno.',
      meta: 'Mračaj · Prnjavor',
      alt: 'Tegle meda na lanenom stolnjaku u livadi pred zalazak sunca',
    },
    homeAcacia: {
      caption: 'Bagrem u cvatu · tegla po tegla',
      meta: 'Bagremov med',
      altCrate: 'Ruke vade teglu bagremovog meda iz drvenog sanduka',
      altBloom: 'Tegla bagremovog meda podignuta prema bagremu u cvatu',
    },
    homeGrass: {
      caption: 'Paša: maslačak, djetelina, livadsko cvijeće',
      meta: 'Bez putujućih košnica',
      alt: 'Tegle meda položene u travu, snimak odozgo',
    },
    productsAcacia: {
      caption: 'Bagrem cvjeta desetak dana · toliko traje i paša',
      meta: 'Sezona bagrema',
      altTree: 'Tegla bagremovog meda pod stablom bagrema u cvatu',
      altHand: 'Tegla bagremovog meda podignuta prema cvjetnim grozdovima',
    },
    productsHarvest: {
      caption: 'Iz sanduka na policu, bez zaustavljanja',
      meta: 'Berba 2025.',
      altStump: 'Tri tegle bagremovog meda na panju, u hladu bagrema',
      altCrate: 'Ruke vade teglu iz drvenog sanduka punog tegli',
    },
    productsSizes: {
      caption: 'Ista serija, tri veličine',
      meta: '0,45 kg · 0,72 kg · 1 kg',
      alt: 'Tegle meda različitih veličina poredane u nizu',
    },
    productsCare: {
      caption: 'Čuvanje',
      heading: 'Kristalizacija nije kvar — to je dokaz da med nije zagrijavan.',
      body:
        'Prirodan med se prije ili kasnije stisne. Dovoljno je da teglu ostavite u mlakoj vodi do 40 °C i vratiće se u tečno stanje, bez gubitka mirisa. Držite je zatvorenu, na sobnoj temperaturi i dalje od sudopere — med vuče vlagu.',
      meta: 'Rok trajanja: dvije godine od punjenja',
      alt: 'Dvije tegle livadskog meda u studijskom svjetlu',
    },
    aboutTools: {
      caption: 'Dimilica, ram, tegla — alat se nije mijenjao',
      meta: 'Mračaj, 1980 — danas',
      alt: 'Tegla meda pored otvorene košnice i dimilice',
    },
    aboutSeasons: {
      caption: 'Ista livada, četiri decenije',
      meta: 'Zora i sumrak nad pčelinjakom',
      altDawn: 'Dvije tegle meda na ogradi u maglovito jutro',
      altDusk: 'Tegle meda na panju obraslom mahovinom',
    },
    processJar: {
      caption: 'Poslije vrcanja teglu punimo istog dana',
      meta: 'Bez pasterizacije, bez filtera pod pritiskom',
      altTap: 'Med curi iz vrcaljke u kantu',
      altJars: 'Redovi napunjenih tegli na stolu, poslije punjenja',
    },
    contactVisit: {
      caption: 'Dođite po med',
      heading: 'Najbolje se kupuje na licu mjesta — uz kafu i obilazak pčelinjaka.',
      body:
        'Javite se dan ranije pa da znamo da vas očekujemo. Pokazaćemo vam košnice, kako se otklapa ram i po čemu se poznaje zrio med. Djeca su dobrodošla, oprema za njih postoji.',
      meta: 'Mračaj bb, Prnjavor · Republika Srpska',
      alt: 'Tegle livadskog meda u studijskom postavu',
    },
    blogSeasons: {
      caption: 'Sve počinje na livadi',
      meta: 'Zapisi iz sezone',
      altMeadow: 'Tegla meda u livadi punoj maslačka',
      altSunset: 'Tegle meda pod krošnjom u zalazak sunca',
    },
  },
  en: {
    homeHives: {
      caption: 'Our apiary · Mračaj',
      meta: 'Hives out on the meadow',
      altA: 'A row of blue and yellow hives on a meadow below the hills',
      altB: 'Hives standing in tall grass in the shade of fruit trees',
    },
    aboutHives: {
      caption: 'The same row of hives, year after year',
      meta: 'Mračaj · Prnjavor',
      altA: 'Hives lined up in the shade of trees at the edge of a meadow',
      altB: 'A row of hives disappearing among the trees',
    },
    processHives: {
      caption: 'Every jar starts here',
      meta: 'The apiary in July',
      altA: 'Hives on an open meadow under a clear sky',
      altB: 'Looking down the row of hives across the meadow',
    },
    homeApiary: {
      caption: 'Mračaj apiary · morning round',
      meta: '2025 season',
      alt: 'A woman holding a jar of meadow honey out in the meadow',
    },
    processLabel: {
      caption: 'The label goes on by hand, last',
      meta: 'One jar at a time',
      alt: 'A label being applied to a jar by hand',
    },
    homeStudio: {
      caption: 'Two forages · one label',
      meta: 'Net 500 g',
      alt: 'Jars of acacia and meadow honey arranged in a repeating grid',
    },
    homeTable: {
      caption: 'From the meadow to the table',
      heading: 'What you open in December was extracted in August.',
      body:
        'We never blend batches and we never buy honey in. Every jar carries the forage of one stretch of summer, so the taste shifts visibly from spring to autumn — and that is deliberate.',
      meta: 'Mračaj · Prnjavor',
      alt: 'Jars of honey on a linen cloth in a meadow at sunset',
    },
    homeAcacia: {
      caption: 'Acacia in bloom · one jar at a time',
      meta: 'Acacia honey',
      altCrate: 'Hands lifting a jar of acacia honey out of a wooden crate',
      altBloom: 'A jar of acacia honey held up against acacia blossom',
    },
    homeGrass: {
      caption: 'Forage: dandelion, clover, meadow flowers',
      meta: 'No migratory hives',
      alt: 'Jars of honey laid in the grass, seen from above',
    },
    productsAcacia: {
      caption: 'Acacia flowers for ten days · the forage lasts as long',
      meta: 'The acacia season',
      altTree: 'A jar of acacia honey beneath an acacia tree in bloom',
      altHand: 'A jar of acacia honey held up against the blossom',
    },
    productsHarvest: {
      caption: 'From the crate to the shelf, without a pause',
      meta: '2025 harvest',
      altStump: 'Three jars of acacia honey on a stump in the shade of the blossom',
      altCrate: 'Hands lifting a jar out of a wooden crate full of jars',
    },
    productsSizes: {
      caption: 'One batch, three sizes',
      meta: '0.45 kg · 0.72 kg · 1 kg',
      alt: 'Jars of honey in several sizes lined up in a row',
    },
    productsCare: {
      caption: 'Keeping it',
      heading: 'Crystallisation is not a fault — it is proof the honey was never heated.',
      body:
        'Raw honey sets sooner or later. Stand the jar in warm water up to 40 °C and it returns to liquid with its aroma intact. Keep it closed, at room temperature and away from the sink — honey draws in moisture.',
      meta: 'Best within two years of jarring',
      alt: 'Two jars of meadow honey in studio light',
    },
    aboutTools: {
      caption: 'Smoker, frame, jar — the tools have not changed',
      meta: 'Mračaj, 1980 — today',
      alt: 'A jar of honey beside an open hive and a smoker',
    },
    aboutSeasons: {
      caption: 'The same meadow, four decades',
      meta: 'Dawn and dusk over the apiary',
      altDawn: 'Two jars of honey on a fence on a misty morning',
      altDusk: 'Jars of honey on a moss-covered stump',
    },
    processJar: {
      caption: 'Once extracted, the honey is jarred the same day',
      meta: 'No pasteurising, no pressure filtering',
      altTap: 'Honey running from the extractor into a bucket',
      altJars: 'Rows of filled jars on the table after bottling',
    },
    contactVisit: {
      caption: 'Come and collect',
      heading: 'The best way to buy is in person — over coffee and a walk round the hives.',
      body:
        'Let us know a day ahead so we can expect you. We will show you the hives, how a frame is uncapped and how ripe honey is recognised. Children are welcome; we have gear their size.',
      meta: 'Mračaj bb, Prnjavor · Republika Srpska',
      alt: 'Jars of meadow honey in a studio arrangement',
    },
    blogSeasons: {
      caption: 'It all starts in the meadow',
      meta: 'Notes from the season',
      altMeadow: 'A jar of honey in a meadow full of dandelions',
      altSunset: 'Jars of honey under a tree at sunset',
    },
  },
};
