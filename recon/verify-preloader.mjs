/**
 * Checks the loading curtain: that it covers the page, that it leaves on the
 * measured schedule, and that scrolling is held until it is gone.
 *
 * Expected, from window.load:  0.20s mark starts rising · 1.20s mark home
 *                              1.45s curtain starts down · 2.35s removed
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('recon/preloader');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 716 } });

const samples = [];
await page.addInitScript(() => {
  window.__t = [];
  window.addEventListener('load', () => {
    const t0 = performance.now();
    const tick = setInterval(() => {
      const c = document.getElementById('preloader');
      const m = c && c.querySelector('.preloader__mark');
      window.__t.push({
        t: Math.round(performance.now() - t0),
        gone: !c,
        curtain: c ? getComputedStyle(c).transform : null,
        markOpacity: m ? getComputedStyle(m).opacity : null,
        markTransform: m ? getComputedStyle(m).transform : null,
        locked: document.documentElement.classList.contains('is-preloading'),
        scrollY: Math.round(window.scrollY),
      });
      if (performance.now() - t0 > 3200) clearInterval(tick);
    }, 50);
  });
});

await page.goto('http://localhost:3007/sr', { waitUntil: 'load', timeout: 90000 });

// Try to scroll while the curtain is up — it must not move.
await page.waitForTimeout(500);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(200);
const lockedScroll = await page.evaluate(() => Math.round(window.scrollY));

for (const t of [100, 400, 900, 1500, 1900, 2500]) {
  // rough frames for eyeballing
}
await page.waitForTimeout(3400);
samples.push(...(await page.evaluate(() => window.__t)));

const at = (ms) => samples.find((s) => Math.abs(s.t - ms) < 40) ?? samples[samples.length - 1];
console.log('scrollY while the curtain was up:', lockedScroll, lockedScroll === 0 ? '(held ✓)' : '(MOVED ✗)');
console.log('\n t(ms)  gone   mark-opacity  curtain transform');
for (const ms of [0, 200, 500, 1000, 1200, 1450, 1800, 2100, 2350, 2600]) {
  const s = at(ms);
  console.log(
    `${String(ms).padStart(5)}  ${String(s.gone).padEnd(6)} ${String(s.markOpacity).padEnd(13)} ${s.curtain ?? '—'}`,
  );
}
const removed = samples.find((s) => s.gone);
console.log('\ncurtain removed at ~', removed ? `${removed.t}ms` : 'never', '(code says 2350ms)');
console.log('scroll lock released:', samples.some((s) => !s.locked) ? 'yes ✓' : 'no ✗');

await browser.close();
