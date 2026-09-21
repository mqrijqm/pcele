/**
 * Skida CSS fajlove referentne strane u .ref/riso/css/ i ispisuje listu.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = '.ref/riso/css';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const seen = [];
page.on('response', async (res) => {
  const url = res.url();
  if (!/\.css(\?|$)/.test(url)) return;
  try {
    const body = await res.text();
    seen.push({ url, size: body.length });
  } catch {}
});
await page.goto('https://www.meracinque.com/il-nostro-riso/', { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(4000);

const hrefs = await page.evaluate(() =>
  [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href),
);
console.log(JSON.stringify(hrefs, null, 2));

const scripts = await page.evaluate(() => [...document.querySelectorAll('script[src]')].map((s) => s.src));
console.log(JSON.stringify(scripts, null, 2));

// uzmi i sam sadrzaj svakog CSS-a direktno iz stranice (zaobilazi CORS)
const css = await page.evaluate(async (list) => {
  const out = [];
  for (const href of list) {
    try {
      const r = await fetch(href);
      out.push({ href, text: await r.text() });
    } catch (e) {
      out.push({ href, text: `/* Greska: ${e.message} */` });
    }
  }
  return out;
}, hrefs);

for (const c of css) {
  const name = c.href.split('/').pop().split('?')[0];
  await writeFile(`${OUT}/${name}`, c.text);
  console.log(`snimljeno ${name}  ${c.text.length} B`);
}

await browser.close();
