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
    products: {
      title: 'Naši proizvodi',
      description:
        'Bagremov i livadski med, propolis i imuno mješavina iz našeg pčelinjaka u Mračaju. Male serije, sirovo vrcano, bez dodataka.',
    },
    about: {
      title: 'O nama',
      description:
        'Pčelarstvo Jevtić započelo je kao mala porodična djelatnost u mirnom selu Mračaj, u blizini Prnjavora. Kroz tri generacije, prenijeli smo znanje i ljubav prema pčelama, čuvajući tradiciju proizvodnje čistog, prirodnog meda.',
    },
    process: {
      title: 'Naš proces',
      description:
        'Od košnice do vaše tegle — kako vrcamo, cijedimo i punimo med u našem pčelinjaku u Mračaju, korak po korak i bez prečica.',
    },
    blog: {
      title: 'Iz našeg pčelinjaka',
      description:
        'Priče o medu, pčelama i sezonskom radu na imanju u Mračaju — pisane iz iskustva tri generacije pčelara.',
    },
    contact: {
      title: 'Kontaktirajte nas',
      description:
        'Javite se za količine, poklon pakovanja, veleprodaju ili posjetu pčelinjaku u Mračaju kod Prnjavora. Rado ćemo odgovoriti na sva pitanja.',
    },
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
    cart: { title: 'Korpa', description: 'Artikali spremni za narudžbu' },
  },
  en: {
    home: {
      title: 'Pčelarstvo Jevtić | Tradition in every drop',
      description:
        'Family honey and bee products from Mračaj near Prnjavor. A beekeeping tradition since 1980.',
    },
    products: {
      title: 'Our Products',
      description:
        'Acacia and meadow honey, propolis and an immune blend from our apiary in Mračaj. Small batches, raw-spun, nothing added.',
    },
    about: {
      title: 'About Us',
      description:
        'Pčelarstvo Jevtić began as a small family business in the peaceful village of Mračaj, near Prnjavor. Through three generations, we have passed down knowledge and love for bees, preserving the tradition of producing pure, natural honey.',
    },
    process: {
      title: 'Our Process',
      description:
        'From hive to your jar — how we spin, strain and fill honey at our apiary in Mračaj, step by step and with no shortcuts.',
    },
    blog: {
      title: 'From our apiary',
      description:
        'Stories about honey, bees, and seasonal work on the Mračaj homestead — written from three generations of beekeeping experience.',
    },
    contact: {
      title: 'Contact Us',
      description:
        "Get in touch about quantities, gift packaging, wholesale or a visit to our apiary in Mračaj near Prnjavor. We're happy to answer any question.",
    },
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
    cart: { title: 'Cart', description: 'Items ready for checkout' },
  },
};

/*
 * Kontakt: ploha u medenom tonu po uzoru na meracinque contact — marquee
 * naslov, uvod i kontakt pillovi lijevo, forma desno. Forma šalje na
 * /api/contact; dok mejl servis nije podešen pada nazad na mailto, pa su
 * ovdje i tekstovi koji ga pune.
 */
export const simplePages = {
  kontakt: {
    sr: {
      heading: 'Kontakt',
      intro: [
        'Prodajemo direktno iz pčelinjaka — male serije, tegla po tegla.',
        'Javite se za količine, poklon pakovanja',
        'i sezonske serije. Rado ćemo vas čuti!',
      ],
      email: 'pcelarstvojevtic@gmail.com',
      phone: '+387 66 030 550',
      form: {
        firstName: 'Ime',
        lastName: 'Prezime',
        email: 'Email',
        phone: 'Telefon',
        interest: 'Šta vas zanima?',
        interests: ['Kupovina meda', 'Poklon pakovanje', 'Saradnja i veleprodaja', 'Posjeta pčelinjaku', 'Nešto drugo'],
        selectPlaceholder: 'Izaberite…',
        message: 'Poruka',
        privacy: 'Izjavljujem da sam pročitao/la i prihvatam',
        privacyLink: 'Politiku privatnosti',
        submit: 'Pošalji upit',
        success: 'Hvala! Upit je poslan — javljamo se uskoro.',
        subject: 'Upit sa sajta — Pčelarstvo Jevtić',
        sending: 'Šaljem…',
        fallback:
          'Otvorili smo vaš mail program s pripremljenom porukom — samo je tamo pošaljite.',
        error: 'Slanje nije uspjelo. Pokušajte ponovo ili nam pišite direktno na',
        errors: {
          required: 'Ovo polje je obavezno.',
          email: 'Unesite ispravnu email adresu.',
          phone: 'Unesite ispravan broj telefona.',
          tooLong: 'Tekst je predugačak.',
          consent: 'Potrebna je vaša saglasnost da bismo nastavili.',
        },
      },
    },
    en: {
      heading: 'Contact',
      intro: [
        'We sell straight from the apiary — small batches, jar by jar.',
        'Reach out for quantities, gift packaging',
        'and seasonal batches. We would love to hear from you!',
      ],
      email: 'pcelarstvojevtic@gmail.com',
      phone: '+387 66 030 550',
      form: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        interest: "What's your interest?",
        interests: ['Buying honey', 'Gift packaging', 'Partnership & wholesale', 'Visiting the apiary', 'Something else'],
        selectPlaceholder: 'Select…',
        message: 'Message',
        privacy: 'I declare that I have read and accept the',
        privacyLink: 'Privacy Policy',
        submit: 'Send request',
        success: 'Thank you! Your inquiry is on its way — we will get back to you soon.',
        subject: 'Website inquiry — Pčelarstvo Jevtić',
        sending: 'Sending…',
        fallback: 'We opened your mail app with the message ready — just send it from there.',
        error: 'Sending failed. Please try again or write to us directly at',
        errors: {
          required: 'This field is required.',
          email: 'Please enter a valid email address.',
          phone: 'Please enter a valid phone number.',
          tooLong: 'This text is too long.',
          consent: 'We need your consent to continue.',
        },
      },
    },
  } satisfies L<{
    heading: string;
    intro: readonly string[];
    email: string;
    phone: string;
    form: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      interest: string;
      interests: readonly string[];
      selectPlaceholder: string;
      message: string;
      privacy: string;
      privacyLink: string;
      submit: string;
      success: string;
      subject: string;
      sending: string;
      fallback: string;
      error: string;
      errors: {
        required: string;
        email: string;
        phone: string;
        tooLong: string;
        consent: string;
      };
    };
  }>,
};

/*
 * Kolačići. Korpa i lista želja čuvaju se u browseru (localStorage) i rade bez
 * ikakve saglasnosti; pita se samo za mjerenje posjeta. Tekst je namjerno
 * kratak i tačan — obećava samo ono što sajt zaista radi.
 */
export const cookieConsent = {
  sr: {
    title: 'Kolačići i mjerenje posjeta',
    text: 'Korpa i lista želja rade i bez kolačića. Uz vašu saglasnost anonimno mjerimo posjete — da vidimo šta se čita, a šta ne. Bez reklama i bez dijeljenja podataka.',
    necessary: 'Samo neophodno',
    accept: 'Prihvatam mjerenje',
    more: 'Politika privatnosti',
    settings: 'Podešavanja kolačića',
  },
  en: {
    title: 'Cookies and visit measurement',
    text: 'The cart and wishlist work without cookies. With your consent we measure visits anonymously — to see what gets read and what does not. No ads, and no data is shared.',
    necessary: 'Necessary only',
    accept: 'Accept measurement',
    more: 'Privacy policy',
    settings: 'Cookie settings',
  },
} satisfies L<{
  title: string;
  text: string;
  necessary: string;
  accept: string;
  more: string;
  settings: string;
}>;

// ---------------------------------------------------------------- home -------

export const home = {
  /*
   * Znak "Okusi slast" stoji u tri sekcije — livadski, propolis, bagremov — i
   * u sve tri vodi na isto mjesto. Natpis veze zato stoji jednom, ovdje, a ne
   * triput uz svaku sekciju: da se tri ista poziva ne mogu razici.
   *
   * `znakAlt` uz svaku sekciju i dalje kaze sta na znaku pise; ovo kaze kuda
   * vodi. Citac ekrana cita oboje, u tom redu.
   */
  znakCta: {
    sr: 'pogledaj proizvode',
    en: 'see the products',
  } satisfies L<string>,

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

  /*
   * Izdvojeni proizvodi: tri reda u kojima je tegla (bocica) glavna, pa mreza
   * svojstava pod njima.
   *
   * Sekcija stoji odmah iza heroja, prije price — prvo se vidi sta se nudi, pa
   * odakle dolazi. Ime, mjere i cinjenice se ne prepisuju iz `data/products.ts`
   * nego se odatle citaju; ovdje stoje samo rijeci koje taj katalog nema.
   */
  izdvojeno: {
    sr: {
      eyebrow: 'Izdvojeno iz pčelinjaka',
      heading: 'Ono što izlazi iz naših košnica.',
      intro:
        'Dvije sorte meda iz berbe 2026. i propolis iz istih košnica — sve što vrcamo i cijedimo, na jednom mjestu.',
      svi: 'Svi proizvodi',
      cta: 'Pogledaj proizvod',
      mreza: {
        heading: 'Zašto ovaj med',
        fotoNatpis: 'Naš pčelinjak u Mračaju · od 1980.',
        fotoAlt: 'Tegla bagremovog meda na košnici, iza nje livada i brda',
        plocice: [
          {
            naslov: '100% prirodno',
            tekst: 'Bez dodataka, boja i konzervansa — u tegli je samo ono što su pčele donijele.',
          },
          {
            naslov: 'Sirovo vrcano',
            tekst: 'Med ne grijemo i ne filtriramo; teče iz saća pravo u teglu.',
          },
          {
            naslov: 'Bez dodanog šećera',
            tekst: 'Ni sirup, ni aroma, ni konzervans.',
          },
          {
            naslov: 'Bagrem — paša maj–jun',
            tekst: 'Svijetlozlatna, blaga i gotovo prozirna; ostaje tečna i preko zime.',
          },
          {
            naslov: 'Livada — paša jun–jul',
            tekst: 'Cvjetna i puna, iz mnogo različitih cvjetova; do zime kristališe.',
          },
        ],
      },
      proizvod: {
        bagremov: {
          eyebrow: 'Prva paša · maj–jun',
          ime: 'Bagremov med',
          podnaslov: 'Blag, svijetao i prve paše.',
          tekst:
            'Prva berba u godini, sa kratkog bagremovog cvata. Gotovo proziran i blagog ukusa, pa ne pokriva ono uz šta ide — zato stoji uz čaj i palačinke. Ostaje tečan i preko zime.',
          cinjenice: [
            { oznaka: 'UKUS', vrijednost: 'Blag, cvjetni' },
            { oznaka: 'BOJA', vrijednost: 'Svijetlozlatna' },
            { oznaka: 'PAŠA', vrijednost: 'Maj–jun' },
          ],
          etiketa: 'Berba 2026',
          slikaAlt: 'Tegla bagremovog meda u ruci, iznad košnica u sumrak',
        },
        livadski: {
          eyebrow: 'Ljetna paša · jun–jul',
          ime: 'Livadski med',
          podnaslov: 'Cvjetan, pun i svakodnevan.',
          tekst:
            'Ljetna berba sa livada oko Mračaja — mnogo cvjetova u jednoj tegli. Zaokružen i pun, dovoljno blag za svaki dan, a dovoljno izražen da se osjeti krajolik iz kojeg dolazi. Vremenom kristališe, jer ga ne zagrijavamo.',
          cinjenice: [
            { oznaka: 'UKUS', vrijednost: 'Cvjetan' },
            { oznaka: 'BOJA', vrijednost: 'Zlatna' },
            { oznaka: 'PAŠA', vrijednost: 'Jun–jul' },
          ],
          etiketa: 'Berba 2026',
          slikaAlt: 'Red tegli livadskog meda na drvenoj ogradi, ispred šume',
        },
        propolis: {
          eyebrow: 'Iz košnice · cijelo ljeto',
          ime: 'Pčelinji propolis',
          podnaslov: 'Smolast, gorak i koncentrisan.',
          tekst:
            'Smola sa pupoljaka i kore drveta, kojom pčele brane košnicu. Cijedimo je u tamnu bočicu sa kapaljkom, bez razblaživanja — nekoliko kapi je dovoljno.',
          cinjenice: [
            { oznaka: 'VOLUMEN', vrijednost: '20 ml' },
            { oznaka: 'OBLIK', vrijednost: 'Kapi' },
            { oznaka: 'PORIJEKLO', vrijednost: 'Smola sa pupoljaka' },
          ],
          etiketa: 'Bez razblaživanja',
          slikaAlt: 'Bočica pčelinjeg propolisa u ruci, iza nje košnica i cvijeće',
        },
      },
    },
    en: {
      eyebrow: 'Picked from the apiary',
      heading: 'What comes out of our hives.',
      intro:
        'Two kinds of honey from the 2026 harvest and propolis from the same hives — everything we extract and draw off, in one place.',
      svi: 'All products',
      cta: 'View product',
      mreza: {
        heading: 'Why this honey',
        fotoNatpis: 'Our apiary in Mračaj · since 1980',
        fotoAlt: 'A jar of acacia honey on a hive, meadow and hills behind it',
        plocice: [
          {
            naslov: '100% natural',
            tekst: 'No additives, colours or preservatives — the jar holds only what the bees brought in.',
          },
          {
            naslov: 'Raw, unfiltered',
            tekst: 'We never heat or filter it; it runs from the comb straight into the jar.',
          },
          {
            naslov: 'No added sugar',
            tekst: 'No syrup, no aromas, no preservatives.',
          },
          {
            naslov: 'Acacia — May–June flow',
            tekst: 'Pale gold, mild and almost clear; it stays liquid through winter.',
          },
          {
            naslov: 'Meadow — June–July flow',
            tekst: 'Floral and full, drawn from many different flowers; it sets by winter.',
          },
        ],
      },
      proizvod: {
        bagremov: {
          eyebrow: 'First flow · May–June',
          ime: 'Acacia honey',
          podnaslov: 'Mild, pale, the first flow.',
          tekst:
            'The first harvest of the year, from the short acacia bloom. Almost clear and mild, so it does not cover what it goes with — which is why it belongs with tea and pancakes. It stays liquid through winter.',
          cinjenice: [
            { oznaka: 'TASTE', vrijednost: 'Mild, floral' },
            { oznaka: 'COLOUR', vrijednost: 'Pale gold' },
            { oznaka: 'FLOW', vrijednost: 'May–Jun' },
          ],
          etiketa: '2026 harvest',
          slikaAlt: 'A jar of acacia honey held in hand above the hives at dusk',
        },
        livadski: {
          eyebrow: 'Summer flow · June–July',
          ime: 'Meadow honey',
          podnaslov: 'Floral, full and everyday.',
          tekst:
            'A summer harvest from the meadows around Mračaj — many flowers in one jar. Rounded and full, mild enough for every day, distinct enough to taste the landscape it came from. It sets over time, because we never heat it.',
          cinjenice: [
            { oznaka: 'TASTE', vrijednost: 'Floral' },
            { oznaka: 'COLOUR', vrijednost: 'Golden' },
            { oznaka: 'FLOW', vrijednost: 'Jun–Jul' },
          ],
          etiketa: '2026 harvest',
          slikaAlt: 'A jar of meadow honey on an open palm above the meadow',
        },
        propolis: {
          eyebrow: 'From the hive · all summer',
          ime: 'Bee propolis',
          podnaslov: 'Resinous, bitter and concentrated.',
          tekst:
            'A resin from tree buds and bark, which the bees use to guard the hive. We draw it into a dark dropper bottle, undiluted — a few drops are enough.',
          cinjenice: [
            { oznaka: 'VOLUME', vrijednost: '20 ml' },
            { oznaka: 'FORM', vrijednost: 'Drops' },
            { oznaka: 'ORIGIN', vrijednost: 'Resin from buds' },
          ],
          etiketa: 'Undiluted',
          slikaAlt: 'A bottle of bee propolis held in hand, a hive and flowers behind',
        },
      },
    },
  } satisfies L<{
    eyebrow: string;
    heading: string;
    intro: string;
    svi: string;
    cta: string;
    mreza: {
      heading: string;
      fotoNatpis: string;
      fotoAlt: string;
      plocice: ReadonlyArray<{ naslov: string; tekst: string }>;
    };
    proizvod: Record<
      'bagremov' | 'livadski' | 'propolis',
      {
        eyebrow: string;
        ime: string;
        podnaslov: string;
        tekst: string;
        cinjenice: ReadonlyArray<{ oznaka: string; vrijednost: string }>;
        etiketa: string;
        slikaAlt: string;
      }
    >;
  }>,

  aboutPreview: {
    sr: {
      imageAlt: 'Saće u rukama, iznad košnice',
      eyebrow: 'Od košnice do tegle',
      heading: 'Znanje koje se prenosi rukama.',
      description:
        'Med vadimo, cijedimo i punimo sami, u malim serijama. Ne miješamo serije i ne dokupljujemo med — u teglu ide ono što je te sedmice izašlo iz naših košnica.',
      steps: ['Pregled košnica', 'Ručno vrcanje', 'Mirno cijeđenje', 'Punjenje tegli'],
    },
    en: {
      imageAlt: 'Fresh comb held in two hands above the hive',
      eyebrow: 'From hive to jar',
      heading: 'Knowledge passed on by hand.',
      description:
        'We extract, filter and fill the honey ourselves, in small batches. We never blend batches and never buy honey in — what goes into the jar came out of our own hives that week.',
      steps: ['Hive care', 'Hand extraction', 'Slow filtering', 'Jar filling'],
    },
  } satisfies L<{
    imageAlt: string;
    eyebrow: string;
    heading: string;
    description: string;
    steps: string[];
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

  /*
   * Vitrina: uokviren snimak na medenom pojasu, slog s obje strane.
   *
   * Recenica je jedna, presjecena fotografijom — lijeva polovina stoji lijevo
   * od okvira, desna desno od njega. Zato su i dva naslova a ne jedan: da bi
   * se citalo preko slike, a ne pored nje.
   */
  vitrina: {
    sr: {
      eyebrowLeft: 'Sirovo vrcano',
      headingLeft: 'Ništa dodano,',
      body:
        'Med koji vrcamo ostaje takav kakav izađe iz saća — bez grijanja, bez filtriranja, bez ičega dodanog. Ono što je u tegli, tačno je ono što su pčele donijele sa livade.',
      eyebrowRight: 'Od 1980.',
      headingRight: 'ništa oduzeto.',
      seal: 'Proizvodi',
      alt: 'Red tegli livadskog meda na drvenoj ogradi, iza njih zelenilo',
    },
    en: {
      eyebrowLeft: 'Raw, unfiltered',
      headingLeft: 'Nothing added,',
      body:
        'The honey we extract stays exactly as it comes out of the comb — no heating, no filtering, nothing added. What is in the jar is precisely what the bees brought back from the meadow.',
      eyebrowRight: 'Since 1980',
      headingRight: 'nothing taken away.',
      seal: 'Products',
      alt: 'A row of jars of meadow honey on a wooden rail, greenery behind them',
    },
  } satisfies L<{
    eyebrowLeft: string;
    headingLeft: string;
    body: string;
    eyebrowRight: string;
    headingRight: string;
    seal: string;
    alt: string;
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

  /*
   * "U dodiru sa prirodom": snimak, naslov i tekst jedno uz drugo.
   *
   * Naslov je kratak namjerno — u slogu ide verzalom i lomi se u tri reda, pa
   * svaka rijec vise razvlaci stupac. Tekst je u dva pasusa; prvi govori o
   * mjestu, drugi o onome sto iz njega izlazi.
   */
  priroda: {
    sr: {
      heading: 'U dodiru sa prirodom',
      body: [
        'Naši pčelinjaci su mirna, netaknuta mesta gde vekovno pčelarsko znanje i poštovanje prema prirodi žive u savršenom skladu. Priroda se pažljivo neguje kroz tradicionalne metode i brigu o biodiverzitetu, dozvoljavajući svakoj košnici da razvije svoj puni potencijal.',
        'Ovde se nadmorska visina, mikroklima i raznolikost cvetnog pokrivača spajaju u suptilnu ravnotežu, stvarajući čist, autentičan med u kojem se prepliću bogatstvo ukusa i nežna postojanost — nepogrešiv potpis Pčelarstva Jevtić.',
      ],
      link: 'Naše porijeklo',
      photoAlt: 'Pčela na otvorenom dlanu',
    },
    en: {
      heading: 'Close to nature',
      body: [
        'Our apiaries are quiet, untouched places where a century of beekeeping knowledge and respect for nature live in perfect accord. The land is tended carefully, by traditional methods and with an eye to its biodiversity, so that every hive can come into its own.',
        'Here altitude, microclimate and the range of the flowering cover meet in a fine balance, making a clean, honest honey in which a wealth of flavour and a gentle constancy are woven together — the unmistakable signature of Pčelarstvo Jevtić.',
      ],
      link: 'Our origin',
      photoAlt: 'A bee on an open palm',
    },
  },

  geslo: {
    sr: {
      /*
       * Recenica je u tri dijela jer joj sredina ide drugim glasom — bijelo i
       * kurzivom. Kao jedan tekst se to ne bi dalo obiljeziti a da se prelom
       * ne veze za odredjenu sirinu ekrana.
       */
      lead: 'U Republici Srpskoj proizvodi se med bez dodataka, uz sezonski ritam koji',
      accent: 'naša porodica',
      tail: 'prati decenijama.',
      sealAlt: 'Znak: pčela nad cvijetom',
    },
    en: {
      lead: 'In Republika Srpska honey is made with nothing added, to a seasonal rhythm that',
      accent: 'our family',
      tail: 'has kept for decades.',
      sealAlt: 'A mark: a bee above a flower',
    },
  } satisfies L<{
    lead: string;
    accent: string;
    tail: string;
    sealAlt: string;
  }>,

  /*
   * Dvije sorte, jedna nasuprot druge.
   *
   * Sekcija pocinje kao dvije fotografije preko cijelog kadra, po pola svaka,
   * bez razmaka medju njima; skrol ih skuplja u dvije karte na papiru. Natpis
   * ide u slog a ne u sliku — na prelazu se tekst gasi a crtez ostaje, pa to
   * ne mogu biti jedan te isti fajl.
   */
  podjela: {
    sr: {
      livadski: {
        ime: 'livadski MED',
        photoAlt: 'Livada bijelih rada, snimljena u pokretu',
        jarAlt: 'Tegla livadskog meda u pletenoj korpi, uz poljsko cvijeće',
      },
      bagremov: {
        ime: 'bagremov MED',
        photoAlt: 'Grozdovi bagremovog cvijeta, snimljeni u pokretu',
        jarAlt: 'Tegla bagremovog meda na panju, u visokoj travi',
      },
      cta: 'PČELINJAK',
      ctaAria: 'Pogledaj pčelinjak',
    },
    en: {
      livadski: {
        ime: 'meadow HONEY',
        photoAlt: 'A meadow of ox-eye daisies, caught in motion',
        jarAlt: 'A jar of meadow honey in a woven basket, among wild flowers',
      },
      bagremov: {
        ime: 'acacia HONEY',
        photoAlt: 'Clusters of acacia blossom, caught in motion',
        jarAlt: 'A jar of acacia honey on a stump, in tall grass',
      },
      cta: 'THE APIARY',
      ctaAria: 'See the apiary',
    },
  } satisfies L<{
    livadski: { ime: string; photoAlt: string; jarAlt: string };
    bagremov: { ime: string; photoAlt: string; jarAlt: string };
    cta: string;
    ctaAria: string;
  }>,

  /*
   * Ponuda: jedna tegla, jedan izbor, jedno dugme.
   *
   * Cijene i varijante se ne pisu ovdje nego se citaju iz `data/products.ts` —
   * isti izvor iz kojeg zivi i webshop. Da stoje na dva mjesta, prije ili
   * kasnije bi se razisle.
   */
  ponuda: {
    sr: {
      eyebrow: 'BERBA 2026 · MRAČAJ',
      ime: 'Livadski med',
      podnaslov: 'Cvjetan, pun i svakodnevan',
      cinjenice: [
        { oznaka: 'UKUS', vrijednost: 'Cvjetan' },
        { oznaka: 'BOJA', vrijednost: 'Zlatna' },
        { oznaka: 'PAŠA', vrijednost: 'Jun–jul' },
      ],
      tekst:
        'Ljetna paša sa livada oko Mračaja, vrcano jula 2026. Zlatna boja, pun cvjetni ukus — med za svaki dan: za čaj, kolače i kašiku ujutru. Do zime kristališe, jer ga ne zagrijavamo.',
      birajTezinu: 'BIRAJ TEŽINU',
      znakAlt: 'Okusi slast',
      teglaAlt: 'Tegla livadskog meda od 1 kg',
    },
    en: {
      eyebrow: 'HARVEST 2026 · MRAČAJ',
      ime: 'Meadow honey',
      podnaslov: 'Floral, full and everyday',
      cinjenice: [
        { oznaka: 'TASTE', vrijednost: 'Floral' },
        { oznaka: 'COLOUR', vrijednost: 'Golden' },
        { oznaka: 'FLOW', vrijednost: 'Jun–Jul' },
      ],
      tekst:
        'A summer flow from the meadows around Mračaj, extracted in July 2026. Golden in colour, full and floral — a honey for every day: for tea, for baking, for a spoonful in the morning. It sets by winter, because we never heat it.',
      birajTezinu: 'CHOOSE A SIZE',
      znakAlt: 'Taste the sweetness',
      teglaAlt: 'A 1 kg jar of meadow honey',
    },
  } satisfies L<{
    eyebrow: string;
    ime: string;
    podnaslov: string;
    cinjenice: ReadonlyArray<{ oznaka: string; vrijednost: string }>;
    tekst: string;
    birajTezinu: string;
    znakAlt: string;
    teglaAlt: string;
  }>,

  /*
   * Bagremov med: druga sorta u istom nizu.
   *
   * Ista polja kao livadski — sekcija je jedna komponenta koja se puni dvaput,
   * pa se sadrzaj mora poklapati po obliku. Razlike su samo u rijecima i u
   * tome sto ova sekcija stoji obrnuto i na svjetlijoj plohi.
   */
  bagremov: {
    sr: {
      eyebrow: 'BERBA 2026 · MRAČAJ',
      ime: 'Bagremov med',
      podnaslov: 'Blag, svijetao i prve paše',
      cinjenice: [
        { oznaka: 'UKUS', vrijednost: 'Blag, cvjetni' },
        { oznaka: 'BOJA', vrijednost: 'Svijetlozlatna' },
        { oznaka: 'PAŠA', vrijednost: 'Maj–jun' },
      ],
      tekst:
        'Prva paša u godini, iz kratkog bagremovog cvata nad Mračajem. Svijetao i gotovo proziran, blagog ukusa koji ne pokriva ono uz šta ide — zato stoji uz čaj i palačinke, a ne uz jak sir. Ostaje tečan i preko zime.',
      birajTezinu: 'BIRAJ TEŽINU',
      znakAlt: 'Okusi slast',
      teglaAlt: 'Tegla bagremovog meda od 1 kg',
    },
    en: {
      eyebrow: 'HARVEST 2026 · MRAČAJ',
      ime: 'Acacia honey',
      podnaslov: 'Mild, pale, the first flow',
      cinjenice: [
        { oznaka: 'TASTE', vrijednost: 'Mild, floral' },
        { oznaka: 'COLOUR', vrijednost: 'Pale gold' },
        { oznaka: 'FLOW', vrijednost: 'May–Jun' },
      ],
      tekst:
        'The first flow of the year, from the short acacia bloom above Mračaj. Pale and almost clear, mild enough not to cover what it goes with — which is why it belongs with tea and pancakes, not with a strong cheese. It stays liquid through winter.',
      birajTezinu: 'CHOOSE A SIZE',
      znakAlt: 'Taste the sweetness',
      teglaAlt: 'A 1 kg jar of acacia honey',
    },
  } satisfies L<{
    eyebrow: string;
    ime: string;
    podnaslov: string;
    cinjenice: ReadonlyArray<{ oznaka: string; vrijednost: string }>;
    tekst: string;
    birajTezinu: string;
    znakAlt: string;
    teglaAlt: string;
  }>,

  /*
   * Med koji pamti krajolik: naslov u sredini, dvije fotografije lijevo, tekst
   * desno.
   *
   * Stoji iza bagrema, na istom polju cvijeca na kojem stoje i sekcije iznad
   * — dolazi poslije tri sorte i kaze zasto se razlikuju: ne po receptu nego
   * po tome sta je te godine cvjetalo.
   */
  krajolik: {
    sr: {
      heading: 'Med koji pamti krajolik',
      paragrafi: [
        'Svaka tegla našeg meda čuva krajolik iz kojeg je potekao. Pčele prelaze livade, šume i voćnjake, a u saće donose miris lipe, bagrema i divljeg cvijeća. Med pamti majsku kišu, sunce koje je u julu grijalo brda i tišinu jutra prije prve paše.',
        'Ovaj med nije napravljen. Skupljen je, cvijet po cvijet, sa brda iznad našeg sela, gdje bagrem cvjeta prije lipe, a livada miriše najjače poslije kiše. Uzimaju ono što krajolik te godine da. Zato nijedna tegla nije ista.',
      ],
      cta: 'Naši pčelinjaci',
      pcelarAlt: 'Pčelar podiže ram sa pčelama iz žute košnice',
      kriskaAlt: 'Kriška hljeba s medom i nožem preko nje',
    },
    en: {
      heading: 'Honey that remembers the land',
      paragrafi: [
        'Every jar of our honey keeps the landscape it came from. The bees cross meadows, woods and orchards, and carry back into the comb the scent of linden, acacia and wild flowers. The honey remembers the May rain, the July sun on the hills, and the quiet of the morning before the first flow.',
        'This honey was not made. It was gathered, flower by flower, from the hills above our village, where the acacia blooms before the linden and the meadow smells strongest after rain. They take what the land gives that year. No two jars are ever the same.',
      ],
      cta: 'Our apiaries',
      pcelarAlt: 'A beekeeper lifting a frame of bees from a yellow hive',
      kriskaAlt: 'A slice of bread with honey and a knife across it',
    },
  } satisfies L<{
    heading: string;
    paragrafi: ReadonlyArray<string>;
    cta: string;
    pcelarAlt: string;
    kriskaAlt: string;
  }>,

  apiary: {
    sr: {
      heading: 'Mračaj',
      body:
        'U seoskom kraju, na opojnim livadama i obroncima, vrcamo jedinstven med prirodnog porijekla.',
      coords: '44.89915° N, 17.53360° E',
      alt: 'Red plavih i žutih košnica uz njivu, u ljetno popodne',
      hillsAlt: 'Crtež brda i puta koji vijuga između njih',
    },
    en: {
      heading: 'Mračaj',
      body:
        'Out in the countryside, on heady meadows and hillsides, we extract a honey of singular, natural origin.',
      coords: '44.89915° N, 17.53360° E',
      alt: 'A row of blue and yellow hives beside a field on a summer afternoon',
      hillsAlt: 'A drawing of hills with a path winding between them',
    },
  } satisfies L<{
    heading: string;
    body: string;
    coords: string;
    alt: string;
    hillsAlt: string;
  }>,

  rail: {
    sr: {
      label: 'Snimci s pčelinjaka',
      eyebrow: 'Iz našeg albuma',
      alt: {
        dlan: 'Tegla livadskog meda na otvorenom dlanu, iza nje livada i brda',
        panj: 'Tegle livadskog i bagremovog meda na panju, na platnu, u visokoj travi',
        korpa: 'Pletena korpa s teglama meda i propolisom, nošena kroz livadu bijelih rada',
        rame: 'Djevojka u bijeloj haljini drži teglu livadskog meda uz rame',
        svjetlo: 'Tegle meda složene jedna na drugu, sunce prolazi kroz njih',
      },
    },
    en: {
      label: 'Photographs from the apiary',
      eyebrow: 'From our album',
      alt: {
        dlan: 'A jar of meadow honey resting on an open palm, meadow and hills behind it',
        panj: 'Jars of meadow and acacia honey on a tree stump, on linen, in tall grass',
        korpa: 'A woven basket of honey jars and propolis carried through a meadow of daisies',
        rame: 'A young woman in a white dress holding a jar of meadow honey at her shoulder',
        svjetlo: 'Jars of honey stacked one on another, sunlight coming through them',
      },
    },
  } satisfies L<{
    label: string;
    eyebrow: string;
    alt: Record<'dlan' | 'panj' | 'korpa' | 'rame' | 'svjetlo', string>;
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

  /*
   * Livada: crtez pcelinjaka, recenica pod njim, pa pet snimaka u stepenicu.
   *
   * Crtez i recenica su isporuceni kao SVG — recenica je slog pretvoren u
   * krivulje, sa dvije vlati trave u sebi, pa ovdje stoji i kao tekst: to je
   * ono sto procita citac ekrana i ono sto ide u `alt`.
   */
  livada: {
    sr: {
      pejzazAlt: 'Crtež reda košnica na livadi, iza njih brda i oblaci',
      recenica:
        'Vrcamo samo ono što naše pčele saberu na livadama. Sezonu po sezonu, otkad je djed počeo 1980.',
      sealLabel: 'Pogledaj naš pčelinjak',
      photoLabels: ['Domaće.', 'Ukusno.', 'Ručno.', 'Čisto.', 'Prirodno.'],
      photoAlts: [
        'Tegla livadskog meda na ogradnom stubu, iza nje pokošena livada i brdo',
        'Tegla livadskog meda na stolu, uz kafu i kašiku za med',
        'Ramovi sa saćem izvađeni iz košnice, na njima pčele',
        'Med teče iz vrcaljke u staklenu teglu',
        'Pčele na letu košnice, na dasci sa oljuštenom bojom',
      ],
    },
    en: {
      pejzazAlt: 'A drawing of a row of hives in a meadow, hills and clouds behind them',
      recenica:
        'We extract only what our bees gather on the meadows. Season after season, since our grandfather began in 1980.',
      sealLabel: 'See our apiary',
      photoLabels: ['Homemade.', 'Delicious.', 'By hand.', 'Clean.', 'Natural.'],
      photoAlts: [
        'A jar of meadow honey on a fence post, a mown meadow and a hill behind it',
        'A jar of meadow honey on a table, beside coffee and a honey dipper',
        'Frames of comb lifted out of a hive, bees on them',
        'Honey running from the extractor into a glass jar',
        'Bees at the hive entrance, on a board with flaking paint',
      ],
    },
  } satisfies L<{
    pejzazAlt: string;
    recenica: string;
    sealLabel: string;
    photoLabels: readonly [string, string, string, string, string];
    photoAlts: readonly [string, string, string, string, string];
  }>,

  /*
   * Propolis: bocica u sredini, grancica iza nje, tri natpisa oko njih.
   *
   * Natpisi su stigli i kao SVG, slog pretvoren u krivulje. Ovdje stoje kao
   * tekst: tako se citaju, prevode i biraju, a mjeru i razmak slova im daje
   * ista tipografija kojom su i nacrtani.
   */
  propolis: {
    sr: {
      heading: 'Pčelinji propolis',
      volume: '20 ml',
      lead: ['Prirodna smola koju pčele', 'sakupljaju sa pupoljaka', 'i kore drveta.'],
      use: ['Mešaju je sa sopstvenim', 'enzimima i koriste', 'za zaštitu košnice.'],
      benefits: ['100% prirodno porijeklo', 'Bez aditiva', 'Organsko pčelarstvo'],
      bottleAlt: 'Braon staklena bočica pčelinjeg propolisa od 20 ml, sa kapaljkom',
      branchAlt: 'Crtež grančice sa cvjetovima i pupoljcima',
      znakAlt: 'Okusi slast',
    },
    en: {
      heading: 'Bee propolis',
      volume: '20 ml',
      lead: ['A natural resin bees gather', 'from tree buds', 'and bark.'],
      use: ['They mix it with their own', 'enzymes and use it', 'to guard the hive.'],
      benefits: ['100% natural origin', 'No additives', 'Organic beekeeping'],
      bottleAlt: 'A 20 ml amber glass bottle of bee propolis with a dropper',
      branchAlt: 'A drawing of a branch with blossoms and buds',
      znakAlt: 'Taste the sweetness',
    },
  } satisfies L<{
    heading: string;
    volume: string;
    lead: readonly string[];
    use: readonly string[];
    benefits: readonly string[];
    bottleAlt: string;
    branchAlt: string;
    znakAlt: string;
  }>,

  faq: {
    sr: {
      eyebrow: 'O medu',
      heading: 'Mala pitanja prije prve tegle.',
      note: 'Sljedeće sekcije su u razvoju.',
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
      note: 'Next sections in progress.',
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
    note: string;
    items: { question: string; answer: string }[];
  }>,

  newsletter: {
    sr: {
      eyebrow: 'Naruči direktno',
      heading: 'Prva tegla je najbolji način da nas upoznate.',
      description:
        'Pogledajte dostupne vrste meda ili nam pošaljite poruku za količine, poklon pakovanja i sezonske serije.',
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
    homeHives: {
      caption: 'Naš pčelinjak · Mračaj',
      meta: 'Košnice na livadi',
      altA: 'Red plavih i žutih košnica na livadi ispod brda',
      altB: 'Košnice u visokoj travi, u hladu voćaka',
    },
    productsOther: {
      caption: 'Iz iste košnice, ali ne med',
      meta: 'Imuno mix · propolis',
      altMix: 'Tegla imuno mixa na svjetlu, uz drvenu kašiku punu cvjetnog polena',
      altPropolis: 'Bočica pčelinjeg propolisa sa kapaljkom, uz grumenje sirove smole',
    },
    processLabel: {
      caption: 'Etiketa ide rukom, posljednja',
      meta: 'Teglu po teglu',
      alt: 'Ručno lijepljenje etikete na teglu',
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
    homeHives: {
      caption: 'Our apiary · Mračaj',
      meta: 'Hives out on the meadow',
      altA: 'A row of blue and yellow hives on a meadow below the hills',
      altB: 'Hives standing in tall grass in the shade of fruit trees',
    },
    productsOther: {
      caption: 'From the same hive, but not honey',
      meta: 'Imuno mix · propolis',
      altMix: 'A jar of imuno mix in the light, beside a wooden scoop full of flower pollen',
      altPropolis: 'A dropper bottle of bee propolis beside lumps of raw resin',
    },
    processLabel: {
      caption: 'The label goes on by hand, last',
      meta: 'One jar at a time',
      alt: 'A label being applied to a jar by hand',
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
