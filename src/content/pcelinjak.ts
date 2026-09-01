import type { Locale } from '@/i18n/config';

/**
 * Sadrzaj strane "Nasi pcelinjaci".
 *
 * Raspored strane je preuzet sa moncalisse.com/en/vineyards — isti niz traka,
 * ista sirinska skala, isti odnos naslova prema tekstu, iste animacije.
 * Preuzet je raspored, ne tekst: nijedna rijec odande nije ovdje.
 *
 * TODO copy: sve rijeci ispod su privremene. Pisane su tako da svaki blok ima
 * onoliko znakova koliko ga ima na uzoru (+-10%), da se raspored ne pomjeri
 * kad stigne pravi tekst. Uz blokove stoji ciljna duzina.
 */

export type PcelinjakRed = { label: string; value: string };

export type PcelinjakPasa = {
  key: string;
  /** Natpis na dugmetu iznad slajda. */
  tab: string;
  /** Crtez pase — mjesto za sliku, omjer 1.64:1. */
  mapaAlt: string;
  /** Pasus pod crtezom. */
  uvod: string;
  redovi: PcelinjakRed[];
};

type Copy = {
  meta: { title: string; description: string };
  /** Heroj: naslov u tri rijeci i jedna recenica uz sliku koja se siri. */
  hero: { title: string[]; caption: string; slikaAlt: string };
  /** Natpis lijevo, naslov desno, pa uvodni pasus u desnom stupcu. */
  uvod: { pretitle: string; title: string[]; lead: string };
  /** Traka slika koja se lista u stranu. */
  galerija: { alt: string; omjer: '3:2' | '4:3' }[];
  /** Pasus u dva stupca ispod trake. */
  tlo: string;
  /** Naslov lijevo, dugi pasus u sredini, uspravna slika desno. */
  parcela: { title: string[]; body: string; slikaAlt: string };
  /** Natpis i naslov iznad izbornika pasa. */
  pase: { pretitle: string; title: string[]; lista: PcelinjakPasa[] };
  /** Dvije ploce koje prolaze vodoravno dok strana stoji. */
  hscroll: { kvadratAlt: string; kolone: { alt: string; body: string }[] };
  /** Panorama preko cijele mjere. */
  panorama: { alt: string };
  /** Kartice koje vode na ostale strane. */
  dalje: { key: string; href: string; title: string; body: string; link: string; alt: string }[];
};

const sr: Copy = {
  meta: {
    // Sufiks "| Pčelarstvo Jevtić" dodaje `template` u layoutu — ne ovdje.
    title: 'Naši pčelinjaci',
    description:
      'Pčelinjaci u Mračaju, Orašju i Otpočivaljci — livade, bagrem i lipa nadomak Prnjavora.',
  },

  hero: {
    // cilj: 16 znakova, tri rijeci
    title: ['Kraj', 'koji', 'miriše'],
    // cilj: 48
    caption: 'Gdje se zemlja, sunce i pčela sastaju u kapi.',
    slikaAlt: 'Pčelinjak iz vazduha',
  },

  uvod: {
    // cilj: 33
    pretitle: 'U selu nadomak Prnjavora, na brdu',
    // cilj: 28, cetiri rijeci
    title: ['Visina,', 'tišina,', 'i', 'svjetlost'],
    // cilj: 279
    lead:
      'Naši pčelinjaci stoje na dvanaest hektara livade iznad sela Mračaj, nadomak Prnjavora. ' +
      'Na šest stotina metara nadmorske visine, okruženi bagremom i divljim cvijećem, daju med ' +
      'koji svake godine nosi nešto drugačiji ukus, a uvijek istu čistoću i mirnu, duboku zrelost.',
  },

  galerija: [
    { alt: 'Košnice u redu na livadi', omjer: '3:2' },
    { alt: 'Ram sa poklopljenim medom', omjer: '4:3' },
    { alt: 'Pogled na selo ispod pčelinjaka', omjer: '4:3' },
    { alt: 'Bagrem u cvatu nad košnicama', omjer: '3:2' },
    { alt: 'Pčelar pred otvorenom košnicom', omjer: '3:2' },
    { alt: 'Livada pred prvo jutarnje vrcanje', omjer: '3:2' },
  ],

  // cilj: 506, pasus se lomi u dva stupca
  tlo:
    'Tlo ispod naših pčelinjaka je plitko i kamenito, sastavljeno od krečnjaka i ilovače koju ' +
    'kiša svake jeseni iznova premijesi, pa livada nad njim nikad ne izraste bujna nego sitna, ' +
    'gusta i puna trava koje cvjetaju u razmacima od proljeća do kasnog ljeta. Vazduh se ovdje ' +
    'mijenja dva puta dnevno: ujutru se sa doline diže vlaga, a predveče niz obronak siđe ' +
    'hladan dah sa šume, i ta razlika između dana i noći drži pašu duže otvorenom nego što bi ' +
    'bila u ravnici, pa pčela ima vremena da radi bez žurbe.',

  parcela: {
    // cilj: 16, tri rijeci
    title: ['Košnica', 'na', 'brdu'],
    // cilj: 657
    body:
      'U srcu imanja stoji jedan hektar stare livade koju ne kosimo i ne prihranjujemo, nego je ' +
      'puštamo da ide svojim redom. Tu su košnice koje je djed postavio osamdesete godine, na ' +
      'istom onom obronku okrenutom jugu, i tu se i danas vrca prvo. Trave na toj parceli nisu ' +
      'sijane — same su se vratile poslije godina ispaše, pa se u jednoj kapi meda nađe i lipa ' +
      'i djetelina i desetak cvjetova kojima ni ime ne znamo. Iz tog uglavka dolazi med koji ' +
      'izdvajamo posebno i vrcamo u malim serijama, svake godine drugačiji po boji i gustini, a ' +
      'uvijek isti po tome što se u njemu osjeti čitav obronak: i kamen pod travom, i sjena ' +
      'šume nad njom, i strpljenje koje se u pčelarstvu ne može preskočiti.',
    slikaAlt: 'Stara košnica na obronku',
  },

  pase: {
    // cilj: 15
    pretitle: 'Sorte našeg meda',
    // cilj: 25, cetiri rijeci
    title: ['Zeleno', 'srce', 'našeg', 'kraja'],
    lista: [
      {
        key: 'stara-livada',
        // cilj: 12
        tab: 'Stara livada',
        mapaAlt: 'Crtež stare livade sa rasporedom košnica',
        // cilj: 202
        uvod:
          'Pažljivim održavanjem ova je livada zadržala trave koje su na njoj rasle i prije nas, ' +
          'a njihovi duboki korijeni daju medu gustinu, mir i onaj isti ukus koji se prepozna u ' +
          'svakoj berbi, iz godine u godinu.',
        redovi: [
          { label: 'Površina paše', value: '9 hektara' },
          { label: 'Košnice', value: 'stare livadske zajednice' },
          { label: 'Uzvisina', value: '600 m' },
          { label: 'Osunčano', value: 'južna' },
          { label: 'Koordinate', value: 'N 44° 53′ 57″ / E 17° 32′ 01″' },
          { label: 'Paša', value: 'plitko krečnjačko tlo sa ilovačom i sitnim kamenom razasutim po obronku' },
          { label: 'Raspored košnica', value: 'otvoren' },
          { label: 'Raznolikost paše', value: 'više vrsta cvijeća' },
        ],
      },
      {
        key: 'kestenova',
        // cilj: 10
        tab: 'Kestenova',
        mapaAlt: 'Crtež kestenove paše iznad sela',
        uvod:
          'Kesten cvjeta kratko i visoko nad obronkom, pa se ova paša otvori na svega dvije ' +
          'sedmice i za to vrijeme dâ med tamniji i oštriji nego onaj koji dolazi sa livade.',
        redovi: [
          { label: 'Površina paše', value: '4 hektara' },
          { label: 'Košnice', value: 'stari kestenovi na rubu' },
          { label: 'Uzvisina', value: '640 m' },
          { label: 'Osunčano', value: 'sjever' },
          { label: 'Koordinate', value: 'N 44° 54′ 11″ / E 17° 31′ 46″' },
          { label: 'Paša', value: 'duboka šumska zemlja pomiješana sa lišćem i trulim panjevima' },
          { label: 'Raspored košnica', value: 'zbijen' },
          { label: 'Raznolikost paše', value: 'jedna glavna vrsta' },
        ],
      },
      {
        key: 'lipova-pasa',
        // cilj: 10
        tab: 'Lipova paša',
        mapaAlt: 'Crtež lipovog reda uz seoski put',
        uvod:
          'Red lipa uz stari seoski put cvjeta posljednji u godini, kad se livada već smiri, i ' +
          'zato ova paša zatvara sezonu medom svijetlim, mekim i izrazito mirisnim.',
        redovi: [
          { label: 'Površina paše', value: '2 hektara' },
          { label: 'Košnice', value: 'red lipa uz put' },
          { label: 'Uzvisina', value: '580 m' },
          { label: 'Osunčano', value: 'istok' },
          { label: 'Koordinate', value: 'N 44° 53′ 22″ / E 17° 32′ 40″' },
          { label: 'Paša', value: 'nabijena ilovača uz put, vlažnija u sjeni starog drvoreda' },
          { label: 'Raspored košnica', value: 'u nizu' },
          { label: 'Raznolikost paše', value: 'lipa i kasno cvijeće' },
        ],
      },
    ],
  },

  hscroll: {
    kvadratAlt: 'Stara košnica izbliza',
    kolone: [
      {
        alt: 'Pčele na ramu',
        // cilj: 246
        body:
          'Pažljivim radom stari je pčelinjak vraćen u red u kojem je nekad bio, a društva koja ' +
          'na njemu žive danas idu svojim godišnjim tokom bez našeg upletanja u pravo vrijeme. ' +
          'Njihov se ritam vidi u sitnicama koje se skupe kroz sezonu:',
      },
      {
        alt: 'Poklopljeni med na ramu',
        // cilj: 282
        body:
          'manje ali gušće zajednice, duboko ukorijenjena paša koja izdrži i sušu, i stari ' +
          'satovi koji društvu služe kao zaliha kroz zimu — sve to zajedno daje otpornost koja ' +
          'se poslije vidi u tegli: ujednačen kvalitet iz godine u godinu, jasna gustina i ' +
          'sasvim prepoznatljivi'
      },
      {
        alt: 'Vrcaljka u radu',
        // cilj: 282
        body:
          'mirisi koji dolaze od starosti društava i od toga što s njih uzimamo malo. Zaklonjen ' +
          'od vjetra i tih veći dio dana, ovaj je obronak zapravo srce pčelinjaka, mjesto gdje ' +
          'se pčelarsko znanje spaja sa strpljenjem zemlje i daje med prepoznatljiv, postojan i ' +
          'uvijek isti po karakteru.',
      },
    ],
  },

  panorama: { alt: 'Selo i pčelinjak u dolini' },

  dalje: [
    {
      key: 'about',
      href: '/about',
      title: 'O nama',
      // cilj: 263
      body:
        'Porodica Jevtić drži pčele od 1980. godine, u istom selu i po istom redu koji se ' +
        'prenosi s koljena na koljeno. Med vrcamo u malim serijama, bez dodataka i bez žurbe, ' +
        'onako kako je i počelo — jer se ovdje ništa ne radi brže nego što pčela može.',
      link: 'Upoznajte nas',
      alt: 'Porodica pred košnicama',
    },
    {
      key: 'process',
      href: '/process',
      title: 'Naš proces',
      body:
        'Od prvog pregleda u proljeće do posljednjeg vrcanja u ljeto, svaki korak ide rukom i ' +
        'po redu koji se ne skraćuje ni kad se žuri. Med se ne grije i ne filtrira nasilno, ' +
        'nego se pusti da sam sjedne i odstoji, pa u teglu ide onakav kakav je izašao iz sata.',
      link: 'Pogledajte proces',
      alt: 'Vrcanje meda u radionici',
    },
    {
      key: 'products',
      href: '/products',
      title: 'Proizvodi',
      body:
        'Livadski i bagremov med, propolis i vosak — sve iz istih košnica sa ovih obronaka, ' +
        'vrcano u malim serijama. Svaka tegla nosi godinu berbe i ime paše sa koje je došla, pa ' +
        'se odmah zna šta je u njoj i odakle je, bez ijedne riječi previše na deklaraciji.',
      link: 'Pogledajte ponudu',
      alt: 'Tegle meda u nizu',
    },
    {
      key: 'contact',
      href: '/contact',
      title: 'Kontakt',
      body:
        'Pčelinjak se može i posjetiti: dogovorite dolazak i pokazaćemo vam košnice, livadu i ' +
        'cio način na koji se med vrca, od rama do tegle. Za narudžbe, veleprodaju ili samo ' +
        'pitanje o medu, javite se telefonom ili porukom — odgovaramo isti dan.',
      link: 'Javite nam se',
      alt: 'Put ka pčelinjaku',
    },
  ],
};

const en: Copy = {
  meta: {
    title: 'Our apiaries',
    description:
      'Apiaries in Mračaj, Orašje and Otpočivaljka — meadows, acacia and linden near Prnjavor.',
  },
  hero: {
    title: ['Land', 'that', 'remembers'],
    caption: 'Where soil, sun and bee meet inside a single drop.',
    slikaAlt: 'The apiary from above',
  },
  uvod: {
    pretitle: 'In a village near Prnjavor, on a hill',
    title: ['Height,', 'silence,', 'and', 'light'],
    lead:
      'Our apiaries stand on twelve hectares of meadow above the village of Mračaj, near ' +
      'Prnjavor. At six hundred metres above sea level, ringed by acacia and wild flowers, they ' +
      'give honey that tastes a little different each year, yet keeps the same clarity and calm.',
  },
  galerija: [
    { alt: 'Hives in a row on the meadow', omjer: '3:2' },
    { alt: 'A frame of capped honey', omjer: '4:3' },
    { alt: 'The village below the apiary', omjer: '4:3' },
    { alt: 'Acacia in bloom above the hives', omjer: '3:2' },
    { alt: 'The beekeeper at an open hive', omjer: '3:2' },
    { alt: 'The meadow before the first extraction', omjer: '3:2' },
  ],
  tlo:
    'The soil beneath our apiaries is shallow and stony, a mix of limestone and clay that every ' +
    'autumn rain turns over again, so the meadow above it never grows lush but stays fine, ' +
    'dense and full of grasses that flower in turns from spring to late summer. The air changes ' +
    'twice a day: damp rises from the valley in the morning and a cool breath comes down off ' +
    'the forest at dusk, and that difference between day and night keeps the forage open longer ' +
    'than it would ever be on flat ground.',
  parcela: {
    title: ['A', 'hive', 'uphill'],
    body:
      'At the heart of the estate lies one hectare of old meadow that we neither cut nor feed, ' +
      'letting it keep its own order. The hives our grandfather set down in 1980 still stand on ' +
      'that same south-facing slope, and it is still the first place we extract from. The ' +
      'grasses there were never sown — they came back on their own after years of grazing, so a ' +
      'single drop of honey holds linden and clover and a dozen flowers we have no names for. ' +
      'From that corner comes the honey we set aside and extract in small batches, different ' +
      'every year in colour and body, and always the same in that the whole slope is in it.',
    slikaAlt: 'An old hive on the slope',
  },
  pase: {
    pretitle: 'Kinds of our honey',
    title: ['Green', 'heart', 'of', 'the', 'hill'],
    lista: [
      {
        key: 'stara-livada',
        tab: 'Old meadow',
        mapaAlt: 'Drawing of the old meadow and the hive layout',
        uvod:
          'Careful tending has kept the grasses that grew here long before us, and their deep ' +
          'roots give the honey the body and calm you can taste in every harvest.',
        redovi: [
          { label: 'Forage area', value: '9 hectares' },
          { label: 'Hives', value: 'old meadow communities' },
          { label: 'Elevation', value: '600 m' },
          { label: 'Aspect', value: 'south' },
          { label: 'Coordinates', value: 'N 44° 53′ 57″ / E 17° 32′ 01″' },
          { label: 'Forage', value: 'shallow limestone soil with clay and fine stone' },
          { label: 'Hive layout', value: 'open' },
          { label: 'Forage diversity', value: 'many flowering kinds' },
        ],
      },
      {
        key: 'kestenova',
        tab: 'Chestnut',
        mapaAlt: 'Drawing of the chestnut forage above the village',
        uvod:
          'Chestnut flowers briefly and high above the slope, so this forage opens for barely ' +
          'two weeks and in that time gives a honey darker and sharper than the meadow one.',
        redovi: [
          { label: 'Forage area', value: '4 hectares' },
          { label: 'Hives', value: 'old chestnuts at the edge' },
          { label: 'Elevation', value: '640 m' },
          { label: 'Aspect', value: 'north' },
          { label: 'Coordinates', value: 'N 44° 54′ 11″ / E 17° 31′ 46″' },
          { label: 'Forage', value: 'deep forest soil mixed with leaf litter and old stumps' },
          { label: 'Hive layout', value: 'close' },
          { label: 'Forage diversity', value: 'one leading kind' },
        ],
      },
      {
        key: 'lipova-pasa',
        tab: 'Linden',
        mapaAlt: 'Drawing of the linden row along the village road',
        uvod:
          'The row of lindens along the old village road flowers last in the year, once the ' +
          'meadow has settled, and so it closes the season with a pale, soft, fragrant honey.',
        redovi: [
          { label: 'Forage area', value: '2 hectares' },
          { label: 'Hives', value: 'linden row by the road' },
          { label: 'Elevation', value: '580 m' },
          { label: 'Aspect', value: 'east' },
          { label: 'Coordinates', value: 'N 44° 53′ 22″ / E 17° 32′ 40″' },
          { label: 'Forage', value: 'packed clay by the road, damper in the old row’s shade' },
          { label: 'Hive layout', value: 'in a line' },
          { label: 'Forage diversity', value: 'linden and late flowers' },
        ],
      },
    ],
  },
  hscroll: {
    kvadratAlt: 'An old hive up close',
    kolone: [
      {
        alt: 'Bees on a frame',
        body:
          'Careful work has brought the old apiary back to the order it once had, and the ' +
          'colonies living on it now follow their yearly course without our interference:',
      },
      {
        alt: 'Capped honey on a frame',
        body:
          'smaller but denser colonies, deep-rooted forage that survives a drought, and old ' +
          'combs that serve the colony as a reserve — together they give a resilience you later ' +
          'see in the jar: steady quality year after year, clear body and',
      },
      {
        alt: 'The extractor at work',
        body:
          'aromas that come from the age of the colonies and from how little we take. Sheltered ' +
          'and quiet, this slope is the true heart of the apiary, where beekeeping knowledge ' +
          'meets the patience of the land and gives an honest, lasting honey.',
      },
    ],
  },
  panorama: { alt: 'The village and the apiary in the valley' },
  dalje: [
    {
      key: 'about',
      href: '/about',
      title: 'About us',
      body:
        'The Jevtić family has kept bees since 1980, in the same village and by the same order ' +
        'handed down through generations. We extract in small batches, with nothing added and ' +
        'no hurry, the way it began — nothing here is done faster than the bee can work.',
      link: 'Get to know us',
      alt: 'The family in front of the hives',
    },
    {
      key: 'process',
      href: '/process',
      title: 'Our process',
      body:
        'From the first spring inspection to the last summer extraction, every step is done by ' +
        'hand and in an order that is never cut short. The honey is not heated or forced ' +
        'through a filter; it settles on its own and goes into the jar as it left the comb.',
      link: 'See the process',
      alt: 'Extracting honey in the workshop',
    },
    {
      key: 'products',
      href: '/products',
      title: 'Products',
      body:
        'Meadow and acacia honey, propolis and wax — all from the same hives on these slopes. ' +
        'Every jar carries its harvest year and the name of the forage it came from, so you ' +
        'know what is inside and where it is from, without a word too many.',
      link: 'See the range',
      alt: 'Jars of honey in a row',
    },
    {
      key: 'contact',
      href: '/contact',
      title: 'Contact',
      body:
        'The apiary can be visited: arrange a time and we will show you the hives, the meadow ' +
        'and the way the honey is extracted. For orders, wholesale or simply a question about ' +
        'honey, get in touch — we answer the same day.',
      link: 'Get in touch',
      alt: 'The road up to the apiary',
    },
  ],
};

export const pcelinjak: Record<Locale, Copy> = { sr, en };
