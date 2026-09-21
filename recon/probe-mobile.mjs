import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true, channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await p.goto('http://localhost:3111/sr/products', { waitUntil: 'load', timeout: 120000 });
await p.waitForTimeout(4200);
await p.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.5);
  for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
});
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const box = (sel) => { const e = document.querySelector(sel); if (!e) return null; const q = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { w: Math.round(q.width), h: Math.round(q.height), left: Math.round(q.left), fs: cs.fontSize, maxW: cs.maxWidth, color: cs.color, shown: e.classList.contains('in-view') }; };
  return {
    scatter: box('.pe-scatter'),
    scatterContent: box('.pe-scatter__content'),
    scatterTitle: box('.pe-scatter__title'),
    scatterLede: box('.pe-scatter__lede'),
    storyBody: box('.pe-story__body'),
    storyLede: box('.pe-story__lede'),
    storyFacts: box('.pe-facts'),
    heroUnitFs: getComputedStyle(document.querySelector('.pe-hero__unit span')).fontSize,
    whyImage: box('.pe-why__image'),
    bandImage: box('.pe-band__image'),
    ctaImageL: box('.pe-cta__image--left'),
    ctaContent: box('.pe-cta__content'),
  };
});
console.log(JSON.stringify(r, null, 1));
// snimi same sekcije
for (const [name, sel] of [['scatter','.pe-scatter'], ['story','.pe-story'], ['cta','.pe-cta']]) {
  const el = await p.$(sel);
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(700);
  await el.screenshot({ path: `.ref/ours/m-${name}.png` });
}
await b.close();
