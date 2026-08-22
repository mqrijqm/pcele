/**
 * Recon: meracinque.com
 *
 * Measures, rather than guesses, two things:
 *   1. the preloader — what it is, how long it runs, how it leaves
 *   2. the "The Rice of Wonders" headline — how it expands from behind the pack
 *
 * The hard part is that both happen once, early, and GSAP drops finished
 * tweens off its global timeline. So we hook the library *before* the page's
 * own scripts run (addInitScript) and record every call as it is made.
 *
 *   node recon/meracinque.mjs
 *
 * The browser opens headed on purpose: the site sits behind a BotDetect
 * challenge that has to be solved by hand once. The profile is persistent,
 * so the cookie survives and later runs go straight through.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('recon');
const DIRS = {
  profile: path.join(ROOT, 'profile'),
  load: path.join(ROOT, 'load'),
  scroll: path.join(ROOT, 'scroll'),
  mobile: path.join(ROOT, 'mobile'),
  js: path.join(ROOT, 'js'),
  video: path.join(ROOT, 'video'),
};
for (const dir of Object.values(DIRS)) fs.mkdirSync(dir, { recursive: true });

const URL = 'https://www.meracinque.com/en/';
const GOOD_TITLE = 'The Rice of Wonders 100% Carnaroli | Meracinque';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------------------------------------------------------- probe ---
 * Runs in the page before any site script. Three jobs:
 *   - wrap gsap the moment it is assigned, logging every tween/timeline call
 *   - sample anything that looks like a preloader every 50 ms
 *   - note readyState + load timings
 */
function installProbe() {
  const R = {
    t0: performance.now(),
    gsapCalls: [],
    samples: [],
    events: [],
    fromToOrder: 0,
  };
  window.__recon = R;

  const mark = (name) => R.events.push({ name, t: Math.round(performance.now() - R.t0) });
  mark('probe-installed');
  document.addEventListener('DOMContentLoaded', () => mark('DOMContentLoaded'));
  window.addEventListener('load', () => mark('window.load'));

  // ---- describe values without choking on DOM nodes / functions -----------
  const describe = (v, depth = 0) => {
    if (v == null) return v;
    const t = typeof v;
    if (t === 'number' || t === 'string' || t === 'boolean') return v;
    if (t === 'function') return `«fn ${v.name || 'anonymous'}»`;
    if (v instanceof Element) {
      return `«${v.tagName.toLowerCase()}${v.id ? '#' + v.id : ''}${
        v.className && typeof v.className === 'string'
          ? '.' + v.className.trim().split(/\s+/).join('.')
          : ''
      }»`;
    }
    if (v instanceof NodeList || Array.isArray(v)) {
      if (depth > 2) return '«deep»';
      return Array.from(v)
        .slice(0, 12)
        .map((x) => describe(x, depth + 1));
    }
    if (t === 'object') {
      if (depth > 2) return '«deep»';
      const out = {};
      for (const k of Object.keys(v).slice(0, 40)) {
        try {
          out[k] = describe(v[k], depth + 1);
        } catch {
          out[k] = '«throws»';
        }
      }
      return out;
    }
    return String(v);
  };

  // ---- hook gsap on assignment -------------------------------------------
  let _gsap;
  const wrapGsap = (g) => {
    if (!g || g.__reconWrapped) return g;
    const record = (kind, args, extra) => {
      R.gsapCalls.push({
        order: R.fromToOrder++,
        kind,
        t: Math.round(performance.now() - R.t0),
        args: args.map((a) => describe(a)),
        ...extra,
      });
    };

    for (const method of ['to', 'from', 'fromTo', 'set', 'timeline']) {
      const original = g[method];
      if (typeof original !== 'function') continue;
      g[method] = function (...args) {
        record(method, args);
        const result = original.apply(this, args);
        // A returned timeline gets wrapped too, so its children are logged.
        if (method === 'timeline' && result) wrapTimeline(result, R.fromToOrder - 1);
        return result;
      };
    }
    g.__reconWrapped = true;
    return g;
  };

  const wrapTimeline = (tl, parentOrder) => {
    if (!tl || tl.__reconWrapped) return tl;
    for (const method of ['to', 'from', 'fromTo', 'set', 'add', 'call', 'addLabel']) {
      const original = tl[method];
      if (typeof original !== 'function') continue;
      tl[method] = function (...args) {
        R.gsapCalls.push({
          order: R.fromToOrder++,
          kind: `tl.${method}`,
          parentOrder,
          t: Math.round(performance.now() - R.t0),
          args: args.map((a) => describe(a)),
        });
        return original.apply(this, args);
      };
    }
    tl.__reconWrapped = true;
    return tl;
  };

  Object.defineProperty(window, 'gsap', {
    configurable: true,
    get: () => _gsap,
    set: (v) => {
      _gsap = wrapGsap(v);
      mark('gsap-assigned');
    },
  });

  // ---- sample preloader candidates ---------------------------------------
  const HINT = /(load|preload|intro|splash|curtain|overlay|transition|cover|reveal|enter)/i;
  const candidates = () => {
    const found = new Set();
    document.querySelectorAll('body > *, body > * > *').forEach((el) => {
      const id = el.id || '';
      const cls = typeof el.className === 'string' ? el.className : '';
      if (HINT.test(id) || HINT.test(cls)) found.add(el);
      const cs = getComputedStyle(el);
      // Anything fixed and full-bleed at a high z-index is a curtain, named or not.
      if (
        cs.position === 'fixed' &&
        parseFloat(cs.zIndex || '0') >= 100 &&
        el.getBoundingClientRect().height > innerHeight * 0.8
      ) {
        found.add(el);
      }
    });
    return Array.from(found).slice(0, 8);
  };

  const selectorOf = (el) =>
    `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${
      typeof el.className === 'string' && el.className.trim()
        ? '.' + el.className.trim().split(/\s+/).join('.')
        : ''
    }`;

  let ticks = 0;
  const timer = setInterval(() => {
    const t = Math.round(performance.now() - R.t0);
    const frame = { t, els: [] };
    for (const el of candidates()) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      frame.els.push({
        sel: selectorOf(el),
        opacity: cs.opacity,
        transform: cs.transform,
        clipPath: cs.clipPath,
        visibility: cs.visibility,
        display: cs.display,
        height: Math.round(r.height),
        top: Math.round(r.top),
        bg: cs.backgroundColor,
        z: cs.zIndex,
        text: (el.textContent || '').trim().slice(0, 60),
        inDom: document.body.contains(el),
      });
    }
    // Whatever the browser itself is animating right now, with real timings.
    try {
      frame.animations = document
        .getAnimations()
        .slice(0, 20)
        .map((a) => {
          const eff = a.effect;
          const tm = eff && eff.getTiming ? eff.getTiming() : {};
          const target = eff && eff.target ? selectorOf(eff.target) : null;
          return {
            target,
            state: a.playState,
            duration: tm.duration,
            delay: tm.delay,
            easing: tm.easing,
            fill: tm.fill,
            currentTime: Math.round(a.currentTime || 0),
          };
        });
    } catch {
      frame.animations = [];
    }
    R.samples.push(frame);
    if (++ticks > 240) clearInterval(timer); // 12 s of sampling
  }, 50);
}

/* ------------------------------------------------------------------ run --- */
const findings = { url: URL, capturedAt: new Date().toISOString() };

const context = await chromium.launchPersistentContext(DIRS.profile, {
  headless: false,
  viewport: { width: 1440, height: 900 },
  userAgent: UA,
  locale: 'en-GB',
  timezoneId: 'Europe/Belgrade',
  deviceScaleFactor: 1,
  recordVideo: { dir: DIRS.video, size: { width: 1440, height: 900 } },
  args: ['--disable-blink-features=AutomationControlled'],
});

await context.addInitScript(installProbe);

const page = context.pages()[0] ?? (await context.newPage());

const assets = { scripts: [], styles: [], other: [] };
page.on('response', (res) => {
  const u = res.url();
  const type = res.request().resourceType();
  if (type === 'script') assets.scripts.push(u);
  else if (type === 'stylesheet') assets.styles.push(u);
  else if (type === 'font') assets.other.push(u);
});

// ---- frame-by-frame through the preloader --------------------------------
console.log('→ opening', URL);
const started = Date.now();
let capturing = true;
const capture = (async () => {
  let i = 0;
  while (capturing && Date.now() - started < 8000) {
    const t = Date.now() - started;
    try {
      await page.screenshot({
        path: path.join(DIRS.load, `${String(t).padStart(5, '0')}ms.png`),
      });
    } catch {
      /* page may be mid-navigation */
    }
    i++;
    const drift = 100 * i - (Date.now() - started);
    if (drift > 0) await sleep(drift);
  }
})();

await page.goto(URL, { waitUntil: 'load', timeout: 120000 }).catch((e) => {
  console.log('goto:', e.message);
});

// ---- BotDetect gate ------------------------------------------------------
let title = await page.title();
if (title === 'Robot Challenge Screen' || /robot/i.test(title)) {
  console.log('\n*** The site is showing its robot challenge. ***');
  console.log('*** Solve it by hand in the open browser window. Waiting… ***\n');
  while (!(await page.title().catch(() => '')).includes('Meracinque')) {
    await sleep(1000);
  }
  console.log('→ challenge cleared, reloading for a clean preloader capture');
  await page.goto(URL, { waitUntil: 'load', timeout: 120000 });
}
title = await page.title();
console.log('→ title:', title);

await capture;
capturing = false;
await sleep(4000); // let the intro finish and the probe keep sampling

/* ------------------------------------------------------------- extract --- */
const probe = await page.evaluate(() => window.__recon ?? null);
findings.probe = probe;

findings.page = await page.evaluate(() => {
  const sel = (el) =>
    el
      ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${
          typeof el.className === 'string' && el.className.trim()
            ? '.' + el.className.trim().split(/\s+/).join('.')
            : ''
        }`
      : null;

  const libs = {};
  for (const name of [
    'gsap',
    'ScrollTrigger',
    'SplitText',
    'ScrollSmoother',
    'CustomEase',
    'Flip',
    'Lenis',
    'barba',
    'Swiper',
    'Draggable',
    'MotionPathPlugin',
  ]) {
    libs[name] = typeof window[name] !== 'undefined';
  }
  if (window.gsap && window.gsap.version) libs.gsapVersion = window.gsap.version;

  const fonts = [];
  try {
    document.fonts.forEach((f) =>
      fonts.push({ family: f.family, weight: f.weight, style: f.style, status: f.status }),
    );
  } catch {
    /* ignore */
  }

  // live GSAP timeline, in case anything survived
  let tweens = [];
  try {
    if (window.gsap) {
      tweens = window.gsap.globalTimeline.getChildren(true, true, true).map((t) => ({
        targets: (t.targets ? t.targets() : []).map(sel),
        duration: t.duration(),
        delay: t.delay(),
        ease: t.vars && t.vars.ease ? String(t.vars.ease) : null,
        vars: (() => {
          const out = {};
          for (const k of Object.keys(t.vars || {})) {
            const v = t.vars[k];
            out[k] = typeof v === 'function' ? '«fn»' : typeof v === 'object' ? '«obj»' : v;
          }
          return out;
        })(),
      }));
    }
  } catch {
    /* ignore */
  }

  let triggers = [];
  try {
    if (window.ScrollTrigger) {
      triggers = window.ScrollTrigger.getAll().map((st) => ({
        trigger: sel(st.trigger),
        start: st.start,
        end: st.end,
        scrub: st.vars.scrub ?? false,
        pin: st.vars.pin ? sel(st.pin) || true : false,
        toggleActions: st.vars.toggleActions ?? null,
        animation: !!st.animation,
      }));
    }
  } catch {
    /* ignore */
  }

  return {
    title: document.title,
    bodyClass: document.body.className,
    themeColor: document.querySelector('meta[name="theme-color"]')?.content ?? null,
    scripts: Array.from(document.querySelectorAll('script[src]')).map((s) => s.src),
    styles: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((l) => l.href),
    libs,
    fonts,
    tweens,
    triggers,
    scrollHeight: document.body.scrollHeight,
  };
});

// ---- the headline section -------------------------------------------------
findings.headline = await page.evaluate(() => {
  const sel = (el) =>
    el
      ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${
          typeof el.className === 'string' && el.className.trim()
            ? '.' + el.className.trim().split(/\s+/).join('.')
            : ''
        }`
      : null;

  // Find the heading that says "wonders" / "rice of wonders"
  const all = Array.from(document.querySelectorAll('h1,h2,h3,.title,[class*="title"]'));
  const node = all.find((el) => /wonder/i.test(el.textContent || ''));
  if (!node) return { found: false, headings: all.slice(0, 20).map((el) => ({ sel: sel(el), text: (el.textContent || '').trim().slice(0, 80) })) };

  const section = node.closest('section') || node.parentElement;
  const cs = getComputedStyle(node);
  const r = node.getBoundingClientRect();

  const inner = Array.from(node.querySelectorAll('*'))
    .slice(0, 60)
    .map((el) => {
      const ecs = getComputedStyle(el);
      const er = el.getBoundingClientRect();
      return {
        sel: sel(el),
        text: (el.textContent || '').trim().slice(0, 30),
        display: ecs.display,
        position: ecs.position,
        transform: ecs.transform,
        letterSpacing: ecs.letterSpacing,
        width: Math.round(er.width),
        left: Math.round(er.left),
        clipPath: ecs.clipPath,
        overflow: ecs.overflow,
      };
    });

  return {
    found: true,
    sectionSel: sel(section),
    sectionHtml: (section?.outerHTML || '').slice(0, 8000),
    headingSel: sel(node),
    text: (node.textContent || '').trim(),
    type: {
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight,
      color: cs.color,
      textTransform: cs.textTransform,
    },
    rect: { left: Math.round(r.left), width: Math.round(r.width), top: Math.round(r.top) },
    children: inner,
    childCount: node.children.length,
  };
});

/* -------------------------------------------------------------- scroll --- */
console.log('→ scroll pass');
const scrollLog = [];
const sectionTop = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('h1,h2,h3,[class*="title"]'));
  const node = all.find((el) => /wonder/i.test(el.textContent || ''));
  if (!node) return 0;
  const s = node.closest('section') || node.parentElement;
  return Math.max(0, Math.round(s.getBoundingClientRect().top + window.scrollY - 900));
});

for (let i = 0; i <= 24; i++) {
  const y = sectionTop + i * 100;
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(320);
  await page.screenshot({ path: path.join(DIRS.scroll, `${String(i).padStart(2, '0')}-y${y}.png`) });
  scrollLog.push(
    await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('h1,h2,h3,[class*="title"]'));
      const node = all.find((el) => /wonder/i.test(el.textContent || ''));
      if (!node) return { y: window.scrollY };
      const r = node.getBoundingClientRect();
      const cs = getComputedStyle(node);
      const kids = Array.from(node.children).map((c) => {
        const cr = c.getBoundingClientRect();
        return { left: Math.round(cr.left), right: Math.round(cr.right), t: getComputedStyle(c).transform };
      });
      return {
        y: window.scrollY,
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        letterSpacing: cs.letterSpacing,
        transform: cs.transform,
        kids,
      };
    }),
  );
}
findings.scroll = scrollLog;

/* ------------------------------------------------------------ theme js --- */
console.log('→ downloading theme scripts');
const themeScripts = [...new Set(assets.scripts)].filter(
  (u) => /meracinque\.com/.test(u) && !/jquery|gtm|analytics|recaptcha|iubenda|cookie/i.test(u),
);
findings.themeScripts = themeScripts;
for (const url of themeScripts.slice(0, 25)) {
  try {
    const res = await context.request.get(url);
    const body = await res.text();
    const name = url.split('/').pop().split('?')[0] || 'script.js';
    fs.writeFileSync(path.join(DIRS.js, name), body);
  } catch (e) {
    console.log('  skip', url, e.message);
  }
}

/* -------------------------------------------------------------- mobile --- */
console.log('→ mobile pass');
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(URL, { waitUntil: 'load', timeout: 120000 });
for (let i = 0; i < 30; i++) {
  await page.screenshot({ path: path.join(DIRS.mobile, `load-${String(i * 200).padStart(5, '0')}ms.png`) });
  await sleep(200);
}
findings.mobile = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('h1,h2,h3,[class*="title"]'));
  const node = all.find((el) => /wonder/i.test(el.textContent || ''));
  if (!node) return null;
  const cs = getComputedStyle(node);
  const r = node.getBoundingClientRect();
  return {
    fontSize: cs.fontSize,
    lineHeight: cs.lineHeight,
    letterSpacing: cs.letterSpacing,
    width: Math.round(r.width),
    left: Math.round(r.left),
    childCount: node.children.length,
    html: node.outerHTML.slice(0, 2000),
  };
});
const mobileTop = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('h1,h2,h3,[class*="title"]'));
  const node = all.find((el) => /wonder/i.test(el.textContent || ''));
  if (!node) return 0;
  const s = node.closest('section') || node.parentElement;
  return Math.max(0, Math.round(s.getBoundingClientRect().top + window.scrollY - 400));
});
for (let i = 0; i <= 12; i++) {
  const y = mobileTop + i * 100;
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(300);
  await page.screenshot({ path: path.join(DIRS.mobile, `scroll-${String(i).padStart(2, '0')}-y${y}.png`) });
}

findings.assets = {
  scripts: [...new Set(assets.scripts)],
  styles: [...new Set(assets.styles)],
  fonts: [...new Set(assets.other)],
};

fs.writeFileSync(path.join(ROOT, 'findings.json'), JSON.stringify(findings, null, 2));
console.log('→ wrote recon/findings.json');

await context.close();
console.log('→ done. video in recon/video/');
