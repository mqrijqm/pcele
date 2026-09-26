import { Fragment, type CSSProperties } from 'react';

/**
 * Tekst razlomljen na rijeci, spreman za `Citaj`.
 *
 * Svaka rijec nosi svoj redni broj (`--i`), a cijeli pasus ukupan broj
 * (`--n`); iz ta dva broja i iz `--p` sa sekcije CSS izracuna koliko je koja
 * rijec do sada ispisana (`.citaj__w`). Razmaci su pravi razmaci u tekstu, ne
 * `margin`, pa se tekst kopira i cita normalno.
 */
export default function Rijeci({ tekst }: { tekst: string }) {
  const rijeci = tekst.split(' ');
  return (
    <span className="citaj__tekst" style={{ ['--n' as string]: rijeci.length } as CSSProperties}>
      {rijeci.map((r, i) => (
        <Fragment key={`${r}-${i}`}>
          <span className="citaj__w" style={{ ['--i' as string]: i } as CSSProperties}>
            {r}
          </span>{' '}
        </Fragment>
      ))}
    </span>
  );
}
