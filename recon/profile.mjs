/**
 * Row / column profiles for a colour inside a region — the honest way to find
 * a text band when neighbouring artwork shares the same hue.
 *
 *   node recon/profile.mjs <image> <mode> [x,y,w,h]
 *     mode: headline | label | solid
 */
import { readPixels } from './measure.mjs';

const COLOURS = {
  headline: [0xa9, 0x6f, 0x36],
  label: [0x5c, 0x38, 0x14],
};

const [file, mode = 'headline', regionArg] = process.argv.slice(2);
const px = readPixels(file);
const { w, h, raw } = px;
const region = regionArg ? regionArg.split(',').map(Number) : [0, 0, w, h];
const [rx, ry, rw, rh] = region;

const hit = (x, y) => {
  const i = (y * w + x) * 3;
  if (mode === 'solid') {
    // not-paper
    return !(
      Math.abs(raw[i] - 0xfc) <= 12 &&
      Math.abs(raw[i + 1] - 0xf8) <= 12 &&
      Math.abs(raw[i + 2] - 0xdc) <= 12
    );
  }
  const [tr, tg, tb] = COLOURS[mode];
  const tol = mode === 'label' ? 26 : 30;
  return (
    Math.abs(raw[i] - tr) <= tol && Math.abs(raw[i + 1] - tg) <= tol && Math.abs(raw[i + 2] - tb) <= tol
  );
};

console.log(`${file} — ${mode} in [${rx},${ry},${rw},${rh}]\n`);

const rows = [];
for (let y = ry; y < ry + rh; y++) {
  let n = 0;
  for (let x = rx; x < rx + rw; x++) if (hit(x, y)) n++;
  rows.push([y, n]);
}
const live = rows.filter(([, n]) => n > 0);
console.log('rows with pixels:', live.length ? `${live[0][0]} … ${live[live.length - 1][0]}` : 'none');

// contiguous bands, ignoring gaps of 3 rows or fewer
const bands = [];
let cur = null;
for (const [y, n] of rows) {
  if (n > 0) {
    if (!cur) cur = { from: y, to: y, peak: n };
    else {
      cur.to = y;
      cur.peak = Math.max(cur.peak, n);
    }
  } else if (cur && y - cur.to > 3) {
    bands.push(cur);
    cur = null;
  }
}
if (cur) bands.push(cur);
console.log('bands (y):');
for (const b of bands) console.log(`   ${b.from}–${b.to}   height ${b.to - b.from + 1}   peak ${b.peak}`);

const cols = [];
for (let x = rx; x < rx + rw; x++) {
  let n = 0;
  for (let y = ry; y < ry + rh; y++) if (hit(x, y)) n++;
  cols.push([x, n]);
}
const liveC = cols.filter(([, n]) => n > 0);
console.log(
  '\ncolumns with pixels:',
  liveC.length ? `${liveC[0][0]} … ${liveC[liveC.length - 1][0]}` : 'none',
);
const cbands = [];
cur = null;
for (const [x, n] of cols) {
  if (n > 0) {
    if (!cur) cur = { from: x, to: x };
    else cur.to = x;
  } else if (cur && x - cur.to > 24) {
    cbands.push(cur);
    cur = null;
  }
}
if (cur) cbands.push(cur);
console.log('column groups (gap > 24px):');
for (const b of cbands) console.log(`   ${b.from}–${b.to}   width ${b.to - b.from + 1}`);
