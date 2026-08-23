import Image from 'next/image';

/**
 * Uvod u stranicu: nadnaslov i naslov u sredini, sa znakom koji se vrti desno.
 *
 * Zamijenio je stari heroj sa slikom. Nosi ga prazan prostor, ne fotografija —
 * strana se otvara mirno, a znak u uglu je jedino sto se mice.
 */
export default function PageOpener({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <section className="opener">
      <div className="container">
        <p className="opener__eyebrow reveal">{eyebrow}</p>
        <h2 className="opener__heading reveal stagger-1">{heading}</h2>
      </div>

      {/*
        * Znak stoji izvan mjere teksta, uz desnu ivicu sekcije, i vrti se
        * jedan krug u pola minuta — isto kao onaj u "Odakle smo".
        */}
      <span className="opener__badge" aria-hidden="true">
        <Image src="/hero/logo-krug.svg" alt="" width={279} height={298} />
      </span>
    </section>
  );
}
