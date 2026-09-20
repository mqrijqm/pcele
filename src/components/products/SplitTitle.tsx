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
    <Tag className={`pe-split reveal ${className}`.trim()} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span className="pe-split__line" key={`${word}-${i}`}>
            <span className="pe-split__word" style={{ '--word': i } as React.CSSProperties}>
              {word}
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}
