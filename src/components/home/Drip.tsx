import type { ReactNode } from 'react';

import DripEdge from './DripEdge';

/**
 * Prelaz sa papira na smedju: med se prelije preko ruba strane i sekcija
 * ispod pocinje tamo gdje se kapi zaustave.
 *
 * Rub je jedan crtez (Asset 4 iz Marijinih assetsa), ne stotinu CSS
 * radijusa — kapi su nejednake, kao sto i jesu kad se med sipa, i to je
 * jedino sto ovaj prelaz cini vjerodostojnim.
 *
 * Crtez je ispisan u kodu a ne ucitan iz /public jer je jedan potez od
 * kilobajta: kao fajl bi bio jos jedan zahtjev, a ovako uzima boju iz
 * palete i mijenja se zajedno s njom. Sada je i vise od crteza — svaka ivica
 * ima i svoju ravnu verziju, pa se skrolom prelazi iz jedne u drugu. Obje
 * stoje u `dripPaths.ts`, a `DripEdge` ih spaja.
 *
 * Pojas ima dva ruba, ne jedan. Gornji je med koji se prelije s papira na
 * smedju; donji je isti potez, drugom rukom crtan — deblje i mirnije kapi —
 * kojim se strana vraca na papir. Bez njega bi se smedja zavrsavala pravom
 * linijom, a poceti prelivom pa zavrsiti rezom je pola posla.
 *
 * Donji crtez je jedan potez u boji papira, polozen preko smedje: ono sto
 * nije potez jesu kapi. Zato je smedja na `.drip__tail`, a ne na putanji.
 *
 * Tijelo pojasa je prazno namjerno — pojas je prelaz, ne sekcija.
 */
export default function Drip({ children }: { children?: ReactNode }) {
  return (
    <section className="drip">
      <div className="drip__head">
        <DripEdge variant="head" />
      </div>

      <div className="drip__body">{children}</div>

      <div className="drip__tail">
        <DripEdge variant="tail" />
      </div>
    </section>
  );
}
