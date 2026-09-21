import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true, channel: 'chromium' });
const routes = ['/sr', '/en', '/sr/products', '/en/products', '/sr/pcelinjak', '/en/pcelinjak', '/sr/process', '/sr/products/bagremov-med-1kg', '/sr/wishlist', '/sr/account', '/sr/privacy', '/sr/terms'];
for (const r of routes) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 90)));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text().slice(0, 90)));
  let status = 0;
  try {
    const res = await p.goto(`http://localhost:3111${r}`, { waitUntil: 'load', timeout: 90000 });
    status = res.status();
    await p.waitForTimeout(3000);
  } catch (e) { errs.push('NAV ' + e.message.slice(0, 60)); }
  const info = await p.evaluate(() => ({
    h: document.body.scrollHeight,
    over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 34),
    header: !!document.querySelector('.site-header'),
    footer: !!document.querySelector('footer'),
  })).catch(() => null);
  console.log(`${String(status).padEnd(4)} ${r.padEnd(34)} h=${String(info?.h).padStart(6)} over=${String(info?.over).padStart(3)} header=${info?.header ? 'da' : 'NE'} footer=${info?.footer ? 'da' : 'NE'}  ${errs.length ? 'GRESKE: ' + errs.join(' | ') : 'cisto'}  «${info?.h1}»`);
  await p.close();
}
await b.close();
