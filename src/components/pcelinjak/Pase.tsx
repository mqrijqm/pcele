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
 * **Izbornik.** Fotografija izabrane pase stoji po sredini, a tri crteza
 * (natpisi sorta su u samom crtezu) stoje u vertikalnom nizu tik uz nju, na
 * desnoj strani. Klik na crtez mijenja fotografiju — slajdovi se pretope,
 * bez biblioteke.
 *
 * **Vodoravna ploca.** Dok je blok zakacen na sredini kadra, tekst i tabela
 * ostaju na svom mjestu slijeva, a galerija (kvadratna slika i tri stupca)
 * klizi u SVOM prozoru desno od teksta — prozor je isijeca uz tekst, pa slike
 * nikad ne prelaze preko njega. Prije je galerija klizila preko teksta i
 * prekrivala tabelu. Duzina skrola je jednaka duzini puta galerije, pa je
 * kretanje po prstu.
 *
 * Na telefonu se pinovanje ne pali: ploce idu jedna pod drugu.
 */
export default function Pase({
  lista,
  tabelaAria,
  kvadratAlt,
  kvadrat,
  kolone,
}: {
  lista: PcelinjakPasa[];
  tabelaAria: string;
  kvadratAlt: string;
  kvadrat?: string;
  kolone: { heading: string; alt: string; body: string; src?: string }[];
}) {
  const [aktivna, setAktivna] = useState(0);
  const hscroll = useRef<HTMLDivElement>(null);
  const panelTekst = useRef<HTMLDivElement>(null);
  const panelGalerija = useRef<HTMLDivElement>(null);
  const okno = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = hscroll.current;
    const tekst = panelTekst.current;
    const galerija = panelGalerija.current;
    const prozor = okno.current;
    if (!wrap || !tekst || !galerija || !prozor) return;

    /* Vidi napomenu u `Hero.tsx` — `gsap.matchMedia` sam ciscen na uzem kadru. */
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        /*
         * Tekst stoji na mjestu; klizi samo galerija, unutar svog prozora. Put
         * je koliko joj treba da njena zadnja slika stane uz desnu ivicu
         * prozora — i nista vise, pa se skrol ne gubi na praznoj voznji.
         */
        const put = () => Math.max(0, galerija.scrollWidth - prozor.clientWidth);

        gsap.to(galerija, {
          x: () => -put(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            // Blok se zakaci na sredini kadra, ne uz vrh: inace je pola ekrana
            // ispod njega prazno dok galerija klizi.
            start: "center center",
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

  /*
   * Uvod i tabela su razlicite duzine po sorti, pa se visina bloka mijenja kad
   * se klikne na drugi crtez. Pin je izmjeren na staroj visini; ponovo se mjeri
   * odmah po promjeni (klik je uvijek iznad bloka, pa se skrol ne pomjera).
   */
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [aktivna]);

  const p = lista[aktivna];

  return (
    <>
      {/* --- fotografija pase i crtezi sorti uz nju --------------------- */}
      <div className="pcl-strip pcl-mb-lg">
        <div className="pcl-pase">
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
                  {/* Fotografija sorte, uspravna — cijela tegla mora da se vidi. */}
                  <ImagePlaceholder
                    ratio={0.8}
                    label="4:5"
                    alt={pasa.mapaAlt}
                    src={pasa.slika}
                    sizes="(max-width: 767px) 90vw, 28rem"
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>

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
                  aria-label={pasa.tab}
                >
                  {/*
                    Natpis je u samom crtezu, pa dugme nema svoj slog — ime sorte
                    stoji u `aria-label`, da ga citac ekrana ipak procita.
                  */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="pcl-tab__znak" src={pasa.znak} alt="" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- ploca koja prolazi u stranu -------------------------------- */}
      <div className="pcl-hscroll pcl-mb-lg" ref={hscroll}>
        <div className="pcl-hscroll__viewport">
          <div className="pcl-hscroll__track">
            {/* tekst i tabela — ostaju na mjestu dok galerija prolazi */}
            <div className="pcl-hscroll__panel pcl-hscroll__panel--text" ref={panelTekst}>
              {/* Ime sorte: crtezi su iznad, pa bez ovoga tekst ne kaze o cemu govori. */}
              <p className="pcl-pretitle pcl-hscroll__sorta">{p.tab}</p>
              <p className="pcl-body pcl-hscroll__uvod">{p.uvod}</p>
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

            {/* prozor: isijeca galeriju uz tekst, da slike ne prelaze preko njega */}
            <div className="pcl-hscroll__window" ref={okno}>
            {/* kvadratna slika i tri stupca — jedina ploca koja se pomjera */}
            <div className="pcl-hscroll__panel pcl-hscroll__panel--galerija" ref={panelGalerija}>
              <div className="pcl-hscroll__kvadrat">
                <ImagePlaceholder
                  ratio={1}
                  label="1:1"
                  alt={kvadratAlt}
                  src={kvadrat}
                  sizes="(max-width: 767px) 90vw, 24vw"
                />
              </div>
              <div className="pcl-triptych">
                {kolone.map((k) => (
                  <div key={k.alt}>
                    <ImagePlaceholder ratio={1.501} label="3:2" alt={k.alt} src={k.src} />
                    <p className="pcl-triptych__heading">{k.heading}</p>
                    <p className="pcl-body pcl-triptych__text">{k.body}</p>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
