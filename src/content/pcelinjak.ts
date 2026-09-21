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
  /** Ime sorte; stoji kao pristupacan naziv dugmeta, jer je natpis u crtezu. */
  tab: string;
  /** Crtez sorte — u njemu je i sam natpis, pa dugme nema svoj slog. */
  znak: string;
  /** Fotografija sorte — uspravan okvir 4:5. */
  slika: string;
  /** Sta se na fotografiji vidi. */
  mapaAlt: string;
  /** Pasus pod crtezom. */
  uvod: string;
  redovi: PcelinjakRed[];
};

type Copy = {
  meta: { title: string; description: string };
  /** Heroj: naslov u tri rijeci i jedna recenica uz sliku koja se siri. */
  hero: { title: string[]; caption?: string; slikaAlt: string; slika?: string };
  /** Natpis lijevo, naslov desno, pa uvodni pasus u desnom stupcu. */
  uvod: { title: string[]; lead: string };
  /** Traka slika koja se lista u stranu. Omjer je omjer same fotografije. */
  galerija: { alt: string; omjer: '3:2' | '4:3' | '2:3' | '1:1'; src?: string }[];
  /** Naslov lijevo, dugi pasus u sredini, uspravna slika desno. */
  parcela: { title: string[]; body: string; slikaAlt: string; slika?: string };
  /** Natpis i naslov iznad izbornika pasa. */
  pase: { pretitle: string; title: string[]; lista: PcelinjakPasa[] };
  /** Dvije ploce koje prolaze vodoravno dok strana stoji. */
  hscroll: {
    kvadratAlt: string;
    kvadrat?: string;
    kolone: { heading: string; alt: string; body: string; src?: string }[];
  };
  /** Panorama preko cijele mjere. */
  panorama: { alt: string; src?: string };
  /** Kartice koje vode na ostale strane. */
  dalje: {
    key: string;
    href: string;
    title: string;
    body: string;
    link: string;
    alt: string;
    src?: string;
  }[];
  /** Snimak preko cijele plohe iza kartica. */
  pozadina: { alt: string; src: string };
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
    slikaAlt: 'Košnice na otvorenoj livadi pod vedrim nebom',
    slika: '/images/real/pcelinjak-4.webp',
  },

  uvod: {
    // cilj: 28, cetiri rijeci
    title: ['Visina,', 'tišina,', 'i', 'svjetlost'],
    // cilj: 279
    lead:
      'Naši pčelinjaci stoje na dvanaest hektara livade iznad sela Mračaj, nadomak Prnjavora. ' +
      'Na šest stotina metara nadmorske visine, okruženi bagremom i divljim cvijećem, daju med ' +
      'koji svake godine nosi nešto drugačiji ukus, a uvijek istu čistoću i mirnu, duboku zrelost.',
  },

  galerija: [
    { alt: 'Košnice u nizu, pogled niz red', omjer: '3:2', src: '/images/pcelinjak/traka-kosnice.webp' },
    { alt: 'Košnice u hladu voćnjaka', omjer: '4:3', src: '/images/pcelinjak/traka-hlad.webp' },
    { alt: 'Ram sa poklopljenim medom i upisanom godinom berbe', omjer: '4:3', src: '/images/pcelinjak/traka-berba.webp' },
    { alt: 'Ramovi sa saćem izbliza', omjer: '2:3', src: '/images/pcelinjak/traka-ramovi.webp' },
    { alt: 'Med teče iz vrcaljke u teglu', omjer: '2:3', src: '/images/pcelinjak/traka-vrcanje.webp' },
    { alt: 'Kante sa sirovim medom poslije vrcanja', omjer: '1:1', src: '/images/pcelinjak/traka-kante.webp' },
  ],

  parcela: {
    // cilj: 16, tri rijeci
    title: ['Košnica', 'na', 'brdu'],
    /*
     * Kraci nego blok na uzoru, i namjerno: zadnje dvije recenice su otisle na
     * zahtjev. Duzina ovdje vise ne prati uzor.
     */
    body:
      'U srcu imanja stoji jedan hektar stare livade koju ne kosimo i ne prihranjujemo, nego je ' +
      'puštamo da ide svojim redom. Tu su košnice koje je djed postavio osamdesete godine, na ' +
      'istom onom obronku okrenutom jugu, i tu se i danas vrca prvo. Trave na toj parceli nisu ' +
      'sijane — same su se vratile poslije godina ispaše, pa se u jednoj kapi meda nađe i lipa ' +
      'i djetelina i desetak cvjetova kojima ni ime ne znamo.',
    slikaAlt: 'Pčele na ulazu u staru košnicu',
    slika: '/images/pcelinjak/parcela.webp',
  },

  pase: {
    // cilj: 15
    pretitle: 'Sorte našeg meda',
    // cilj: 25, cetiri rijeci
    title: ['Zeleno', 'srce', 'našeg', 'kraja'],
    lista: [
      {
        key: 'livadski',
        tab: 'Livadski med',
        znak: '/images/brand/sorta-livadski.svg',
        slika: '/images/pcelinjak/sorta-livadski.webp',
        mapaAlt: 'Tegla livadskog meda na otvorenom dlanu, iza nje brdo i zelena livada',
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
        key: 'bagremov',
        tab: 'Bagremov med',
        znak: '/images/brand/sorta-bagremov.svg',
        slika: '/images/pcelinjak/sorta-bagremov.webp',
        mapaAlt: 'Ruka drži teglu bagremovog meda, iza nje košnice u zalazak sunca',
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
        key: 'meden',
        tab: 'Meden',
        znak: '/images/brand/sorta-meden.svg',
        slika: '/images/pcelinjak/sorta-meden.webp',
        mapaAlt: 'Tegle bagremovog i livadskog meda na drvenom stolu, uz dimilicu i košnice',
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
    kvadratAlt: 'Tegle napunjene medom, poredane na stolu',
    kvadrat: '/images/pcelinjak/hscroll-tegle.webp',
    kolone: [
      {
        heading: 'Ritam',
        alt: 'Pčela na otvorenom dlanu',
        src: '/images/priroda/pcela-na-dlanu.webp',
        body:
          'Pažljivim radom stari je pčelinjak vraćen u red u kojem je nekad bio, a društva koja ' +
          'na njemu žive danas idu svojim godišnjim tokom bez našeg upletanja u pravo vrijeme. ' +
          'Njihov se ritam vidi u sitnicama koje se skupe kroz sezonu:',
      },
      {
        heading: 'Otpornost',
        alt: 'Med teče iz vrcaljke u staklenu teglu',
        src: '/images/real/vrcaljka-tegla.webp',
        body:
          'manje ali gušće zajednice, duboko ukorijenjena paša koja izdrži i sušu, i stari ' +
          'satovi koji društvu služe kao zaliha kroz zimu — sve to zajedno daje otpornost koja ' +
          'se poslije vidi u tegli: ujednačen kvalitet iz godine u godinu, jasna gustina i ' +
          'sasvim prepoznatljivi',
      },
      {
        heading: 'Karakter',
        alt: 'Tegla livadskog meda na ogradnom stubu, iza nje pokošena livada i brdo',
        src: '/images/real/tegla-stub-livada.webp',
        body:
          'mirisi koji dolaze od starosti društava i od toga što s njih uzimamo malo. Zaklonjen ' +
          'od vjetra i tih veći dio dana, ovaj je obronak zapravo srce pčelinjaka, mjesto gdje ' +
          'se pčelarsko znanje spaja sa strpljenjem zemlje i daje med prepoznatljiv, postojan i ' +
          'uvijek isti po karakteru.',
      },
    ],
  },

  panorama: {
    alt: 'Korpa sa livadskim i bagremovim medom i propolisom, u livadi',
    src: '/images/pcelinjak/ploca.webp',
  },

  dalje: [
    {
      key: 'process',
      href: '/process',
      title: 'Naš proces',
      body:
        'Od prvog pregleda u proljeće do posljednjeg vrcanja u ljeto, svaki korak ide rukom i ' +
        'po redu koji se ne skraćuje ni kad se žuri. Med se ne grije i ne filtrira nasilno, ' +
        'nego se pusti da sam sjedne i odstoji, pa u teglu ide onakav kakav je izašao iz sata.',
      link: 'Pogledajte proces',
      alt: 'Bagrem u cvatu nad pčelinjakom',
      src: '/images/pcelinjak/kartica.webp',
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
  ],

  pozadina: {
    alt: 'Tegla meda na ogradi, brdo iznad sela u pozadini',
    src: '/images/pcelinjak/pozadina.webp',
  },
};

const en: Copy = {
  meta: {
    title: 'Our apiaries',
    description:
      'Apiaries in Mračaj, Orašje and Otpočivaljka — meadows, acacia and linden near Prnjavor.',
  },
  hero: {
    title: ['Land', 'that', 'remembers'],
    slikaAlt: 'Hives on an open meadow under a clear sky',
    slika: '/images/real/pcelinjak-4.webp',
  },
  uvod: {
    title: ['Height,', 'silence,', 'and', 'light'],
    lead:
      'Our apiaries stand on twelve hectares of meadow above the village of Mračaj, near ' +
      'Prnjavor. At six hundred metres above sea level, ringed by acacia and wild flowers, they ' +
      'give honey that tastes a little different each year, yet keeps the same clarity and calm.',
  },
  galerija: [
    { alt: 'Hives in a row, seen down the line', omjer: '3:2', src: '/images/pcelinjak/traka-kosnice.webp' },
    { alt: 'Hives in the shade of the orchard', omjer: '4:3', src: '/images/pcelinjak/traka-hlad.webp' },
    { alt: 'A frame of capped honey with the harvest year written on it', omjer: '4:3', src: '/images/pcelinjak/traka-berba.webp' },
    { alt: 'Frames of comb up close', omjer: '2:3', src: '/images/pcelinjak/traka-ramovi.webp' },
    { alt: 'Honey running from the extractor into a jar', omjer: '2:3', src: '/images/pcelinjak/traka-vrcanje.webp' },
    { alt: 'Buckets of raw honey after extraction', omjer: '1:1', src: '/images/pcelinjak/traka-kante.webp' },
  ],
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
    slikaAlt: 'Bees at the entrance of an old hive',
    slika: '/images/pcelinjak/parcela.webp',
  },
  pase: {
    pretitle: 'Kinds of our honey',
    title: ['Green', 'heart', 'of', 'the', 'hill'],
    lista: [
      {
        key: 'livadski',
        tab: 'Meadow honey',
        znak: '/images/brand/sorta-livadski.svg',
        slika: '/images/pcelinjak/sorta-livadski.webp',
        mapaAlt: 'A jar of meadow honey on an open palm, hills and green meadow behind it',
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
        key: 'bagremov',
        tab: 'Acacia honey',
        znak: '/images/brand/sorta-bagremov.svg',
        slika: '/images/pcelinjak/sorta-bagremov.webp',
        mapaAlt: 'A hand holding a jar of acacia honey, hives behind it at sunset',
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
        key: 'meden',
        tab: 'Meden',
        znak: '/images/brand/sorta-meden.svg',
        slika: '/images/pcelinjak/sorta-meden.webp',
        mapaAlt: 'Jars of acacia and meadow honey on a wooden table, beside a smoker and hives',
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
    kvadratAlt: 'Jars filled with honey, lined up on a table',
    kvadrat: '/images/pcelinjak/hscroll-tegle.webp',
    kolone: [
      {
        heading: 'Rhythm',
        alt: 'A bee on an open palm',
        src: '/images/priroda/pcela-na-dlanu.webp',
        body:
          'Careful work has brought the old apiary back to the order it once had, and the ' +
          'colonies living on it now follow their yearly course without our interference:',
      },
      {
        heading: 'Resilience',
        alt: 'Honey running from the extractor into a glass jar',
        src: '/images/real/vrcaljka-tegla.webp',
        body:
          'smaller but denser colonies, deep-rooted forage that survives a drought, and old ' +
          'combs that serve the colony as a reserve — together they give a resilience you later ' +
          'see in the jar: steady quality year after year, clear body and',
      },
      {
        heading: 'Character',
        alt: 'A jar of meadow honey on a fence post, a mown meadow and a hill behind it',
        src: '/images/real/tegla-stub-livada.webp',
        body:
          'aromas that come from the age of the colonies and from how little we take. Sheltered ' +
          'and quiet, this slope is the true heart of the apiary, where beekeeping knowledge ' +
          'meets the patience of the land and gives an honest, lasting honey.',
      },
    ],
  },
  panorama: {
    alt: 'A basket of meadow and acacia honey and propolis, out in the meadow',
    src: '/images/pcelinjak/ploca.webp',
  },
  dalje: [
    {
      key: 'process',
      href: '/process',
      title: 'Our process',
      body:
        'From the first spring inspection to the last summer extraction, every step is done by ' +
        'hand and in an order that is never cut short. The honey is not heated or forced ' +
        'through a filter; it settles on its own and goes into the jar as it left the comb.',
      link: 'See the process',
      alt: 'Acacia in bloom above the apiary',
      src: '/images/pcelinjak/kartica.webp',
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
  ],

  pozadina: {
    alt: 'A jar of honey on a fence, the hill above the village behind it',
    src: '/images/pcelinjak/pozadina.webp',
  },
};

export const pcelinjak: Record<Locale, Copy> = { sr, en };
