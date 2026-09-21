import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true, channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3111/sr/products', { waitUntil: 'load', timeout: 120000 });
await p.waitForTimeout(4000);
const r = await p.evaluate(() => {
  return [...document.querySelectorAll('.pe-movers__row')].map((row) => {
    const t = row.querySelector('.pe-movers__title');
    const ic = row.querySelector('.pe-movers__icon');
    const inner = t.querySelector('span[aria-hidden]');
    // sirina teksta bez lomljenja
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + getComputedStyle(t).font;
    probe.style.fontSize = getComputedStyle(t).fontSize;
    probe.style.fontFamily = getComputedStyle(t).fontFamily;
    probe.style.letterSpacing = getComputedStyle(t).letterSpacing;
    probe.textContent = t.getAttribute('aria-label');
    document.body.appendChild(probe);
    const textW = Math.round(probe.getBoundingClientRect().width);
    probe.remove();
    return {
      text: t.getAttribute('aria-label'),
      fs: getComputedStyle(t).fontSize,
      titleBoxW: Math.round(t.getBoundingClientRect().width),
      titleH: Math.round(t.getBoundingClientRect().height),
      textW,
      iconW: Math.round(ic.getBoundingClientRect().width),
      rowW: Math.round(row.getBoundingClientRect().width),
      gap: getComputedStyle(row).columnGap,
    };
  });
});
console.log(JSON.stringify(r, null, 1));
await b.close();
