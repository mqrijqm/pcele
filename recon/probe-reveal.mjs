import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true, channel: 'chromium' });
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto('http://localhost:3111/sr/products', { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(4200);
  await p.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.5);
    for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 180)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
  });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => ({
    total: document.querySelectorAll('.reveal').length,
    missing: [...document.querySelectorAll('.reveal:not(.in-view)')].map((e) => ({
      cls: e.className.replace(/\s+/g, ' ').trim().slice(0, 70),
      text: (e.getAttribute('aria-label') || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
    })),
  }));
  console.log(`\n=== ${w}x${h} ===  reveal: ${r.total}, bez in-view: ${r.missing.length}`);
  for (const m of r.missing) console.log(`  ${m.cls}  «${m.text}»`);
  await p.close();
}
await b.close();
