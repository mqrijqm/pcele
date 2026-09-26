import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Kad se ovi stilovi i skrol-logika ukljucuju: od 768 navise, uz kretanje.
 * Isti uslov je u `pcelinjak.css` (`.pcl-lijep`), pa moraju ici zajedno.
 */
export const SKROL_MQ = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/**
 * Sekcija koja stoji dok se nesto skrolom pomjera — bez GSAP pina.
 *
 * ZASTO NE PIN. `pin: true` kaci sekciju `position: fixed`, ubacuje
 * pin-spacer i pri otpustanju je vraca nazad. Uz Lenis (skrol koji vodi
 * JavaScript) je to trzalo: sekcija bi zaostala za skrolom za kadar-dva, a pri
 * ulasku i izlasku preskocila (u mjerenju je pomjeranje layouta iz toga bilo
 * ~0.8). Ovdje je isto sto radi `.geslo`: sekcija (`outer`) je visoka koliko
 * scena plus put skrola, a scena (`stage`) u njoj je `position: sticky` — to
 * radi sam preglednik, bez ijedne linije JavaScripta po kadru. JavaScript samo
 * cita skrol i kaze sadrzaju koliko je odmakao.
 *
 * Visinu sekcije zadaje `--put` (koliko skrola traje kretanje) i `--scena`
 * (koliko je visoka scena); oba se upisuju samo pri mjerenju strane, nikad pri
 * skrolu. Scena se lijepi na sredinu kadra (vidi `.pcl-lijep__scena`), pa
 * skrol pocinje tacno kad se zalijepi: `start` je vrh scene u trenutku kad
 * dotakne svoj `top`.
 *
 * `napredak` dobija broj od 0 do 1 i put u pikselima; vraca se funkcija za
 * cisecenje.
 */
export function lijepi({
  outer,
  stage,
  put,
  napredak,
}: {
  outer: HTMLElement;
  stage: HTMLElement;
  /** Koliko piksela skrola traje kretanje (bez same scene). */
  put: () => number;
  napredak: (p: number, put: number) => void;
}): () => void {
  let d = 0;

  const izmjeri = () => {
    d = Math.max(0, Math.round(put()));
    outer.style.setProperty("--put", `${d}px`);
    outer.style.setProperty("--scena", `${stage.offsetHeight}px`);
  };

  izmjeri();
  ScrollTrigger.addEventListener("refreshInit", izmjeri);

  const trigger = ScrollTrigger.create({
    trigger: outer,
    // Zalijepljena scena ima svoj `top`; skrol krece kad ga dotakne.
    start: () => `top ${parseFloat(getComputedStyle(stage).top) || 0}px`,
    end: () => `+=${Math.max(1, d)}`,
    scrub: true,
    invalidateOnRefresh: true,
    onRefresh: (self) => napredak(self.progress, d),
    onUpdate: (self) => napredak(self.progress, d),
  });

  return () => {
    trigger.kill();
    ScrollTrigger.removeEventListener("refreshInit", izmjeri);
    outer.style.removeProperty("--put");
    outer.style.removeProperty("--scena");
  };
}
