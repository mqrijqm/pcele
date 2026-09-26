/*
 * Dok je meni ili korpa otvorena, sve iza njih mora biti "mrtvo" za tastaturu.
 *
 * `aria-modal` sam ne zarobljava fokus — Tab bi nastavio kroz formu, dugmad i
 * veze na strani koju ne vidis ispod panela. `inert` je jedina stvar koja to
 * odjednom rjesava: element (i sve u njemu) ne prima ni fokus, ni klik, a
 * citac ekrana ga preskace.
 *
 * Postavlja se rucno na DOM, ne kroz React: `main` i podnozje su serverski
 * elementi koje React ne prati, pa ih ovo atributom ne dira pri renderu.
 * Vraca funkciju koja sve vraca kako je bilo.
 */
export function lockBackground({ withHeader = false }: { withHeader?: boolean } = {}) {
  const selector = withHeader ? 'main, footer, .site-header' : 'main, footer';
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  els.forEach((el) => el.setAttribute('inert', ''));
  return () => els.forEach((el) => el.removeAttribute('inert'));
}
