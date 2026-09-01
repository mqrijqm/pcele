'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis, wired exactly as meracinque.com wires it — the scrubbed hero timeline
 * reads its progress through this, so the feel of the reveal depends on it:
 *
 *   new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)),
 *               wheelMultiplier: 1, touchMultiplier: 2, normalizeWheel: true, anchors: true })
 *   lenis.on('scroll', ScrollTrigger.update)
 *   gsap.ticker.add(t => lenis.raf(t * 1000))
 *   gsap.ticker.lagSmoothing(0)
 *
 * It stays stopped while the loading curtain is up.
 *
 * Ovdje su i dvije stvari koje se ticu ucitavanja, a ne samog skrola:
 *
 * — Strana se otvara na vrhu. Preglednik inace vraca na mjesto gdje si stao
 *   prije osvjezavanja; sa zavjesom to znaci da zavjesa padne na sredinu
 *   sekcije koju nisi trazio.
 *
 * — `ScrollTrigger.refresh()` poslije zavjese i poslije fontova. Visine
 *   pinovanih sekcija se mjere dok je zavjesa gore i dok slog jos stoji u
 *   zamjenskom fontu; kad se pravi font ucita, mjera se pomjeri, a okidaci
 *   ostanu na starim brojevima.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (document.documentElement.classList.contains('is-preloading')) window.scrollTo(0, 0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('preloader:done', refresh);
      return () => window.removeEventListener('preloader:done', refresh);
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
      anchors: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const preloading = document.documentElement.classList.contains('is-preloading');
    if (preloading) lenis.stop();
    const start = () => {
      lenis.start();
      refresh();
    };
    window.addEventListener('preloader:done', start);

    /*
     * Zadrzavanje skrola.
     *
     * Sekcija sa snimkom pcelinjaka trazi da se strana zaustavi dok snimak ne
     * prodje. Lenis je ovdje jedini koji zna gdje je strana, ali on nema koga
     * da pita — zato se javlja dogadjajem, isto kao zavjesa iznad.
     *
     * `lenis.stop()` gasi tocak i dodir. Tastatura ide mimo njega, pa se
     * razmaknica i strelice hvataju posebno; bez toga se strana i dalje moze
     * pomjeriti tipkom.
     */
    const KEYS = new Set([
      ' ',
      'PageDown',
      'PageUp',
      'ArrowDown',
      'ArrowUp',
      'Home',
      'End',
      'Spacebar',
    ]);

    let locked = false;
    const swallow = (e: KeyboardEvent) => {
      if (!locked) return;
      const el = e.target as HTMLElement | null;
      /* U polju za unos razmaknica je slovo, ne skrol. */
      if (el?.closest('input, textarea, select, [contenteditable]')) return;
      if (KEYS.has(e.key)) e.preventDefault();
    };

    /*
     * Prije zaustavljanja strana se dovede na mjesto. Bez toga se zamrzne
     * tamo gdje se zatekla — sekcija napola u kadru, pa izgleda kao da je
     * strana zapela, a ne da je stala namjerno.
     */
    const lock = (e: Event) => {
      locked = true;
      const to = (e as CustomEvent<{ to?: Element }>).detail?.to;
      if (!to) {
        lenis.stop();
        return;
      }
      lenis.scrollTo(to as HTMLElement, {
        duration: 0.5,
        lock: true,
        onComplete: () => lenis.stop(),
      });
    };
    const unlock = () => {
      locked = false;
      lenis.start();
    };

    /*
     * Skok na vrh, bez putovanja.
     *
     * Medena zavjesa mijenja stranu dok je sve pokriveno i tada trazi vrh nove
     * strane. `window.scrollTo` tu ne pomaze: polozaj drzi Lenis i vratio bi
     * stranu tamo gdje je mislio da jeste. `immediate` znaci bez animacije —
     * ispod zavjese se nema sta gledati, a i ne smije: kad bi se putovalo,
     * zavjesa bi se digla dok strana jos klizi.
     */
    const toTop = () => lenis.scrollTo(0, { immediate: true, force: true });
    window.addEventListener('scroll:top', toTop);

    window.addEventListener('scroll:lock', lock);
    window.addEventListener('scroll:unlock', unlock);
    window.addEventListener('keydown', swallow, { passive: false });

    /* ---------------------------------------------------------------------
     * Stajanje na sekciji.
     *
     * Kad se skrol smiri, strana dovuce najblizu sekciju na vrh kadra, da se
     * cita od pocetka a ne od sredine. Tri stvari drze da to ne smeta:
     *
     * 1. Hvata samo blizu. Ako je vrh sekcije dalje od cetvrtine kadra, ne
     *    dira nista — inace bi strana vukla korisnika natrag svaki put kad
     *    krene dalje.
     *
     * 2. Preskace visoke sekcije. Ono sto je vise od jednog i po kadra ne
     *    moze se procitati odjednom, pa bi snap tu bio smetnja: povukao bi te
     *    na vrh onoga sto si upravo poceo da citas nize.
     *
     * 3. Preskace pinovane sekcije. One vec drze skrol same (heroj, vodoravna
     *    ploca) i imaju svoj `pin-spacer`; snap bi im se borio sa scrubom.
     *
     * Cijela stvar radi tek kad korisnik pusti — 160ms tisine — i nikad dok
     * je strana zakljucana ili meni otvoren.
     */
    const BLIZINA = 0.25; /* koliko blizu vrh sekcije mora biti, u visinama kadra */
    const NAJVISA = 1.5; /* preko ovoliko kadra sekcija se ne snapuje */

    let mjesta: number[] = [];

    const izmjeri = () => {
      const glavni = document.querySelector('main');
      if (!glavni) return (mjesta = []);
      const kadar = window.innerHeight;
      mjesta = Array.from(glavni.children)
        .filter((el): el is HTMLElement => el instanceof HTMLElement)
        .filter((el) => {
          if (el.dataset.snap === 'off') return false;
          if (el.classList.contains('pin-spacer')) return false;
          if (el.querySelector('.pin-spacer')) return false;
          const h = el.offsetHeight;
          return h > kadar * 0.3 && h < kadar * NAJVISA;
        })
        .map((el) => el.getBoundingClientRect().top + window.scrollY)
        .sort((a, b) => a - b);
    };

    let mirovanje: number | undefined;
    const smiri = () => {
      if (locked) return;
      if (document.body.style.overflow === 'hidden') return; /* meni je otvoren */
      if (!mjesta.length) return;

      const sada = window.scrollY;
      const kraj = document.documentElement.scrollHeight - window.innerHeight;
      /* Na samom vrhu i dnu se ne dira — tamo je i tako sve na svom mjestu. */
      if (sada < 4 || sada > kraj - 4) return;

      let najblize = mjesta[0];
      for (const m of mjesta) if (Math.abs(m - sada) < Math.abs(najblize - sada)) najblize = m;

      if (Math.abs(najblize - sada) > window.innerHeight * BLIZINA) return;
      if (Math.abs(najblize - sada) < 2) return;

      lenis.scrollTo(najblize, { duration: 0.6, easing: (t) => 1 - Math.pow(1 - t, 3) });
    };

    const naSkrol = () => {
      window.clearTimeout(mirovanje);
      mirovanje = window.setTimeout(smiri, 160);
    };

    lenis.on('scroll', naSkrol);
    /*
     * Mjere se uzimaju poslije `refresh`-a, ne prije: pinovane sekcije tek
     * tada dobiju svoj `pin-spacer` i konacnu visinu.
     */
    ScrollTrigger.addEventListener('refresh', izmjeri);
    izmjeri();
    const ponovo = () => window.setTimeout(izmjeri, 200);
    window.addEventListener('resize', ponovo);

    return () => {
      window.clearTimeout(mirovanje);
      window.removeEventListener('resize', ponovo);
      ScrollTrigger.removeEventListener('refresh', izmjeri);
      window.removeEventListener('preloader:done', start);
      window.removeEventListener('scroll:top', toTop);
      window.removeEventListener('scroll:lock', lock);
      window.removeEventListener('scroll:unlock', unlock);
      window.removeEventListener('keydown', swallow);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
