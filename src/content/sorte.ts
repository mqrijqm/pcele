import type { Locale } from '@/i18n/config';

/**
 * Sadrzaj sekcije "Vrcamo ukus koji traje" — tri sorte, svaka sa svojim
 * crtezom i tri reda podataka.
 *
 * Nema vise boja po kartici: kartica nema. Sve tri sorte stoje na istom
 * papiru kao i ostatak strane, pa im je i mastilo isto — crtezi su prebojeni
 * u hero smedju (#73552E), a naslovi idu istim serifom kao svaki drugi naslov
 * na strani.
 *
 * Podaci se ne ponavljaju izmedju sorti. Ranije su livadski i propolis imali
 * isti red ("cvjetan / zlatan / jun–jul"), sto je za propolis bilo i netacno:
 * propolis nije med nego smola, gorka i smolasta, i prodaje se u kapima. Zato
 * treca sorta ima svoja tri reda, a ne tri ista.
 */

export type Sorta = {
  /** Kljuc se koristi i kao ime SVG fajla u /public/hero/sorte/. */
  key: 'livadski' | 'bagrem' | 'proplis';
  naziv: string;
  alt: string;
  /** Kratka recenica ispod naziva — jedna, ne opis. */
  nota: string;
  /**
   * Opticka tezina crteza nije ista: sace je gusto siano, bagremova grana je
   * tanka. Mjera izjednacava koliko mastila svaki od njih donese u red.
   */
  scale: number;
  redovi: { label: string; value: string }[];
  /** Gdje vodi naziv sorte. */
  slug: string;
};

type SorteCopy = {
  heading: string;
  lead: string;
  cta: string;
  sorte: Sorta[];
};

export const sorte: Record<Locale, SorteCopy> = {
  sr: {
    heading: 'Vrcamo ukus koji traje.',
    lead: 'Tri sorte iz istog pčelinjaka — svaka nosi pašu svog dijela ljeta.',
    cta: 'Svi proizvodi',
    sorte: [
      {
        key: 'livadski',
        naziv: 'Livadski med',
        alt: 'Crtež livadskog cvijeta',
        nota: 'Sa livada oko Mračaja, iz ljetne paše.',
        scale: 1,
        slug: 'livadski-med-1kg',
        redovi: [
          { label: 'Ukus', value: 'Cvjetan' },
          { label: 'Boja', value: 'Zlatna' },
          { label: 'Paša', value: 'Jun–jul' },
        ],
      },
      {
        key: 'bagrem',
        naziv: 'Bagremov med',
        alt: 'Crtež bagremove grane u cvatu',
        nota: 'Iz kratkog bagremovog cvata, prve paše u godini.',
        scale: 1.12,
        slug: 'bagremov-med-1kg',
        redovi: [
          { label: 'Ukus', value: 'Blag' },
          { label: 'Boja', value: 'Svijetlozlatna' },
          { label: 'Paša', value: 'Maj–jun' },
        ],
      },
      {
        key: 'proplis',
        naziv: 'Pčelinji propolis',
        alt: 'Crtež saća s propolisom',
        nota: 'Smola iz košnice, cijeđena u bočicu s kapaljkom.',
        scale: 0.9,
        slug: 'pcelinji-propolis-20ml',
        redovi: [
          { label: 'Ukus', value: 'Gorak' },
          { label: 'Miris', value: 'Smolast' },
          { label: 'Oblik', value: 'Kapi' },
        ],
      },
    ],
  },
  en: {
    heading: 'We spin a taste that lasts.',
    lead: 'Three varieties from one apiary — each carries the forage of its own stretch of summer.',
    cta: 'All products',
    sorte: [
      {
        key: 'livadski',
        naziv: 'Meadow honey',
        alt: 'Drawing of a meadow flower',
        nota: 'From the meadows around Mračaj, out of the summer forage.',
        scale: 1,
        slug: 'livadski-med-1kg',
        redovi: [
          { label: 'Taste', value: 'Floral' },
          { label: 'Colour', value: 'Golden' },
          { label: 'Forage', value: 'Jun–Jul' },
        ],
      },
      {
        key: 'bagrem',
        naziv: 'Acacia honey',
        alt: 'Drawing of an acacia branch in bloom',
        nota: 'From the short acacia bloom, the first forage of the year.',
        scale: 1.12,
        slug: 'bagremov-med-1kg',
        redovi: [
          { label: 'Taste', value: 'Mild' },
          { label: 'Colour', value: 'Pale gold' },
          { label: 'Forage', value: 'May–Jun' },
        ],
      },
      {
        key: 'proplis',
        naziv: 'Bee propolis',
        alt: 'Drawing of honeycomb with propolis',
        nota: 'Resin from the hive, drawn into a dropper bottle.',
        scale: 0.9,
        slug: 'pcelinji-propolis-20ml',
        redovi: [
          { label: 'Taste', value: 'Bitter' },
          { label: 'Aroma', value: 'Resinous' },
          { label: 'Form', value: 'Drops' },
        ],
      },
    ],
  },
};
