import fs from 'fs';

const W = 720, H = 720, FR = 147, FSZ = W * H * 3;
const src = fs.readFileSync('full.raw');

/* Ciljne boje — iz palete sajta, ne iz snimka. */
const PAPER = [0xF5, 0xE8, 0xD8];   // --paper
const HONEY = [0xE5, 0xCD, 0xA1];   // --gold na ~32% preko papira
const INK   = [0x1E, 0x17, 0x10];   // toplo tamna umesto hladnog crnog

const SRC_BG = 240;                 // crvena pozadine u snimku
const JAR = { x0: 214, x1: 508, y0: 150, y1: 545 };  // dno tegle je 545; nize je natpis
const BEE = { x0: 226, x1: 298, y0: 102, y1: 174 };
const SCAN = { y0: 165, y1: 535 };

const R = (f,x,y) => src[f*FSZ + (y*W+x)*3];
const G = (f,x,y) => src[f*FSZ + (y*W+x)*3+1];
const B = (f,x,y) => src[f*FSZ + (y*W+x)*3+2];

/* --- zidovi tegle -------------------------------------------------------- */
/* Tegla stoji u mestu kroz ceo snimak, pa se ivice mere jednom za sve kadrove. */
const left = new Int16Array(H).fill(-1), right = new Int16Array(H).fill(-1);
for (let y = JAR.y0; y <= JAR.y1; y++) {
  let l = -1, r = -1;
  for (const f of [0, 30, 70, 110, 146])
    for (let x = JAR.x0; x <= JAR.x1; x++)
      if (R(f,x,y) < 170) { if (l < 0 || x < l) l = x; if (x > r) r = x; }
  left[y] = l; right[y] = r;
}

/* --- povrs meda ---------------------------------------------------------- */
/*
 * Med se ne trazi po boji: u snimku je jedva pet nijansi tamniji od pozadine,
 * a odsjaji u staklu su isto toliko — pa je svako merenje po boji lagalo da je
 * tegla puna. Trazi se sama elipsa povrsi, i to oduzimanjem prvog kadra:
 * sve sto je crno a u kadru 0 nije bilo, jedina je linija koja se pomera.
 *
 * Elipsa u redovima daje dva zgusnjenja — zadnji luk gore, prednji dole — a
 * izmedju njih samo svoje bokove. Odatle i gornja i donja ivica povrsi.
 */
const yTop = new Int16Array(FR).fill(-1), yFull = new Int16Array(FR).fill(-1);
for (let f = 1; f < FR; f++) {
  const moving = new Int16Array(H);
  for (let y = SCAN.y0; y <= SCAN.y1; y++) {
    if (left[y] < 0) continue;
    let n = 0;
    for (let x = left[y] + 6; x <= right[y] - 6; x++)
      if (R(f,x,y) < 195 && R(0,x,y) >= 212) n++;
    moving[y] = n;
  }
  let top = -1;
  for (let y = SCAN.y0; y <= SCAN.y1; y++) if (moving[y] >= 25) { top = y; break; }
  if (top < 0) continue;
  let full = top;
  for (let y = top; y <= Math.min(SCAN.y1, top + 90); y++) if (moving[y] >= 25) full = y;
  yTop[f] = top; yFull[f] = full;
}
/* Prvi kadrovi nemaju sta da oduzmu od sebe — nasledjuju prvo pravo merenje. */
const first = Array.from(yTop).findIndex((v) => v > 0);
for (let f = 0; f < first; f++) { yTop[f] = yTop[first]; yFull[f] = yFull[first]; }
/* Nivo moze samo da raste; kadar bez merenja nasledjuje prethodni. */
for (let f = 1; f < FR; f++) {
  if (yTop[f] < 0 || yTop[f] > yTop[f-1]) { yTop[f] = yTop[f-1]; yFull[f] = yFull[f-1]; }
}

/* --- iscrtavanje --------------------------------------------------------- */
const out = Buffer.alloc(FR * FSZ);
const sstep = (a,b,v) => { const t = Math.min(1, Math.max(0,(v-a)/(b-a))); return t*t*(3-2*t); };

for (let f = 0; f < FR; f++) {
  /* Gornja granica meda je zadnji luk elipse: u sredini je na yTop, uz zidove pada na yFull. */
  const bound = new Float32Array(W).fill(1e6);
  const yl = yFull[f], yt = yTop[f];
  if (yl > 0) {
    const cx = (left[yl] + right[yl]) / 2, hw = (right[yl] - left[yl]) / 2;
    for (let x = JAR.x0; x <= JAR.x1; x++) {
      const u = Math.min(1, Math.abs(x - cx) / hw);
      bound[x] = yt + (yl - yt) * (1 - Math.sqrt(1 - u*u));
    }
  }

  /* Fotografska pcela je jedino zasiceno u kadru, pa se skida ključem po zasicenju. */
  const bee = new Float32Array(W*H), dil = new Float32Array(W*H);
  for (let y = BEE.y0; y <= BEE.y1; y++) for (let x = BEE.x0; x <= BEE.x1; x++) {
    const r = R(f,x,y), g = G(f,x,y), b = B(f,x,y);
    bee[y*W+x] = sstep(26, 34, Math.max(r,g,b) - Math.min(r,g,b));
  }
  for (let y = BEE.y0; y <= BEE.y1; y++) for (let x = BEE.x0; x <= BEE.x1; x++) {
    let m = 0;
    for (let dy=-3; dy<=3; dy++) for (let dx=-3; dx<=3; dx++) { const v = bee[(y+dy)*W+(x+dx)] || 0; if (v > m) m = v; }
    dil[y*W+x] = m;
  }

  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const r = R(f,x,y);
    /*
     * Mastilo u snimku je crno preko svetle podloge, pa mu je pokrivenost
     * (240 - r) / 240. Nova boja je smedja, dakle svetlija od crne — bez ove
     * game bi svaka linija ispala tanja nego u originalu.
     */
    const ink = Math.pow(Math.min(1, Math.max(0, (SRC_BG - r) / SRC_BG)), 0.82);
    let honey = 0;
    if (y >= JAR.y0 && y <= JAR.y1 && left[y] >= 0 && x > left[y] && x < right[y])
      honey = sstep(bound[x] - 1, bound[x] + 2, y);
    /*
     * Pipci i vrhovi krila su tanki i sivi kao potez, pa ih kljuc po zasicenju
     * ne uhvati. Iznad y=157 nema nista od tegle — sve tu je pcela, i brise se
     * bez pitanja. Ispod toga pocinje obod, pa odlucuje samo zasicenje.
     */
    const band = (x >= BEE.x0 && x <= BEE.x1 && y >= BEE.y0) ? 1 - sstep(151, 158, y) : 0;
    const beeA = Math.max(dil[y*W+x] || 0, band);

    const o = f*FSZ + (y*W+x)*3;
    for (let c = 0; c < 3; c++) {
      const base = PAPER[c] + (HONEY[c] - PAPER[c]) * honey;
      let v = base + (INK[c] - base) * ink;
      v += (PAPER[c] - v) * beeA;
      out[o+c] = Math.round(Math.min(255, Math.max(0, v)));
    }
  }
}
fs.writeFileSync('out.raw', out);
console.log('yTop :', Array.from(yTop).join(','));
