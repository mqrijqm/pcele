"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ImagePlaceholder from "./ImagePlaceholder";

gsap.registerPlugin(ScrollTrigger);

/**
 * Heroj: naslov stoji, slika se skrolom razlije preko cijelog kadra.
 *
 * Na uzoru slika krece kao mala kutija u sredini (363x288 na 1440) i, dok
 * strana ide nadolje, raste dok ne prekrije cio kadar — naslov i potpis
 * ostaju gdje jesu, samo im slika prijedje ispod pa preko, pa mastilo mijenja
 * boju u papir da bi se i dalje citalo.
 *
 * Rast je vezan za skrol (`scrub`), ne za vrijeme: koliko se prstom pomjeri,
 * toliko slika naraste. Zato i ne treba trajanje ni krivulja — kretanje je
 * pravo, a osjecaj daje sam skrol.
 *
 * Na telefonu ovoga nema. Uzor tamo daje uspravnu sliku u toku strane, jer
 * kadar nema sirine da se sirenje uopste vidi.
 */
export default function Hero({
  rijeci,
  caption,
  slikaAlt,
}: {
  rijeci: string[];
  caption: string;
  slikaAlt: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const m = media.current;
    if (!el || !m) return;

    /*
     * `gsap.matchMedia`, ne `ScrollTrigger.matchMedia`: kad se kadar suzi ispod
     * 768 i pravilo prestane da vazi, ovaj sam skine inline mjere koje je tween
     * ostavio. Sa starim pozivom su ostajale, pa je na telefonu slika drzala
     * sirinu izracunatu za siroki kadar.
     */
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.to(m, {
          width: () => el.clientWidth,
          height: () => el.clientHeight,
          top: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=" + Math.round(window.innerHeight * 1.1),
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            // Natpisi prelaze u papir tek kad slika stvarno pokrije kadar.
            onUpdate: (self) =>
              el.classList.toggle("is-covered", self.progress > 0.55),
          },
        });
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div className="pcl-hero pcl-mb-lg" ref={root}>
      <div className="pcl-hero__stage">
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
            <div className="pcl-hero__media" ref={media}>
              {/* Kutija na uzoru: 363.2x288, dakle 1.26:1. */}
              <ImagePlaceholder
                ratio={1.261}
                label="1.26:1"
                alt={slikaAlt}
                zoom
              />
            </div>
            <p className="pcl-body pcl-hero__caption pcl-in">{caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
