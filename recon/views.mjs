/**
 * Snima stranu kadar po kadar (jedan ekran = jedna slika), da se moze gledati.
 *
 *   node recon/views.mjs [--port 3111] [--path /sr/products] [--w 1440] [--h 900] [--tag d]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};

const PORT = arg('port', '3111');
const PATH = arg('path', '/sr/products');
const W = Number(arg('w', '1440'));
const H = Number(arg('h', '900'));
const TAG = arg('tag', 'd');
const OUT = `.ref/ours/views-${TAG}`;
const MAX = Number(arg('max', '14'));

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(`http://localhost:${PORT}${PATH}`, { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(4200);

// predji stranu jednom, da se sve otvori
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.55);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 170));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 600));
});
await page.waitForTimeout(700);

const total = await page.evaluate(() => document.body.scrollHeight);
const frames = Math.min(Math.ceil(total / H), MAX);
console.log(`${total} px -> ${frames} kadrova @ ${W}x${H}`);

for (let i = 0; i < frames; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * H);
  await page.waitForTimeout(650);
  await page.screenshot({ path: `${OUT}/v${String(i).padStart(2, '0')}.png` });
}

// mjere kljucnih naslova
const titles = await page.evaluate(() =>
  [...document.querySelectorAll('.pe-movers__title, .pe-why__title, .pe-cta__title, .pe-scatter__title')].map(
    (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        text: (el.getAttribute('aria-label') || el.textContent || '').slice(0, 46),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fs: cs.fontSize,
        lines: Math.round(r.height / parseFloat(cs.lineHeight)),
      };
    },
  ),
);
console.log('\nnaslovi:');
for (const t of titles) console.log(`  ${t.fs.padStart(8)}  ${String(t.w).padStart(5)}x${String(t.h).padStart(4)}  redova:${t.lines}  «${t.text}»`);

const facts = await page.evaluate(() =>
  [...document.querySelectorAll('.pe-facts')].map((el) => ({
    w: Math.round(el.getBoundingClientRect().width),
    cols: el.children.length,
    h: Math.round(el.getBoundingClientRect().height),
  })),
);
console.log('podaci:', JSON.stringify(facts));

await browser.close();
console.log(`snimci: ${OUT}`);
