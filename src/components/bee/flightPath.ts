/**
 * Putanja leta.
 *
 * Tacke su nacrtane preko stvarnog rasporeda pocetne strane, izmerenog na
 * 1434 x 14090 px. Cuvaju se kao *razlomci* te mere (0..1), pa se u trenutku
 * crtanja mnoze stvarnom sirinom prozora i stvarnom visinom dokumenta. Zato
 * putanja prati sekcije i kad se visina strane promeni — a promenice se, jer
 * slike i fontovi stizu naknadno.
 *
 * Vazno: x i y nisu u istoj razmeri (1% sirine je ~14 px, 1% visine ~141 px),
 * zato se tacke pisu u referentnim pikselima i tek onda dele. Ono sto ovde
 * izgleda kao krug, na strani i jeste krug.
 */

export type Pt = [number, number];

/** Raspored preko kojeg su tacke nacrtane. */
export const REF = { w: 1434, h: 15636 };

/** Prolazak kroz niz tacaka, ili petlja oko centra. */
export type Leg = { through: Pt[] } | { loop: { c: Pt; r: number; from?: number } };

/**
 * Desktop ruta. Krece lijevo od vrha isprekidane strelice — dovoljno da je
 * strelica ne dodiruje, a da i dalje pokazuje na nju — pa se spusta kroz
 * heroj oko tegle. Tih prvih sest tacaka je crtano okom, preko heroja, i tu
 * ostaje.
 *
 * Ispod heroja tacke su izmjerene, ne pogodjene: za svakih 380 px visine
 * potrazen je najsiri pojas u kojem na toj visini nema nijednog naslova, reda
 * s podacima, citata, linka ni dugmeta (sa 56 px zracnosti oko svakog), pa
 * ruta ide kroz te pojase. Preko fotografije i preko obicnog pasusa smije —
 * preko naslova i podataka ne.
 *
 * Petlje vise nema: vrtjela se oko mreze izdvojenih proizvoda koje na strani
 * vise nema, a i sama je bila okret radi okreta.
 */
export const DESKTOP: Leg[] = [
  {
    through: [
      /*
       * Polazak lijevo od strelice, i lijevo od wordmarka — ne samo iznad
       * njega. Visina pcele se racuna od visine cijele strane, a wordmark
       * sjedi u heroju cija se visina mijenja drugacije; na 768 su se to dvoje
       * poklopili i pcela je sletjela na samo ime.
       */
      [200, 210],
      [900, 660],
      [1180, 1350],
      [520, 2050],  // tegla
      [700, 2650],
      /*
       * Kamilica u donjem desnom uglu sekcije s teglom. Cvijet je stvarna
       * stvar na strani (`.hero-jar__bloom`), ne tacka nacrtana okom — ako se
       * njegov polozaj ili velicina promijene u CSS-u, ova tacka ide s njim.
       *
       * Visina je birana tako da pcela stigne pri kraju pina, kad pecat i
       * cvijet vec iskoce: sekcija je tada jos zakovana, pa cvijet stoji u
       * kadru i pcela ima na sta da sleti.
       */
      [1202, 3342], // cvijet
      [1140, 3800], // ispod heroja pocinju izmjerene tacke
      [1381, 4370], // uz desnu ivicu: sorte drze cijelu mjeru teksta
      [1330, 5750], // naslov nasljedja ide skoro preko cijele mjere
      [900, 6600],
      [1276, 7220],
      [900, 8200],
      [560, 9200],
      [200, 10260],
      [81, 10900],  // uz lijevu ivicu
      [400, 11500],
      [1339, 11900], // desno prije utisaka, da ih ne presijece u dolasku
      [1250, 12600], // i desno dok utisci ne prodju
      [120, 13150], // pitanja drze mjeru teksta, ostaje lijeva margina
      [90, 13400],
      [1148, 13950],
      [310, 14440],
      [388, 14950], // zavrsava iznad podnozja
    ],
  },
];

/**
 * Telefon: kraca i mirnija ruta. Nema petlje — na 390 px sirine krug bi bio
 * grcevit — nego mirno njihanje lijevo-desno niz stranu.
 *
 * Ovdje se pojas ne moze mjeriti: na ovoj sirini slog ide preko cijele strane
 * i slobodnog pojasa gotovo nigdje nema. Zato pcela ostaje u margini uz samu
 * ivicu, tamo gdje slog ionako ne stize.
 */
export const MOBILE_REF = { w: 384, h: 13478 };

export const MOBILE: Leg[] = [
  {
    through: [
      [40, 128], // polazak: lijevo od vrha strelice, kao i na desktopu
      [230, 520],
      [310, 750],
      [40, 1700],
      [344, 2800],
      [40, 3900],
      [344, 5000],
      [40, 6100],
      [344, 7200],
      [40, 8300],
      [344, 9400],
      [40, 10500],
      [344, 11600],
      [40, 12500],
      [200, 13200],
    ],
  },
];


/* --------------------------------------------------------------- proces ----
 * Strana "Nas proces". Ruta krece uz heroj, pa se spusta niz korake — koraci
 * se smjenjuju lijevo-desno, pa pcela ide izmedju njih.
 *
 * Mjereno na 1434 x 8163 (desktop) i 384 x 6440 (telefon).
 */
export const PROCESS_REF = { w: 1434, h: 8163 };

export const PROCESS: Leg[] = [
  {
    through: [
      [200, 230], // polazak: uz heroj, iznad kartice
      [700, 520],
      [1180, 900],
      [420, 1500],
      [1150, 2200],
      [380, 2950],
      [1150, 3700],
      [420, 4450],
      [1150, 5200],
      [400, 5950],
      [1080, 6550],
      [560, 7050], // zavrsava iznad podnozja
    ],
  },
];

export const PROCESS_MOBILE_REF = { w: 384, h: 6440 };

export const PROCESS_MOBILE: Leg[] = [
  {
    through: [
      [60, 190],
      [280, 460],
      [90, 1000],
      [290, 1600],
      [100, 2250],
      [290, 2900],
      [100, 3550],
      [290, 4200],
      [110, 4850],
      [280, 5400],
      [150, 5850],
    ],
  },
];


/* ---------------------------------------------------------------- o nama ---
 * Strana "O nama". Isti smisao kao na procesu: krece uz uvod, pa se spusta
 * niz stranu izmedju blokova. Mjere se popravljaju posle prvog gledanja.
 */
export const ABOUT_REF = { w: 1434, h: 9000 };

export const ABOUT: Leg[] = [
  {
    through: [
      [250, 260],
      [800, 560],
      [1180, 1050],
      [420, 1750],
      [1150, 2500],
      [380, 3250],
      [1150, 4050],
      [430, 4800],
      [1150, 5550],
      [420, 6300],
      [1080, 7000],
      [600, 7600],
    ],
  },
];

export const ABOUT_MOBILE_REF = { w: 384, h: 7200 };

export const ABOUT_MOBILE: Leg[] = [
  {
    through: [
      [70, 210],
      [290, 520],
      [90, 1150],
      [290, 1850],
      [100, 2550],
      [290, 3250],
      [100, 3950],
      [290, 4650],
      [120, 5350],
      [270, 6000],
      [150, 6550],
    ],
  },
];

/*
 * Rute po stranicama. Pcela je ista, mijenja se samo kuda leti.
 */
export const ROUTES = {
  home: {
    desktop: { legs: DESKTOP, ref: REF },
    mobile: { legs: MOBILE, ref: MOBILE_REF },
  },
  process: {
    desktop: { legs: PROCESS, ref: PROCESS_REF },
    mobile: { legs: PROCESS_MOBILE, ref: PROCESS_MOBILE_REF },
  },
  about: {
    desktop: { legs: ABOUT, ref: ABOUT_REF },
    mobile: { legs: ABOUT_MOBILE, ref: ABOUT_MOBILE_REF },
  },
} as const;

export type RouteName = keyof typeof ROUTES;

/** Prva tacka rute — tu pcela stoji kad je pokret iskljucen. */
export function startPoint(legs: readonly Leg[]): Pt {
  const first = legs[0];
  return 'through' in first ? first.through[0] : [first.loop.c[0], first.loop.c[1] - first.loop.r];
}

/** Catmull-Rom kroz tacke -> kubicne Bezierove krive. Glatko, bez uglova. */
function spline(pts: Pt[], tension = 1): string {
  if (pts.length < 2) return '';
  const p = pts;
  let d = `M ${r(p[0][0])} ${r(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const k = tension / 6;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C ${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}

/** Krug od cetiri kubne krive, u smeru kazaljke, od najvise tacke. */
function circle(cx: number, cy: number, rad: number): string {
  const k = rad * 0.5522847498;
  return (
    ` C ${r(cx + k)} ${r(cy - rad)} ${r(cx + rad)} ${r(cy - k)} ${r(cx + rad)} ${r(cy)}` +
    ` C ${r(cx + rad)} ${r(cy + k)} ${r(cx + k)} ${r(cy + rad)} ${r(cx)} ${r(cy + rad)}` +
    ` C ${r(cx - k)} ${r(cy + rad)} ${r(cx - rad)} ${r(cy + k)} ${r(cx - rad)} ${r(cy)}` +
    ` C ${r(cx - rad)} ${r(cy - k)} ${r(cx - k)} ${r(cy - rad)} ${r(cx)} ${r(cy - rad)}`
  );
}

const r = (n: number) => Math.round(n * 10) / 10;

/**
 * Sklapa `d` za dati prozor. `legs` su u referentnim pikselima, `ref` je
 * raspored preko kojeg su crtane, a `w`/`h` su stvarne mere sada.
 */
export function buildPath(
  legs: readonly Leg[],
  ref: { w: number; h: number },
  w: number,
  h: number,
): string {
  const sx = w / ref.w;
  const sy = h / ref.h;
  const s = (p: Pt): Pt => [p[0] * sx, p[1] * sy];

  let d = '';
  for (const leg of legs) {
    if ('through' in leg) {
      const seg = spline(leg.through.map(s));
      // Nastavak se nadovezuje: prvo M se izbacuje ako vec crtamo.
      d += d ? seg.replace(/^M[^C]*/, '') : seg;
    } else {
      const [cx, cy] = s(leg.loop.c);
      // Poluprecnik se skalira po sirini, pa se krug ne rastegne u jaje
      // kad se strana produzi.
      const rad = leg.loop.r * sx;
      if (!d) d = `M ${r(cx)} ${r(cy - rad)}`;
      d += circle(cx, cy, rad);
    }
  }
  return d.trim();
}
