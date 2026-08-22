/**
 * Reports the darkest ink found in a region — used to tell whether the headline
 * halves are painted at full opacity in a given reference state.
 *
 *   node recon/ink.mjs <image> x,y,w,h
 */
import { readPixels } from './measure.mjs';

const [file, regionArg] = process.argv.slice(2);
const { w, raw } = readPixels(file);
const [rx, ry, rw, rh] = regionArg.split(',').map(Number);

let darkest = [255, 255, 255];
let darkestLum = 1e9;
const hist = new Map();
for (let y = ry; y < ry + rh; y++) {
  for (let x = rx; x < rx + rw; x++) {
    const i = (y * w + x) * 3;
    const [r, g, b] = [raw[i], raw[i + 1], raw[i + 2]];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < darkestLum) {
      darkestLum = lum;
      darkest = [r, g, b];
    }
    const key = `${r >> 3},${g >> 3},${b >> 3}`;
    hist.set(key, (hist.get(key) || 0) + 1);
  }
}
const hex = ([r, g, b]) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
console.log(`${file} [${regionArg}]`);
console.log('  darkest pixel :', hex(darkest), darkest.join(','));

const top = [...hist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
console.log('  most common   :', top.map(([k, n]) => `${hex(k.split(',').map((v) => (+v << 3) + 4))}×${n}`).join('  '));

// How far is the darkest ink from full-strength #A96F36 against #FCF8DC paper?
const ink = [0xa9, 0x6f, 0x36];
const paper = [0xfc, 0xf8, 0xdc];
const alphas = darkest.map((v, i) => (paper[i] - v) / (paper[i] - ink[i]));
console.log('  implied alpha :', alphas.map((a) => a.toFixed(3)).join(' / '));
