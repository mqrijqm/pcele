/**
 * Targeted measurement of the hero references.
 *
 * The jar's own label art carries the same browns as the headline, so every
 * colour probe here is restricted to a band that excludes the jar.
 *
 *   node recon/measure-hero.mjs reference/ref-3-end.png
 */
import { readPixels, bbox, notPaper } from './measure.mjs';

const HEADLINE = [0xa9, 0x6f, 0x36];
const LABEL = [0x5c, 0x38, 0x14];

const file = process.argv[2];
const px = readPixels(file);
const { w, h } = px;
console.log(`\n${file} — ${w}×${h}`);

const fmt = (b, label) => {
  if (!b) return console.log(`${label.padEnd(22)} —`);
  console.log(
    `${label.padEnd(22)} x ${String(b.left).padStart(4)}–${String(b.right).padStart(4)}` +
      `   y ${String(b.top).padStart(3)}–${String(b.bottom).padStart(3)}` +
      `   ${String(b.width).padStart(4)}×${String(b.height).padStart(3)}`,
  );
};

// ---- jar: the only large opaque object in the middle third -----------------
const jar = notPaper(px, 12, [Math.round(w * 0.3), 140, Math.round(w * 0.4), h - 150]);
fmt(jar, 'jar');
if (jar) {
  console.log(
    `${''.padEnd(22)} centre x ${((jar.left + jar.right) / 2).toFixed(1)}` +
      `   width ${(100 * jar.width / w).toFixed(2)}vw` +
      `   top ${(100 * jar.top / h).toFixed(1)}%   bottom ${(100 * jar.bottom / h).toFixed(1)}%` +
      `   height ${(100 * jar.height / h).toFixed(2)}svh`,
  );
}

const jarL = jar ? jar.left : Math.round(w * 0.38);
const jarR = jar ? jar.right : Math.round(w * 0.63);

// ---- headline halves, measured strictly outside the jar --------------------
const left = bbox(px, HEADLINE, 30, [0, 150, jarL - 4, h - 160]);
const right = bbox(px, HEADLINE, 30, [jarR + 4, 150, w - jarR - 4, h - 160]);
fmt(left, 'headline left');
fmt(right, 'headline right');
if (left && right) {
  const capTop = Math.min(left.top, right.top);
  const capBottom = Math.max(left.bottom, right.bottom);
  console.log(
    `${''.padEnd(22)} span ${left.left} → ${right.right}` +
      `   band y ${capTop}–${capBottom}` +
      `   mid ${(((capTop + capBottom) / 2 / h) * 100).toFixed(1)}% of height`,
  );
}

// ---- labels ---------------------------------------------------------------
// "VRCANO 2025" sits right of the jar, above the headline band.
// "100% SIROVO PRIRODAN" sits left of the jar, below it.
const bandTop = left ? left.top : 370;
const bandBottom = left ? left.bottom : 440;
const labUpper = bbox(px, LABEL, 26, [jarR + 4, 150, w - jarR - 4, Math.max(1, bandTop - 160)]);
const labLower = bbox(px, LABEL, 26, [0, bandBottom + 6, jarL - 4, h - bandBottom - 16]);
fmt(labUpper, 'label upper-right');
fmt(labLower, 'label lower-left');

// ---- decorations ----------------------------------------------------------
fmt(notPaper(px, 12, [0, 140, Math.round(w * 0.2), 240]), 'logo circle');
fmt(notPaper(px, 12, [Math.round(w * 0.8), Math.round(h * 0.5), Math.round(w * 0.2) - 1, Math.round(h * 0.5) - 1]), 'flowers');
