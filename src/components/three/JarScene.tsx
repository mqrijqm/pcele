'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';

import JarModel from './JarModel';

/**
 * Scena oko tegle. Sve sto kosta performanse drzano je ovdje, na jednom mjestu.
 *
 * Okruzenje se NE skida sa mreze. `<Environment>` uz `preset` povlaci HDRI sa
 * tudjeg servera; ovdje su umjesto toga tri svijetla pravougaonika koje three
 * sam snimi u kockastu mapu 256x256. Nista ne izlazi iz sajta, nista se ne
 * ceka, a staklo ima sta da odbija — bez odsjaja bi izgledalo kao mlijeko.
 */
export default function JarScene() {
  const [mirno, setMirno] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMirno(mq.matches);
    const on = () => setMirno(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <Canvas
      /*
       * Gornja granica gustine piksela. Na ekranu sa DPR 3 scena bi se
       * renderovala devet puta vise piksela nego na obicnom, a prozirno staklo
       * svaki taj piksel placa dvaput jer trazi jos jedan prolaz.
       */
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 1.6, 20], fov: 32 }}
    >
      <color attach="background" args={['#f5e8d8']} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 6]} intensity={2.1} />
      <directionalLight position={[-7, 4, -4]} intensity={0.7} color="#ffd9a0" />

      <Suspense fallback={null}>
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={3.2} scale={[12, 9]} position={[0, 6, 9]} />
          <Lightformer form="rect" intensity={1.6} scale={[9, 12]} position={[-10, 2, 2]} />
          <Lightformer form="rect" intensity={1.1} scale={[9, 12]} position={[10, 2, -3]} />
        </Environment>

        <JarModel spin={!mirno} />
      </Suspense>

      {/* Bez zumiranja: kotacic ostaje strani, da se sekcija ne otima o skrol. */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.62}
      />
    </Canvas>
  );
}
