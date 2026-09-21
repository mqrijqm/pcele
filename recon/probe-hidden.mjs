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
  const bad = [];
  document.querySelectorAll('.pe h1, .pe h2, .pe h3, .pe p, .pe li, .pe dd, .pe dt, .pe a, .pe button').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') return;
    const q = el.getBoundingClientRect();
    if (q.width === 0) return;
    const text = (el.textContent || '').trim().slice(0, 34);
    if (!text) return;
    if (parseFloat(cs.opacity) < 0.9) bad.push({ why: 'opacity ' + cs.opacity, cls: el.className.toString().slice(0, 40), text });
    if (cs.transform !== 'none' && cs.transform.includes(',')) {
      const m = cs.transform.match(/matrix\(([^)]+)\)/);
      if (m) { const v = m[1].split(',').map(Number); if (Math.abs(v[4]) > 4 || Math.abs(v[5]) > 4) bad.push({ why: `tf ${Math.round(v[4])},${Math.round(v[5])}`, cls: el.className.toString().slice(0, 40), text }); }
    }
  });
  return { bad: bad.slice(0, 20), count: bad.length };
});
console.log('skriveno ili pomjereno:', r.count);
for (const x of r.bad) console.log(`  ${x.why}  .${x.cls}  «${x.text}»`);
await b.close();
