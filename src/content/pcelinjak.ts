import type { Locale } from '@/i18n/config';

/**
 * Sadrzaj strane "Nasi pcelinjaci".
 *
 * Raspored strane je preuzet sa moncalisse.com/en/vineyards: isti niz traka,
 * ista sirinska skala, isti odnos naslova prema tekstu. Preuzet je raspored,
 * ne tekst — svaka recenica ovdje je nasa i govori o pcelinjacima.
 *
 * NAPOMENA: uz zadatak nije stigao storytelling tekst, pa je ovo napisano iz
 * podataka koje sajt vec nosi — tri sela oko Prnjavora, 1980, bagremova i
 * livadska pasa, vrcanje u malim serijama. Rijeci su za zamjenu; raspored ne
 * zavisi od njihove duzine.
 */

export type Pcelinjak = {
  key: string;
  naziv: string;
  slika: string;
  alt: string;
  redovi: { label: string; value: string }[];
};

type Copy = {
  meta: { title: string; description: string };
  hero: { pretitle: string; title: string; lead: string };
  uvod: { pretitle: string; title: string; body: string[] };
  istaknuti: { pretitle: string; title: string; body: string; alt: string };
  mjesta: { pretitle: string; title: string; lista: Pcelinjak[] };
  prica: { title: string; body: string[]; altA: string; altB: string };
  zavrsna: { alt: string };
  poziv: { pretitle: string; title: string; cta: string; ctaSecondary: string };
};

export const pcelinjak: Record<Locale, Copy> = {
  sr: {
    meta: {
      title: 'Naši pčelinjaci',
      description:
        'Tri pčelinjaka u selima nadomak Prnjavora — Mračaj, Orašje i Otpočivaljka. Paša, košnice i sezona za svaki od njih.',
    },
    hero: {
      pretitle: 'Mračaj · Orašje · Otpočivaljka',
      title: 'Naši pčelinjaci',
      lead: 'Tri mjesta, jedna sezona, i pčele koje same biraju odakle nose.',
    },
    uvod: {
      pretitle: 'Nadomak Prnjavora',
      title: 'Visina, tišina i paša',
      body: [
        'Naši pčelinjaci stoje u tri sela oko Prnjavora, na obroncima iznad njiva i uz rub šume. Nijedan nije na istoj visini ni okrenut na istu stranu, pa se ni paša ne otvara istog dana — bagrem uz šumu procvjeta prije nego livada niže u polju.',
        'Košnice ne selimo za pašom. Ostaju gdje jesu, godinama, i uzimaju ono što im je nadohvat. Zato med iz jednog pčelinjaka nije isti kao med iz drugog, ni od jedne godine do druge.',
      ],
    },
    istaknuti: {
      pretitle: 'Najstariji red',
      title: 'Mračaj',
      body:
        'Ovdje je 1980. stajala prva košnica. Red je od tada rastao uz istu ogradu, uz njivu koja se kosi svakog ljeta, pa je paša tu najravnomjernija — livadska od maja do jula, s bagremom uz šumu na početku sezone.',
      alt: 'Red plavih i žutih košnica uz njivu u Mračaju',
    },
    mjesta: {
      pretitle: 'Gdje stoje',
      title: 'Tri pčelinjaka',
      lista: [
        {
          key: 'mracaj',
          naziv: 'Mračaj',
          slika: '/images/pcelinjak/kosnice-livada.webp',
          alt: 'Košnice u livadi u Mračaju, iza njih pokošena njiva',
          redovi: [
            { label: 'Paša', value: 'Livadska, bagrem uz šumu' },
            { label: 'Košnice', value: 'Najstariji red, od 1980.' },
            { label: 'Sezona', value: 'Maj — jul' },
          ],
        },
        {
          key: 'orasje',
          naziv: 'Orašje',
          slika: '/images/pcelinjak/kosnice-drvece.webp',
          alt: 'Košnice među drvećem u Orašju',
          redovi: [
            { label: 'Paša', value: 'Bagremova, uz rub šume' },
            { label: 'Košnice', value: 'U hladu, okrenute na istok' },
            { label: 'Sezona', value: 'Kraj maja — jun' },
          ],
        },
        {
          key: 'otpocivaljka',
          naziv: 'Otpočivaljka',
          slika: '/images/pcelinjak/kosnice-hlad.webp',
          alt: 'Košnice pod drvetom u Otpočivaljci, polje iza njih',
          redovi: [
            { label: 'Paša', value: 'Livadska, s obronaka' },
            { label: 'Košnice', value: 'Najviši položaj od tri' },
            { label: 'Sezona', value: 'Jun — jul' },
          ],
        },
      ],
    },
    prica: {
      title: 'Sezona se ne požuruje',
      body: [
        'Vrcamo kad je med zreo, ne kad nam odgovara. Ram se otklopi tek kad ga pčele same zatvore voskom — dotle je u njemu previše vode i med bi se ukiselio prije nego dođe do tegle.',
        'Zato se sezona ne mjeri u danima nego u redovima: koliko je ramova spremno, toliko se i vrca. Ostatak čeka sljedeći obilazak.',
      ],
      altA: 'Tegle livadskog meda na drvenoj ogradi uz šumu',
      altB: 'Košnice izbliza, plavo i žuto, polje iza njih',
    },
    zavrsna: { alt: 'Tegla meda na stubu ograde, brdo iza nje' },
    poziv: {
      pretitle: 'Dođite po med',
      title: 'Najbolje se kupuje na licu mjesta',
      cta: 'Kontaktirajte nas',
      ctaSecondary: 'Naši proizvodi',
    },
  },

  en: {
    meta: {
      title: 'Our apiaries',
      description:
        'Three apiaries in villages outside Prnjavor — Mračaj, Orašje and Otpočivaljka. Forage, hives and season for each.',
    },
    hero: {
      pretitle: 'Mračaj · Orašje · Otpočivaljka',
      title: 'Our apiaries',
      lead: 'Three places, one season, and bees that choose for themselves where to gather.',
    },
    uvod: {
      pretitle: 'Outside Prnjavor',
      title: 'Height, quiet and forage',
      body: [
        'Our apiaries stand in three villages around Prnjavor, on slopes above the fields and along the edge of the woods. No two sit at the same height or face the same way, so the forage does not open on the same day — the acacia by the wood flowers before the meadow lower down.',
        'We do not move the hives to follow the forage. They stay where they are, for years, and take what is within reach. So honey from one apiary is not the honey from another, nor the same from one year to the next.',
      ],
    },
    istaknuti: {
      pretitle: 'The oldest row',
      title: 'Mračaj',
      body:
        'The first hive stood here in 1980. The row has grown along the same fence ever since, beside a field mown every summer, which makes the forage steadiest here — meadow from May to July, with acacia by the wood at the start of the season.',
      alt: 'A row of blue and yellow hives beside a field in Mračaj',
    },
    mjesta: {
      pretitle: 'Where they stand',
      title: 'Three apiaries',
      lista: [
        {
          key: 'mracaj',
          naziv: 'Mračaj',
          slika: '/images/pcelinjak/kosnice-livada.webp',
          alt: 'Hives in a meadow at Mračaj, a mown field behind them',
          redovi: [
            { label: 'Forage', value: 'Meadow, acacia by the wood' },
            { label: 'Hives', value: 'The oldest row, since 1980' },
            { label: 'Season', value: 'May — July' },
          ],
        },
        {
          key: 'orasje',
          naziv: 'Orašje',
          slika: '/images/pcelinjak/kosnice-drvece.webp',
          alt: 'Hives among the trees at Orašje',
          redovi: [
            { label: 'Forage', value: 'Acacia, along the wood' },
            { label: 'Hives', value: 'In shade, facing east' },
            { label: 'Season', value: 'Late May — June' },
          ],
        },
        {
          key: 'otpocivaljka',
          naziv: 'Otpočivaljka',
          slika: '/images/pcelinjak/kosnice-hlad.webp',
          alt: 'Hives under a tree at Otpočivaljka, a field behind them',
          redovi: [
            { label: 'Forage', value: 'Meadow, off the slopes' },
            { label: 'Hives', value: 'The highest of the three' },
            { label: 'Season', value: 'June — July' },
          ],
        },
      ],
    },
    prica: {
      title: 'The season is not hurried',
      body: [
        'We extract when the honey is ripe, not when it suits us. A frame is uncapped only once the bees have sealed it themselves — before that it holds too much water and would sour before it reached the jar.',
        'So the season is counted in rows rather than days: as many frames as are ready, that is what is extracted. The rest waits for the next visit.',
      ],
      altA: 'Jars of meadow honey on a wooden fence by the wood',
      altB: 'Hives close up, blue and yellow, a field behind',
    },
    zavrsna: { alt: 'A jar of honey on a fence post, a hill behind it' },
    poziv: {
      pretitle: 'Come for the honey',
      title: 'It is best bought where it is made',
      cta: 'Get in touch',
      ctaSecondary: 'Our products',
    },
  },
};
