'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

import BeeSvg from './BeeSvg';

/**
 * Pcela koja stalno stoji u kadru.
 *
 * Ranije je letjela po putanji nacrtanoj preko cijele strane, a skrol ju je
 * vukao po njoj. To je zvucalo dobro i radilo lose: putanja je duga koliko i
 * dokument, pa se pcela cesto zatekne uz sam rub ekrana ili preko naslova, a
 * gdje ce se zateci zavisi od visine strane — koja se mijenja sa svakom
 * slikom koja se ucita.
 *
 * Sada ne postoji putanja. Pcela bira mjesto u kadru: najradije sredinu, a
 * ako je sredina zauzeta sadrzajem — naslovom, slikom, dugmetom — sklanja se
 * u prvi slobodan ugao. Uvijek je vidljiva i nikad ne stoji preko onoga sto
 * se cita.
 */

/**
 * Mjesta na koja pcela smije da sjedne, u dijelovima kadra. Redom kojim se
 * biraju: sredina prva, uglovi kad sredina nije slobodna.
 */
const PERCHES = [
  { x: 0.5, y: 0.46 },
  { x: 0.14, y: 0.26 },
  { x: 0.86, y: 0.26 },
  { x: 0.14, y: 0.76 },
  { x: 0.86, y: 0.76 },
] as const;

/**
 * Sve sto se cita ili dodiruje — preko toga pcela ne stoji.
 *
 * Ukrasi se ne broje. Sajt je pun crteza koji pokrivaju cijele pojaseve —
 * kapi meda, okviri, pecati — i da se i oni racunaju, sredina ekrana ne bi
 * bila slobodna nikad, pa bi pcela cijelu stranu provela u istom uglu.
 * Prepoznaju se po `aria-hidden`: ono sto citac ekrana preskace, preskace i
 * ona.
 */
const CONTENT =
  'h1, h2, h3, h4, p, li, a, button, input, textarea, select, img, video, figure, blockquote';

/** Koliko zraka oko pcele mora biti prazno da bi mjesto vazilo za slobodno. */
const CLEAR = 46;

/** Kako brzo se premjesta. Dovoljno sporo da se cita kao let, ne kao skok. */
const GLIDE = 1.15;

export default function BeeFlight() {
  const [mounted, setMounted] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  const beeRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const layer = layerRef.current;
    const bee = beeRef.current;
    const drift = driftRef.current;
    if (!layer || !bee || !drift) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const place = (x: number, y: number) => gsap.set(bee, { x, y, xPercent: -50, yPercent: -50 });

    if (still) {
      /* Bez pokreta: pcela stoji u gornjem lijevom uglu i tu ostaje. */
      layer.dataset.still = 'true';
      place(window.innerWidth * PERCHES[1].x, window.innerHeight * PERCHES[1].y);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(bee, { xPercent: -50, yPercent: -50 });

      /*
       * Kruzenje oko mjesta na kojem stoji.
       *
       * Bez ovoga pcela samo sjedi u uglu i s vremena na vrijeme preskoci na
       * drugi — a izmedju ta dva skoka izgleda kao naljepnica. Ovako je stalno
       * u letu, samo taj let nikud ne vodi.
       *
       * Ide na svoj sloj, ne na `.bee`: taj nosi izbor mjesta, i da se dvoje
       * pise u isti `transform`, jedno bi drugo brisalo. Brojevi su namjerno
       * neujednaceni — krug jednakih koraka se cita kao mehanizam.
       */
      const wander = gsap
        .timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
        .to(drift, { x: 26, y: -18, duration: 3.1 })
        .to(drift, { x: 38, y: 14, duration: 2.4 })
        .to(drift, { x: -14, y: 22, duration: 3.6 })
        .to(drift, { x: -30, y: -10, duration: 2.8 })
        .to(drift, { x: 0, y: 0, duration: 3.3 });
      const toX = gsap.quickTo(bee, 'x', { duration: GLIDE, ease: 'power3.out' });
      const toY = gsap.quickTo(bee, 'y', { duration: GLIDE, ease: 'power3.out' });

      let at = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.46 };
      place(at.x, at.y);

      /*
       * Je li tacka slobodna? Gleda se pravougaonik oko nje, ne sam piksel:
       * pcela ima svoju sirinu, pa joj ne pomaze da joj je slobodna tacno
       * sredina ako joj krilo lezi na naslovu.
       */
      const taken = (x: number, y: number, boxes: DOMRect[]) =>
        boxes.some(
          (b) =>
            b.left - CLEAR < x && b.right + CLEAR > x && b.top - CLEAR < y && b.bottom + CLEAR > y,
        );

      /* Sadrzaj koji je trenutno u kadru. Mjeri se rijetko, ne svaki kadar. */
      const inView = () => {
        const h = window.innerHeight;
        const w = window.innerWidth;
        const out: DOMRect[] = [];
        document.querySelectorAll<HTMLElement>(CONTENT).forEach((el) => {
          if (layer.contains(el)) return;
          if (el.closest('[aria-hidden="true"]')) return;
          const b = el.getBoundingClientRect();
          if (b.bottom < 0 || b.top > h || b.right < 0 || b.left > w) return;
          if (b.width < 8 || b.height < 8) return;
          out.push(b);
        });
        return out;
      };

      const settle = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const boxes = inView();

        const perch =
          PERCHES.find((p) => !taken(p.x * w, p.y * h, boxes)) ??
          /* Sve zauzeto — ide u ugao koji je najdalje od svega. */
          PERCHES.reduce((best, p) => {
            const d = (q: (typeof PERCHES)[number]) =>
              Math.min(
                ...boxes.map((b) =>
                  Math.hypot(
                    Math.max(b.left - q.x * w, 0, q.x * w - b.right),
                    Math.max(b.top - q.y * h, 0, q.y * h - b.bottom),
                  ),
                ),
                Infinity,
              );
            return d(p) > d(best) ? p : best;
          }, PERCHES[1]);

        const x = perch.x * w;
        const y = perch.y * h;
        if (Math.abs(x - at.x) < 2 && Math.abs(y - at.y) < 2) return;

        /* Gleda tamo gdje leti. Crtez gleda udesno, pa se za lijevo ogleda. */
        gsap.to(bee, { scaleX: x < at.x ? -1 : 1, duration: 0.3, overwrite: 'auto' });
        at = { x, y };
        toX(x);
        toY(y);
      };

      settle();

      /*
       * Mjerenje ide na kraju pomjeranja, ne u toku njega: sadrzaj se ionako
       * pomjera zajedno sa stranom, pa ga nema smisla mjeriti sto puta u
       * sekundi — a i skupo je.
       */
      let idle: number | undefined;
      const later = () => {
        window.clearTimeout(idle);
        idle = window.setTimeout(settle, 140);
      };

      window.addEventListener('scroll', later, { passive: true });
      window.addEventListener('resize', later);

      /* Strana se produzi kad stignu slike i fontovi — i tada se mjeri iznova. */
      const ro = new ResizeObserver(later);
      ro.observe(document.body);

      return () => {
        window.clearTimeout(idle);
        window.removeEventListener('scroll', later);
        window.removeEventListener('resize', later);
        ro.disconnect();
        wander.kill();
      };
    }, layer);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div className="bee-layer" ref={layerRef} aria-hidden="true">
      {/* tri omotaca: mjesto u kadru -> kruzenje oko njega -> lebdenje -> crtez */}
      <div className="bee" ref={beeRef}>
        <div className="bee__drift" ref={driftRef}>
          <div className="bee__hover">
            <BeeSvg className="bee__art" />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
