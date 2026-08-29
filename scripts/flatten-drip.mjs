/*
 * Ravna verzija kapajuce ivice.
 *
 * Putanju rastavlja na komande, sve prevodi u apsolutne i svodi na cetiri
 * vrste — M, L, C, Z — pa u ravnoj verziji spusta Y svake tacke gornje ivice
 * na pocetnu visinu. X se ne dira.
 *
 * Uglovi pravougaonika (tacke pri dnu okvira) ostaju gdje jesu: kad bi i njih
 * poravnao, oblik bi se sklopio u liniju bez povrsine i pojas bi nestao.
 */

const NUM = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;

function parse(d) {
  const out = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
  let m;
  while ((m = re.exec(d))) {
    out.push({ cmd: m[1], args: (m[2].match(NUM) || []).map(Number) });
  }
  return out;
}

/* Sve u apsolutno, i samo M / L / C / Z. */
function normalise(d) {
  const segs = [];
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let prevCtrl = null;

  for (const { cmd, args } of parse(d)) {
    const rel = cmd === cmd.toLowerCase();
    const up = cmd.toUpperCase();

    if (up === 'Z') {
      segs.push({ cmd: 'Z', pts: [] });
      x = sx;
      y = sy;
      prevCtrl = null;
      continue;
    }

    const step = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4 }[up];
    if (!step) throw new Error('nepodrzana komanda: ' + cmd);

    for (let i = 0; i < args.length; i += step) {
      const a = args.slice(i, i + step);

      if (up === 'M' || up === 'L') {
        const nx = rel ? x + a[0] : a[0];
        const ny = rel ? y + a[1] : a[1];
        // Svaki M poslije prvog para u nizu je zapravo L — tako kaze SVG.
        const kind = up === 'M' && i > 0 ? 'L' : up;
        segs.push({ cmd: kind, pts: [nx, ny] });
        if (kind === 'M') {
          sx = nx;
          sy = ny;
        }
        x = nx;
        y = ny;
        prevCtrl = null;
      } else if (up === 'H') {
        const nx = rel ? x + a[0] : a[0];
        segs.push({ cmd: 'L', pts: [nx, y] });
        x = nx;
        prevCtrl = null;
      } else if (up === 'V') {
        const ny = rel ? y + a[0] : a[0];
        segs.push({ cmd: 'L', pts: [x, ny] });
        y = ny;
        prevCtrl = null;
      } else if (up === 'C') {
        const p = rel ? [x + a[0], y + a[1], x + a[2], y + a[3], x + a[4], y + a[5]] : a;
        segs.push({ cmd: 'C', pts: p });
        prevCtrl = [p[2], p[3]];
        x = p[4];
        y = p[5];
      } else if (up === 'S') {
        const c1 = prevCtrl ? [2 * x - prevCtrl[0], 2 * y - prevCtrl[1]] : [x, y];
        const p2 = rel ? [x + a[0], y + a[1]] : [a[0], a[1]];
        const p3 = rel ? [x + a[2], y + a[3]] : [a[2], a[3]];
        segs.push({ cmd: 'C', pts: [...c1, ...p2, ...p3] });
        prevCtrl = p2;
        x = p3[0];
        y = p3[1];
      }
    }
  }
  return segs;
}

const r = (n) => Number(n.toFixed(3));

function toD(segs) {
  return segs
    .map(({ cmd, pts }) => (cmd === 'Z' ? 'Z' : cmd + pts.map(r).join(' ')))
    .join('');
}

/*
 * Ravna varijanta: ista lista komandi, isti X-evi, a Y svake tacke gornje
 * ivice pada na pocetnu visinu. Tacke pri dnu okvira se ne diraju.
 */
function flatten(segs, height, baseline) {
  const floor = height * 0.8;
  return segs.map(({ cmd, pts }) => ({
    cmd,
    pts: pts.map((v, i) => (i % 2 === 1 && v < floor ? baseline : v)),
  }));
}

const shapes = {
  head: {
    viewBox: '0 0 1365 633.75',
    height: 633.75,
    d: 'M0,.2C6.98-.04,17.65-.19,30.61.51c43.26,2.32,103.79,5.58,144.8,45.22,22.78,22.02,31.04,47.05,40.08,74.44,14.52,44,14.06,82.64,12.01,105.91-4.33,26.48,5.77,48.91,21.9,55.37,10.48,4.2,24.82,2.18,33.91-6.2,17.71-16.34,1.9-44.38,3.08-102.35.67-32.97,1.35-66.28,21.58-93.04,24.04-31.8,63.76-38.58,73.99-40.32,76.25-13.01,103.41,48.44,186.95,46.52,56.63-1.3,49.47-29.65,109.31-32.68,88.48-4.47,122.82,56.59,187.74,35.78,36.58-11.73,32.6-33.34,74.59-43.59,44.96-10.97,105.21.02,118.76,32.17,8.11,19.23-.08,41.47,11.82,52.97,6.44,6.38,19.88,9.75,26.35,2.13,8.57-10.73-2.06-41.95,8.99-62.67,12.77-25.41,50.71-42.68,76.4-26.01,8.1,6.46,18.02,12.6,28.82,11.78,21.31-.82,36.28-21.26,64.98-36.72,24.8-13.03,49.18-19.13,88.33-17.11v631.65H0V.2Z',
  },
  tail: {
    viewBox: '0 0 1440 691',
    height: 691,
    d: 'M0 0.218189C7.36352 -0.0434873 18.6198 -0.207035 32.2919 0.556187C77.9288 3.08572 141.785 6.64016 185.048 49.8604C209.08 73.8692 217.793 101.16 227.33 131.024C242.648 178.998 242.163 221.128 240 246.499C235.432 275.371 246.087 299.827 263.103 306.87C274.159 311.449 289.287 309.247 298.876 300.11C317.56 282.294 300.881 251.722 302.126 188.516C302.833 152.568 303.55 116.25 324.891 87.0729C350.252 52.4008 392.155 45.0084 402.947 43.1113C483.386 28.9263 512.039 95.9263 600.169 93.8329C659.91 92.4155 652.357 61.505 715.485 58.2013C808.826 53.3276 845.053 119.902 913.54 97.2129C952.13 84.4234 947.931 60.8617 992.229 49.6859C1039.66 37.7251 1103.22 49.7077 1117.51 84.7614C1126.07 105.728 1117.43 129.977 1129.98 142.516C1136.78 149.472 1150.96 153.146 1157.78 144.838C1166.82 133.139 1155.61 99.0991 1167.27 76.5077C1180.74 48.8027 1220.76 29.973 1247.86 48.1486C1256.41 55.192 1266.87 61.8866 1278.27 60.9925C1300.75 60.0984 1316.54 37.8123 1346.82 20.956C1372.98 6.74919 1398.7 0.0982538 1440 2.3007V691H0V0.218189Z',
  },
};

const report = {};
for (const [name, s] of Object.entries(shapes)) {
  const segs = normalise(s.d);
  const baseline = segs[0].pts[1];
  const flat = flatten(segs, s.height, baseline);

  report[name] = {
    viewBox: s.viewBox,
    komandi: segs.length,
    tipovi: segs.map((x) => x.cmd).join(''),
    isti: segs.map((x) => x.cmd).join('') === flat.map((x) => x.cmd).join(''),
    brojeva: segs.reduce((n, x) => n + x.pts.length, 0),
    baseline,
    xIsti: segs.every((sg, i) =>
      sg.pts.every((v, j) => (j % 2 === 1 ? true : v === flat[i].pts[j])),
    ),
    drip: toD(segs),
    flat: toD(flat),
  };
}

console.log(JSON.stringify(report, null, 1));
