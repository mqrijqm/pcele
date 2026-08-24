import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import JarStage from '@/components/three/JarStage';
import { isLocale } from '@/i18n/config';

/*
 * Proba, ne stranica sajta. Nije u navigaciji, nije u sitemapu i nosi noindex.
 * Scenu drzi `JarStage`, koji je jedini klijentski dio ove strane.
 */

export const metadata: Metadata = {
  title: 'Proba — tegla u 3D',
  robots: { index: false, follow: false },
};

export default async function Test3DPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="header-offset" style={{ background: 'var(--paper)' }}>
      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
        <p className="eyebrow">Proba</p>
        <h1
          className="font-display"
          style={{ marginTop: '0.75rem', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--brown)' }}
        >
          Tegla sastavljena u kodu
        </h1>
        <p style={{ marginTop: '1rem', maxWidth: '52ch', lineHeight: 1.7, color: 'var(--brown)' }}>
          Nema modela za skidanje — oblik, staklo, med i poklopac nastaju u pregledniku.
          Povuci mišem da je okreneš.
        </p>
      </section>

      <div style={{ height: '78svh', width: '100%' }}>
        <JarStage />
      </div>
    </main>
  );
}
