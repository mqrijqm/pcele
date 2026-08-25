/**
 * Rucno povucena linija — jedini razdjelnik na sajtu.
 *
 * Nije `border`: ravna linija od jednog piksela je jedino mjesto na strani
 * gdje bi se vidjelo da je nesto crtao racunar, a sve ostalo je crtano rukom.
 * `non-scaling-stroke` drzi debljinu na jednom pikselu koliko god se linija
 * razvukla, a `preserveAspectRatio="none"` joj dozvoljava da se razvuce.
 *
 * Oba polozaja stoje u istom omotacu, a CSS bira koji se vidi: razdjelnik u
 * mrezi lezi vodoravno na uskom ekranu i stoji uspravno na sirokom. Rotacija
 * ne bi radila — put ide po X osi, pa bi razvucen u usku i visoku kutiju ostao
 * kratka vodoravna crta.
 */
export default function InkRule({ className }: { className?: string }) {
  return (
    <span className={`ink-rule ${className ?? ''}`} aria-hidden="true">
      <svg className="ink-rule__h" viewBox="0 0 600 10" preserveAspectRatio="none" fill="none">
        <path
          d="M1 5.6C60 3.2 120 7.4 180 5.1s120-2.4 180 .8 120 1.8 180-1.4c20-1.1 40-.4 59 .8"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg className="ink-rule__v" viewBox="0 0 10 600" preserveAspectRatio="none" fill="none">
        <path
          d="M5.6 1C3.2 60 7.4 120 5.1 180s-2.4 120 .8 180 1.8 120-1.4 180c-1.1 20-.4 40 .8 59"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
