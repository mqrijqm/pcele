/**
 * Measures a screenshot by colour: where is the headline, the jar, the labels.
 *
 *   node recon/measure.mjs <image.png> [--region x,y,w,h]
 *
 * Decodes through ImageMagick (`magick … rgb:-`) because we have no image
 * library in the project and do not need one.
 */
import { execFileSync } from 'node:child_process';

const TARGETS = {
  headline: [0xa9, 0x6f, 0x36],
  label: [0x5c, 0x38, 0x14],
  paper: [0xfc, 0xf8, 0xdc],
  pill: [0xf1, 0xeb, 0xd3],
};

export function readPixels(file) {
  const size = execFileSync('magick', ['identify', '-format', '%w %h', file])
    .toString()
    .trim()
    .split(' ')
    .map(Number);
  const [w, h] = size;
  const raw = execFileSync('magick', [file, '-depth', '8', 'rgb:-'], {
    maxBuffer: 1024 * 1024 * 256,
  });
  return { w, h, raw };
}

export function bbox({ w, h, raw }, target, tol = 46, region = null) {
  const [tr, tg, tb] = target;
  const x0 = region ? region[0] : 0;
  const y0 = region ? region[1] : 0;
  const x1 = region ? region[0] + region[2] : w;
  const y1 = region ? region[1] + region[3] : h;

  let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1, count = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * 3;
      if (
        Math.abs(raw[i] - tr) <= tol &&
        Math.abs(raw[i + 1] - tg) <= tol &&
        Math.abs(raw[i + 2] - tb) <= tol
      ) {
        count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (count === 0) return null;
  return {
    left: minX, right: maxX, top: minY, bottom: maxY,
    width: maxX - minX + 1, height: maxY - minY + 1, count,
  };
}

/** Anything that is not the paper background — used to find the jar. */
export function notPaper({ w, h, raw }, tol = 14, region = null) {
  const [pr, pg, pb] = TARGETS.paper;
  const x0 = region ? region[0] : 0;
  const y0 = region ? region[1] : 0;
  const x1 = region ? region[0] + region[2] : w;
  const y1 = region ? region[1] + region[3] : h;
  let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1, count = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * 3;
      const isPaper =
        Math.abs(raw[i] - pr) <= tol &&
        Math.abs(raw[i + 1] - pg) <= tol &&
        Math.abs(raw[i + 2] - pb) <= tol;
      if (!isPaper) {
        count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!count) return null;
  return { left: minX, right: maxX, top: minY, bottom: maxY, width: maxX - minX + 1, height: maxY - minY + 1, count };
}

const fmt = (b) =>
  b ? `left ${b.left}  right ${b.right}  top ${b.top}  bottom ${b.bottom}  (${b.width}×${b.height}, ${b.count}px)` : '—';

// Only run the report when this file is the entry point, not when imported.
const isEntry = Boolean(process.argv[1] && /measure\.mjs$/.test(process.argv[1]));
if (isEntry && process.argv[2]) {
  const file = process.argv[2];
  const px = readPixels(file);
  console.log(`${file} — ${px.w}×${px.h}\n`);

  // The nav pill lives in the top ~130px; ignore it when measuring hero pieces.
  const body = [0, 130, px.w, px.h - 130];

  console.log('headline (whole)      ', fmt(bbox(px, TARGETS.headline, 40, body)));
  console.log('headline LEFT half    ', fmt(bbox(px, TARGETS.headline, 40, [0, 130, Math.floor(px.w * 0.4), px.h - 130])));
  console.log('headline RIGHT half   ', fmt(bbox(px, TARGETS.headline, 40, [Math.floor(px.w * 0.6), 130, px.w - Math.floor(px.w * 0.6), px.h - 130])));
  console.log('labels                ', fmt(bbox(px, TARGETS.label, 34, body)));
  console.log('jar (centre column)   ', fmt(notPaper(px, 14, [Math.floor(px.w * 0.38), 130, Math.floor(px.w * 0.25), px.h - 130])));
  console.log('logo circle (left)    ', fmt(notPaper(px, 14, [0, 130, Math.floor(px.w * 0.2), 220])));
  console.log('flowers (bottom right)', fmt(notPaper(px, 14, [Math.floor(px.w * 0.82), Math.floor(px.h * 0.55), Math.floor(px.w * 0.18), Math.floor(px.h * 0.45)])));
}
