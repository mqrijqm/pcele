import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true, channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto('http://localhost:3111/sr/products', { waitUntil: 'load', timeout: 120000 });
await p.waitForTimeout(4200);
await p.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.5);
  for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 180)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
});
await p.waitForTimeout(2500);
const r = await p.evaluate(() => {
  return [...document.querySelectorAll('.pe-split')].map((el) => {
    const w = el.querySelector('.pe-split__word');
    const line = el.querySelector('.pe-split__line');
    const cs = w ? getComputedStyle(w) : null;
    return {
      cls: el.className.replace(/\s+/g, ' ').trim().slice(0, 56),
      text: (el.getAttribute('aria-label') || '').slice(0, 30),
      inView: el.classList.contains('in-view'),
      wordTf: cs ? cs.transform : null,
      wordTransition: cs ? cs.transition.slice(0, 90) : null,
      delay: cs ? cs.transitionDelay : null,
      lineOverflow: line ? getComputedStyle(line).overflow : null,
      lineH: line ? Math.round(line.getBoundingClientRect().height) : null,
    };
  });
});
console.log(JSON.stringify(r, null, 1));
await b.close();
