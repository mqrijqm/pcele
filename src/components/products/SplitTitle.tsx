import { Fragment } from 'react';

/**
 * Naslov koji ulazi red po red, iz maske.
 *
 * Rijeci su podijeljene u markupu a ne u browseru: nema mjerenja teksta,
 * nema posla pri hidrataciji, i strana radi i bez JavaScripta — tada je
 * naslov samo vidljiv. Kretanje je u CSS-u, okidac je `.reveal` koji nosi
 * `RevealObserver` sa ostatka sajta.
 *
 * `aria-label` nosi cijelu recenicu, a razbijeni dijelovi su skriveni od
 * citaca ekrana — inace bi se naslov procitao slovo po slovo.
 */
export default function SplitTitle({
  text,
  className = '',
  as: Tag = 'h2',
}: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}) {
  const words = text.split(' ');

  return (
    <Tag
      /*
       * `data-no-type` je kocnica koju `HeadingTypewriter` sa ostatka sajta
       * postuje. Bez nje on preuzme naslov, skine `reveal` i ispise slova
       * jedno po jedno — a rijeci ostaju skrivene u maski, jer okidac za
       * njihovo podizanje (`in-view`) nikad ne dodje.
       */
      data-no-type=""
      className={`pe-split reveal ${className}`.trim()}
      aria-label={text}
    >
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="pe-split__line">
              <span className="pe-split__word" style={{ '--word': i } as React.CSSProperties}>
                {word}
              </span>
            </span>
            {/*
              Razmak stoji IZVAN `.pe-split__line`. Taj element je `inline-block`,
              a razmak na kraju inline-block-a browser odbaci — rijeci bi se
              slijepile ("Zaštonaš med?").
            */}
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
