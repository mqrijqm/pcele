/**
 * Drvo DOM-a sa geometrijom za jednu sekciju referentne strane.
 *
 *   node recon/tree.mjs --tag d --sel ".section-image-ul"
 */
import { readFile } from 'node:fs/promises';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const TAG = arg('tag', 'd');
const SEL = arg('sel', null);
const DEPTH = Number(arg('depth', '6'));

const { chromium } = await import('playwright');
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: Number(arg('w', '1440')), height: 900 } });
await page.goto('https://www.meracinque.com/il-nostro-riso/', { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(4500);
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.6);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 200));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

const dump = await page.evaluate(
  ({ sel, depth }) => {
    const root = sel ? document.querySelector(sel) : document.body;
    if (!root) return '(nema)';
    const px = (n) => Math.round(n);
    const lines = [];
    const walk = (el, d, max) => {
      if (d > max) return;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || r.width === 0) return;
      const clone = el.cloneNode(true);
      clone.querySelectorAll('*').forEach((c) => c.remove());
      const txt = (clone.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70);
      const cls = el.className && el.className.toString ? el.className.toString().trim() : '';
      const cont = getComputedStyle(el.parentElement || el).display;
      const gridInfo = cont === 'grid' ? ' [grid child]' : '';
      const bits = [
        `${px(r.left)},${px(r.top + window.scrollY)} ${px(r.width)}×${px(r.height)}`,
        cs.position !== 'static' ? cs.position : '',
        cs.display !== 'block' ? cs.display : '',
        gridInfo,
      ]
        .filter(Boolean)
        .join(' ');
      let extra = '';
      if (cs.display.includes('grid')) extra += ` cols:${cs.gridTemplateColumns} gap:${cs.gap}`;
      if (cs.display.includes('flex'))
        extra += ` flex:${cs.flexDirection} just:${cs.justifyContent} align:${cs.alignItems} gap:${cs.gap}`;
      if (parseFloat(cs.paddingTop) || parseFloat(cs.paddingLeft))
        extra += ` pad:${cs.paddingTop}/${cs.paddingRight}/${cs.paddingBottom}/${cs.paddingLeft}`;
      if (parseFloat(cs.marginTop) || parseFloat(cs.marginBottom))
        extra += ` mar:${cs.marginTop}/${cs.marginRight}/${cs.marginBottom}/${cs.marginLeft}`;
      if (cs.display !== 'none' && cs.position !== 'static') extra += ` z:${cs.zIndex}`;
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') extra += ` bg:${cs.backgroundColor}`;
      if (cs.transform !== 'none') extra += ` tf:${cs.transform}`;
      lines.push(`${'  '.repeat(d)}${el.tagName.toLowerCase()}${cls ? '.' + cls.split(/\s+/).join('.') : ''}  ${bits}${extra}${txt ? `  «${txt}»` : ''}`);
      [...el.children].forEach((c) => walk(c, d + 1, max));
    };
    walk(root, 0, depth);
    return lines.join('\n');
  },
  { sel: SEL, depth: DEPTH },
);

console.log(dump);
await browser.close();
