/**
 * Rekonstrukcija stranice /il-nostro-riso/ sa meracinque.com.
 *
 *   node recon/riso.mjs [--w 1440] [--h 900] [--tag d]
 *
 * Izlaz:
 *   .ref/riso/<tag>/page.html        — DOM poslije skrolovanja
 *   .ref/riso/<tag>/full.png         — cijela strana
 *   .ref/riso/<tag>/sections.json    — redoslijed sekcija + geometrija
 *   .ref/riso/<tag>/styles.json      — computed style za kljucne elemente
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};

const W = Number(arg('w', 1440));
const H = Number(arg('h', 900));
const TAG = arg('tag', 'd');
const URL = 'https://www.meracinque.com/il-nostro-riso/';
const OUT = `.ref/riso/${TAG}`;

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  locale: 'it-IT',
});
await page.goto(URL, { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(4500);

// cookie baner, ako ga ima
await page.evaluate(() => {
  const rx = /accetta|accept|accetto|ok|consenti|chiudi/i;
  document.querySelectorAll('button, a, [role="button"]').forEach((b) => {
    const t = (b.textContent || '').trim();
    if (t.length < 40 && rx.test(t)) b.click();
  });
});
await page.waitForTimeout(1200);

// skroluj do kraja da se sve otvori, pa se vrati i opet predji (lazy reveals)
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.6);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 260));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 600));
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 200));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);

const total = await page.evaluate(() => document.body.scrollHeight);
console.log(`visina strane: ${total} px @ ${W}x${H}`);

const sections = await page.evaluate(() => {
  const out = [];
  const seen = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.height < 140 || r.width < window.innerWidth * 0.6) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'inline') return;
    const cls = el.className && el.className.toString().trim();
    if (!cls) return;
    const key = `${cls}|${Math.round(r.top + window.scrollY)}|${Math.round(r.height)}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({
      tag: el.tagName.toLowerCase(),
      cls,
      id: el.id || undefined,
      top: Math.round(r.top + window.scrollY),
      h: Math.round(r.height),
      w: Math.round(r.width),
      left: Math.round(r.left),
      bg: cs.backgroundColor,
      color: cs.color,
      pos: cs.position,
    });
  });
  return out.sort((a, b) => a.top - b.top || b.h - a.h);
});

const styleSelectors = [
  'body',
  'main',
  '.page-hero, .hero-page, .page-header, section:first-of-type',
  'h1',
  'h2',
  'h3',
  'p',
  'a',
  'img',
  'figure',
  'header',
  'footer',
  'nav',
];

const styles = {};
for (const sel of styleSelectors) {
  styles[sel] = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const keep = [
      'display',
      'position',
      'top',
      'left',
      'right',
      'bottom',
      'width',
      'maxWidth',
      'minWidth',
      'height',
      'maxHeight',
      'minHeight',
      'margin',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
      'padding',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'gap',
      'rowGap',
      'columnGap',
      'gridTemplateColumns',
      'gridTemplateRows',
      'flexDirection',
      'flexWrap',
      'justifyContent',
      'alignItems',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'letterSpacing',
      'textTransform',
      'textAlign',
      'color',
      'backgroundColor',
      'borderRadius',
      'borderWidth',
      'borderColor',
      'overflow',
      'transform',
      'zIndex',
      'objectFit',
      'aspectRatio',
      'mixBlendMode',
      'textDecorationLine',
    ];
    const o = { rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } };
    for (const k of keep) o[k] = cs[k];
    return o;
  }, sel);
}

// sve fontove koje strana stvarno koristi
const fonts = await page.evaluate(() => {
  const set = new Map();
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    const key = `${cs.fontFamily} | ${cs.fontSize} | ${cs.fontWeight} | ${cs.lineHeight} | ${cs.letterSpacing}`;
    const t = (el.textContent || '').trim().slice(0, 60);
    if (!t || el.children.length) return;
    if (!set.has(key)) set.set(key, { font: key, count: 0, sample: t });
    set.get(key).count++;
  });
  return [...set.values()].sort((a, b) => b.count - a.count).slice(0, 60);
});

await writeFile(`${OUT}/sections.json`, JSON.stringify(sections, null, 2));
await writeFile(`${OUT}/styles.json`, JSON.stringify(styles, null, 2));
await writeFile(`${OUT}/fonts.json`, JSON.stringify(fonts, null, 2));
await writeFile(`${OUT}/page.html`, await page.content());
await page.screenshot({ path: `${OUT}/full.png`, fullPage: true });

console.log('\n--- fontovi (fontFamily | size | weight | lineHeight | letterSpacing) ---');
for (const f of fonts.slice(0, 26)) {
  console.log(`${String(f.count).padStart(4)}  ${f.font}   «${f.sample}»`);
}

console.log('\n--- sekcije ---');
for (const s of sections) {
  console.log(
    `${String(s.top).padStart(6)} ${String(s.h).padStart(6)} h${String(s.w).padStart(5)} L${String(s.left).padStart(5)}  ${s.pos.padEnd(8)} ${s.bg.padEnd(22)} ${s.tag}.${s.cls}`,
  );
}

await browser.close();
