import Script from 'next/script';

/*
 * Vercel Web Analytics, bez kolačića — mjeri posjete anonimno, ne prati
 * posjetioca kroz sajtove i ne čuva ništa u njegovom browseru, pa se ne pita
 * za saglasnost.
 *
 * Ubacuje se običnom <script> etiketom (zvanični način za sajtove bez njihovog
 * paketa @vercel/analytics), pa nema nove zavisnosti. Radi samo u produkciji, i
 * tek kad je Web Analytics uključen u Vercel dashboardu
 * (Project -> Analytics -> Enable) i sajt ponovo deployan.
 */
export default function Analytics() {
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      <Script id="vercel-analytics-init" strategy="afterInteractive">
        {'window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };'}
      </Script>
      <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
    </>
  );
}
