'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * Karta koja se sklapa iz tri komada, pa blago prati mis.
 *
 * Karta je jedna rasterska slika. Komadi nisu tri fajla nego tri kopije te
 * iste slike, svaka odsjecena svojim `clip-path`-om po unutrasnjim medjama
 * opstine. Zbog toga sto stoje na istom mjestu i nose isti piksel, kad se
 * transformi ponistite one se opet citaju kao jedna karta — bez sava i bez
 * pomjeranja za pola piksela.
 *
 * Rezovi se namjerno preklapaju za oko 1.5% sa svake strane. Dvije susjedne
 * maske koje dijele istu ivicu ostavljaju vlas papira izmedju sebe: rub im je
 * omeksan, pa se dvije poluprozirne ivice ne saberu u punu boju. Preklop tu
 * vlas pokriva, a kako je ispod isti piksel, preklop se ne vidi.
 *
 * Ulazak vodi `.in-view`, ali ga ovdje stavlja svoj posmatrac a ne opsti
 * RevealObserver — karta ceka da se vidi cijela, ne tek da zaviri.
 *
 * Pomak za misem je mali i namjerno spor: karta ne "juri" kursor nego se za
 * njim vuce, pa se pokret osjeti kao tezina, a ne kao efekat. Tacka koja se
 * prati je cijela sekcija, ne sama slika — inace bi karta reagovala tek kad
 * predjes preko nje.
 *
 * Sve je transform, i sve staje na `prefers-reduced-motion`. Na dodir se ne
 * vezuje nista: tamo mis ne postoji, a `pointer: fine` to pouzdano razdvaja.
 */
export default function OriginMap({ alt }: { alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);

  /*
   * Sklapanje ne pocinje cim karta zaviri odozdo, nego kad cijela stoji u
   * kadru i ispod nje ima jos malo vazduha. Zato ovdje stoji svoj posmatrac, a
   * ne opsti `reveal`: onaj pali na 5% vidljivosti, pa bi se karta sklopila
   * dok joj se vidi samo gornja ivica — i najbolji dio pokreta bi prosao
   * ispod ruba ekrana.
   *
   * Cijela sekcija bi bila prirodnija mjera, ali je visa od ekrana (oko 1200
   * naspram 765 piksela na obicnom laptopu), pa se nikad ne bi vidjela cijela.
   * Karta je ono sto se zapravo gleda.
   *
   * `rootMargin` odsijeca 6% dna, pa se puna vidljivost postize tek kad karta
   * predje i taj visak. Drugi uslov je za uzak i nizak ekran, gdje je karta
   * visa od kadra: tamo je "cijela vidljiva" nemoguce, pa je dovoljno da
   * ispuni ekran.
   */
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const r = entry.boundingClientRect;
          const vh = window.innerHeight;
          const room = vh * 0.06;
          const whole = r.top >= 0 && r.bottom <= vh - room;
          const fills = r.height > vh - room && r.top <= 0 && r.bottom >= vh;
          if (!whole && !fills) continue;
          el.classList.add('in-view');
          io.disconnect();
          return;
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 0.9, 0.99, 1], rootMargin: '0px 0px -6% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /*
   * Kad zadnji komad stane na svoje mjesto, rezovi se sklanjaju i ostaje jedna
   * neisjecena slika. Ne zbog uredjivanja koda: tamo gdje rez presijeca samu
   * konturu karte preklop ostavlja tamniju vlas od dva-tri piksela — dva
   * omeksana ruba jedan preko drugog — i ta vlas bi ostala zauvijek na
   * mirnoj karti. Uz to nestanu i dva sloja koja bi inace do kraja strane
   * stajala na GPU-u.
   *
   * `transitionend` isplivava do omotaca, pa se slusa na jednom mjestu.
   */
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    const onEnd = (e: TransitionEvent) => {
      const t = e.target as HTMLElement;
      if (e.propertyName !== 'transform' || !t.classList?.contains('origin__piece--c')) return;
      el.classList.add('origin__map--whole');
      el.removeEventListener('transitionend', onEnd);
    };

    el.addEventListener('transitionend', onEnd);
    return () => el.removeEventListener('transitionend', onEnd);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    const section = el?.closest('.origin') as HTMLElement | null;
    if (!el || !section) return;

    const fine = window.matchMedia('(pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || still.matches) return;

    // Koliko karta smije da odluta od svog mjesta.
    const RANGE = 14;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      // -1..1 od sredine sekcije
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2 * RANGE;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2 * RANGE;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      // Prosto priblizavanje cilju: sto je dalje, to brze ide.
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      const settled = Math.abs(targetX - x) < 0.05 && Math.abs(targetY - y) < 0.05;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = '';
    };
  }, []);

  return (
    <div className="origin__map" ref={wrap}>
      <div className="origin__map-inner">
        {/*
          * Prvi komad stoji u toku i on daje visinu okvira; druga dva lebde
          * preko njega. Alt nosi samo prvi — druga dva su ista slika, i za
          * citac ekrana ne postoje.
          */}
        <Image
          className="origin__piece origin__piece--a"
          src="/images/brand/mapa-prnjavor.webp"
          alt={alt}
          width={1058}
          height={706}
          sizes="(max-width: 768px) 88vw, 62vw"
        />
        <Image
          className="origin__piece origin__piece--b"
          src="/images/brand/mapa-prnjavor.webp"
          alt=""
          aria-hidden
          width={1058}
          height={706}
          sizes="(max-width: 768px) 88vw, 62vw"
        />
        <Image
          className="origin__piece origin__piece--c"
          src="/images/brand/mapa-prnjavor.webp"
          alt=""
          aria-hidden
          width={1058}
          height={706}
          sizes="(max-width: 768px) 88vw, 62vw"
        />
      </div>
    </div>
  );
}
