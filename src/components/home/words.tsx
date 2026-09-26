import { Fragment } from 'react';
import gsap from 'gsap';

/**
 * Pasus koji se pali rijec po rijec, kako skrol odmice — isti postupak kao u
 * `Geslo.tsx`, samo za tekst koji ima vise od jednog reda.
 *
 * Rijeci su obicni `span`-ovi razdvojeni pravim razmakom u tekstu, ne `margin`-om:
 * tako pasus ostaje isti tekst za pretragu, za kopiranje i za citac ekrana, a
 * preglednik ga i dalje lomi po sirini kolone.
 */
export function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="rw">{word}</span>{' '}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Koliko se od rijeci vidi dok ceka svoj red. Isto tanko kao `--geslo-faint`:
 * da se nazire da tu nesto pise, a premalo da se procita unaprijed.
 */
export const FAINT = 0.3;

/**
 * Vraca funkciju koja za napredak citanja (0–1) upali rijeci do te tacke.
 *
 * Prednja ivica nije oster rez nego prelaz preko `soft` rijeci: rijec koja je
 * na redu je napola upaljena, a tek ona iza nje potpuno. Duzi pasus trazi
 * siru ivicu — na tri rijeci bi se kroz osamdeset vidjela kao treptaj.
 *
 * Upisuje se samo ono sto se promijenilo: pasus od stotinu rijeci bi inace
 * stotinu puta po kadru diralo stil, i kad skrol stoji.
 */
export function wordReveal(words: HTMLElement[], soft = 4) {
  const setters = words.map((word) => gsap.quickSetter(word, 'opacity'));
  const last = words.map(() => -1);
  const count = words.length;

  return (progress: number) => {
    const head = progress * (count + soft);
    setters.forEach((set, index) => {
      const value = Math.min(1, Math.max(FAINT, (head - index) / soft));
      // Krajnje vrijednosti se uvijek upisuju, da rijec ne ostane na 0.998.
      const edge = value === 1 || value === FAINT;
      if (value === last[index]) return;
      if (!edge && Math.abs(value - last[index]) < 0.004) return;
      last[index] = value;
      set(value);
    });
  };
}
