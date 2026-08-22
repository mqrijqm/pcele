/**
 * With reduced motion the curtain must not appear, the hero must already be in
 * its end state, and the tall scroll section must collapse to one screen.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({
  viewport: { width: 1440, height: 716 },
  reducedMotion: 'reduce',
});
await page.goto('http://localhost:3007/sr', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(2500);

const out = await page.evaluate(() => {
  const cs = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el) : null;
  };
  const hero = document.querySelector('.hero-jar');
  return {
    curtain: !!document.getElementById('preloader'),
    locked: document.documentElement.classList.contains('is-preloading'),
    heroHeight: hero.offsetHeight,
    viewport: window.innerHeight,
    crest: cs('.hero-jar__crest').transform,
    flowers: cs('.hero-jar__flowers').transform,
    left: cs('.hero-jar__half--left').transform,
    labelBottom: cs('.hero-jar__label--bottom > span').transform,
  };
});

console.log('curtain present   :', out.curtain, out.curtain ? '(should be gone)' : 'OK');
console.log('scroll locked     :', out.locked, out.locked ? '(should be free)' : 'OK');
console.log('hero height       :', out.heroHeight, 'vs viewport', out.viewport,
            out.heroHeight <= out.viewport + 4 ? 'OK' : '(should be one screen)');
console.log('crest transform   :', out.crest, out.crest === 'none' ? 'OK' : '(should be untouched)');
console.log('flowers transform :', out.flowers, out.flowers === 'none' ? 'OK' : '(should be untouched)');
console.log('headline transform:', out.left, out.left === 'none' ? 'OK' : '(should be at rest)');
console.log('label transform   :', out.labelBottom, out.labelBottom === 'none' ? 'OK' : '(should be visible)');

await page.screenshot({ path: 'recon/state-reduced.png' });
await browser.close();
