'use client';

import { Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  PresentationControls,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';
import {
  deinterleaveGeometry,
  mergeVertices,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const MODEL = '/models/tegla_livadski.glb';

/**
 * Model dolazi iz Blendera sa proizvoljnom velicinom i pozicijom, pa ga ovde
 * sami centriramo i skaliramo. Tako scena izgleda isto i ako neko sutra izveze
 * novu teglu iz drugog fajla.
 */
function Jar() {
  const { scene } = useGLTF(MODEL);
  const viewport = useThree((state) => state.viewport);

  const { object, size } = useMemo(() => {
    const clone = scene.clone(true);

    /*
     * Senčenje je bilo ravno po pločicama. Popravka ide u tri koraka:
     *   1. razdvoji prepletene atribute — `mergeVertices` na takvom zapisu puca
     *   2. baci zatecene normale pa spoji tacke po poziciji i UV-u
     *   3. izracunaj normale iznova, sad preko deljenih tacaka
     * Svetlo tada prelazi preko ivica umesto da se lomi na njima.
     *
     * Geometrija se NE zaglađuje (Loop subdivision) — probano, raspada model:
     * telo je vise odvojenih ljuski (staklo i med), pa algoritam spoji ono
     * sto ne sme. Uglasti obris dna se moze resiti samo u izvornom fajlu.
     */
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      // deinterleaveGeometry menja geometriju na licu mesta, ne vraca novu.
      const geo = mesh.geometry as THREE.BufferGeometry;
      deinterleaveGeometry(geo);

      geo.deleteAttribute('normal');
      const spojen = mergeVertices(geo, 1e-5);
      spojen.computeVertexNormals();
      mesh.geometry = spojen;
    });

    const box = new THREE.Box3().setFromObject(clone);
    const dims = box.getSize(new THREE.Vector3());
    clone.position.sub(box.getCenter(new THREE.Vector3()));
    return { object: clone, size: dims };
  }, [scene]);

  /*
   * `viewport` vraca koliko je sveta vidljivo pred kamerom. Poredimo teglu sa
   * tim prostorom i po visini i po sirini, pa uzimamo manji odnos — inace bi
   * na uskom telefonu izlazila van ekrana, a na sirokom monitoru bila sicusna.
   */
  const scale = useMemo(
    () => Math.min((viewport.height * 0.78) / size.y, (viewport.width * 0.72) / size.x),
    [viewport.height, viewport.width, size.x, size.y]
  );

  // Dno tegle u svetskim jedinicama — tu ide senka, bez obzira na skalu.
  const bottom = (-size.y * scale) / 2;

  return (
    <>
      {/*
       * PresentationControls vrti sam objekat, ne kameru — zato tegla ostaje
       * u sredini kadra dok je okrecemo. `global` znaci da se hvata bilo gde
       * na sekciji, ne samo tacno na modelu; tako se lakse otkrije da moze.
       * Vodoravno se vrti bez granica, uspravno namerno malo — da tegla ne
       * moze da se prevrne naglavacke.
       */}
      <PresentationControls
        global
        cursor
        snap={false}
        speed={1.6}
        damping={0.18}
        polar={[-Math.PI / 11, Math.PI / 11]}
        azimuth={[-Infinity, Infinity]}
      >
        <group scale={scale}>
          <primitive object={object} />
        </group>
      </PresentationControls>

      {/*
       * Senka stoji izvan kontrola — ona pripada podlozi, ne tegli,
       * pa se ne sme okretati zajedno sa njom.
       */}
      <ContactShadows
        position={[0, bottom - 0.02, 0]}
        opacity={0.85}
        /*
         * `far` je visina do koje senka "hvata" geometriju iznad ploce. Ako je
         * manja od tegle, senka nestane sasvim — na to sam vec naleteo.
         * Sirina ploce je kompromis: preuska pa se zamucena senka seče o rub i
         * ispod tegle se vidi pravougaonik, preširoka pa se senka razvuce u nista.
         */
        scale={size.x * scale * 4}
        blur={1.8}
        far={3}
        resolution={1024}
        color="#73552E"
      />
    </>
  );
}

export default function JarScene() {
  return (
    <Canvas
      // dpr gore ogranicen na 2 — na telefonima sa dpr 3 i 4 bi scena
      // renderovala 9x vise piksela nego sto oko primeti.
      dpr={[1, 2]}
      camera={{ position: [0, 0.85, 5.2], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} />
      <directionalLight position={[-5, 2, -3]} intensity={0.5} />

      <Suspense fallback={null}>
        <Jar />

        {/*
         * Staklo i lak na etiketi traze nesto da odbiju. Umesto da skidamo
         * HDR mapu sa tudjeg servera, okruzenje sklapamo od nekoliko svetlecih
         * ploca — nula mreznog saobracaja, a odsjaj postoji.
         */}
        <Environment resolution={256}>
          <Lightformer intensity={2.6} position={[0, 4, 2]} scale={[8, 3, 1]} color="#FFFBEA" />
          <Lightformer intensity={1.4} position={[-4, 1, 2]} scale={[3, 6, 1]} color="#FDF9DC" />
          <Lightformer intensity={1} position={[4, 0, 3]} scale={[3, 5, 1]} color="#C79A3B" />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL);
