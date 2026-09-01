'use client';

import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { home } from '@/content/pages';
import { localeHref, type Locale } from '@/i18n/config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Crtezi uz natpise.
 *
 * Bagremov crtez je izvucen iz `bagrem.svg`, gdje je stajao slijepljen sa
 * natpisom u istom fajlu — a natpis i crtez se ovdje ne ponasaju isto (na
 * prelazu se slog gasi, crtez ostaje), pa nisu mogli ostati jedno.
 *
 * Livadski crtez jos ne postoji kao zaseban fajl: `livadski med.svg` je samo
 * natpis, a onaj crtez trave postoji jedino utisnut u `Group 63.png`, odakle
 * se ne da izvuci kao vektor. Dok ne stigne, ovdje stoji `null` — natpis se
 * tada ispisuje bez crteza umjesto da se vidi slomljena slika.
 */
const IKONE = {
  livadski: '/images/sorte/ikona-livada.svg',
  bagremov: '/images/sorte/ikona-bagrem.svg',
} as const;

/**
 * Dvije sorte, jedna nasuprot druge.
 *
 * **Kako se sekcija otvara.** Dvije fotografije stoje preko cijelog kadra, po
 * pola svaka, bez razmaka medju njima — jedna slika presjecena po sredini.
 * Skrol ih skuplja: svaka karta se smanjuje ka sredini svoje polovine dok ne
 * sjedne na svoju konacnu mjeru, i tek tada se ispisuju natpisi i krug.
 *
 * **Zasto `transform`, a ne mjere.** Karta cijelo vrijeme stoji u svojoj
 * konacnoj velicini; puni kadar je samo `scale` preko nje. Da se animiraju
 * `width`/`height`, preglednik bi na svakom kadru iznova racunao raspored
 * cijele strane. Ovako se mijenja samo ono sto ide na grafickoj kartici.
 *
 * Mjera tog `scale`-a nije konstanta nego odnos polovine kadra i karte, pa se
 * racuna u JS-u i pise kao `--fill` na samu kartu. Na promjenu prozora se
 * racuna iznova — inace bi se pri prvom skrolu poslije rotacije telefona
 * vidio rub karte usred punog kadra.
 *
 * **Pin.** Sticky stack u visokoj sekciji, kao u `HeroJar` — ne
 * `ScrollTrigger.pin`. Sekcija je visoka, u njoj stoji `sticky` pozornica
 * visine kadra, i skrol kroz visak visine je ono sto pokrece smanjivanje.
 *
 * **Prelaz na kartu** je u CSS-u, ne u GSAP-u: mis ulazi i izlazi, a
 * `transition` po prirodi ide u oba smjera istom krivom. GSAP i CSS ne diraju
 * ista svojstva — otkrivanje pise `opacity` na omotac natpisa i na krug,
 * prelaz pise `opacity` na sliku tegle, na slog u natpisu i na suprotnu kartu.
 * Da oboje pisu po istom mjestu, inline vrijednost iz GSAP-a bi potukla CSS.
 */
export default function Podjela({ locale }: { locale: Locale }) {
  const t = home.podjela[locale];
  const root = useRef<HTMLElement>(null);

  /*
   * Prelaz se pali tek kad se sekcija otvori. Dok traje skupljanje, karta pod
   * misem ne smije da se mijenja — u tom trenutku je jos puni kadar.
   */
  const [otvoreno, setOtvoreno] = useState(false);
  /* Koja je karta pod misem, u fokusu ili dodirnuta: 0 lijeva, 1 desna. */
  const [aktivna, setAktivna] = useState<number | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const karte = q('.podjela__card') as HTMLElement[];
      const natpisi = q('.podjela__label');
      const krug = q('.podjela__circle')[0];
      if (!karte.length) return;

      /*
       * Koliko puta karta mora da naraste da bi popunila svoju polovinu.
       *
       * `max` a ne `min`: karta mora da prekrije polovinu i po sirini i po
       * visini, pa se uzima veci od dva odnosa — manji bi ostavio papir uz
       * jednu ivicu.
       */
      const izmjeri = () => {
        karte.forEach((karta) => {
          const pola = karta.parentElement as HTMLElement;
          /*
           * Karta je u trenutku mjerenja skoro uvijek usred `scale`-a koji je
           * postavio GSAP, pa se izmjerena mjera dijeli tim istim `scale`-om
           * da se dobije ona iz rasporeda.
           *
           * Mjeri se `getBoundingClientRect`, a ne `offsetWidth`: `offset*`
           * vraca cio broj, a karta je 24vw — na sirini 1440 to je 345.6, sto
           * se zaokruzi na 346 i `fill` ispadne za dlaku premali. Rezultat je
           * jedan piksel papira uz rub dok su fotografije preko cijelog kadra.
           *
           * `scale` se cita iz same matrice `transform`-a, ne iz `--fill`:
           * `--fill` je samo zapis onoga sto je izracunato, a ono sto je na
           * karti stvarno primijenjeno u ovom kadru zna jedino matrica.
           */
          const zapis = getComputedStyle(karta).transform;
          const skala = zapis && zapis !== 'none' ? new DOMMatrixReadOnly(zapis).a || 1 : 1;
          const k = karta.getBoundingClientRect();
          const fill = Math.max(
            pola.getBoundingClientRect().width / (k.width / skala),
            pola.getBoundingClientRect().height / (k.height / skala),
          );
          /*
           * Dvije hiljaditine preko mjere.
           *
           * Racun je tacan, ali preglednik `transform` iscrtava na svoju
           * rastersku mrezu, pa karta zna da ispadne dvije stotinke piksela
           * uza od polovine — a to je, uz tamnu fotografiju na papiru, tanka
           * svijetla nit uz rub. Visak je izvan polovine, koja ionako
           * odsijeca, pa se nigdje drugdje ne vidi.
           */
          karta.style.setProperty('--fill', String(fill * 1.002));
        });
      };

      const mm = gsap.matchMedia();

      /* Ko je iskljucio animacije dobija sekciju vec otvorenu, bez pina. */
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(karte, { scale: 1 });
        gsap.set([...natpisi, krug], { opacity: 1, scale: 1 });
        setOtvoreno(true);
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /*
         * Koliko skrola traje skupljanje.
         *
         * Pin traje tacno onoliko koliko je sekcija visa od kadra; skupljanje
         * uzima 62% toga, a ostatak sekcija stoji mirno da se otkriveni
         * raspored vidi prije nego strana krene dalje.
         *
         * Mjeri se funkcijom, ne brojem: `invalidateOnRefresh` je zove iznova
         * na svaku promjenu prozora, pa put prati visinu kadra.
         */
        const putSkupljanja = () => (el.offsetHeight - window.innerHeight) * 0.62;

        izmjeri();
        window.addEventListener('resize', izmjeri);

        gsap.set(natpisi, { opacity: 0 });
        gsap.set(krug, { opacity: 0, scale: 0.72 });

        /*
         * Otkrivanje nije vezano za skrol: kad se skupljanje zavrsi, natpisi i
         * krug dolaze svojim tempom. Zato stoji kao zasebna, pauzirana traka
         * koju drugi okidac pusti — i vrati unazad ako se citalac vrati gore.
         */
        const otkrivanje = gsap.timeline({ paused: true });
        otkrivanje.to(natpisi, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.12,
        });
        otkrivanje.to(
          krug,
          { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.5)' },
          '>-0.15',
        );

        /*
         * Skupljanje: `scale` od pune polovine do jedan, vezano za skrol.
         */
        const skupljanje = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${putSkupljanja()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        skupljanje.fromTo(
          karte,
          { scale: (i, target: HTMLElement) => Number(getComputedStyle(target).getPropertyValue('--fill')) || 1 },
          { scale: 1, duration: 1 },
          0,
        );

        /*
         * Okidac stoji tacno tamo gdje skupljanje stane. Naprijed pusta
         * otkrivanje, nazad ga vraca — pa se sekcija na povratku sklopi isto
         * onako kako se otvorila.
         */
        const okidac = ScrollTrigger.create({
          trigger: el,
          start: () => `top top-=${putSkupljanja()}`,
          invalidateOnRefresh: true,
          onEnter: () => {
            otkrivanje.play();
            setOtvoreno(true);
          },
          onLeaveBack: () => {
            otkrivanje.reverse();
            setOtvoreno(false);
            setAktivna(null);
          },
        });

        return () => {
          window.removeEventListener('resize', izmjeri);
          skupljanje.scrollTrigger?.kill();
          skupljanje.kill();
          okidac.kill();
          otkrivanje.kill();
        };
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [locale]);

  const sorte = [
    { kljuc: 'livadski' as const, slika: 'livadski-livada', tegla: 'livadski-tegla' },
    { kljuc: 'bagremov' as const, slika: 'bagremov-bagrem', tegla: 'bagremov-tegla' },
  ];

  return (
    <section
      ref={root}
      className={`podjela${otvoreno ? ' is-open' : ''}${
        aktivna !== null ? ` is-active-${aktivna}` : ''
      }`}
    >
      <div className="podjela__stage">
        {sorte.map((sorta, i) => {
          const s = t[sorta.kljuc];
          const ikona = IKONE[sorta.kljuc];

          return (
            <div className="podjela__half" key={sorta.kljuc}>
              {/*
                * Karta prima fokus da bi se s tastature vidjelo isto sto i
                * misem. Nije dugme — klik nista ne otvara; na dodir samo
                * prebacuje isti prikaz, pa je `tabIndex` bez uloge tacno ono
                * sto jeste: mjesto koje se moze doseci, a ne radnja.
                */}
              <div
                className="podjela__card"
                tabIndex={0}
                onMouseEnter={() => otvoreno && setAktivna(i)}
                onMouseLeave={() => setAktivna((bila) => (bila === i ? null : bila))}
                onFocus={() => otvoreno && setAktivna(i)}
                onBlur={() => setAktivna((bila) => (bila === i ? null : bila))}
                onClick={() => otvoreno && setAktivna((bila) => (bila === i ? null : i))}
              >
                <Image
                  className="podjela__photo"
                  src={`/images/sorte/${sorta.slika}.webp`}
                  alt={s.photoAlt}
                  width={1200}
                  height={1800}
                  sizes="(orientation: portrait) 100vw, 50vw"
                />

                {/*
                  * Tegla stoji nad fotografijom i ceka na nuli. Ucitava se
                  * odmah, ne na prvi prelaz — inace bi prvi prelaz preko karte
                  * bio bijeli bljesak dok slika stize.
                  */}
                <Image
                  className="podjela__jar"
                  src={`/images/sorte/${sorta.tegla}.webp`}
                  alt={s.jarAlt}
                  width={1200}
                  height={1800}
                  loading="eager"
                  sizes="(orientation: portrait) 100vw, 50vw"
                />

                <p className="podjela__label">
                  {ikona && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className="podjela__icon" src={ikona} alt="" aria-hidden="true" />
                  )}
                  <span className="podjela__label-text">{s.ime}</span>
                </p>
              </div>
            </div>
          );
        })}

        {/*
          * Teglica stoji izmedju polovina, a ne u njima: na prelazu preko karte
          * ostaje netaknuta, pa ne smije da naslijedi ni prigusenje ni pomak
          * bilo koje od dvije.
          *
          * Bila je smedji disk s iscrtkanim prstenom, natpisom i strelicom.
          * Sada je sam crtez teglice — veza je ista, samo se vise ne najavljuje
          * rijecima nego oblikom. Ime odredista zato nosi `aria-label`: crtez
          * ga ne izgovara.
          */}
        <TransitionLink
          className="podjela__circle"
          href={localeHref(locale, '/pcelinjak')}
          aria-label={t.ctaAria}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="podjela__teglica"
            src="/images/brand/teglica.svg"
            alt=""
            aria-hidden="true"
          />
        </TransitionLink>
      </div>
    </section>
  );
}
