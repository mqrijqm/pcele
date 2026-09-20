import type { Locale } from '@/i18n/config';

import { home, photoBreaks, processFrames, processPage, processStepImages } from './pages';

/**
 * Sadrzaj strane "Nas proces", slozen u raspored strane o pcelinjacima.
 *
 * Nista ovdje nije novo napisano: rijeci dolaze iz `pages.ts` (koraci, natpisi,
 * umetak o ramovima, opisi fotografija). Ovaj fajl samo ih razvrstava po
 * trakama rasporeda — naslov se lomi na rijeci jer svaka rijec na velikom
 * naslovu ulazi kao svoj element, isto kao na pcelinjacima.
 */

const rijeci = (s: string) => s.split(' ');

export type ProcessTrakaSlika = {
  alt: string;
  omjer: '3:2' | '4:3' | '2:3' | '1:1';
  src: string;
};

const build = (l: Locale) => {
  const c = processPage[l];
  const f = processFrames[l];
  const s = photoBreaks[l];

  return {
    hero: {
      title: rijeci(c.eyebrow),
      caption: s.processHives.caption,
      slikaAlt: s.processHives.altA,
      slika: '/images/real/pcelinjak-4.webp',
    },

    uvod: {
      pretitle: c.sectionEyebrow,
      title: rijeci(c.sectionHeading),
      lead: `${c.description.replace(' - ', ' — ')}. ${c.note}`,
    },

    koraci: c.steps.map((step, i) => ({
      broj: String(i + 1).padStart(2, '0'),
      ukupno: String(c.steps.length).padStart(2, '0'),
      title: rijeci(step.title),
      alt: step.title,
      desc: step.desc,
      src: processStepImages[i],
    })),

    /* Umetak prije trake: ramove pravimo sami. */
    ramovi: {
      pretitle: f.eyebrow,
      title: rijeci(f.heading),
      body: f.body,
    },

    galerija: [
      { alt: f.altA, omjer: '4:3', src: '/images/real/ram-2025.webp' },
      { alt: f.altB, omjer: '3:2', src: '/images/real/otklapanje-rama.webp' },
      { alt: s.processJar.altTap, omjer: '1:1', src: '/images/real/vrcaljka-kanta.webp' },
      { alt: s.processJar.altJars, omjer: '2:3', src: '/images/real/tegle-stol.webp' },
      { alt: s.processLabel.alt, omjer: '2:3', src: '/images/mockups/label-in-hands.webp' },
    ] satisfies ProcessTrakaSlika[],

    /* Zavrsna kartica: prva stoji otvorena, ostale su u redu ispod slike. */
    kraj: {
      title: c.outroHeading,
      link: c.outroCta,
      slika: { alt: home.vitrina[l].alt, src: '/images/pcelinjak/tegle-ograda.webp' },
      // Ukras iza kartice: nista se na njemu ne cita, pa mu ne treba opis.
      pozadina: { alt: '', src: '/images/pcelinjak/kosnice-hlad.webp' },
      dalje: [
        { key: 'products', href: '/products', title: home.vitrina[l].seal },
        { key: 'pcelinjak', href: '/pcelinjak', title: home.krajolik[l].cta },
      ],
    },
  };
};

export const processView: Record<Locale, ReturnType<typeof build>> = {
  sr: build('sr'),
  en: build('en'),
};
