# Recon — meracinque.com

Captured 22 Aug 2026, Chromium 1440×900 and 390×844, via `recon/meracinque.mjs`.
No bot challenge appeared. Raw data in `recon/findings.json`, frames in
`recon/load/`, `recon/scroll/`, `recon/mobile/`, their bundle in `recon/js/`.

Two independent sources agree throughout: the minified theme bundle
(`recon/js/main.js`, the source of truth) and runtime sampling every 50 ms.

---

## 1. Stack

| | |
|---|---|
| Platform | WordPress + WooCommerce, custom theme `sim-base` |
| Bundler | Vite — `dist/assets/main.js` (47 KB) + `vendor.js` (446 KB) |
| Animation | **GSAP + ScrollTrigger + SplitText** (bundled, *no* window globals) |
| Smooth scroll | **Lenis**, driven off the GSAP ticker |
| Fonts | Ayer (headline serif), Sud, Readex Pro — all self-hosted woff2 |
| Colours | page `#7074b6`, headline `#ebafb4`, preloader `#f0ecdd` |

SplitText is *loaded* but the hero headline does **not** use it. The headline is
split by hand into two spans in the markup.

Lenis config, verbatim:

```js
new Lenis({
  duration: 1.25,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),   // expo.out
  wheelMultiplier: 1, touchMultiplier: 2, normalizeWheel: true, anchors: true,
})
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```

---

## 2. Preloader

Markup is a single `#preloader` holding one `svg` (their monogram).

```css
#preloader     { position:fixed; z-index:100; left:0; top:0;
                 width:100vw; height:100svh; overflow:hidden;
                 background-color:#f0ecdd; display:flex;
                 align-items:center; justify-content:center }
#preloader svg { height:15vh; width:auto; opacity:0 }
```

Wiring — it starts on **`window.load`**, not on DOMContentLoaded:

```js
document.addEventListener('DOMContentLoaded', () => V.initReady())   // Lenis etc.
window.addEventListener('load', () => {
  document.getElementById('preloader')?.classList.add('loaded')
  V.initLoad()                                                       // → initPreloader()
})
```

The timeline, verbatim:

```js
gsap.set('#preloader svg', { opacity: 0, yPercent: 20 })
gsap.timeline({ onComplete: () => $('#preloader').remove() })
  .delay(0.2)
  .to('#preloader svg', { opacity: 1, yPercent: 0, duration: 1,   ease: 'power3.out' })
  .to('#preloader',     { yPercent: 100,          duration: 0.9, ease: 'power3.out' }, '+=0.25')
  .addLabel('showContent')
```

### Timing table — preloader

| t (s, from `window.load`) | what | duration | ease |
|---|---|---|---|
| 0.00 | `#preloader` gets class `loaded` | — | — |
| 0.20 | monogram: `opacity 0→1`, `yPercent 20→0` | 1.00 | `power3.out` |
| 1.20 | hold | 0.25 | — |
| 1.45 | curtain: `yPercent 0→100` (slides down) | 0.90 | `power3.out` |
| 2.35 | `#preloader` removed from the DOM | — | — |

**Verified at runtime.** `window.load` fired at 2409 ms; the curtain began moving
between the 3808 ms and 3852 ms samples → 1399–1443 ms after load, against 1450 ms
in the code. The sampled travel (66 → 236 → 415 → 466 → 620 → 671 → 753 px over
355 ms) matches a `power3.out` decelerating curve.

Notes:

- **No scroll lock.** Nothing in the CSS or JS freezes the body; the curtain is
  simply fixed and on top.
- **No skip on repeat visits.** `sessionStorage` / `localStorage` appear zero
  times in the bundle. It runs every single load.
- **No counter, no progress bar** — just the monogram.
- It waits on `window.load`, so it is already gated on images and fonts.

---

## 3. The "The Rice of Wonders" headline

### Markup

```html
<section class="home-product bg-purple">
  <div class="home-product__slides">            <!-- sticky -->
    <div class="home-product__slide--1">
      <div class="slide-content">
        <div class="label-before"><span>…</span></div>
        <h2 class="title font-1 t-medium t-170 c-pink">
          <span class="title-left">The Rice of</span>
          <span class="title-right">Wonders</span>
        </h2>
        <div class="label-after"><span>…</span></div>
        <div class="label-after-2">…</div>
      </div>
      <div class="sparkle">…</div><div class="ribbon">…</div>
    </div>
    <div class="home-product__slide--2">…</div>
  </div>
  <div class="home-product__main-image"><img …></div>   <!-- the pack, above the text -->
</section>
```

### CSS that does the structural work

```css
.home-product                       { position:relative; width:100%; height:550svh; overflow:clip }
.home-product__slides               { position:sticky; top:0; height:100svh }   /* ← the "pin" */
.home-product__slide                { position:absolute; inset:0; pointer-events:none }
.home-product__slide--1             { display:flex; align-items:center; justify-content:center }
.home-product__slide--1 .slide-content { width:67.7svw; display:flex; flex-direction:column }
.home-product__slide--1 .title      { display:flex; justify-content:space-between }  /* ← the gap */
.home-product__main-image           { position:absolute; top:50%; right:50%; height:73.15svh }
.t-170                              { font-size:8.854svw; line-height:8.854svw }   /* 16svw portrait */
```

Three things carry the whole effect:

1. **`justify-content: space-between`** on `.title` — at rest the two halves are
   flung to the outer edges of a 67.7svw column, and the pack occupies the gap.
2. **`position: sticky`** on the slide stack inside a 550svh section — this is
   the pin. ScrollTrigger's `pin` is *not* used.
3. The pack is a sibling *after* the slides, so it is above the text with no
   z-index fight.

### The timeline

```js
gsap.set(pack, { yPercent: -40, xPercent: 50 })

const master = gsap.timeline({
  scrollTrigger: { trigger: '.home-product', start: 'top 35%', end: 'bottom bottom', scrub: true }
})

const tlIn = gsap.timeline({ defaults: { ease: 'linear', duration: 1 } })
tlIn.from(pack, { opacity: 0 })
tlIn.addLabel('titles')
mm.add('(orientation: landscape)', () => {
  tlIn.from(titleLeft,  { opacity: 0, xPercent:  50 }, 'titles')
  tlIn.from(titleRight, { opacity: 0, xPercent: -50 }, 'titles')
})
mm.add('(orientation: portrait)', () => {
  tlIn.to(titleLeft,  { opacity: 1, yPercent: -50 }, 'titles')
  tlIn.to(titleRight, { opacity: 1, yPercent:  50 }, 'titles')
})
tlIn.from([labelBefore, labelAfter], { yPercent: 100, stagger: 0.5 })
tlIn.from(labelAfter2, { yPercent: 100 })
tlIn.from([sparkle, ribbon], { scale: 0, stagger: 0.5 })
tlIn.duration(1)                    // ← rescales the whole timeline to one unit

const tlOut = /* mirror image: labels out, titles out, pack flies right, slide 2 in */
tlOut.duration(1)

master.add(tlIn)
master.add(tlOut, '+=0.4')
```

`ease: 'linear'` everywhere is not laziness — the timeline is **scrubbed**, so the
easing comes from Lenis and from the scroll itself. `.duration(1)` normalises a
6-unit sequence into one unit, which is what makes the proportions below exact.

### Timing table — headline (proportion of `tlIn`, which is 1/2.4 of `master`)

| step | raw units | normalised | property | ease |
|---|---|---|---|---|
| pack fades in | 0 → 1 | 0.000 → 0.167 | `opacity 0→1` | linear |
| **both halves split** | 1 → 2 | 0.167 → 0.333 | left `xPercent 50→0`, right `xPercent −50→0`, `opacity 0→1` | linear |
| label-before rises | 2 → 3 | 0.333 → 0.500 | `yPercent 100→0` behind `overflow:hidden` | linear |
| label-after rises | 2.5 → 3.5 | 0.417 → 0.583 | same, `stagger: 0.5` | linear |
| label-after-2 rises | 3.5 → 4.5 | 0.583 → 0.750 | `yPercent 100→0` | linear |
| sparkle scales in | 4.5 → 5.5 | 0.750 → 0.917 | `scale 0→1` | linear |
| ribbon scales in | 5 → 6 | 0.833 → 1.000 | `scale 0→1`, `stagger: 0.5` | linear |

### Runtime proof

`xPercent: ±50` means half of each span's own width, so the travel differs per half:

| scrollY | `.title-left` translateX | `.title-right` translateX |
|---|---|---|
| ≤ 2250 | 174.535 | −140.422 |
| 2350 | 110.119 | −88.596 |
| 2450 | 52.541 | −42.272 |
| ≥ 2550 | 0 | 0 |

`.title-left` is 349 px wide → 174.535 = exactly 50 %. `.title-right` is 281 px →
140.422 = exactly 50 %. The steps are dead even (57.58 px and 46.32 px per 100 px
of scroll), which confirms `linear` + `scrub`. Total travel takes **303 px of
scroll**, and 0.0694 of the trigger's 4365 px range is 303 px — the code and the
stopwatch agree exactly.

---

## 4. Mobile (390×844, portrait)

- `.t-170` becomes `font-size: 16svw` (93.6 px measured).
- `.slide-content` drops its fixed width, `.label-before` / `.label-after span`
  are `display:none`; only `.label-after-2` survives, moved to `bottom: 10%`.
- **The halves separate vertically instead of horizontally**: `yPercent −50` and
  `+50` with `opacity 0→1`. "The Rice of" rises above the pack, "Wonders" drops
  below it, so the headline is never trapped behind the product.
- The pack shrinks to `height: 47.2svh`.

---

## 5. What I am carrying over, and the two deliberate departures

Carried over exactly: sticky-stack pin, `justify-content: space-between`, two
hand-split halves, `xPercent ±50` with `opacity 0→1`, `ease:'linear'` under
`scrub: true`, `.duration(1)` normalisation, `stagger: 0.5` on decorative pairs,
`yPercent: 100` label masks, and the whole preloader timeline
(`0.2 → 1.0 power3.out → +0.25 → 0.9 power3.out → remove`).

**Departure 1 — `start: 'top top'` instead of `'top 35%'`.** Their section sits
mid-document, so "top of trigger reaches 35 % down the viewport" is a sensible
anchor. Our hero is the first thing on the page: its top is already above that
line at scroll 0, which would leave the headline part-way expanded on arrival and
contradict `ref-1-start.png`. `top top` is the same anchor expressed for a
section that starts at the document top.

**Departure 2 — order of the last two steps.** Meracinque raises its labels and
*then* scales in the decorations. The reference screenshots ask for the reverse:
`ref-2-mid` shows the logo circle and the flowers with no labels yet, and
`ref-3-end` adds the labels last. Same mechanics, same durations, same 0.5
stagger — the two blocks are swapped.

Everything else is measured, not assumed.

---

## 6. What was built, and how it verifies

Files:

| file | what |
|---|---|
| `src/components/home/HeroJar.tsx` | the hero — markup and the scrubbed timeline |
| `src/components/layout/Preloader.tsx` | the loading curtain |
| `src/components/layout/SmoothScroll.tsx` | Lenis, wired as theirs is |
| `src/app/globals.css` | `.hero-jar*` and `#preloader` geometry |

### Geometry, measured from `ref-3-end.png` at 1440×716

| piece | reference | built |
|---|---|---|
| jar (visible ink) | x 593–845, y 184–603 | canvas 564–876 / 136–627, ink identical |
| headline colour | `#A96F36` | `#A96F36` |
| headline band | y 390–446 (57 tall) | y 390–446 (57) |
| "Med porodične" | x 97–559 (463 wide) | x 97–560 (463) |
| "tradicije" right edge | x 1077 | x 1077 |
| VRCANO 2025 | x 987–1111, y 352–365 | x 986–1114, y 353–366 |
| 100% SIROVO PRIRODAN | x 104–324, y 465–478 | x 99–323, y 466–479 |
| mark | 115×115 at (96, 191) | 115×115 at (96, 191) |
| daisies | 204×306 at (1242, 416), mirrored | identical |
| paper | rgb(252, 248, 220) | rgb(252, 247, 220) |

Headline travel: left half 473 → 97 (376 px), right half 955 → 1077 (122 px).
Both reproduce **exactly** at states 1 and 3.

### Preloader, measured on the built page

| t from `window.load` | expected | observed |
|---|---|---|
| 0.20 s | mark begins rising | opacity still 0 at 200 ms ✓ |
| 1.00 s | `power3.out` at 0.8 → 0.992 | 0.9913 ✓ |
| 1.20 s | mark home | 0.9998 ✓ |
| 1.45 s | curtain starts down | still still at 1450, moving by 1800 ✓ |
| 2.35 s | curtain at yPercent 100 = 716 px | 715.835 ✓ |
| — | removed | 2463 ms (the extra ~110 ms is our fonts/decode gate) |

Scroll was held at 0 against a wheel event while the curtain was up, and released
after ✓. Under `prefers-reduced-motion` there is no curtain, no scroll lock, the
section collapses to one screen and every piece sits at rest ✓.

### The four departures, and why

1. **`start: 'top top'`** instead of `'top 35%'` — our section begins at the
   document top, where their anchor is already behind us.
2. **Decorations lead, labels close.** Theirs runs titles → labels →
   decorations. `ref-2-mid` shows the mark and daisies already in while the
   headline is still travelling, and no labels; that is only reachable if the
   decorations go first.
3. **No opacity on the headline halves.** Sampled ink in all three frames is
   `#a96f36` at alpha 1.000, the collapsed frame included. Theirs genuinely
   fades (their own collapsed frame shows a ghost); the mocks do not.
4. **Travel in viewport units, not `xPercent`.** Theirs is `xPercent: ±50` —
   half of each span's own width. "Med porodične" against "tradicije" is far
   more lopsided than "The Rice of" against "Wonders": matching the reference
   needs +80 % on one half and −57 % on the other. Anchoring both to the
   viewport keeps one linear scrubbed translate per half and still scales,
   because the type is sized in vw.

Also ours: the scroll lock during the curtain (they leave scrolling free), and
waiting on `document.fonts.ready` + `jar.decode()` on top of `window.load`.

### Known gaps against the mocks

- **`ref-2-mid` right half.** The mock draws it at x 1091, past its own final
  1077. No monotonic tween reaches beyond its end value; ours reads 998 at that
  moment. Flagged in the brief as possible mock imprecision.
- **Headline baseline drifts in the mocks.** `ref-1` sits at y 377–419,
  `ref-2` at 381–435, `ref-3` at 390–446 — the frames were composed separately.
  Ours is fixed and matches `ref-3`, so states 1 and 2 sit ~16 px (2.2 % of the
  viewport) lower than their mocks.
- **The pill reads "Menu", not "M"** — a later instruction than these mocks.
