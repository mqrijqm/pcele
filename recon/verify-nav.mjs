/**
 * Walks the whole menu the way a person does: open the menu, click a link,
 * check the page actually rendered, go back to the home page, repeat.
 *
 * Guards the bug where the curtain ripped its own node out of React's tree and
 * the first navigation tore the app down.
 */
import { chromium } from 'playwright';

const PORT = process.argv[2] ?? '3007';
const TARGETS = ['/sr/products', '/sr/about', '/sr/process', '/sr/blog', '/sr/contact'];

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('pageerror', (e) => errors.push(e.message.split('\n')[0].slice(0, 120)));

let failures = 0;

for (const href of TARGETS) {
  errors.length = 0;
  await page.goto(`http://localhost:${PORT}/sr`, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(3200); // let the curtain finish

  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /Menu/i.test(x.textContent || ''));
    b?.click();
  });
  await page.waitForTimeout(700);
  await page.click(`a[href="${href}"]`);
  await page.waitForTimeout(2200);

  const state = await page.evaluate(() => ({
    path: location.pathname,
    title: document.title,
    sections: document.querySelectorAll('main section').length,
    height: document.body.scrollHeight,
    htmlClass: document.documentElement.className,
    overflow: getComputedStyle(document.body).overflow,
  }));

  const ok =
    state.path === href &&
    state.sections > 0 &&
    state.height > 1000 &&
    state.overflow !== 'hidden' &&
    errors.length === 0;
  if (!ok) failures++;

  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${href.padEnd(14)} sections ${String(state.sections).padStart(2)}` +
      `  height ${String(state.height).padStart(5)}  overflow ${state.overflow.padEnd(7)}` +
      `  title "${state.title.slice(0, 30)}"` +
      (errors.length ? `\n       errors: ${errors.join(' | ')}` : ''),
  );
}

console.log(failures ? `\n${failures} of ${TARGETS.length} failed` : `\nall ${TARGETS.length} pages navigate cleanly`);
await browser.close();
process.exit(failures ? 1 : 0);
