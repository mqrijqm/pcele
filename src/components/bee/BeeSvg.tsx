import { BEE_PATHS, BEE_VIEWBOX } from './beePaths';

/**
 * Pcela, ubacena u dokument (a ne kroz <img src="/bee.svg">) iz jednog razloga:
 * CSS moze da dohvati krila samo ako su stvarni cvorovi na strani.
 *
 * /public/bee.svg je isti crtez, za otvaranje u Figmi — ali strana crta ovo.
 *
 * Redosled crtanja je zadnje krilo -> telo -> prednje krilo, pa telo prekriva
 * koren zadnjeg krila i lepet izgleda kao da izlazi iza grudi.
 */
export default function BeeSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={BEE_VIEWBOX}
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
    >
      <path id="wing-back" d={BEE_PATHS.wingBack} />
      <path id="body" d={BEE_PATHS.body} />
      <path id="wing-front" d={BEE_PATHS.wingFront} />
    </svg>
  );
}
