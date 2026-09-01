"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ImagePlaceholder from "./ImagePlaceholder";
import type { PcelinjakPasa } from "@/content/pcelinjak";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sorte meda i ploca koja prolazi vodoravno.
 *
 * Na uzoru su ovo dvije trake koje idu jedna za drugom: gore izbornik sa
 * crtezom pase, dolje blok koji se pinuje i prolazi u stranu. Drzim ih u
 * jednoj komponenti jer dijele izabranu pasu — kad se promijeni dugme, mijenja
 * se i crtez i tabela ispod njega.
 *
 * **Izbornik.** Tri jednaka polja, aktivno podvuceno. Slajdovi se ne pomjeraju
 * nego pretope — uzor koristi splide u `fade` nacinu, ovdje je to prozirnost
 * na slojevima naslaganim jedan preko drugog, bez biblioteke.
 *
 * **Vodoravna ploca.** Dok blok stoji zakacen za vrh kadra, dvije ploce
 * prolaze u stranu: prva sa tekstom i tabelom, druga sa kvadratnom slikom i
 * tri stupca. Duzina skrola je jednaka sirini koju treba prijeci, pa je
 * kretanje po prstu — nema ubrzanja ni zaostajanja.
 *
 * Na telefonu se pinovanje ne pali: ploce idu jedna pod drugu, kao i na uzoru.
 */
export default function Pase({
  lista,
  tabelaAria,
  kvadratAlt,
  kolone,
}: {
  lista: PcelinjakPasa[];
  tabelaAria: string;
  kvadratAlt: string;
  kolone: { alt: string; body: string }[];
}) {
  const [aktivna, setAktivna] = useState(0);
  const hscroll = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = hscroll.current;
    const t = track.current;
    if (!wrap || !t) return;

    /* Vidi napomenu u `Hero.tsx` — `gsap.matchMedia` sam ciscen na uzem kadru. */
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        // Preci treba sve osim jednog kadra — otud `scrollWidth - clientWidth`.
        const put = () => t.scrollWidth - t.clientWidth;
        gsap.to(t, {
          x: () => -put(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${put()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      },
    );

    return () => mm.revert();
  }, []);

  const p = lista[aktivna];

  return (
    <>
      {/* --- izbornik pasa i crtez ------------------------------------- */}
      <div className="pcl-strip pcl-mb-lg">
        <ul className="pcl-tabs" role="tablist">
          {lista.map((pasa, i) => (
            <li key={pasa.key} role="presentation">
              <button
                type="button"
                role="tab"
                id={`pasa-tab-${pasa.key}`}
                aria-selected={i === aktivna}
                aria-controls={`pasa-panel-${pasa.key}`}
                className="pcl-tab"
                onClick={() => setAktivna(i)}
              >
                <span className="pcl-tab__mark" aria-hidden="true" />
                <span className="pcl-tab__label">{pasa.tab}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="pcl-slides">
          {lista.map((pasa, i) => (
            <div
              key={pasa.key}
              id={`pasa-panel-${pasa.key}`}
              role="tabpanel"
              aria-labelledby={`pasa-tab-${pasa.key}`}
              aria-hidden={i !== aktivna}
              className={`pcl-slide${i === aktivna ? " is-active" : ""}`}
            >
              <div className="pcl-slide__map">
                {/* Crtez pase — omjer 1.64:1, kao karta imanja na uzoru. */}
                <ImagePlaceholder
                  ratio={1.639}
                  label="1.64:1"
                  alt={pasa.mapaAlt}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- ploca koja prolazi u stranu -------------------------------- */}
      <div className="pcl-hscroll pcl-mb-lg" ref={hscroll}>
        <div className="pcl-hscroll__viewport">
          <div className="pcl-hscroll__track" ref={track}>
            {/* prva ploca: tekst i tabela, u sirini sadrzaja */}
            <div className="pcl-hscroll__panel">
              <div className="pcl-strip">
                <div className="pcl-cols pcl-cols--6-18">
                  <div aria-hidden="true" />
                  <div>
                    <p className="pcl-body">{p.uvod}</p>
                    <table className="pcl-table" aria-label={tabelaAria}>
                      <tbody>
                        {p.redovi.map((red) => (
                          <tr key={red.label}>
                            <th scope="row">{red.label}</th>
                            <td>{red.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* druga ploca: kvadratna slika i tri stupca, preko cijele mjere */}
            <div className="pcl-hscroll__panel">
              <div className="pcl-strip pcl-strip--wide">
                <div className="pcl-cols pcl-cols--9h-14h">
                  <div>
                    <ImagePlaceholder ratio={1} label="1:1" alt={kvadratAlt} />
                  </div>
                  <div className="pcl-triptych">
                    {kolone.map((k) => (
                      <div key={k.alt}>
                        <ImagePlaceholder
                          ratio={1.501}
                          label="3:2"
                          alt={k.alt}
                        />
                        <p className="pcl-body pcl-triptych__text">{k.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
