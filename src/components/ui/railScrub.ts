import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Traka koja se lista skrolom.
 *
 * Isti mehanizam nose dvije sekcije — album na pocetnoj i proizvodi u
 * prodavnici — pa stoji ovdje, na jednom mjestu.
 *
 * Sekcija je visoka vise ekrana, scena unutra je `position: sticky`, a ovo
 * samo prevodi napredak skrola u vodoravni pomak trake. Nema pina: sticky to
 * radi bez diranja layouta, sto je uz Lenis mirnije.
 *
 * Prvi i posljednji okvir nikad ne dodju u sredinu — oni su ti koji vire iza
 * rubova dok je traka na pocetku i na kraju. Bez njih bi se traka otvarala na
 * prazan papir s lijeve strane i zatvarala na prazan s desne.
 *
 * `onCentre` se javlja kad se promijeni koji je okvir u sredini, i to samo
 * tada — ne na svakom kadru.
 */
export function railScrub(
  root: HTMLElement,
  q: (sel: string) => Element[],
  onCentre?: (index: number) => void,
) {
  const track = q('.rail__track')[0] as HTMLElement | undefined;
  const plates = q('.rail__item') as HTMLElement[];
  if (!track || plates.length < 3) return;

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    /*
     * Sredina okvira mjeri se iz `offsetLeft`, ne iz `getBoundingClientRect` —
     * pravougaonik na ekranu vec sadrzi i pomak trake, pa bi mjera zavisila od
     * trenutka u kojem je uzeta. `offsetLeft` je mirna vrijednost iz layouta.
     */
    const centreOf = (plate: HTMLElement) => plate.offsetLeft + plate.offsetWidth / 2;

    const first = plates[1];
    const last = plates[plates.length - 2];

    const home0 = () => track.parentElement!.clientWidth / 2 - centreOf(first);
    const travel = () => centreOf(last) - centreOf(first);

    gsap.set(track, { x: home0 });

    /* Zadnji javljeni okvir, da se ista vijest ne ponavlja svakog kadra. */
    let told = -1;
    const tell = () => {
      if (!onCentre) return;
      const stage = track.parentElement!;
      const mid = stage.getBoundingClientRect().left + stage.clientWidth / 2;
      let best = 0;
      let near = Infinity;
      plates.forEach((plate, i) => {
        const box = plate.getBoundingClientRect();
        const away = Math.abs(box.left + box.width / 2 - mid);
        if (away < near) {
          near = away;
          best = i;
        }
      });
      if (best !== told) {
        told = best;
        onCentre(best);
      }
    };

    const tween = gsap.to(track, {
      x: () => home0() - travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: tell,
        onUpdate: tell,
      },
    });

    tell();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });

  return () => mm.revert();
}
