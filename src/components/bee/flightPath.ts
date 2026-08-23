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
export const REF = { w: 1434, h: 14090 };

/** Prolazak kroz niz tacaka, ili petlja oko centra. */
export type Leg = { through: Pt[] } | { loop: { c: Pt; r: number; from?: number } };

/**
 * Desktop ruta. Krece tacno pod vrhom isprekidane strelice, tako da strelica
 * iz napisa "Listaj i prati pcelu" pokazuje bas na nju. Zatim se spusta kroz
 * teglu, preseca "O nama" dijagonalno, napravi pun krug oko izdvojenih
 * proizvoda i izlazi kod podnozja.
 */
export const DESKTOP: Leg[] = [
  {
    through: [
      [395, 243],    // polazak: tacno pod vrhom isprekidane strelice
      [900, 660],
      [1180, 1350],
      [520, 2050],   // tegla
      [250, 2680],
      [960, 3260],
      [1160, 3900],
      [640, 4400],
      [250, 4820],   // ulazi u "O nama"
      [720, 5120],
      [1160, 5400],  // izlazi iz "O nama"
      [1240, 5960],
      [820, 6420],
      [717, 6700],   // dolazi na vrh petlje
    ],
  },
  { loop: { c: [717, 7040], r: 340 } }, // pun krug oko izdvojenih proizvoda
  {
    through: [
      [717, 6700],
      [1080, 7500],
      [1180, 8500],
      [520, 9200],   // utisci
      [280, 9950],
      [880, 10600],
      [1150, 11250], // pitanja
      [600, 11850],
      [340, 12400],
      [820, 12850],
      [1060, 13150], // zavrsava tik iznad podnozja
    ],
  },
];

/**
 * Telefon: kraca i mirnija ruta. Nema petlje — na 390 px sirine krug bi bio
 * grcevit — nego samo mirno njihanje levo-desno niz stranu.
 */
export const MOBILE_REF = { w: 390, h: 13919 };

export const MOBILE: Leg[] = [
  {
    through: [
      [88, 128], // polazak: pod vrhom strelice, kao i na desktopu
      [230, 520],
      [310, 750],
      [90, 1575],
      [300, 2485],
      [110, 3560],
      [290, 4640],
      [100, 5800],
      [300, 6795],
      [120, 7955],
      [290, 9115],
      [110, 10275],
      [280, 11350],
      [150, 12430],
      [250, 13175],
    ],
  },
];

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
export function buildPath(legs: Leg[], ref: { w: number; h: number }, w: number, h: number): string {
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
