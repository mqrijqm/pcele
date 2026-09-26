'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

import { Words, wordReveal } from './words';

gsap.registerPlugin(ScrollTrigger);

/**
 * Isti uslov kao u CSS-u koji sekciju lijepi za kadar (`.priroda` u
 * `globals.css`). Kad se razidju, JS vodi citanje skrolom dok sekcija u stvari
 * prolazi kroz kadar — pa rijeci ostanu prigusene zauvijek.
 */
const PIN = '(prefers-reduced-motion: no-preference) and (min-width: 901px) and (min-height: 640px)';
const FLOW =
  '(prefers-reduced-motion: no-preference) and (max-width: 900px), (prefers-reduced-motion: no-preference) and (max-height: 639px)';

/** Koliki dio puta kroz sekciju je citanje; ostatak drzi cijeli tekst prije otpustanja. */
const READ = 0.82;

/**
 * U dodiru sa prirodom: snimak, naslov i dva pasusa jedno uz drugo.
 *
 * **Sekcija se zaustavi.** Ranije je zaustavljanje trajalo malo vise od pola
 * ekrana skrola i pasusi su izlazili cijeli odjednom, pa se do kraja prvog
 * nije stizalo. Sada je pozornica lijepljena za vrh kadra kao kod gesla
 * (`Geslo.tsx`): snimak, naslov i pecat udju sami, a pasusi ostaju priguseni
 * dok ih skrol ne upali rijec po rijec (`words.tsx`). Zadnjih ~18% puta cio
 * tekst samo stoji, pa se moze procitati do kraja prije nego strana krene.
 *
 * Isto kao kod `Krajolik`: na uskom ili niskom prozoru sadrzaj ne staje u
 * kadar, pa tamo nema zaustavljanja i sve ulazi kad sekcija dodje u kadar.
 */
export default function Priroda({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const t = home.priroda[locale];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector as (sel: string) => Element[];
      const heading = q('.priroda__heading');
      const seal = q('.priroda__seal');
      const pasusi = q('.priroda__copy > p');
      const veza = q('.priroda__link');
      const rijeci = q('.priroda__copy .rw') as HTMLElement[];
      if (!heading.length || !seal.length || !pasusi.length) return;

      /*
       * Pecat sjedi sredinom na uglu snimka. Pomak od pola svoje mjere je ovdje,
       * ne u CSS-u: GSAP skalira preko `transform` i pri prvom upisu pretvori
       * CSS `translate` u nulu, pa je pecat stajao pomaknut za pola sebe.
       */
      gsap.set(seal, { xPercent: -50, yPercent: -50 });

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([...heading, ...pasusi, ...veza], { opacity: 1, y: 0 });
        gsap.set(seal, { opacity: 1, scale: 1 });
      });

      /*
       * Naslov, pa pecat. Pecat dolazi zadnji, kad se snimak i slog vec smire.
       * `slog` je ono sto ulazi vremenom; veza uz pasuse ide skrolom.
       */
      const ulazak = (slog: Element[]) => {
        gsap.set(heading, { opacity: 0, y: 28 });
        gsap.set(slog, { opacity: 0, y: 18 });
        gsap.set(seal, { opacity: 0, scale: 0.78 });

        return gsap
          .timeline({
            scrollTrigger: { trigger: el, start: 'top 72%', once: true },
            defaults: { ease: 'power2.out' },
          })
          .to(heading, { opacity: 1, y: 0, duration: 0.5 }, 0)
          .to(slog, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.2)
          .to(seal, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }, 0.6);
      };

      mm.add(PIN, () => {
        gsap.set(veza, { opacity: 0 });
        const tl = ulazak(pasusi);

        const light = wordReveal(rijeci, 5);
        const showLink = gsap.quickSetter(veza, 'opacity');
        const paint = (progress: number) => {
          light(Math.min(1, progress / READ));
          /* Veza dolazi kad je tekst gotovo procitan, ne prije. */
          showLink(Math.min(1, Math.max(0, (progress - 0.66) / 0.14)));
        };
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
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set(rijeci, { clearProps: 'opacity' });
        };
      });

      mm.add(FLOW, () => {
        const tl = ulazak([...pasusi, ...veza]);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section className="priroda" ref={root}>
      <div className="priroda__stage">
        <div className="priroda__inner">
          <figure className="priroda__shot">
            <Image
              src="/images/priroda/pcela-na-dlanu.webp"
              alt={t.photoAlt}
              width={716}
              height={1073}
              sizes="(max-width: 900px) 70vw, 26vw"
            />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="priroda__seal"
              src="/images/brand/pecat-cvijet.svg"
              alt=""
              aria-hidden="true"
            />
          </figure>

          <h2 className="priroda__heading">{t.heading}</h2>

          <div className="priroda__copy">
            {t.body.map((par) => (
              <p key={par.slice(0, 24)}>
                <Words text={par} />
              </p>
            ))}

            <Link className="priroda__link" href={localeHref(locale, '/#porijeklo')}>
              {t.link}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
