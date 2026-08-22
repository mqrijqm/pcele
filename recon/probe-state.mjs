/** Reads the live transform of every hero piece at a given scroll progress. */
import { chromium } from 'playwright';

const progress = Number(process.argv[2] ?? 0);
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 716 } });
page.on('console', (m) => { if (m.type() === 'error') console.log('  console error:', m.text().slice(0, 200)); });
page.on('pageerror', (e) => console.log('  page error:', e.message.slice(0, 300)));
page.on('requestfailed', (r) => console.log('  request failed:', r.url().slice(0, 120), r.failure()?.errorText));
await page.goto('http://localhost:3006/sr', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3600);

await page.evaluate((p) => {
  const hero = document.querySelector('.hero-jar');
  window.scrollTo(0, Math.round((hero.offsetHeight - window.innerHeight) * p));
}, progress);
await page.waitForTimeout(1500);

const out = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return `${sel}: missing`;
    const cs = getComputedStyle(el);
    return `${sel.padEnd(34)} transform=${cs.transform}  opacity=${cs.opacity}`;
  };
  return [
    `scrollY ${window.scrollY}`,
    pick('.hero-jar__crest'),
    pick('.hero-jar__flowers'),
    pick('.hero-jar__half--left'),
    pick('.hero-jar__half--right'),
    pick('.hero-jar__label--top > span'),
    pick('.hero-jar__label--bottom > span'),
  ].join('\n');
});
console.log(`progress ${progress}\n${out}`);
await browser.close();
