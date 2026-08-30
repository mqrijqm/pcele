'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Album — snimci koji se listaju skrolom.
 *
 * Jedan snimak stoji u sredini i tu ostaje; susjedni vire iza rubova ekrana,
 * isjeceni, kao sljedeca i prethodna stranica. Kad nastavis niz stranu, traka
 * se pomjeri ulijevo i sljedeci snimak dodje u sredinu — listas udesno. Ko
 * stane, stane i traka; nista se ne krece samo od sebe.
 *
 * Mehanizam je isti kao kod heroja s teglom: sekcija je visoka vise ekrana,
 * scena unutra je `position: sticky`, a GSAP samo prevodi napredak skrola u
 * vodoravni pomak. Nema pina — sticky to radi bez diranja layouta, sto je uz
 * Lenis mirnije.
 */

/**
 * Dva okvira, ne dva odnosa strana.
 *
 * Snimak se ne prikazuje u svom omjeru nego u omjeru okvira u koji je stavljen
 * — `object-fit: cover` ga podreze. Zato album ostaje isti bez obzira sta se
 * u njega doda: sirok okvir je uvijek jednako sirok, uspravni uvijek jednako
 * uzak i za petinu visi. Brojevi su izmjereni iz Marijinog crteza sekcije.
 */
const FRAME = {
  wide: { aspect: 836 / 473, lift: 1 },
  tall: { aspect: 405 / 575, lift: 1.216 },
} as const;

/**
 * Redoslijed snimaka — ovim redom dolaze u sredinu.
 *
 * Oblik okvira bira fotografija, ne ritam: sirok okvir podreze uspravan
 * snimak na trecinu, pa u njega ide samo ono sto je i snimljeno polezecke.
 * Od pet snimaka u albumu takav je jedan, i stoji drugi po redu — dovoljno
 * da traka ima jedan siri predah, a da nijedan snimak ne bude odsjecen.
 */
const RAIL = [
  { src: '/images/real/album-tegla-dlan.webp', frame: 'tall', key: 'dlan' },
  { src: '/images/real/album-kosnice.webp', frame: 'wide', key: 'kosnice' },
  { src: '/images/real/album-korpa.webp', frame: 'tall', key: 'korpa' },
  { src: '/images/real/album-tegla-rame.webp', frame: 'tall', key: 'rame' },
  { src: '/images/real/album-tegle-svjetlo.webp', frame: 'tall', key: 'svjetlo' },
] as const;

/*
 * Prvi i posljednji okvir nikad ne dodju u sredinu — oni su ti koji vire iza
 * rubova dok album stoji na pocetku i na kraju. Zato traka pocinje zadnjim
 * snimkom a zavrsava prvim: svaki snimak iz liste tako dobije svoju stanicu u
 * sredini tacno jednom, a rubovi se popune onim sto ionako slijedi.
 *
 * Ta dva ruba su odjek, ne novi snimak, pa nemaju svoj opis: citac ekrana bi
 * inace dva puta procitao istu fotografiju.
 */
const PLATES = [
  { ...RAIL[RAIL.length - 1], id: 'edge-start', echo: true },
  ...RAIL.map((shot) => ({ ...shot, id: shot.key, echo: false })),
  { ...RAIL[0], id: 'edge-end', echo: true },
];

/**
 * Pecat: zeleni krug s isprekidanim prstenom.
 *
 * Vrti se prsten, ne cio krug. Puna zelena ploca je simetricna pa se na njoj
 * rotacija ionako ne vidi, a natpis unutra mora ostati citljiv — da se okrece
 * cijeli SVG, tekst bi se vrtio naglavacke. Zato je prsten izvucen iz crteza
 * (`pecat-*.svg` ga vise nemaju) i nacrtan ovdje, kao zaseban sloj koji jedini
 * ima animaciju.
 */
function Seal({
  href,
  src,
  label,
  className,
}: {
  href: string;
  src: string;
  label: string;
  className: string;
}) {
  return (
    <Link href={href} className={`rail__seal ${className}`} aria-label={label}>
      <Image className="rail__sealFace" src={src} alt="" width={127} height={127} />
      <svg className="rail__sealRing" viewBox="0 0 127 127" aria-hidden="true" focusable="false">
        <circle
          cx="63.5"
          cy="62.5"
          r="55.1187"
          fill="none"
          stroke="var(--paper)"
          strokeWidth="0.762519"
          strokeDasharray="7 7"
        />
      </svg>
    </Link>
  );
}

export default function PhotoRail({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const copy = home.rail[locale];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const track = q('.rail__track')[0] as HTMLElement;
      const plates = q('.rail__item') as HTMLElement[];
      if (!track || plates.length < 2) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /*
         * Sredina okvira mjeri se iz `offsetLeft`, ne iz `getBoundingClientRect`
         * — pravougaonik na ekranu vec sadrzi i pomak trake, pa bi mjera
         * zavisila od trenutka u kojem je uzeta. `offsetLeft` je mirna
         * vrijednost iz layouta.
         */
        const centreOf = (plate: HTMLElement) => plate.offsetLeft + plate.offsetWidth / 2;

        /*
         * Album se ne otvara na prvom snimku nego na drugom, i ne zavrsava na
         * posljednjem nego na pretposljednjem. Prvi i posljednji su tu samo da
         * vire iza rubova — bez njih bi na pocetku lijeva strana ekrana bila
         * prazan papir, a na kraju desna.
         */
        const first = plates[1];
        const last = plates[plates.length - 2];

        const home0 = () => track.parentElement!.clientWidth / 2 - centreOf(first);
        const travel = () => centreOf(last) - centreOf(first);

        gsap.set(track, { x: home0 });

        const tween = gsap.to(track, {
          x: () => home0() - travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="rail"
      ref={root}
      aria-label={copy.label}
      style={{ '--rail-count': PLATES.length } as React.CSSProperties}
    >
      <div className="rail__stage">
        <header className="rail__intro">
          <p className="rail__eyebrow">{copy.eyebrow}</p>
        </header>

        <div className="rail__viewport">
          <ul className="rail__track">
            {PLATES.map((shot, i) => (
              <li
                className={`rail__item rail__item--${shot.frame}`}
                key={shot.id}
                style={
                  {
                    aspectRatio: String(FRAME[shot.frame].aspect),
                    '--lift': FRAME[shot.frame].lift,
                  } as React.CSSProperties
                }
              >
                <Image
                  className="rail__img"
                  src={shot.src}
                  alt={shot.echo ? '' : copy.alt[shot.key]}
                  fill
                  sizes="(max-width: 900px) 90vw, 60vw"
                  priority={i === 0}
                />
              </li>
            ))}
          </ul>

          {/*
            Pecati stoje na bocnim snimcima, uz njihov unutrasnji rub — nikad
            preko onog u sredini. Zato su vezani za rub prozora a ne za neki
            odredjeni snimak: snimci ispod njih se smjenjuju, pecat ostaje.
          */}
          <Seal
            href={localeHref(locale, '/process')}
            src="/images/brand/pecat-proces.svg"
            label={copy.sealProcess}
            className="rail__seal--start"
          />
          <Seal
            href={localeHref(locale, '/about')}
            src="/images/brand/pecat-pcelinjaci.svg"
            label={copy.sealHives}
            className="rail__seal--end"
          />
        </div>
      </div>
    </section>
  );
}
