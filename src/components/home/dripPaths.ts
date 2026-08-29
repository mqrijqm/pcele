/**
 * Kapajuca ivica i njena ravna verzija.
 *
 * Obje putanje su svedene na isti oblik zapisa: apsolutne koordinate i samo
 * cetiri komande — M, C, L, Z. Svaka ima dvadeset i sest komandi i sto trideset
 * i cetiri broja, u istom redoslijedu. Zato se izmedju njih moze preci prostim
 * racunom, broj po broj, bez ijedne biblioteke.
 *
 * Ravnu verziju nije crtala ruka nego skripta: uzela je istu putanju i svakoj
 * tacki gornje ivice spustila Y na pocetnu visinu. X nije dirala. Tacke pri
 * dnu okvira ostale su gdje jesu — kad bi i one legle na istu visinu, oblik bi
 * se sklopio u liniju bez povrsine i cijeli pojas bi nestao.
 *
 * Otud i izgled ravnih putanja: dvadeset i jedna kriva ciji su svi Y isti, pa
 * se sve one crtaju kao prava linija. Tacke su tu i dalje — samo poravnate.
 * To je i cijela poenta: da ih ima koliko i u kapima, da svaka ima svoj par.
 */

/** Gornja ivica: med se prelije s papira na med. */
export const HEAD_VIEWBOX = '0 0 1365 633.75';

export const HEAD_DRIP =
  'M0 0.2C6.98 -0.04 17.65 -0.19 30.61 0.51C73.87 2.83 134.4 6.09 175.41 45.73C198.19 67.75 206.45 92.78 215.49 120.17C230.01 164.17 229.55 202.81 227.5 226.08C223.17 252.56 233.27 274.99 249.4 281.45C259.88 285.65 274.22 283.63 283.31 275.25C301.02 258.91 285.21 230.87 286.39 172.9C287.06 139.93 287.74 106.62 307.97 79.86C332.01 48.06 371.73 41.28 381.96 39.54C458.21 26.53 485.37 87.98 568.91 86.06C625.54 84.76 618.38 56.41 678.22 53.38C766.7 48.91 801.04 109.97 865.96 89.16C902.54 77.43 898.56 55.82 940.55 45.57C985.51 34.6 1045.76 45.59 1059.31 77.74C1067.42 96.97 1059.23 119.21 1071.13 130.71C1077.57 137.09 1091.01 140.46 1097.48 132.84C1106.05 122.11 1095.42 90.89 1106.47 70.17C1119.24 44.76 1157.18 27.49 1182.87 44.16C1190.97 50.62 1200.89 56.76 1211.69 55.94C1233 55.12 1247.97 34.68 1276.67 19.22C1301.47 6.19 1325.85 0.09 1365 2.11L1365 633.76L0 633.76L0 0.2Z';

export const HEAD_FLAT =
  'M0 0.2C6.98 0.2 17.65 0.2 30.61 0.2C73.87 0.2 134.4 0.2 175.41 0.2C198.19 0.2 206.45 0.2 215.49 0.2C230.01 0.2 229.55 0.2 227.5 0.2C223.17 0.2 233.27 0.2 249.4 0.2C259.88 0.2 274.22 0.2 283.31 0.2C301.02 0.2 285.21 0.2 286.39 0.2C287.06 0.2 287.74 0.2 307.97 0.2C332.01 0.2 371.73 0.2 381.96 0.2C458.21 0.2 485.37 0.2 568.91 0.2C625.54 0.2 618.38 0.2 678.22 0.2C766.7 0.2 801.04 0.2 865.96 0.2C902.54 0.2 898.56 0.2 940.55 0.2C985.51 0.2 1045.76 0.2 1059.31 0.2C1067.42 0.2 1059.23 0.2 1071.13 0.2C1077.57 0.2 1091.01 0.2 1097.48 0.2C1106.05 0.2 1095.42 0.2 1106.47 0.2C1119.24 0.2 1157.18 0.2 1182.87 0.2C1190.97 0.2 1200.89 0.2 1211.69 0.2C1233 0.2 1247.97 0.2 1276.67 0.2C1301.47 0.2 1325.85 0.2 1365 0.2L1365 633.76L0 633.76L0 0.2Z';

/** Donja ivica: isti potez, u boji papira, kojim se strana vraca na papir. */
export const TAIL_VIEWBOX = '0 0 1440 691';

export const TAIL_DRIP =
  'M0 0.218C7.364 -0.043 18.62 -0.207 32.292 0.556C77.929 3.086 141.785 6.64 185.048 49.86C209.08 73.869 217.793 101.16 227.33 131.024C242.648 178.998 242.163 221.128 240 246.499C235.432 275.371 246.087 299.827 263.103 306.87C274.159 311.449 289.287 309.247 298.876 300.11C317.56 282.294 300.881 251.722 302.126 188.516C302.833 152.568 303.55 116.25 324.891 87.073C350.252 52.401 392.155 45.008 402.947 43.111C483.386 28.926 512.039 95.926 600.169 93.833C659.91 92.415 652.357 61.505 715.485 58.201C808.826 53.328 845.053 119.902 913.54 97.213C952.13 84.423 947.931 60.862 992.229 49.686C1039.66 37.725 1103.22 49.708 1117.51 84.761C1126.07 105.728 1117.43 129.977 1129.98 142.516C1136.78 149.472 1150.96 153.146 1157.78 144.838C1166.82 133.139 1155.61 99.099 1167.27 76.508C1180.74 48.803 1220.76 29.973 1247.86 48.149C1256.41 55.192 1266.87 61.887 1278.27 60.992C1300.75 60.098 1316.54 37.812 1346.82 20.956C1372.98 6.749 1398.7 0.098 1440 2.301L1440 691L0 691L0 0.218Z';

export const TAIL_FLAT =
  'M0 0.218C7.364 0.218 18.62 0.218 32.292 0.218C77.929 0.218 141.785 0.218 185.048 0.218C209.08 0.218 217.793 0.218 227.33 0.218C242.648 0.218 242.163 0.218 240 0.218C235.432 0.218 246.087 0.218 263.103 0.218C274.159 0.218 289.287 0.218 298.876 0.218C317.56 0.218 300.881 0.218 302.126 0.218C302.833 0.218 303.55 0.218 324.891 0.218C350.252 0.218 392.155 0.218 402.947 0.218C483.386 0.218 512.039 0.218 600.169 0.218C659.91 0.218 652.357 0.218 715.485 0.218C808.826 0.218 845.053 0.218 913.54 0.218C952.13 0.218 947.931 0.218 992.229 0.218C1039.66 0.218 1103.22 0.218 1117.51 0.218C1126.07 0.218 1117.43 0.218 1129.98 0.218C1136.78 0.218 1150.96 0.218 1157.78 0.218C1166.82 0.218 1155.61 0.218 1167.27 0.218C1180.74 0.218 1220.76 0.218 1247.86 0.218C1256.41 0.218 1266.87 0.218 1278.27 0.218C1300.75 0.218 1316.54 0.218 1346.82 0.218C1372.98 0.218 1398.7 0.218 1440 0.218L1440 691L0 691L0 0.218Z';

const NUM = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
const CMD = /[MLCZ]/g;

/**
 * Pravi funkciju koja vraca putanju negdje izmedju dvije zadate.
 *
 * Obje se rastave jednom, pri pozivu: komande na jednu stranu, brojevi na
 * drugu. Poslije toga svaki kadar samo racuna brojeve i slaze niz — nema
 * ponovnog citanja putanje i nema biblioteke koja bi krive pretvarala u
 * mnogougao da bi ih uparila. Krive ostaju krive.
 *
 * Ako se dvije putanje ne poklapaju po broju komandi ili brojeva, funkcija ne
 * pokusava da ih pomiri nego vraca odrediste. Bolje da se vidi da nema
 * prelaza nego da se strana crta iskrivljeno.
 */
export function morph(from: string, to: string): (t: number) => string {
  const ops = from.match(CMD) ?? [];
  const a = (from.match(NUM) ?? []).map(Number);
  const b = (to.match(NUM) ?? []).map(Number);

  const mismatch = ops.join('') !== (to.match(CMD) ?? []).join('') || a.length !== b.length;
  if (mismatch) return () => to;

  /* Koliko brojeva nosi svaka komanda. */
  const arity: Record<string, number> = { M: 2, L: 2, C: 6, Z: 0 };

  return (t: number) => {
    const out: string[] = [];
    let n = 0;
    for (const op of ops) {
      const count = arity[op];
      if (!count) {
        out.push(op);
        continue;
      }
      let chunk = op;
      for (let i = 0; i < count; i += 1) {
        const v = a[n] + (b[n] - a[n]) * t;
        chunk += (i ? ' ' : '') + Math.round(v * 100) / 100;
        n += 1;
      }
      out.push(chunk);
    }
    return out.join('');
  };
}
