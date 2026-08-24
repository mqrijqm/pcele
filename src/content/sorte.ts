import type { Locale } from '@/i18n/config';

/**
 * Sadrzaj sekcije "Vrcamo ukus koji traje" — tri sorte, svaka sa svojim
 * crtezom i tri reda podataka.
 *
 * Boje kartica su ocitane iz referentnih maketa (livadski.png, bagren.png,
 * propa.png): kremaste kartice nose smedji naslov, bijela nosi zlatni. Zlatna
 * na kremastoj daje kontrast 1.99:1, sto je premalo i za ovako krupna slova —
 * zato zlatna ide samo tamo gdje pozadina to podnese.
 */

export type Sorta = {
  /** Kljuc se koristi i kao ime SVG fajla u /public/hero/sorte/. */
  key: 'livadski' | 'bagrem' | 'proplis';
  naziv: string;
  alt: string;
  /** Pozadina kartice. */
  bg: string;
  /** Boja naziva — smedja na kremastoj, zlatna na bijeloj. */
  nazivBoja: string;
  redovi: { label: string; value: string }[];
};

type SorteCopy = {
  heading: string[];
  cta: string;
  /** Nevidljiv naslov sekcije za citace ekrana. */
  srHeading: string;
  /** Pristupacni opis trake za listanje. */
  regionLabel: string;
  sorte: Sorta[];
};

const KREM = '#FCF0D3';
const BIJELA = '#FFFFFF';
const SMEDJA = '#845C34';
const ZLATNA = '#C9A961';

export const sorte: Record<Locale, SorteCopy> = {
  sr: {
    heading: ['Vrcamo Ukus', 'Koji Traje'],
    cta: 'Poruči Odmah',
    srHeading: 'Sorte meda',
    regionLabel: 'Sorte meda — listaj vodoravno',
    sorte: [
      {
        key: 'livadski',
        naziv: 'livadski MED',
        alt: 'Crtež livadskog cvijeta',
        bg: KREM,
        nazivBoja: SMEDJA,
        redovi: [
          { label: 'Ukus/Miris', value: 'CVJETAN' },
          { label: 'Boja', value: 'ZLATAN' },
          { label: 'Sezona', value: 'JUN–JUL' },
        ],
      },
      {
        key: 'bagrem',
        naziv: 'bagremov MED',
        alt: 'Crtež bagremovog cvijeta',
        bg: BIJELA,
        nazivBoja: ZLATNA,
        redovi: [
          { label: 'Ukus/Miris', value: 'BAGREM' },
          { label: 'Boja', value: 'ŽUTA' },
          { label: 'Sezona', value: 'MAJ–JUN' },
        ],
      },
      {
        key: 'proplis',
        naziv: 'proplis od MEDA',
        alt: 'Crtež saća s propolisom',
        bg: KREM,
        nazivBoja: SMEDJA,
        redovi: [
          { label: 'Ukus/Miris', value: 'CVJETAN' },
          { label: 'Boja', value: 'ZLATAN' },
          { label: 'Sezona', value: 'JUN–JUL' },
        ],
      },
    ],
  },
  en: {
    heading: ['We Spin a Taste', 'That Lasts'],
    cta: 'Order Now',
    srHeading: 'Honey varieties',
    regionLabel: 'Honey varieties — scroll sideways',
    sorte: [
      {
        key: 'livadski',
        naziv: 'meadow HONEY',
        alt: 'Drawing of a meadow flower',
        bg: KREM,
        nazivBoja: SMEDJA,
        redovi: [
          { label: 'Taste/Aroma', value: 'FLORAL' },
          { label: 'Colour', value: 'GOLDEN' },
          { label: 'Season', value: 'JUN–JUL' },
        ],
      },
      {
        key: 'bagrem',
        naziv: 'acacia HONEY',
        alt: 'Drawing of an acacia blossom',
        bg: BIJELA,
        nazivBoja: ZLATNA,
        redovi: [
          { label: 'Taste/Aroma', value: 'ACACIA' },
          { label: 'Colour', value: 'YELLOW' },
          { label: 'Season', value: 'MAY–JUN' },
        ],
      },
      {
        key: 'proplis',
        naziv: 'propolis in HONEY',
        alt: 'Drawing of honeycomb with propolis',
        bg: KREM,
        nazivBoja: SMEDJA,
        redovi: [
          { label: 'Taste/Aroma', value: 'FLORAL' },
          { label: 'Colour', value: 'GOLDEN' },
          { label: 'Season', value: 'JUN–JUL' },
        ],
      },
    ],
  },
};
