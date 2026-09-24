const RASTER_ASSETS = [
  '/hero/hero-pejzaz-opt.webp',
  '/hero/jar.webp',
  '/images/brand/kamilica-latice.webp',
  '/images/brand/kamilica-srce.webp',
  '/images/real/pcelinjak-mracaj-poster.webp',
  '/images/priroda/cvijece-uzorak.webp',
  '/images/priroda/pcela-na-dlanu.webp',
  '/images/real/album-tegla-dlan.webp',
  '/images/real/album-panj.webp',
  '/images/real/album-korpa.webp',
  '/images/real/album-tegla-rame.webp',
  '/images/real/album-tegle-svjetlo.webp',
  '/images/brand/mapa-prnjavor.webp',
  '/images/proizvodi/livadski-1kg-new.webp',
  '/images/proizvodi/livadski-500g-new.webp',
  '/images/proizvodi/bagremov-1kg-new.webp',
  '/images/proizvodi/bagremov-500g-new.webp',
  '/images/real/propolis-bocica.webp',
  '/images/real/tegla-stub-livada.webp',
  '/images/real/pcele-leto.webp',
  '/images/real/tegla-kafa-sto.webp',
  '/images/real/vrcaljka-tegla.webp',
  '/images/real/ramovi-sace.webp',
  '/images/krajolik/pcelar-kosnice.webp',
  '/images/krajolik/kriska-meda.webp',
  '/images/izdvojeno/bagremov-pasa.webp',
  '/images/izdvojeno/livadski-red.webp',
  '/images/izdvojeno/propolis-ruka.webp',
  '/images/real/tegle-red.webp',
] as const;

const VECTOR_ASSETS = [
  '/hero/cta-cart.svg',
  '/hero/cta-products.svg',
  '/hero/foot.svg',
  '/hero/logo-krug.svg',
  '/images/brand/bagremov-grana.svg',
  '/images/brand/brda.svg',
  '/images/brand/livadski-cvijet.svg',
  '/images/brand/mark.svg',
  '/images/brand/mark-footer.svg',
  '/images/brand/pcelar.svg',
  '/images/brand/pecat-cvijet.svg',
  '/images/brand/pecat-okusi-oker.svg',
  '/images/brand/pecat-okusi-tamni.svg',
  '/images/brand/pecat-okusi-zlatni.svg',
  '/images/brand/pecat-prirodan.svg',
  '/images/brand/recenica-vrcamo.svg',
  '/images/brand/sunce.svg',
  '/images/brand/teglica.svg',
  '/images/brand/wordmark-jevtic.svg',
  '/images/brand/znak-krug.svg',
] as const;

/**
 * The landing is deliberately image-led and its scroll scenes reveal assets
 * faster than native lazy loading can request them on a remote connection.
 * Preloading the complete, already-compressed set makes every later reveal a
 * cache hit. React hoists these resource hints into the document head.
 */
export default function LandingImagePreloads() {
  return (
    <>
      {RASTER_ASSETS.map((href, index) => (
        <link
          key={href}
          rel="preload"
          as="image"
          href={href}
          type="image/webp"
          fetchPriority={index < 5 ? 'high' : 'low'}
        />
      ))}
      {VECTOR_ASSETS.map((href) => (
        <link
          key={href}
          rel="preload"
          as="image"
          href={href}
          type="image/svg+xml"
          fetchPriority="low"
        />
      ))}
    </>
  );
}
