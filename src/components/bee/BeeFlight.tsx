'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

import BeeSvg from './BeeSvg';
import { buildPath, ROUTES, startPoint, type Leg, type RouteName } from './flightPath';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/** Koliko pcela sme da se nagne. Preko ovoga bi izgledala kao da pada. */
const MAX_TILT = 20;

/**
 * Pcela koja prati skrol kroz celu stranu.
 *
 * Sloj je portal u <body>, a ne dete <main>-a, iz dva razloga: putanja treba
 * da ide i preko podnozja (koje je van <main>-a), i ovako nijedan roditelj sa
 * svojim stacking kontekstom ne moze da je zakloni.
 *
 * z-index 40 je izmedju sadrzaja (1-3, i zrno papira na 20) i headera (60).
 */
export default function BeeFlight({ route = 'home' }: { route?: RouteName }) {
  const plan = ROUTES[route];
  const [mounted, setMounted] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const beeRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const layer = layerRef.current;
    const flight = flightRef.current;
    const trail = trailRef.current;
    const mask = maskRef.current;
    const bee = beeRef.current;
    if (!layer || !flight || !trail || !mask || !bee) return;

    /** Prepisuje putanju za trenutne mere strane. Vraca duzinu traga. */
    const draw = (legs: readonly Leg[], ref: { w: number; h: number }) => {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.scrollHeight;
      layer.style.width = `${w}px`;
      layer.style.height = `${h}px`;
      const d = buildPath(legs, ref, w, h);
      flight.setAttribute('d', d);
      trail.setAttribute('d', d);
      mask.setAttribute('d', d);
      return mask.getTotalLength();
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Smireno stanje: pcela stoji u heroju, bez putanje, bez leta, bez lepeta.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        layer.dataset.still = 'true';
        const w = document.documentElement.clientWidth;
        const h = document.documentElement.scrollHeight;
        layer.style.width = `${w}px`;
        layer.style.height = `${h}px`;
        const [sx, sy] = startPoint(plan.desktop.legs);
        gsap.set(bee, {
          x: (sx / plan.desktop.ref.w) * w,
          y: (sy / plan.desktop.ref.h) * h,
          xPercent: -50,
          yPercent: -50,
        });
        return () => {
          delete layer.dataset.still;
        };
      });

      const fly = (legs: readonly Leg[], ref: { w: number; h: number }) => () => {
        let len = draw(legs, ref);
        let raw = MotionPathPlugin.getRawPath(flight);
        MotionPathPlugin.cacheRawPathMeasurements(raw);

        gsap.set(mask, { strokeDasharray: len, strokeDashoffset: len });

        /** Nagib i okretanje za dati polozaj na putanji. */
        const pose = (p: number) => {
          const { angle } = MotionPathPlugin.getPositionOnPath(raw, p, true) as {
            angle: number;
          };

          // Ugao u -180..180, pa se odluci gleda li pcela ulevo.
          let a = ((((angle + 180) % 360) + 360) % 360) - 180;
          let flip = 1;
          if (a > 90 || a < -90) {
            flip = -1;
            a += a > 0 ? -180 : 180;
          }
          // rotacija i scaleX idu na isti cvor namerno: GSAP slaze
          // translate -> rotate -> scale, pa se crtez prvo ogleda a tek
          // onda nagne. Zato pcela nikad ne zavrsi naglavacke.
          gsap.set(bee, {
            rotation: gsap.utils.clamp(-MAX_TILT, MAX_TILT, a),
            scaleX: flip,
          });

          gsap.set(mask, { strokeDashoffset: len * (1 - p) });
        };

        // Deklarisano unapred i sa proverom u onUpdate: ako se strana ucita
        // vec skrolovana, ScrollTrigger prvi put pozove onUpdate jos unutar
        // gsap.to(), pre nego sto `tween` uopste dobije vrednost.
        let tween: gsap.core.Tween | null = null;

        tween = gsap.to(bee, {
          ease: 'none',
          motionPath: {
            path: flight,
            align: flight,
            alignOrigin: [0.5, 0.5],
            // autoRotate je namerno iskljucen: on upisuje pun ugao, a nama
            // treba nagib omedjen na +-20 stepeni i okretanje po x-u. Ugao se
            // racuna rucno, iz iste putanje, u onUpdate ispod.
            autoRotate: false,
          },
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
          },
          onUpdate: () => tween && pose(tween.progress()),
        });

        // Na vrhu strane scrub jos nije nista okrenuo, pa bi pcela stajala
        // ravno umesto da vec gleda niz putanju. Jednom rucno.
        pose(0);

        // Kad se strana produzi (slike, fontovi, otvoreno pitanje u FAQ-u),
        // ScrollTrigger meri iznova - putanja mora da se prepise pre toga.
        const remeasure = () => {
          len = draw(legs, ref);
          raw = MotionPathPlugin.getRawPath(flight);
          MotionPathPlugin.cacheRawPathMeasurements(raw);
          gsap.set(mask, { strokeDasharray: len });
          if (!tween) return;
          tween.invalidate();
          pose(tween.progress());
        };
        ScrollTrigger.addEventListener('refreshInit', remeasure);

        const ro = new ResizeObserver(() => ScrollTrigger.refresh());
        ro.observe(document.body);

        if (new URLSearchParams(window.location.search).has('editPath')) {
          void enableHelper(bee, flight, ref);
        }

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', remeasure);
          ro.disconnect();
        };
      };

      mm.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        fly(plan.desktop.legs, plan.desktop.ref),
      );
      mm.add(
        '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        fly(plan.mobile.legs, plan.mobile.ref),
      );
    }, layer);

    return () => ctx.revert();
  }, [mounted, plan]);

  if (!mounted) return null;

  return createPortal(
    <div className="bee-layer" ref={layerRef} aria-hidden="true">
      <svg className="bee-layer__canvas" width="100%" height="100%">
        <defs>
          {/*
           * Trag je isprekidan, pa mu pomeranje dashoffset-a ne bi "crtalo"
           * liniju nego teralo crtice u stranu. Zato se crta punom, debelom
           * maskom koja raste - a kroz nju se vidi isprekidana linija.
           */}
          <mask id="bee-trail-mask" maskUnits="userSpaceOnUse">
            <path ref={maskRef} fill="none" stroke="#fff" strokeWidth={28} strokeLinecap="round" />
          </mask>
        </defs>
        <path ref={flightRef} className="bee-layer__flight" fill="none" />
        <path ref={trailRef} className="bee-layer__trail" mask="url(#bee-trail-mask)" />
      </svg>

      {/* tri omotaca: putanja -> lebdenje -> crtez */}
      <div className="bee" ref={beeRef}>
        <div className="bee__hover">
          <BeeSvg className="bee__art" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * ?editPath - MotionPathHelper preko stvarnog rasporeda.
 *
 * Kad prevuces krivu kako treba, u konzoli otkucaj `beePath()`. Ispisuje
 * putanju nazad u referentnim pikselima, spremnu da se zalepi u flightPath.ts
 * - jer helper radi u pikselima ovog prozora, a fajl cuva razlomke.
 */
async function enableHelper(
  bee: HTMLElement,
  flight: SVGPathElement,
  ref: { w: number; h: number },
) {
  const { MotionPathHelper } = await import('gsap/MotionPathHelper');
  gsap.registerPlugin(MotionPathHelper);
  MotionPathHelper.create(bee);

  (window as unknown as { beePath: () => string }).beePath = () => {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.scrollHeight;
    const sx = ref.w / w;
    const sy = ref.h / h;
    let i = 0;
    const out = (flight.getAttribute('d') ?? '').replace(/-?\d+\.?\d*/g, (n) => {
      const v = parseFloat(n) * (i++ % 2 === 0 ? sx : sy);
      return String(Math.round(v * 10) / 10);
    });
    // eslint-disable-next-line no-console
    console.log(out);
    return out;
  };
  // eslint-disable-next-line no-console
  console.log('[bee] MotionPathHelper je aktivan. Kad zavrsis: beePath()');
}
