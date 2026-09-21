/**
 * Provjere koje ne idu u redovni QA:
 *   - /en varijanta strane
 *   - `prefers-reduced-motion: reduce`
 *   - da nijedan `.reveal` ne ostane skriven
 *
 *   node recon/checks.mjs [--port 3111]
 */
import { chromium } from 'playwright';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const PORT = arg('port', '3111');

const browser = await chromium.launch({ headless: true, channel: 'chromium' });

const open = async (path, opts = {}) => {
  const page = await browser.newPage({
    viewport: { width: opts.w ?? 1440, height: opts.h ?? 900 },
    deviceScaleFactor: 1,
    reducedMotion: opts.reduced ? 'reduce' : 'no-preference',
  });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
  page.on('pageerror', (e) => errors.push(`PAGEERROR ${e.message.slice(0, 160)}`));
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(4200);
  return { page, errors };
};

const walk = async (page) => {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.5);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });
  await page.waitForTimeout(1200);
};

for (const { path, w, h, reduced, tag } of [
  { path: '/en/products', w: 1440, h: 900, tag: 'en-desktop' },
  { path: '/en/products', w: 390, h: 844, tag: 'en-mobile' },
  { path: '/sr/products', w: 1440, h: 900, reduced: true, tag: 'reduced-desktop' },
  { path: '/sr/products', w: 390, h: 844, reduced: true, tag: 'reduced-mobile' },
]) {
  const { page, errors } = await open(path, { w, h, reduced });
  await walk(page);

  const r = await page.evaluate(() => {
    const hidden = [...document.querySelectorAll('.reveal:not(.in-view)')].filter(
      (e) => e.offsetParent !== null,
    ).length;
    const marquee = document.querySelector('.pe-hero__track');
    const words = document.querySelector('.pe-split__word');
    const ctaImg = document.querySelector('.pe-cta__image--left');
    const seasonSlider = document.querySelector('.pe-season__slider');
    return {
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      bodyH: document.body.scrollHeight,
      hiddenReveals: hidden,
      marqueeAnimation: marquee ? getComputedStyle(marquee).animationName : null,
      marqueeTransform: marquee ? getComputedStyle(marquee).transform : null,
      wordTransform: words ? getComputedStyle(words).transform : null,
      ctaImgTransform: ctaImg ? getComputedStyle(ctaImg).transform : null,
      seasonTransform: seasonSlider ? getComputedStyle(seasonSlider).transform : null,
      h1: document.querySelector('h1')?.textContent?.trim(),
      sections: document.querySelectorAll('.pe > section').length,
    };
  });

  console.log(`\n=== ${tag}  ${path} @ ${w}x${h}${reduced ? ' (reduced motion)' : ''} ===`);
  console.log(JSON.stringify(r));
  console.log(errors.length ? `GRESKE: ${errors.join(' | ')}` : 'konzola cista');
  await page.screenshot({ path: `.ref/ours/check-${tag}.png`, fullPage: false });
  await page.close();
}

await browser.close();
