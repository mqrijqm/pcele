/**
 * Pulls the animation code out of Meracinque's minified theme bundle.
 * Reports keyword counts, every ease string, and readable slices around the
 * loader and headline timelines.
 */
import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2] ?? 'recon/js/main.js';
const src = fs.readFileSync(file, 'utf8');
console.log(`${path.basename(file)} — ${src.length} chars\n`);

const words = [
  'loader', 'Loader', 'preload', 'intro', 'splash', 'curtain',
  'SplitText', 'chars', 'words', 'lines', 'letterSpacing', 'clipPath',
  'scrub', 'pin:', 'ease:', 'duration:', 'stagger', 'CustomEase',
  'sessionStorage', 'localStorage', 'onComplete', 'timeline',
];
for (const w of words) {
  const n = src.split(w).length - 1;
  if (n) console.log(String(n).padStart(4), w);
}

console.log('\n--- ease values ---');
const eases = [...new Set(src.match(/ease:\s*"[^"]+"/g) ?? [])];
console.log(eases.join('\n') || '(none as string literals)');

console.log('\n--- duration values ---');
const durs = [...new Set(src.match(/duration:\s*[\d.]+/g) ?? [])];
console.log(durs.join('  '));

console.log('\n--- stagger values ---');
console.log([...new Set(src.match(/stagger:\s*[^,}]+/g) ?? [])].join('\n'));

console.log('\n--- CustomEase definitions ---');
console.log([...new Set(src.match(/CustomEase[^;]{0,160}/g) ?? [])].join('\n'));

const slice = (needle, before = 400, after = 900) => {
  const out = [];
  let i = -1;
  while ((i = src.indexOf(needle, i + 1)) !== -1) {
    out.push(src.slice(Math.max(0, i - before), i + after));
    if (out.length > 6) break;
  }
  return out;
};

for (const needle of process.argv.slice(3)) {
  console.log(`\n\n======================= "${needle}" =======================`);
  const hits = slice(needle);
  if (!hits.length) console.log('(not found)');
  hits.forEach((h, n) => console.log(`\n--- hit ${n + 1} ---\n${h}`));
}
