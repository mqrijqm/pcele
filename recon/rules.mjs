/**
 * Vadi CSS pravila iz minifikovanog fajla, sa tacnim kontekstom media query-ja.
 *
 *   node recon/rules.mjs --sel "fwi|stb|timeline" [--file .ref/riso/css/main.css]
 */
import { readFile } from 'node:fs/promises';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const RX = new RegExp(arg('sel', '.'));
const FILE = arg('file', '.ref/riso/css/main.css');

const css = await readFile(FILE, 'utf8');

// tokenizuj: prati zagrade i @media kontekst
const out = [];
let buf = '';
const stack = [];
for (let i = 0; i < css.length; i++) {
  const ch = css[i];
  if (ch === '{') {
    const head = buf.trim();
    buf = '';
    stack.push(head);
    continue;
  }
  if (ch === '}') {
    const body = buf.trim();
    buf = '';
    const head = stack.pop();
    if (body && !head.startsWith('@')) {
      const media = stack.filter((s) => s.startsWith('@')).join(' && ');
      out.push({ media, head, body });
    }
    continue;
  }
  buf += ch;
}

for (const r of out) {
  if (!RX.test(r.head)) continue;
  console.log(`${r.media ? `[${r.media}]\n  ` : ''}${r.head}\n  { ${r.body} }\n`);
}
console.log(`--- ${out.length} pravila ukupno ---`);
