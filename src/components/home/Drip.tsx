import type { ReactNode } from 'react';

/**
 * Prelaz sa papira na smedju: med se prelije preko ruba strane i sekcija
 * ispod pocinje tamo gdje se kapi zaustave.
 *
 * Rub je jedan crtez (Asset 4 iz Marijinih assetsa), ne stotinu CSS
 * radijusa — kapi su nejednake, kao sto i jesu kad se med sipa, i to je
 * jedino sto ovaj prelaz cini vjerodostojnim.
 *
 * Crtez je ovdje ispisan a ne ucitan iz /public jer je jedan potez od
 * kilobajta: kao fajl bi bio jos jedan zahtjev, a ovako uzima boju iz
 * palete i mijenja se zajedno s njom.
 *
 * Tijelo sekcije je zasad prazno. Visinu drzi `.drip__body`, a sadrzaj se
 * prosljedjuje kao djeca kad ga bude.
 */
export default function Drip({ children }: { children?: ReactNode }) {
  return (
    <section className="drip">
      <svg className="drip__edge" viewBox="0 0 1365 633.75" aria-hidden="true" focusable="false">
        <path fill="var(--brown)" d="M0,.2C6.98-.04,17.65-.19,30.61.51c43.26,2.32,103.79,5.58,144.8,45.22,22.78,22.02,31.04,47.05,40.08,74.44,14.52,44,14.06,82.64,12.01,105.91-4.33,26.48,5.77,48.91,21.9,55.37,10.48,4.2,24.82,2.18,33.91-6.2,17.71-16.34,1.9-44.38,3.08-102.35.67-32.97,1.35-66.28,21.58-93.04,24.04-31.8,63.76-38.58,73.99-40.32,76.25-13.01,103.41,48.44,186.95,46.52,56.63-1.3,49.47-29.65,109.31-32.68,88.48-4.47,122.82,56.59,187.74,35.78,36.58-11.73,32.6-33.34,74.59-43.59,44.96-10.97,105.21.02,118.76,32.17,8.11,19.23-.08,41.47,11.82,52.97,6.44,6.38,19.88,9.75,26.35,2.13,8.57-10.73-2.06-41.95,8.99-62.67,12.77-25.41,50.71-42.68,76.4-26.01,8.1,6.46,18.02,12.6,28.82,11.78,21.31-.82,36.28-21.26,64.98-36.72,24.8-13.03,49.18-19.13,88.33-17.11v631.65H0V.2Z" />
      </svg>
      <div className="drip__body">{children}</div>
    </section>
  );
}
