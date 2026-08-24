'use client';

import dynamic from 'next/dynamic';

/*
 * Jedini posao ovog fajla je da drzi `ssr: false`.
 *
 * U App Routeru se to ne smije napisati u serverskoj komponenti, a mora negdje
 * da postoji: <Canvas> trazi pravi WebGL kontekst, kojeg na serveru nema. Uz to
 * ovako three.js ostaje u zasebnom komadu koji se skida tek kad se ova strana
 * otvori — ni jedan drugi ekran sajta ga ne nosi.
 */
const JarScene = dynamic(() => import('./JarScene'), {
  ssr: false,
  loading: () => null,
});

export default function JarStage() {
  return <JarScene />;
}
