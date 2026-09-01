'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

import { POUR_DRIP, POUR_VIEWBOX } from '@/components/home/dripPaths';

gsap.registerPlugin(CustomEase);

/*
 * Med se ne krece kao zavjesa od platna. Krene tromo, pusti se niz sredinu i
 * na kraju se opet uspori — otud kriva sa oba kraja stisnuta. Ista kriva nosi
 * i pokrivanje i otkrivanje, pa se cita kao jedan potez a ne kao dva.
 */
const POUR_EASE = CustomEase.create('honeyPour', 'M0,0 C0.7,0 0.3,1 1,1');

const COVER_MS = 650;
const REVEAL_MS = 700;

/*
 * Najkrace zadrzavanje pod punom zavjesom. Kesirana ruta sjedne za desetak
 * milisekundi, pa bi bez ovoga med pao i odmah se digao — trzaj, ne prelaz.
 */
const HOLD_MS = 200;

/*
 * Mrtvackova sklopka. Ako ruta ne sjedne — pao server, pukla mreza — zavjesa
 * ipak odlazi. Bolje strana koja se nije promijenila nego korisnik zarobljen
 * iza medene plohe.
 */
const SAFETY_MS = 4000;

/* Na serveru nema rasporeda da se mjeri, pa tamo obican `useEffect`. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type Phase = 'idle' | 'covering' | 'waiting' | 'revealing';

/*
 * Stanje prelaza zivi izvan Reacta, u modulu.
 *
 * Prebacivac jezika ne mijenja samo stranu nego i `[locale]` — a to je segment
 * korenskog rasporeda, pa React na njemu razmontira cijelo stablo i sagradi ga
 * iznova. Dokument je isti (nista se ne ucitava ponovo), ali provider dobije
 * novi element, praznu memoriju i zavjesu parkiranu iznad kadra — usred
 * prelaza koji je stara instanca vec pustila.
 *
 * Zato ono sto mora prezivjeti stoji ovdje: modul se ne gradi iznova. Nova
 * instanca zatekne `waiting`, postavi svoju zavjesu tacno tamo gdje je stara
 * stala, i nastavi. Za oko je to jedan potez — a prelomljen je na dva stabla.
 */
const flight = {
  phase: 'idle' as Phase,
  coveredAt: 0,
  /* `null` dok se ne izmjeri; poslije toga preziv remontiranje kao i ostalo. */
  motionOk: null as boolean | null,
};

type HoneyTransition = {
  /** Odvede na `href` kroz zavjesu. Van zavjese (smireno kretanje) — odmah. */
  navigate: (href: string) => void;
  /** Dok traje, svaki novi zahtjev za navigacijom se preskace. */
  isBusy: boolean;
  /** Da li zavjesa uopste postoji na ovoj masini. */
  isEnabled: boolean;
};

const Ctx = createContext<HoneyTransition>({
  navigate: () => undefined,
  isBusy: false,
  isEnabled: false,
});

/**
 * Za sve sto nije `TransitionLink` — dugme u korpi, stavka u meniju, bilo sta
 * sto vodi na drugu stranu a nije `<a>`.
 */
export function useHoneyTransition(): HoneyTransition {
  return useContext(Ctx);
}

/**
 * Med se prelije preko strane, strana se ispod njega zamijeni, med otece dolje.
 *
 * Isti crtez kojim se sekcija preliva u sekciju (`dripPaths`), samo uspravljen
 * u zavjesu: kapi vode nadolje na donjoj ivici, a na gornjoj je isti crtez
 * okrenut naglavce — kad zavjesa ode, niti se rastegnu i puste.
 *
 * **Jedan potez, ne dva.** Stubac krece iznad kadra i zavrsi ispod njega, a
 * izmedju se samo zaustavi dok se strana mijenja. Nigdje se ne vraca odakle je
 * dosao: med koji bi se povukao navise ne bi bio med.
 *
 * **Sta se mice.** Samo `transform: translateY` na jednom sancu. Nista se ne
 * mjeri dok animacija traje — sve tri tacke se izracunaju prije poletanja, iz
 * visine stupca i dubine kapi.
 *
 * **Zasto `usePathname` a ne dogadjaj rutera.** App Router nema dogadjaje
 * navigacije; jedini pouzdan znak da je nova strana sjela jeste da se putanja
 * promijenila. Zato provider gleda putanju, i tek kad se ona pomjeri pusta
 * zavjesu dalje.
 *
 * **Ko je iskljucio kretanje** ne dobija zavjesu uopste — ni u DOM-u je nema,
 * a `navigate` je obican `router.push`.
 */
export default function HoneyTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const column = useRef<HTMLDivElement>(null);
  const lead = useRef<HTMLDivElement>(null);
  const drops = useRef<HTMLDivElement>(null);

  const tween = useRef<gsap.core.Tween | null>(null);
  const dropTween = useRef<gsap.core.Tween | null>(null);
  const safety = useRef(0);
  const hold = useRef(0);

  /*
   * Zavjesa se dodaje tek na klijentu. Server je ne ispisuje, pa nema sta da
   * se razidje pri hidraciji — a kod onih koji su kretanje iskljucili ostaje
   * neispisana zauvijek.
   */
  const [enabled, setEnabled] = useState(() => flight.motionOk ?? false);
  const [busy, setBusy] = useState(() => flight.phase !== 'idle');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      flight.motionOk = !mq.matches;
      setEnabled(flight.motionOk);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /*
   * Tri polozaja stupca, sva tri u pikselima i sva tri izracunata odjednom.
   *
   * `idle`  — cio stubac tacno iznad kadra, donji rub mu lezi na vrhu ekrana.
   * `cover` — tijelo pokriva kadar do dna, a kapi vise ispod donje ivice.
   * `exit`  — cio stubac ispod kadra.
   *
   * Racun za `cover`: vrh stupca + dubina kapi + tijelo mora pasti tacno na
   * dno kadra, a to je `visina kadra + dubina kapi - visina stupca`.
   */
  const points = useCallback(() => {
    const el = column.current;
    const edge = lead.current;
    if (!el || !edge) return null;
    const height = el.offsetHeight;
    const depth = edge.offsetHeight;
    return {
      idle: -height,
      cover: window.innerHeight + depth - height,
      exit: window.innerHeight,
    };
  }, []);

  const park = useCallback(() => {
    const el = column.current;
    const at = points();
    if (!el || !at) return;
    gsap.set(el, { y: at.idle, willChange: 'auto' });
    if (drops.current) gsap.set(drops.current.children, { y: 0, opacity: 0 });
  }, [points]);

  useEffect(() => {
    if (!enabled) return;
    const onResize = () => {
      if (flight.phase === 'idle') park();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [enabled, park]);

  /*
   * Nova strana pocinje od vrha, uvijek.
   *
   * Skrol drzi Lenis, a on ne cita `window.scrollTo` — zato dogadjaj, isto
   * kako `SmoothScroll` vec prima `scroll:lock`. Poziv ostaje uz njega, za
   * slucaj da Lenisa nema (smireno kretanje ga ne pravi).
   */
  const jumpToTop = useCallback(() => {
    window.dispatchEvent(new Event('scroll:top'));
    window.scrollTo(0, 0);
  }, []);

  const finish = useCallback(() => {
    flight.phase = 'idle';
    setBusy(false);
    park();
  }, [park]);

  const reveal = useCallback(() => {
    const el = column.current;
    const at = points();
    if (!el || !at) {
      finish();
      return;
    }
    window.clearTimeout(safety.current);
    flight.phase = 'revealing';
    tween.current?.kill();
    tween.current = gsap.to(el, {
      y: at.exit,
      duration: REVEAL_MS / 1000,
      ease: POUR_EASE,
      onComplete: finish,
    });
  }, [finish, points]);

  const cover = useCallback(
    (href: string) => {
      const el = column.current;
      const at = points();
      if (!el || !at) {
        router.push(href);
        return;
      }

      /*
       * Strana se pocinje dovlaciti odmah, ne kad se med slegne.
       *
       * Prije je `router.push` isao tek u `onComplete`, pa je cekanje na rutu
       * pocinjalo poslije pokrivanja i lijepilo se na animaciju. Ovako tece
       * ispod nje: dok med pada, strana se vec sprema. `prefetch` je zato, a
       * ne `push` — `push` bi zamijenio stranu cim bude spremna, a to je
       * dok je kadar jos napola otkriven.
       *
       * `TransitionLink` isto zove ovo na prelazak misem, pa je ruta obicno
       * topla i prije klika; ovo hvata dodir i sve sto dodje bez prelaska.
       */
      router.prefetch(href);

      flight.phase = 'covering';
      setBusy(true);

      tween.current?.kill();
      dropTween.current?.kill();
      gsap.set(el, { y: at.idle, willChange: 'transform' });

      /*
       * Kapi koje su se otkinule idu malo pred plohom, svaka za trun kasnije
       * od prethodne. Zato su unutar stupca: nose njegov pomak, a na njega
       * dodaju samo svoj mali predujam.
       */
      if (drops.current) {
        gsap.set(drops.current.children, { y: 0, opacity: 1 });
        dropTween.current = gsap.to(drops.current.children, {
          y: () => window.innerHeight * 0.06,
          opacity: 0,
          duration: COVER_MS / 1000,
          ease: 'power1.in',
          stagger: 0.08,
        });
      }

      tween.current = gsap.to(el, {
        y: at.cover,
        duration: COVER_MS / 1000,
        ease: POUR_EASE,
        onComplete: () => {
          flight.coveredAt = performance.now();
          flight.phase = 'waiting';
          router.push(href);
        },
      });

      window.clearTimeout(safety.current);
      safety.current = window.setTimeout(() => {
        if (flight.phase === 'waiting' || flight.phase === 'covering') reveal();
      }, SAFETY_MS);
    },
    [points, reveal, router],
  );

  /*
   * Prvo poravnanje — i preuzimanje prelaza zapocetog prije remontiranja.
   *
   * Ide prije iscrtavanja, ne poslije: da je u obicnom `useEffect`, nova
   * zavjesa bi jedan kadar stajala iznad ekrana i kroz taj kadar bi se vidjela
   * nova strana. Ovako je postavljena prije nego sto se ijedan piksel nacrta.
   */
  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;
    const el = column.current;
    const at = points();
    if (!el || !at) return;

    if (flight.phase === 'covering' || flight.phase === 'waiting') {
      /* Stara instanca je kadar vec pokrila; nova nastavlja tacno odatle. */
      flight.phase = 'waiting';
      gsap.set(el, { y: at.cover, willChange: 'transform' });
      window.clearTimeout(safety.current);
      safety.current = window.setTimeout(() => {
        if (flight.phase === 'waiting') reveal();
      }, SAFETY_MS);
      return;
    }

    park();
  }, [enabled, park, points, reveal]);

  /*
   * Putanja se pomjerila — nova strana je sjela. Skrol na vrh ide odmah, dok
   * je jos sve pokriveno, pa se stara pozicija nikad ne vidi.
   */
  useEffect(() => {
    if (flight.phase !== 'waiting') return;
    jumpToTop();
    const rest = Math.max(0, HOLD_MS - (performance.now() - flight.coveredAt));
    window.clearTimeout(hold.current);
    hold.current = window.setTimeout(reveal, rest);
    return () => window.clearTimeout(hold.current);
  }, [pathname, jumpToTop, reveal]);

  /*
   * Nazad i naprijed ne dobijaju zavjesu — nista ih nije ni najavilo. Ako se
   * dogode usred prelaza, zavjesa se prekida i vraca iznad kadra: strana koju
   * je preglednik vec pokazao ne smije ostati pod medom.
   */
  useEffect(() => {
    if (!enabled) return;
    const onPop = () => {
      tween.current?.kill();
      dropTween.current?.kill();
      window.clearTimeout(safety.current);
      window.clearTimeout(hold.current);
      finish();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [enabled, finish]);

  useEffect(
    () => () => {
      tween.current?.kill();
      dropTween.current?.kill();
      window.clearTimeout(safety.current);
      window.clearTimeout(hold.current);
    },
    [],
  );

  const navigate = useCallback(
    (href: string) => {
      if (!enabled) {
        router.push(href);
        return;
      }
      /* Navigacija je zakljucana dok med tece: drugi klik nema sta da radi. */
      if (flight.phase !== 'idle') return;
      cover(href);
    },
    [cover, enabled, router],
  );

  const value = useMemo<HoneyTransition>(
    () => ({ navigate, isBusy: busy, isEnabled: enabled }),
    [busy, enabled, navigate],
  );

  return (
    <Ctx.Provider value={value}>
      {children}

      {enabled && (
        <div className="honey-pour" aria-hidden="true" data-busy={busy ? 'true' : undefined}>
          <div className="honey-pour__column" ref={column}>
            {/* Gornji rub: isti crtez naglavce, niti koje se rastegnu i puste. */}
            <div className="honey-pour__edge honey-pour__edge--trail">
              <svg viewBox={POUR_VIEWBOX} focusable="false" aria-hidden="true">
                <path d={POUR_DRIP} fill="var(--amber)" />
              </svg>
            </div>

            <div className="honey-pour__body" />

            {/* Donji rub: kapi vode. */}
            <div className="honey-pour__edge honey-pour__edge--lead" ref={lead}>
              <svg viewBox={POUR_VIEWBOX} focusable="false" aria-hidden="true">
                <path d={POUR_DRIP} fill="var(--amber)" />
              </svg>

              <div className="honey-pour__drops" ref={drops}>
                <span className="honey-pour__drop" style={{ left: '18%' }} />
                <span className="honey-pour__drop" style={{ left: '54%' }} />
                <span className="honey-pour__drop" style={{ left: '81%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
