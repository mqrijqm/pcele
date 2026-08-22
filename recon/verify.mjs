/**
 * Phase 3 — compare the built hero against the reference frames.
 *
 * The hero is scroll-driven, so each reference state is a scroll position.
 * With the timeline normalised to one unit the steps land at:
 *
 *   crest        0.000 – 0.250      flowers      0.125 – 0.375
 *   headline     0.375 – 0.625
 *   label top    0.625 – 0.875      label bottom 0.750 – 1.000
 *
 *   ref-1  progress 0.000   nothing has started
 *   ref-2  progress 0.462   decorations in, headline ~35 % across, no labels
 *   ref-3  progress 1.000   everything home
 *
 *   node recon/verify.mjs [--port 3005] [--width 1440] [--height 716]
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};

const PORT = arg('port', '3007');
const W = Number(arg('width', 1440));
const H = Number(arg('height', 716));
const LOCALE = arg('locale', 'sr');
const OUT = path.resolve('recon');
const TAG = W === 1440 ? '' : `-${W}x${H}`;

const STATES = [
  { name: '1', progress: 0.0, ref: 'reference/ref-1-start.png' },
  { name: '2', progress: 0.4625, ref: 'reference/ref-2-mid.png' },
  { name: '3', progress: 1.0, ref: 'reference/ref-3-end.png' },
];

// `channel: 'chromium'` uses the full build we already have; the default
// headless shell is a separate download.
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

console.log(`→ http://localhost:${PORT}/${LOCALE}  at ${W}×${H}`);
await page.goto(`http://localhost:${PORT}/${LOCALE}`, { waitUntil: 'load', timeout: 120000 });

// Let the curtain finish and dismiss the cookie notice, which would sit on top.
await page.waitForTimeout(3600);
await page.evaluate(() => {
  document.querySelectorAll('button').forEach((b) => {
    if (/Prihvatam|Accept/i.test(b.textContent || '')) b.click();
  });
});
await page.waitForTimeout(600);

const geometry = [];

for (const state of STATES) {
  // Drive the pinned section by scroll position, then let Lenis settle.
  await page.evaluate((p) => {
    const hero = document.querySelector('.hero-jar');
    const total = hero.offsetHeight - window.innerHeight;
    const y = Math.round(total * p);
    const lenisEl = document.documentElement;
    lenisEl.classList.remove('lenis-smooth');
    window.scrollTo(0, y);
  }, state.progress);
  await page.waitForTimeout(1400);
  await page.evaluate((p) => {
    const hero = document.querySelector('.hero-jar');
    const total = hero.offsetHeight - window.innerHeight;
    window.scrollTo(0, Math.round(total * p));
  }, state.progress);
  await page.waitForTimeout(900);

  const shot = path.join(OUT, `state-${state.name}${TAG}.png`);
  await page.screenshot({ path: shot });

  geometry.push({
    state: state.name,
    ...(await page.evaluate(() => {
      const r = (el) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          left: Math.round(b.left),
          right: Math.round(b.right),
          top: Math.round(b.top),
          bottom: Math.round(b.bottom),
          w: Math.round(b.width),
          h: Math.round(b.height),
        };
      };
      return {
        scrollY: Math.round(window.scrollY),
        left: r(document.querySelector('.hero-jar__half--left')),
        right: r(document.querySelector('.hero-jar__half--right')),
        jar: r(document.querySelector('.hero-jar__jar')),
        crest: r(document.querySelector('.hero-jar__crest')),
        flowers: r(document.querySelector('.hero-jar__flowers')),
        labelTop: r(document.querySelector('.hero-jar__label--top')),
        labelBottom: r(document.querySelector('.hero-jar__label--bottom')),
        fontSize: getComputedStyle(document.querySelector('.hero-jar__title')).fontSize,
        fontFamily: getComputedStyle(document.querySelector('.hero-jar__title')).fontFamily,
      };
    })),
  });

  if (W === 1440) {
    const out = path.join(OUT, `compare-${state.name}.png`);
    execFileSync('magick', [
      'montage',
      state.ref,
      shot,
      '-tile', '1x2',
      '-geometry', '+0+6',
      '-background', '#888888',
      out,
    ]);
    console.log(`   compare-${state.name}.png  (reference on top, ours below)`);
  }
}

fs.writeFileSync(path.join(OUT, `verify${TAG}.json`), JSON.stringify(geometry, null, 2));
console.log('\nmeasured:');
for (const g of geometry) {
  console.log(
    `  state ${g.state}  scrollY ${String(g.scrollY).padStart(5)}` +
      `  headline ${g.left ? g.left.left : '—'} → ${g.right ? g.right.right : '—'}` +
      `  jar ${g.jar ? `${g.jar.left}–${g.jar.right} / ${g.jar.top}–${g.jar.bottom}` : '—'}`,
  );
}
console.log(`  font: ${geometry[0].fontSize} ${geometry[0].fontFamily}`);

await browser.close();
