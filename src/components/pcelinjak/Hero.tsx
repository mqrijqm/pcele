"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ImagePlaceholder from "./ImagePlaceholder";

gsap.registerPlugin(ScrollTrigger);

/* Na serveru `useLayoutEffect` samo upozorava, pa se tamo koristi obican `useEffect`. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Heroj: naslov stoji, slika se skrolom razlije u traku preko cijele sirine.
 *
 * Na uzoru slika krece kao mala kutija u sredini (363x288 na 1440) i, dok
 * strana ide nadolje, raste dok ne popuni kadar ispod naslova. Naslov ostaje
 * gdje jeste; slika mu nikad ne prelazi preko slova, pa mastilo ne mora da se
 * mijenja, a potpis uz malu sliku blijedi cim ona krene da raste.
 *
 * Rast je vezan za skrol, ne za vrijeme: koliko se prstom pomjeri, toliko
 * slika naraste. Zato ne treba ni trajanje ni krivulja.
 *
 * KAKO SE RASTE. Ranije je tween mijenjao `width`, `height` i `top` kutije, a
 * strana se pinovala GSAP-om: to je layout na svakom kadru skrola, pa se heroj
 * vidljivo "trzao" i na kraju skakao. Sada je kutija od pocetka velika koliko
 * ce biti na kraju, a mala se samo _cini_ — `transform` (pomak + razmjera) i
 * druga razmjera na slici unutra, tako da slika u svakom trenutku ima tacno
 * onaj isjecak koji bi imala kao `object-fit: cover` u kutiji te velicine.
 * Nista se ne preracunava u layoutu; radi samo kompozitor. A umjesto pina, sam
 * heroj je visok (kadar + put skrola) i unutra stoji `position: sticky` scena,
 * isto kao `.geslo` — bez pin-spacera, bez preskoka pri otpustanju.
 *
 * Do prvog mjerenja kutija stoji na svom mjestu iz CSS-a (mala, kao i ranije),
 * a `is-live` je tek prebacuje u velicinu za rast, uz isti izgled — pa se ne
 * vidi nikakav preskok ni kad JavaScript stigne kasnije od prvog crteza.
 *
 * Na telefonu ovoga nema. Uzor tamo daje uspravnu sliku u toku strane, jer
 * kadar nema sirine da se sirenje uopste vidi.
 */
export default function Hero({
  rijeci,
  caption,
  slikaAlt,
  slika,
  svijetla = false,
}: {
  rijeci: string[];
  caption?: string;
  slikaAlt: string;
  slika?: string;
  /** Svijetla slika: ostaje kao oznaka na omotacu, ako zatreba drugaciji slog. */
  svijetla?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    const st = stage.current;
    const sl = slot.current;
    const m = media.current;
    const im = inner.current;
    if (!el || !st || !sl || !m || !im) return;

    /*
     * `gsap.matchMedia`, ne `ScrollTrigger.matchMedia`: kad se kadar suzi ispod
     * 768 i pravilo prestane da vazi, ovaj sam vraca sve sto je ostalo.
     */
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const foto = m.querySelector("img");
        let p = 0;

        // Mjere, u pikselima scene: mala kutija (odakle se kreće) i velika (kamo se stize).
        let x0 = 0, y0 = 0, w0 = 1, h0 = 1; // sredina i velicina male
        let fx = 0, fy = 0, fw = 1, fh = 1; // sredina i velicina velike
        let iw = 1, ih = 1; // velicina slike kad prekriva veliku kutiju

        const measure = () => {
          // Mali okvir se mjeri prije nego se kutija prebaci na veliku mjeru.
          const sr = st.getBoundingClientRect();
          const or = sl.getBoundingClientRect();
          w0 = or.width;
          h0 = or.height;
          x0 = or.left - sr.left + w0 / 2;
          y0 = or.top - sr.top + h0 / 2;

          el.classList.add("is-live");
          m.style.transform = "";
          im.style.transform = "";
          // Kutija ide od dna naslova do dna scene, preko cijele sirine.
          m.style.width = `${st.clientWidth}px`;
          m.style.height = "0px";
          const strip = m.offsetParent as HTMLElement | null;
          const tf = strip ? strip.getBoundingClientRect().top - sr.top : 0;
          fw = st.clientWidth;
          fh = Math.max(1, st.clientHeight - tf);
          m.style.height = `${fh}px`;

          const mr = m.getBoundingClientRect();
          fx = mr.left - sr.left + mr.width / 2;
          fy = mr.top - sr.top + mr.height / 2;

          // Slika unutra je vec `cover` u velikoj kutiji; treba joj omjer da bi se
          // znalo koliko da se smanji u maloj.
          const nw = foto?.naturalWidth || 0;
          const nh = foto?.naturalHeight || 0;
          const omjer = nw && nh ? nw / nh : fw / fh;
          if (omjer >= fw / fh) {
            ih = fh;
            iw = fh * omjer;
          } else {
            iw = fw;
            ih = fw / omjer;
          }
        };

        let prekriveno = false;
        const update = () => {
          const w = w0 + (fw - w0) * p;
          const h = h0 + (fh - h0) * p;
          const cx = x0 + (fx - x0) * p;
          const cy = y0 + (fy - y0) * p;
          const sx = w / fw;
          const sy = h / fh;
          // Isto sto radi `object-fit: cover`: slika je uvijek tacno onoliko velika koliko treba da prekrije kutiju.
          const u = Math.max(w / iw, h / ih);
          m.style.transform = `translate3d(${(cx - fx).toFixed(2)}px, ${(cy - fy).toFixed(2)}px, 0) scale(${sx.toFixed(5)}, ${sy.toFixed(5)})`;
          im.style.transform = `scale(${(u / sx).toFixed(5)}, ${(u / sy).toFixed(5)})`;

          // Potpis uz malu sliku nema sta da radi kad slika naraste preko njegovog mjesta.
          const sada = p > 0.06;
          if (sada !== prekriveno) {
            prekriveno = sada;
            el.classList.toggle("is-covered", sada);
          }
        };

        const remeasure = () => {
          measure();
          update();
        };
        remeasure();

        // Slika se moze ucitati poslije prvog mjerenja; tek tada je poznat njen omjer.
        if (foto && !foto.complete) foto.addEventListener("load", remeasure);
        ScrollTrigger.addEventListener("refreshInit", measure);

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            p = self.progress;
            update();
          },
          onUpdate: (self) => {
            p = self.progress;
            update();
          },
        });

        return () => {
          trigger.kill();
          ScrollTrigger.removeEventListener("refreshInit", measure);
          foto?.removeEventListener("load", remeasure);
          el.classList.remove("is-live", "is-covered");
          m.style.transform = "";
          m.style.width = "";
          m.style.height = "";
          im.style.transform = "";
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div className={`pcl-hero pcl-mb-lg${svijetla ? " pcl-hero--light" : ""}`} ref={root}>
      <div className="pcl-hero__stage" ref={stage}>
        {/* naslov: dvanaest i dvanaest kolona, rijec po rijec u svom redu */}
        <div className="pcl-strip pcl-mb-sm pcl-hero__title">
          <div className="pcl-cols pcl-cols--12-12">
            <h1 className="pcl-display pcl-display--1 pcl-in">
              {rijeci.map((r) => (
                <span className="pcl-display__word" key={r}>
                  <span>{r}</span>
                </span>
              ))}
            </h1>
            <div aria-hidden="true" />
          </div>
        </div>

        {/* slika u sredini, potpis desno — tri jednaka stupca */}
        <div className="pcl-strip">
          <div className="pcl-cols pcl-cols--8-8-8">
            <div aria-hidden="true" />
            {/* Prazno mjesto male kutije u srednjem stupcu; od njega se mjeri odakle slika krece. */}
            <div className="pcl-hero__slot" ref={slot} aria-hidden="true" />
            <div className="pcl-hero__media" ref={media}>
              <div className="pcl-hero__inner" ref={inner}>
                {/* Kutija na uzoru: 363.2x288, dakle 1.26:1. */}
                <ImagePlaceholder
                  ratio={1.261}
                  label="1.26:1"
                  alt={slikaAlt}
                  src={slika}
                  sizes="100vw"
                  priority
                  zoom
                />
              </div>
            </div>
            {caption && <p className="pcl-body pcl-hero__caption pcl-in">{caption}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
