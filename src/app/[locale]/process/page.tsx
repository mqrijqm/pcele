import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import TransitionLink from '@/components/ui/TransitionLink';
import BeeFlight from '@/components/bee/BeeFlight';
import Hero from '@/components/pcelinjak/Hero';
import Rail from '@/components/pcelinjak/Rail';
import Motion from '@/components/pcelinjak/Motion';
import Kraj from '@/components/pcelinjak/Kraj';
import Koraci from '@/components/pcelinjak/Koraci';
import ImagePlaceholder from '@/components/pcelinjak/ImagePlaceholder';
import { meta } from '@/content/pages';
import { processView } from '@/content/process';
import { isLocale, localeHref, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : 'sr';
  return { title: meta[l].process.title, description: meta[l].process.description };
}

/**
 * Nas proces.
 *
 * Isti raspored kao strana o pcelinjacima (vidi `pcelinjak/page.tsx`): heroj
 * sa slikom koja se skrolom siri, natpis lijevo i naslov desno, mreza od 24
 * kolona, traka slika koja se lista u stranu i zavrsna kartica koja se ispise
 * dok strana stoji. Mjere i animacije dolaze iz `pcelinjak.css`.
 *
 *   heroj -> uvod -> pet koraka (prvi stoji, ostali kliznu udesno) ->
 *   umetak o ramovima -> traka slika -> zavrsna kartica
 */
export default async function ProcessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = processView[locale];

  return (
    <div className="pcl header-offset">
      <BeeFlight />
      <Motion />

      {/* --- heroj ------------------------------------------------------ */}
      <Hero
        rijeci={t.hero.title}
        caption={t.hero.caption}
        slikaAlt={t.hero.slikaAlt}
        slika={t.hero.slika}
        svijetla
      />

      {/* --- natpis lijevo, naslov desno, pa uvodni pasus --------------- */}
      <section className="pcl-strip pcl-mb-md">
        <div className="pcl-cols pcl-cols--7-17">
          <p className="pcl-pretitle pcl-in">{t.uvod.pretitle}</p>
          <h2 className="pcl-display pcl-display--2 pcl-in">
            {t.uvod.title.map((r, i) => (
              <span className="pcl-display__word" key={`${r}-${i}`}>
                <span>{r}</span>
              </span>
            ))}
          </h2>
        </div>
      </section>

      <section className="pcl-strip pcl-mb-lg">
        <div className="pcl-cols pcl-cols--8-16">
          <div aria-hidden="true" />
          <p className="pcl-body pcl-in">{t.uvod.lead}</p>
        </div>
      </section>

      {/*
        Pet koraka u jednom kadru: prvi stoji, ostali kliznu sdesna dok se
        strana skrola. Cio korak stane u ekran — vidi `Koraci.tsx`.
      */}
      <section className="pcl-mb-lg">
        <Koraci koraci={t.koraci} />
      </section>

      {/* --- umetak: ramove pravimo sami, pa traka iz radionice ---------- */}
      <section className="pcl-strip pcl-mt-lg pcl-mb-md">
        <div className="pcl-cols pcl-cols--7-17">
          <p className="pcl-pretitle pcl-in">{t.ramovi.pretitle}</p>
          <h2 className="pcl-display pcl-display--2 pcl-in">
            {t.ramovi.title.map((r, i) => (
              <span className="pcl-display__word" key={`${r}-${i}`}>
                <span>{r}</span>
              </span>
            ))}
          </h2>
        </div>
      </section>

      <section className="pcl-strip pcl-mb-md">
        <div className="pcl-cols pcl-cols--8-16">
          <div aria-hidden="true" />
          <p className="pcl-body pcl-in">{t.ramovi.body}</p>
        </div>
      </section>

      <section className="pcl-strip pcl-strip--wide pcl-mb-lg pcl-in">
        <Rail
          slike={t.galerija}
          aria={locale === 'sr' ? 'Slike iz radionice' : 'Pictures from the workshop'}
        />
      </section>

      {/* --- zavrsna kartica: strana stane dok se ne ispise ------------- */}
      <section className="pcl-strip pcl-strip--wide">
        <Kraj>
          <div className="pcl-next pcl-next--dark">
            <div className="pcl-next__bg">
              <Image
                src={t.kraj.pozadina.src}
                alt={t.kraj.pozadina.alt}
                fill
                sizes="100vw"
                className="pcl-next__bgImg"
              />
            </div>

            <div className="pcl-next__card">
              <p className="pcl-next__counter" data-ulaz>
                <span>01</span>
                <span className="pcl-next__total">0{t.kraj.dalje.length}</span>
              </p>
              <h2 className="pcl-next__title" data-ulaz>
                {t.kraj.title}
              </h2>
              <div className="pcl-next__media" data-ulaz>
                <ImagePlaceholder
                  ratio={2}
                  label="2:1"
                  alt={t.kraj.slika.alt}
                  src={t.kraj.slika.src}
                  sizes="(max-width: 767px) 80vw, 28rem"
                />
              </div>
              <span data-ulaz>
                <TransitionLink
                  className="pcl-next__link"
                  href={localeHref(locale, t.kraj.dalje[0].href)}
                >
                  {t.kraj.link}
                </TransitionLink>
              </span>
            </div>

            <nav className="pcl-next__rail" data-ulaz>
              {t.kraj.dalje.map((d, i) => (
                <TransitionLink
                  key={d.key}
                  className="pcl-next__railLink"
                  href={localeHref(locale, d.href)}
                  aria-current={i === 0 ? 'true' : undefined}
                >
                  {d.title}
                </TransitionLink>
              ))}
            </nav>
          </div>
        </Kraj>
      </section>
    </div>
  );
}
