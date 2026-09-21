/**
 * Mjeri ponasanje interakcija na referentnoj strani.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.meracinque.com/il-nostro-riso/', { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(4500);
await page.evaluate(() => {
  const rx = /accetta|accept|accetto|consenti/i;
  document.querySelectorAll('button, a').forEach((b) => {
    const t = (b.textContent || '').trim();
    if (t.length < 40 && rx.test(t)) b.click();
  });
});
await page.waitForTimeout(1000);
await page.evaluate(async () => {
  const step = Math.round(window.innerHeight * 0.6);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 180));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1000);

const probe = async (label, fn) =>
  console.log(`\n### ${label}\n${JSON.stringify(await page.evaluate(fn), null, 1).slice(0, 3000)}`);

await probe('timeline: aktivni vs neaktivni naslov', () => {
  const items = [...document.querySelectorAll('.timeline__item')];
  return items.slice(0, 4).map((it) => {
    const t = it.querySelector('.timeline__item__title');
    const cs = getComputedStyle(t);
    const r = t.getBoundingClientRect();
    const lines = it.querySelector('.timeline__item__title .split-lines');
    return {
      active: it.classList.contains('active'),
      text: t.textContent.trim(),
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      w: Math.round(r.width),
      h: Math.round(r.height),
      linesH: lines ? Math.round(lines.getBoundingClientRect().height) : null,
      overflow: lines ? getComputedStyle(lines).overflow : null,
      media: !!it.querySelector('.timeline__item__media'),
      itemW: Math.round(it.getBoundingClientRect().width),
    };
  });
});

await probe('timeline: klik na 3. stavku', async () => {
  document.querySelectorAll('.timeline__nav__item')[3].click();
  await new Promise((r) => setTimeout(r, 900));
  const slider = document.querySelector('.timeline__slider');
  const ind = document.querySelector('.timeline__indicator');
  const items = [...document.querySelectorAll('.timeline__item')];
  return {
    sliderTransform: getComputedStyle(slider).transform,
    sliderLeft: Math.round(slider.getBoundingClientRect().left),
    indicator: getComputedStyle(ind).cssText.includes('translate') ? getComputedStyle(ind).transform : getComputedStyle(ind).transform,
    indicatorW: Math.round(ind.getBoundingClientRect().width),
    indicatorL: Math.round(ind.getBoundingClientRect().left),
    items: items.map((it) => ({
      active: it.classList.contains('active'),
      w: Math.round(it.getBoundingClientRect().width),
      title: it.querySelector('.timeline__item__title')?.textContent.trim(),
      titleFs: it.querySelector('.timeline__item__title')
        ? getComputedStyle(it.querySelector('.timeline__item__title')).fontSize
        : null,
      hasMedia: !!it.querySelector('.timeline__item__media'),
      left: Math.round(it.getBoundingClientRect().left),
    })),
  };
});

await probe('hero-marquee: transform na raznim skrolovima', async () => {
  const out = [];
  const t = document.querySelectorAll('.hero-marquee__inner__text');
  for (const y of [0, 200, 400, 600, 1000]) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 350));
    out.push({ y, tf: [...t].map((e) => getComputedStyle(e).transform) });
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 300));
  return out;
});

await probe('our-rice-moving-title: transform na skrolu', async () => {
  const sec = document.querySelector('.our-rice-moving-title');
  const top = sec.getBoundingClientRect().top + window.scrollY;
  const rows = sec.querySelectorAll('.our-rice-moving-title__row');
  const out = [];
  for (const off of [-500, -200, 0, 200, 400, 700]) {
    window.scrollTo(0, Math.max(0, top + off));
    await new Promise((r) => setTimeout(r, 350));
    out.push({ off, tf: [...rows].map((e) => getComputedStyle(e).transform) });
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 300));
  return out;
});

await probe('our-rice-moving-title: sadrzaj', () => {
  const sec = document.querySelector('.our-rice-moving-title');
  return [...sec.querySelectorAll('.our-rice-moving-title__row')].map((r) => ({
    cls: r.className,
    text: r.textContent.replace(/\s+/g, ' ').trim().slice(0, 120),
    html: r.innerHTML.replace(/\s+/g, ' ').trim().slice(0, 600),
  }));
});

await probe('parallax-images: sadrzaj i transform', () => {
  const g = document.querySelector('.parallax-images');
  return {
    text: g.querySelector('.parallax-images__content')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 300),
    html: g.querySelector('.parallax-images__content')?.innerHTML.replace(/\s+/g, ' ').trim().slice(0, 900),
    images: [...g.querySelectorAll('.parallax-images__image')].map((i) => ({
      cls: i.className,
      delta: i.getAttribute('data-delta-random'),
      tf: getComputedStyle(i).transform,
      src: i.querySelector('img')?.getAttribute('src')?.split('/').pop(),
    })),
  };
});

await probe('cta-moving-image + contacts-row: sadrzaj', () => ({
  cta: {
    html: document.querySelector('.cta-moving-image')?.innerHTML.replace(/\s+/g, ' ').trim().slice(0, 1400),
  },
  contacts: {
    html: document.querySelector('.contacts-row')?.innerHTML.replace(/\s+/g, ' ').trim().slice(0, 1400),
  },
}));

await probe('stb sekcije: tekst', () =>
  [...document.querySelectorAll('.stb')].map((s) => ({
    label: s.querySelector('.stb__label')?.textContent.trim(),
    text: s.querySelector('.stb__text')?.textContent.replace(/\s+/g, ' ').trim(),
    img: s.querySelector('.stb__image img')?.getAttribute('src')?.split('/').pop(),
    imgW: s.querySelector('.stb__image img') ? Math.round(s.querySelector('.stb__image img').getBoundingClientRect().width) : null,
  })),
);

await probe('fwi: sadrzaj', () => ({
  html: document.querySelector('.fwi')?.innerHTML.replace(/\s+/g, ' ').trim().slice(0, 900),
}));

await probe('sekcija-image-ul: tekst', () => ({
  title: document.querySelector('.section-image-ul__title')?.textContent.replace(/\s+/g, ' ').trim(),
  main: document.querySelector('.section-image-ul__maintext')?.textContent.replace(/\s+/g, ' ').trim(),
  ul: [...document.querySelectorAll('.section-image-ul__maintext ul li')].map((l) => l.textContent.trim()),
  tail: document.querySelector('.section-image-ul__text')?.textContent.replace(/\s+/g, ' ').trim(),
  img: document.querySelector('.section-image-ul__image')?.getAttribute('src')?.split('/').pop(),
}));

await browser.close();
