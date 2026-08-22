/**
 * Finds the scale and offset at which cvijece.png was placed in the reference.
 *
 * The flowers bleed off two edges, so their size cannot be read from a bounding
 * box. Instead we rasterise the source alpha at a range of scales, slide it
 * around, and keep the placement whose silhouette best overlaps the reference's
 * non-paper mask (intersection over union).
 */
import { execFileSync } from 'node:child_process';
import { readPixels } from './measure.mjs';

const REF = 'reference/ref-3-end.png';
const SRC = 'public/hero/cvijece.png';

// ---- reference mask: everything that is not paper, in the bottom-right ------
const ref = readPixels(REF);
const RX = 1180, RY = 360, RW = 1440 - 1180, RH = 716 - 360;
const refMask = new Uint8Array(RW * RH);
for (let y = 0; y < RH; y++) {
  for (let x = 0; x < RW; x++) {
    const i = ((y + RY) * ref.w + (x + RX)) * 3;
    const paper =
      Math.abs(ref.raw[i] - 0xfc) <= 14 &&
      Math.abs(ref.raw[i + 1] - 0xf8) <= 14 &&
      Math.abs(ref.raw[i + 2] - 0xdc) <= 14;
    refMask[y * RW + x] = paper ? 0 : 1;
  }
}

/** Source alpha channel at a given rendered width. The reference has the
 * artwork mirrored horizontally, so the source is flopped before matching. */
function alphaAt(width) {
  const height = Math.round((1536 / 1024) * width);
  const raw = execFileSync(
    'magick',
    [SRC, '-flop', '-resize', `${width}x${height}!`, '-alpha', 'extract', '-depth', '8', 'gray:-'],
    { maxBuffer: 1024 * 1024 * 128 },
  );
  return { raw, width, height };
}

let best = null;
for (let width = 180; width <= 460; width += 6) {
  const a = alphaAt(width);
  for (let left = 1150; left <= 1330; left += 4) {
    for (let top = 300; top <= 520; top += 4) {
      let inter = 0, union = 0;
      for (let y = 0; y < RH; y += 2) {
        const sy = y + RY - top;
        for (let x = 0; x < RW; x += 2) {
          const sx = x + RX - left;
          const inSrc = sx >= 0 && sx < a.width && sy >= 0 && sy < a.height;
          const src = inSrc && a.raw[sy * a.width + sx] > 40 ? 1 : 0;
          const r = refMask[y * RW + x];
          if (src || r) union++;
          if (src && r) inter++;
        }
      }
      const iou = union ? inter / union : 0;
      if (!best || iou > best.iou) best = { iou, width, height: a.height, left, top };
    }
  }
  if (width % 100 === 0) process.stdout.write(`  …${width}px best so far ${(best.iou * 100).toFixed(1)}%\n`);
}

console.log('\nbest fit:');
console.log(best);
console.log(
  `\nCSS: left ${(100 * best.left / 1440).toFixed(2)}vw  top ${(100 * best.top / 716).toFixed(2)}%  width ${(100 * best.width / 1440).toFixed(2)}vw`,
);
