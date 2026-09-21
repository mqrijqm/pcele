/**
 * Skida glavni JS bundle referentne strane i ispisuje dijelove oko pojmova.
 *
 *   node recon/js.mjs --sel "timeline|parallaxImages|fwi"
 */
import { writeFile, mkdir } from 'node:fs/promises';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const OUT = '.ref/riso/js';
await mkdir(OUT, { recursive: true });

const url = 'https://www.meracinque.com/dist/assets/main.js';
const text = await (await fetch(url)).text();
await writeFile(`${OUT}/main.js`, text);
console.log(`main.js ${text.length} B`);

const RX = new RegExp(arg('sel', '.'));
// ispisi prozor oko svakog poklapanja
const lines = text.split(/(?<=[;{}])/);
for (let i = 0; i < lines.length; i++) {
  if (RX.test(lines[i])) {
    const from = Math.max(0, i - 2);
    const to = Math.min(lines.length - 1, i + 4);
    console.log(`\n=== ${i} ===`);
    console.log(lines.slice(from, to + 1).join('').slice(0, 2600));
  }
}
