/**
 * Popravlja kvarove u kodiranju koje je napravio PowerShell `Set-Content`.
 *
 * Originalni fajlovi su UTF-8. PowerShell ih je procitao kao CP1252 i upisao
 * ponovo, pa su se nasi znakovi razbili na nizove. Ovaj skript vraca svaki
 * takav niz u pravi znak i upisuje fajl kao UTF-8 bez BOM-a.
 *
 *   node scripts/fix-encoding.mjs --check
 *   node scripts/fix-encoding.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const check = process.argv.includes('--check');

/* Razbijeni niz -> pravi znak. */
const FIXES = [
  ['\u00e2\u20ac\u201d', '\u2014'], // — em crta
  ['\u00e2\u20ac\u201c', '\u2013'], // – en crta
  ['\u00e2\u20ac\u2122', '\u2019'], // ' apostrof
  ['\u00e2\u20ac\u0153', '\u201c'], // " lijevi navodnik
  ['\u00e2\u20ac\u009d', '\u201d'], // " desni navodnik
  ['\u00c4\u008d', '\u010d'], // č
  ['\u00c4\u0087', '\u0107'], // ć
  ['\u00c5\u00a1', '\u0161'], // š
  ['\u00c5\u00be', '\u017e'], // ž
  ['\u00c5\u00a0', '\u0160'], // Š
  ['\u00c5\u00bd', '\u017d'], // Ž
  ['\u00c4\u0090', '\u0110'], // Đ
];

const ROOTS = ['src/components/products', 'src/content', 'src/app'];
const EXT = /\.(tsx?|css)$/;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXT.test(entry.name)) yield full;
  }
}

let touched = 0;

for (const root of ROOTS) {
  try {
    for await (const file of walk(root)) {
      const before = await readFile(file, 'utf8');
      let after = before;
      for (const [bad, good] of FIXES) after = after.split(bad).join(good);
      if (after === before) continue;

      touched++;
      const hits = FIXES.reduce((n, [bad]) => n + before.split(bad).length - 1, 0);
      console.log(`${check ? 'KVRAR' : 'popravljen'}  ${file}  (${hits})`);
      if (!check) await writeFile(file, after, 'utf8');
    }
  } catch {
    /* folder ne postoji — preskoci */
  }
}

console.log(`\n${touched} fajlova ${check ? 'ima kvar' : 'popravljeno'}`);
