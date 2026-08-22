/** Prints a raw slice of a bundle around a needle, with light line-breaking. */
import fs from 'node:fs';

const [file, needle, beforeArg, afterArg] = process.argv.slice(2);
const src = fs.readFileSync(file, 'utf8');
const before = Number(beforeArg ?? 0);
const after = Number(afterArg ?? 2500);

const i = src.indexOf(needle);
if (i === -1) {
  console.log('(not found)');
  process.exit(0);
}
const text = src.slice(Math.max(0, i - before), i + after);
// break after statement separators so the minified code is readable
console.log(text.replace(/([;,])(?=[a-zA-Z_$.])/g, '$1\n'));
