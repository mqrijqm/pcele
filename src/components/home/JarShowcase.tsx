'use client';

import dynamic from 'next/dynamic';

/*
 * Three.js je oko 700 KB. Ucitava se tek u browseru i tek kad ova sekcija
 * zatreba — zato `ssr: false`. Da je u glavnom bundleu, cela stranica bi
 * cekala 3D biblioteku i pre nego sto se prvo slovo ispise.
 */
const JarScene = dynamic(() => import('./JarScene'), { ssr: false });

export default function JarShowcase() {
  return (
    <section
      aria-label="Tegla livadskog meda — povuci mišem za rotaciju"
      className="relative flex min-h-screen items-center justify-center bg-[#FDF9DC]"
    >
      {/*
       * `touch-pan-y` na platnu je kompromis za telefone: uspravno prevlacenje
       * i dalje skroluje stranicu, a vodoravno ide tegli. Da stoji `none`,
       * prst bi zaglavio u sekciji; da stoji `auto`, rotacija ne bi radila.
       * Tegla se ionako okrece vodoravno, pa se nista ne gubi.
       */}
      <div className="h-[min(70vh,42rem)] w-full [&_canvas]:touch-pan-y">
        <JarScene />
      </div>
    </section>
  );
}
