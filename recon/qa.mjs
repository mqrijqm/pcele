/**
 * Snimci i mjere nase strane proizvoda.
 *
 *   node recon/qa.mjs [--port 3007] [--locale sr] [--tag a]
 *
 * Za svaki ekran: snimak cijele strane, spisak sekcija sa visinama, i
 * provjera da li strana ima vodoravni skrol (to je najcesca greska).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};

const PORT = arg('port', '3007');
const LOCALE = arg('locale', 'sr');
const TAG = arg('tag', 'a');
const PATH = arg('path', `/${LOCALE}/products`);
const OUT = `.ref/ours/${TAG}`;

const SIZES = [
  { w: 1440, h: 900, name: 'desktop' },
  { w: 1920, h: 1080, name: 'wide' },
  { w: 768, h: 1024, name: 'tablet' },
  { w: 390, h: 844, name: 'mobile' },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chromium' });

for (const size of SIZES) {
  const page = await browser.newPage({
    viewport: { width: size.w, height: size.h },
    deviceScaleFactor: 1,
    locale: LOCALE === 'sr' ? 'sr-RS' : 'en-US',
  });

  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message.slice(0, 200)}`));

  await page.goto(`http://localhost:${PORT}${PATH}`, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(4200);

  // predji stranu da se sve otvori
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.55);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 190));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 700));
  });
  await page.waitForTimeout(900);

  const report = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const over = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const right = r.right + window.scrollX;
      const left = r.left + window.scrollX;
      if (right > docW + 2 || left < -2) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed') return;
        /*
         * Element koji izlazi iz kadra a neko ga odsijeca nije greska —
         * to je namjerno (rasuti snimci, pomjerene slike, traka koraka).
         * Greska je samo kad nista iznad ne odsjeca.
         */
        let clipped = false;
        for (let p = el.parentElement; p; p = p.parentElement) {
          const pcs = getComputedStyle(p);
          if (/hidden|clip|auto|scroll/.test(pcs.overflowX)) {
            clipped = true;
            break;
          }
        }
        if (clipped) return;
        over.push({
          cls: (el.className || '').toString().slice(0, 80),
          tag: el.tagName.toLowerCase(),
          left: Math.round(left),
          right: Math.round(right),
        });
      }
    });

    const sections = [...document.querySelectorAll('.pe > section')].map((s) => ({
      cls: s.className.replace(/\s+/g, ' ').trim(),
      top: Math.round(s.getBoundingClientRect().top + window.scrollY),
      h: Math.round(s.offsetHeight),
    }));

    return {
      scrollW: document.documentElement.scrollWidth,
      clientW: docW,
      bodyH: document.body.scrollHeight,
      overflow: over.slice(0, 14),
      sections,
    };
  });

  console.log(`\n=== ${size.name} ${size.w}x${size.h} ===`);
  console.log(`strana: ${report.bodyH} px   sirina: scroll ${report.scrollW} / client ${report.clientW}`);
  if (report.overflow.length) {
    console.log('VODORAVNI PRELIV:');
    for (const o of report.overflow) console.log(`  ${o.tag}.${o.cls}  ${o.left} .. ${o.right}`);
  } else {
    console.log('vodoravnog preliva nema');
  }
  for (const s of report.sections) {
    console.log(`  ${String(s.top).padStart(6)} ${String(s.h).padStart(6)}  ${s.cls}`);
  }
  if (errors.length) {
    console.log('GRESKE U KONZOLI:');
    for (const e of errors.slice(0, 8)) console.log(`  ${e}`);
  } else {
    console.log('konzola cista');
  }

  await page.screenshot({ path: `${OUT}/${size.name}.png`, fullPage: true });
  await page.close();
}

await browser.close();
console.log(`\nsnimci: ${OUT}`);
