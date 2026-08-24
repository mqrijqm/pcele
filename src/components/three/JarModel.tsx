'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * Tegla od 500 g, sastavljena u kodu — nema .glb fajla i nema sta da se skida.
 *
 * Mjere su u centimetrima, po odnosima sa fotografije: 9.4 cm visine tijela,
 * 3.15 cm poluprecnika, grlo suzeno na 2.1 cm. Sa poklopcem odnos visine i
 * sirine ispada oko 1.6, koliko je i na snimku.
 *
 * Oblik nosi `LatheGeometry` — profil (presjek kroz teglu) zarotiran oko
 * uspravne ose. Zato tegla ima rame, suzeno grlo i zaobljeno dno, sto valjak
 * po definiciji ne moze imati.
 */

type Pt = [number, number];

/** Spoljna kontura stakla, od dna ka grlu. Prva tacka na x=0 zatvara dno. */
const STAKLO: Pt[] = [
  [0, 0],
  [2.35, 0],
  [2.94, 0.26],
  [3.13, 0.8],
  [3.15, 1.9],
  [3.15, 6.35],
  [3.09, 6.9],
  [2.86, 7.55],
  [2.44, 8.2],
  [2.15, 8.6],
  [2.1, 8.85],
  [2.1, 9.4],
];

/**
 * Med. Uzi je od stakla za debljinu zida i staje na 7.75 — tegla se ne puni do
 * vrha. Zavrsna tacka na x=0 pravi ravnu povrsinu meda; bez nje bi se kroz
 * staklo vidjela rupa umjesto povrsine.
 */
const MED: Pt[] = [
  [0, 0.14],
  [2.25, 0.14],
  [2.8, 0.4],
  [2.99, 0.9],
  [3.01, 1.9],
  [3.01, 6.35],
  [2.95, 6.85],
  [2.74, 7.4],
  [2.45, 7.72],
  [0, 7.78],
];

/** Poklopac: ravan gore, sa oborenom ivicom. Sjeda preko grla. */
const POKLOPAC: Pt[] = [
  [0, 0.9],
  [1.98, 0.88],
  [2.24, 0.72],
  [2.28, 0.1],
  [2.24, 0],
  [0, 0],
];

const toLathe = (pts: Pt[], segments = 96) =>
  new THREE.LatheGeometry(
    pts.map(([x, y]) => new THREE.Vector2(x, y)),
    segments
  );

/* --- etiketa ------------------------------------------------------------- */

const LABEL_W = 2048;
const LABEL_H = 820;

/**
 * Udio oboda koji crtez pokriva.
 *
 * Crtez je izrezan iz FOTOGRAFIJE prednje strane tegle, dakle vec je skracen
 * perspektivom — na snimku je oko 160 stepeni oboda spljosteno u ravnu sliku.
 * Vracanjem na valjak se to otprilike ponistava, pa se crtez razvlaci na
 * 160 stepeni umjesto na svojih 109 koliko bi trazio cist odnos stranica.
 */
const LUK = 160 / 360;

export default function JarModel({ spin = true }: { spin?: boolean }) {
  const group = useRef<THREE.Group>(null);

  const crtez = useLoader(THREE.TextureLoader, '/3d/etiketa-livadski.webp');

  /*
   * Etiketa se sastavlja na platnu, pa tek onda ide na valjak: crtez u sredini,
   * kremasti papir svuda oko njega. Tako je omot jedan komad sa savom pozadi,
   * kao na pravoj tegli — dvije odvojene povrsine bi na spoju dale ivicu.
   */
  const etiketa = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = LABEL_W;
    cv.height = LABEL_H;
    const ctx = cv.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#efe3c6';
    ctx.fillRect(0, 0, LABEL_W, LABEL_H);

    const w = LABEL_W * LUK;
    const img = crtez.image as CanvasImageSource | undefined;
    if (img) ctx.drawImage(img, (LABEL_W - w) / 2, 0, w, LABEL_H);

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }, [crtez]);

  const staklo = useMemo(() => toLathe(STAKLO), []);
  const med = useMemo(() => toLathe(MED), []);
  const poklopac = useMemo(() => toLathe(POKLOPAC, 64), []);

  useFrame((_, dt) => {
    if (spin && group.current) group.current.rotation.y += dt * 0.3;
  });

  return (
    <group ref={group} position={[0, -4.9, 0]}>
      {/*
        * Med je neproziran. Sa `transmission` je i on propustao svjetlo, pa je
        * hvatao svijetlo okruzenje i cijela tegla je ispadala bijela — staklo
        * nema sta da pokaze ako je i sadrzaj proziran.
        */}
      <mesh geometry={med}>
        <meshPhysicalMaterial
          color="#c47f10"
          roughness={0.28}
          metalness={0}
          clearcoat={0.7}
          clearcoatRoughness={0.3}
          sheen={0.4}
          sheenColor="#f0b23c"
        />
      </mesh>

      {/*
        * Staklo. `transmission` je pravo prelamanje svjetla, ne prozirnost —
        * zato mu treba `thickness` i `ior`. To je i najskuplji dio scene:
        * three zbog njega renderuje scenu jos jednom u posebnu teksturu.
        */}
      <mesh geometry={staklo}>
        <meshPhysicalMaterial
          color="#eef4f0"
          roughness={0.04}
          metalness={0}
          transmission={1}
          thickness={0.22}
          ior={1.52}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* Omot preko cijelog oboda; sav je pozadi. */}
      {etiketa && (
        <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI, 0]}>
          <cylinderGeometry args={[3.19, 3.19, 5.3, 96, 1, true]} />
          <meshStandardMaterial map={etiketa} roughness={0.82} side={THREE.DoubleSide} />
        </mesh>
      )}

      <group position={[0, 8.9, 0]}>
        <mesh geometry={poklopac}>
          <meshStandardMaterial color="#c79a3b" metalness={0.9} roughness={0.3} />
        </mesh>
        <Rebra />
      </group>
    </group>
  );
}

/** Rebra po obodu poklopca. Instancirana — 64 rebra, jedan poziv za crtanje. */
const REBARA = 64;

function Rebra() {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scale = new THREE.Vector3(1, 1, 1);

    for (let i = 0; i < REBARA; i++) {
      const a = (i / REBARA) * Math.PI * 2;
      pos.set(Math.cos(a) * 2.27, 0.4, Math.sin(a) * 2.27);
      q.setFromEuler(new THREE.Euler(0, -a, 0));
      m.compose(pos, q, scale);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, REBARA]}>
      <boxGeometry args={[0.04, 0.44, 0.09]} />
      <meshStandardMaterial color="#a97c2a" metalness={0.95} roughness={0.35} />
    </instancedMesh>
  );
}
