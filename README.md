# Pčelarstvo Jevtić

Rekreacija sajta [pcelarstvo-jevtic.vercel.app](https://pcelarstvo-jevtic.vercel.app) —
porodično pčelarstvo iz Mračaja kod Prnjavora.

Sav sadržaj (tekstovi na srpskom i engleskom, cijene, varijante proizvoda, blog tekstovi,
pravne stranice) i svi asseti preuzeti su sa originala i ugrađeni u čist Next.js projekat.

## Pokretanje

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Ostale komande: `pnpm build` (produkcijski build), `pnpm start` (pokreće build).

## Stack

| Sloj | Izbor |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Stilovi | Tailwind CSS 3 |
| Ikone | lucide-react |
| Fontovi | `next/font` — Newsreader (naslovi), DM Sans (tekst) |
| i18n | vlastiti rječnici, bez dodatnih zavisnosti |

## Struktura

```
src/
  app/[locale]/          sve stranice (sr i en), layout, sitemap, robots
  components/
    layout/              header, footer, korpa, cookie banner
    home/                sekcije početne strane
    products/            grid sa filterima + detalj proizvoda
    blog/  contact/  legal/  wishlist/  ui/
  content/pages.ts       tekstovi stranica po jeziku
  data/                  products.ts, posts.ts, legal.ts
  i18n/                  config + messages/{sr,en}.json
  lib/                   korpa i lista želja (localStorage)
  middleware.ts          / → /sr, /products → /sr/products
public/images/           sve slike sa originala
```

## Rute

`/sr` i `/en`, a ispod: `/products`, `/products/[slug]` (6 proizvoda), `/about`,
`/process`, `/blog`, `/blog/[slug]` (3 teksta), `/contact`, `/privacy`, `/terms`,
`/wishlist`, `/account`. Sve je statički generisano.

## Razlike u odnosu na original

- **Korpa i lista želja rade lokalno** (localStorage). Original je vezan za backend
  prodavnice; ovdje nema plaćanja, pa "Na plaćanje" vodi na kontakt.
- **Forme** (kontakt, newsletter) validiraju unos i potvrđuju slanje, ali nemaju
  server koji prima poruku — treba dodati API rutu ili servis kad zatreba.
- **Popravljena tri problema originala**: sajt se više ne pomjera horizontalno zbog
  zatvorene korpe; dugme "Dodaj u korpu" više ne lomi tekst u tri reda; scroll
  animacije se uključuju tek kad JavaScript radi, pa sadržaj ostaje vidljiv i bez njega.
- `/sr` je izričito u adresi (original je srpski držao i bez prefiksa).
