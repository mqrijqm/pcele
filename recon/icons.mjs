import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true, channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 900, height: 620 } });
await p.goto('http://localhost:3111/lab/icons.html', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(1200);
await p.screenshot({ path: '.ref/ours/icons.png', fullPage: true });
await b.close();
console.log('ok');
