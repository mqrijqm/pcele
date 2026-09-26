/**
 * Vrijednost za `anticipatePin` kod zaustavljenih sekcija na strani proizvoda.
 *
 * `anticipatePin` prikvaci sekciju malo prije nego sto stigne do vrha, da pri
 * nativnom skrolu (telefon, dodir) ne bljesne jedan kadar u kojem je jos u toku.
 * Na desktopu skrol vozi Lenis iz JavaScripta, u istom kadru u kojem radi i pin
 * — tamo ranije prikvacivanje samo pravi skok: sekcija odskoci 40-50 px prije
 * nego sto dodje do vrha. Ista odluka (nativni ili Lenis skrol) donosi se i u
 * `SmoothScroll`, pa se ovdje ponavlja isti uslov.
 */
export function anticipatePin(): number {
  const native =
    window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
  return native ? 1 : 0;
}
