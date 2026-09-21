import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true, channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3111/sr/products', { waitUntil: 'load', timeout: 120000 });
await p.waitForTimeout(4000);
await p.evaluate(() => document.querySelector('.pe-season').scrollIntoView({ block: 'center' }));
await p.waitForTimeout(900);
const r = await p.evaluate(() => {
  const nav = document.querySelector('.pe-season__nav');
  const ind = document.querySelector('.pe-season__indicator');
  const active = document.querySelector('.pe-season__tab[aria-selected="true"]');
  const items = [...document.querySelectorAll('.pe-season__item')];
  return {
    navReady: nav.dataset.ready,
    indicator: {
      rect: (() => { const q = ind.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top), Math.round(q.width), Math.round(q.height)]; })(),
      bg: getComputedStyle(ind).backgroundColor,
    },
    activeTab: {
      text: active.textContent,
      color: getComputedStyle(active).color,
      rect: (() => { const q = active.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top), Math.round(q.width), Math.round(q.height)]; })(),
    },
    items: items.slice(0, 3).map((it) => {
      const n = it.querySelector('.pe-season__name');
      const m = it.querySelector('.pe-season__media');
      return {
        active: it.dataset.active,
        nameFs: getComputedStyle(n).fontSize,
        nameW: Math.round(n.getBoundingClientRect().width),
        nameH: Math.round(n.getBoundingClientRect().height),
        mediaW: Math.round(m.getBoundingClientRect().width),
        itemW: Math.round(it.getBoundingClientRect().width),
        itemLeft: Math.round(it.getBoundingClientRect().left),
      };
    }),
    sliderX: getComputedStyle(document.querySelector('.pe-season__slider')).transform,
  };
});
console.log(JSON.stringify(r, null, 1));

// klik na 4. korak pa provjeri da se traka pomjerila
await p.evaluate(() => document.querySelectorAll('.pe-season__tab')[3].click());
await p.waitForTimeout(1000);
const r2 = await p.evaluate(() => {
  const ind = document.querySelector('.pe-season__indicator');
  const active = document.querySelector('.pe-season__tab[aria-selected="true"]');
  const items = [...document.querySelectorAll('.pe-season__item')];
  return {
    indicatorLeft: Math.round(ind.getBoundingClientRect().left),
    indicatorW: Math.round(ind.getBoundingClientRect().width),
    activeTab: active.textContent,
    activeTabColor: getComputedStyle(active).color,
    activeItemLeft: Math.round(items[3].getBoundingClientRect().left),
    activeNameFs: getComputedStyle(items[3].querySelector('.pe-season__name')).fontSize,
    sliderX: getComputedStyle(document.querySelector('.pe-season__slider')).transform,
  };
});
console.log(JSON.stringify(r2, null, 1));
await p.screenshot({ path: '.ref/ours/season-click.png' });
await b.close();
