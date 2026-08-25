import type { Locale } from '@/i18n/config';

/**
 * Karta opstine, crtana istom olovkom kao hero pejzaz.
 *
 * Ranije je ovdje stajala rasterska karta: puna zlatna povrsina, bijele
 * plocice sa nazivima i pin ikone — izgled Google Mapsa usred papirne strane.
 *
 * Obris je stvarni: ocitan je iz te iste karte, uzorkovanjem njenog ruba u
 * 72 pravca iz tezista, pa provucen kroz glatku krivu i lagano zadrhtan, da
 * linija ima ruku. Mjere su iste kao na izvorniku (1058 x 706), pa tri
 * pcelinjaka stoje tacno tamo gdje su i stajali.
 *
 * Pcelinjak nije pin nego mala kosnica: tri poklopljena nastavka i krov,
 * istim potezom kao i sve ostalo.
 */

/** Obris opstine. */
const OBRIS =
  'M976.3 400.7C979.0 413.4 973.6 424.1 970.1 437.1C966.6 450.1 959.4 465.2 955.2 478.5C951.0 491.7 946.5 503.7 944.6 516.6C942.7 529.5 943.7 540.9 943.8 555.8C944.0 570.7 951.2 593.6 945.6 605.9C940.0 618.2 921.6 620.8 910.3 629.7C899.1 638.6 890.5 651.7 878.0 659.3C865.4 667.0 854.5 677.2 834.9 675.6C815.3 673.9 779.2 652.3 760.4 649.5C741.5 646.6 733.4 657.2 721.6 658.6C709.8 660.0 701.3 659.0 689.7 657.8C678.1 656.6 662.9 651.3 652.2 651.3C641.6 651.4 634.2 657.6 625.8 658.1C617.4 658.6 610.3 653.7 601.8 654.5C593.4 655.4 582.9 661.6 575.0 663.2C567.1 664.7 561.9 664.9 554.3 663.9C546.7 662.9 537.6 657.6 529.3 657.3C521.1 657.0 512.0 661.6 504.7 662.2C497.4 662.9 493.5 660.0 485.5 661.2C477.5 662.3 465.5 666.8 456.7 669.1C448.0 671.4 440.9 675.6 433.0 674.9C425.2 674.3 418.1 668.1 409.8 665.4C401.5 662.6 388.4 665.5 383.3 658.4C378.2 651.3 380.2 635.9 379.2 622.8C378.2 609.7 379.9 588.7 377.2 580.0C374.4 571.3 366.2 575.7 362.6 570.7C359.0 565.7 382.9 536.3 355.7 550.1C328.4 564.0 229.5 639.9 199.4 653.8C169.2 667.6 184.0 641.1 174.7 633.2C165.3 625.3 151.1 615.9 143.2 606.3C135.3 596.7 132.3 586.3 127.4 575.7C122.5 565.0 120.5 553.5 113.9 542.4C107.2 531.2 95.5 519.4 87.7 508.7C79.9 498.0 72.5 490.2 66.8 478.2C61.2 466.2 55.6 449.8 53.8 436.6C52.0 423.3 54.1 411.3 56.1 398.7C58.1 386.1 53.3 372.6 65.6 361.1C77.9 349.7 117.6 339.8 130.0 330.0C142.3 320.3 137.2 313.3 139.8 302.6C142.4 291.9 150.8 280.8 145.8 265.9C140.7 251.0 117.3 230.1 109.4 213.2C101.4 196.3 97.6 180.1 98.1 164.6C98.6 149.0 106.2 132.2 112.6 120.0C119.0 107.7 127.4 101.2 136.5 90.9C145.7 80.7 152.3 62.6 167.5 58.4C182.7 54.1 202.6 53.1 227.7 65.7C252.9 78.2 293.6 116.2 318.6 133.6C343.5 151.1 363.6 163.4 377.2 170.3C390.9 177.3 392.5 175.2 400.3 175.3C408.1 175.4 417.2 174.6 424.1 170.9C431.0 167.1 436.1 160.0 441.5 152.9C446.9 145.8 449.4 131.8 456.7 128.3C463.9 124.7 477.2 130.3 485.2 131.4C493.2 132.5 497.6 132.4 504.8 135.1C512.0 137.8 520.8 144.8 528.5 147.7C536.2 150.6 544.5 149.6 550.9 152.5C557.3 155.4 559.3 164.2 566.8 165.3C574.3 166.3 589.7 154.9 595.6 159.0C601.6 163.1 597.8 183.6 602.3 189.8C606.9 196.0 615.6 194.5 623.1 196.1C630.6 197.7 641.1 196.8 647.2 199.5C653.4 202.2 645.8 216.3 660.0 212.3C674.1 208.3 714.0 181.3 731.9 175.6C749.9 169.8 757.5 174.2 767.7 177.9C777.8 181.6 783.7 191.1 792.7 197.8C801.7 204.4 813.3 211.1 821.9 217.9C830.5 224.7 833.9 231.1 844.2 238.6C854.5 246.2 867.5 256.1 883.6 263.2C899.7 270.3 929.0 271.8 940.9 281.1C952.9 290.4 953.0 305.7 955.2 319.0C957.4 332.3 950.5 347.4 954.0 361.0C957.5 374.6 973.6 388.0 976.3 400.7Z';

/** Pcelinjaci — mjesta ocitana sa izvorne karte. */
const PCELINJACI = [
  { x: 345, y: 290, naziv: 'Orašje', anchor: 'middle' as const, dy: -34 },
  { x: 715, y: 356, naziv: 'Mračaj', anchor: 'start' as const, dy: -34 },
  { x: 535, y: 496, naziv: 'Otpočivaljka', anchor: 'middle' as const, dy: 46 },
];

/** Mala kosnica: tri nastavka i krov. */
function Kosnica({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="mapa__kosnica">
      <path d="M-13-14h26M-15-14l15-9 15 9M-11-4h22M-11 5h22M-11 14h22" />
    </g>
  );
}

export default function OriginMap({ alt, locale }: { alt: string; locale: Locale }) {
  return (
    <figure className="mapa reveal stagger-2">
      <svg viewBox="0 0 1058 706" role="img" aria-label={alt}>
        <path className="mapa__obris" d={OBRIS} />
        {PCELINJACI.map((p) => (
          <g key={p.naziv}>
            <Kosnica x={p.x} y={p.y} />
            <text className="mapa__naziv" x={p.x} y={p.y + p.dy} textAnchor={p.anchor}>
              {p.naziv}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mapa__potpis">
        {locale === 'sr' ? 'Opština Prnjavor · tri pčelinjaka' : 'Prnjavor municipality · three apiaries'}
      </figcaption>
    </figure>
  );
}
