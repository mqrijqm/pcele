'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import { type Locale } from '@/i18n/config';

import { Words, wordReveal } from './words';

gsap.registerPlugin(ScrollTrigger);

/*
 * Tri stupca, pet snimaka.
 *
 * Redoslijed u kojem se citaju je cik-cak: prva tri silaze udesno, druga dva
 * se vracaju ulijevo, i svaki je nizi od prethodnog. Zato su ovdje slozeni po
 * stupcima a ne po redu citanja — stupac je ono sto layout drzi, a `i` je
 * mjesto natpisa u sadrzaju.
 *
 * `label` kaze na kojoj strani snimka stoji natpis. Nije ukras: gornji natpis
 * najavljuje snimak, donji ga potpisuje, i tako se pet natpisa ne poredaju u
 * liniju.
 */
const COLUMNS = [
  [
    { i: 0, src: '/images/real/tegla-stub-livada.webp', w: 684, h: 1040, label: 'top' },
    { i: 4, src: '/images/real/pcele-leto.webp', w: 701, h: 1028, label: 'bottom' },
  ],
  [
    { i: 1, src: '/images/real/tegla-kafa-sto.webp', w: 684, h: 1028, label: 'top' },
    { i: 3, src: '/images/real/vrcaljka-tegla.webp', w: 684, h: 1028, label: 'bottom' },
  ],
  [{ i: 2, src: '/images/real/ramovi-sace.webp', w: 684, h: 1028, label: 'bottom' }],
] as const;

/** Koliki dio puta kroz izjavu je citanje; ostatak drzi cijelu recenicu prije otpustanja. */
const READ = 0.82;

/** Recenica u crtezu ima tri reda, i svaki se otkriva zasebno, slijeva nadesno. */
const ROWS = 3;

/** Sirina meke prednje ivice, u postocima sirine crteza — otprilike jedna rijec. */
const FEATHER = 14;

/**
 * Livada: izjava koja se zaustavi, pa pet snimaka u stepenicu.
 *
 * Crtez pcelinjaka je odavde otisao — zauzimao je gotovo cio kadar i drzao
 * stranu na mjestu na kojem se nista nije desavalo. S njim je otisao i pecat
 * koji je vodio na pcelinjake; ta veza sada stoji u sekciji o krajoliku, gdje
 * je i tekst koji je uvodi.
 *
 * **Izjava se zaustavi.** Recenica je najkrupniji slog na strani i jedina
 * poruka ove sekcije, a ranije je samo proletjela — visoka kao kadar i skrolala
 * se zajedno sa stranom, pa je pri ulasku i izlasku stajala prepolovljena.
 * Sada je pozornica lijepljena za vrh kadra kao kod gesla (`Geslo.tsx`): strana
 * stane, skrol ispisuje recenicu, a zadnjih ~18% puta cijela stoji prije
 * otpustanja.
 *
 * **Dva oblika recenice.** Srpska je vektor, i to kao `<img>` a ne umetnuta u
 * stranu: slog je pretvoren u krivulje, s vlatima trave izmedju rijeci, pa je
 * za pretragu i citac ekrana nema — zato ista ta recenica stoji u `alt`-u. Ta
 * slika ne moze da se lomi: na uskom ekranu bi bila sitna kao natpis na
 * kutiji sibica, a engleski prijevod u njoj ne postoji. Zato na telefonu i na
 * engleskom recenica ide kao pravi tekst, rijec po rijec, s travom iznad.
 *
 * Crtez se ne pali rijec po rijec jer u fajlu rijeci nema — samo dva puta,
 * tekst i trava. Otkriva se maskom, red po red, kao da se pise.
 */
export default function Livada({ locale }: { locale: Locale }) {
  const t = home.livada[locale];
  const izjava = useRef<HTMLDivElement>(null);

  /* Crtez je pisan srpskim; drugi jezik ga nema. */
  const art = locale === 'sr';

  useEffect(() => {
    const el = izjava.current;
    if (!el) return;

    const slika = el.querySelector<HTMLElement>('.livada__recenica');
    const rijeci = Array.from(el.querySelectorAll<HTMLElement>('.livada__tekst .rw'));

    const mm = gsap.matchMedia();

    mm.add(
      {
        wide: '(min-width: 701px) and (prefers-reduced-motion: no-preference)',
        narrow: '(max-width: 700px) and (prefers-reduced-motion: no-preference)',
      },
      (context) => {
        /* Crtez samo tamo gdje ga CSS prikazuje: srpski, ne na telefonu. */
        const mask = !!slika && !!context.conditions?.wide;

        let paint: (progress: number) => void;

        if (mask && slika) {
          slika.classList.add('is-reading');
          paint = (progress) => {
            const read = Math.min(1, progress / READ);
            for (let row = 0; row < ROWS; row += 1) {
              const own = Math.min(1, Math.max(0, read * ROWS - row));
              slika.style.setProperty(`--f${row + 1}`, `${(own * (100 + FEATHER)).toFixed(2)}%`);
            }
          };
        } else {
          const light = wordReveal(rijeci, 3);
          paint = (progress) => light(Math.min(1, progress / READ));
        }

        paint(0);

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: ({ progress }) => paint(progress),
          onUpdate: ({ progress }) => paint(progress),
        });

        return () => {
          trigger.kill();
          gsap.set(rijeci, { clearProps: 'opacity' });
          if (slika) {
            slika.classList.remove('is-reading');
            ['--f1', '--f2', '--f3'].forEach((name) => slika.style.removeProperty(name));
          }
        };
      },
    );

    return () => mm.revert();
  }, [locale]);

  return (
    <section className="livada section-padding" data-snap="off">
      <div className="livada__izjava" ref={izjava}>
        <div className="livada__pozornica">
          {art && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="livada__recenica reveal"
              src="/images/brand/recenica-vrcamo.svg"
              alt={t.recenica}
              width={2600}
              height={507}
              loading="lazy"
              decoding="async"
            />
          )}

          <div className={`livada__slog${art ? ' livada__slog--uzak' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="livada__trska"
              src="/images/brand/trska.svg"
              alt=""
              aria-hidden="true"
              width={258}
              height={308}
              loading="lazy"
              decoding="async"
            />
            <p className="livada__tekst">
              <Words text={t.recenica} />
            </p>
          </div>
        </div>
      </div>

      {/*
        * Snimci u stepenicu: svaki sljedeci je nize za nesto manje od pola
        * svoje visine. Pomak je u postocima, ne u pikselima — tako stepenica
        * ostaje ista i kad se stupci suze.
        */}
      <div className="livada__photos">
        {COLUMNS.map((column, c) => (
          <div className={`livada__column livada__column--${c + 1}`} key={c}>
            {column.map((photo) => (
              <figure
                className={`livada__photo livada__photo--${photo.label} reveal stagger-${photo.i + 1}`}
                key={photo.src}
                /* Na uskom ekranu stupci nestaju, pa poredak vraca ovaj broj. */
                style={{ '--i': photo.i } as CSSProperties}
              >
                <figcaption className="livada__label">{t.photoLabels[photo.i]}</figcaption>
                <Image
                  src={photo.src}
                  alt={t.photoAlts[photo.i]}
                  width={photo.w}
                  height={photo.h}
                  sizes="(max-width: 899px) 78vw, 26vw"
                />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
