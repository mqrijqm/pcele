import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true, channel: 'chromium' });
const shots = [
  { path: '/sr/products', w: 1440, h: 900, sel: '.pe-scatter', name: 'd-scatter' },
  { path: '/sr/products', w: 1440, h: 900, sel: '.pe-movers', name: 'd-movers' },
  { path: '/sr/products', w: 390, h: 844, sel: '.pe-story:nth-of-type(2)', name: 'm-storage' },
  { path: '/sr/products', w: 390, h: 844, sel: '.pe-cta', name: 'm-cta' },
];
for (const s of shots) {
  const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 });
  await p.goto(`http://localhost:3111${s.path}`, { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(4200);
  await p.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.5);
    for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 170)); }
    window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
  });
  const el = await p.$(s.sel);
  if (!el) { console.log('nema ' + s.sel); await p.close(); continue; }
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(1400);
  await el.screenshot({ path: `.ref/ours/${s.name}.png` });
  console.log('ok ' + s.name);
  await p.close();
}
await b.close();
