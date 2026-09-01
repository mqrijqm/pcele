import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import TransitionLink from "@/components/ui/TransitionLink";
import BeeFlight from "@/components/bee/BeeFlight";
import Hero from "@/components/pcelinjak/Hero";
import Rail from "@/components/pcelinjak/Rail";
import Pase from "@/components/pcelinjak/Pase";
import Motion from "@/components/pcelinjak/Motion";
import Kraj from "@/components/pcelinjak/Kraj";
import ImagePlaceholder from "@/components/pcelinjak/ImagePlaceholder";
import { pcelinjak } from "@/content/pcelinjak";
import { isLocale, localeHref, type Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "sr";
  return {
    title: pcelinjak[l].meta.title,
    description: pcelinjak[l].meta.description,
  };
}

/**
 * Nasi pcelinjaci.
 *
 * Raspored je preuzet sa moncalisse.com/en/vineyards i to ne po sjecanju nego
 * po mjerenju: strana je snimljena Playwrightom na 1440, 1024 i 390 px, pa su
 * iz izracunatih stilova izvuceni mreza, ritam, tipografska skala i kutije
 * slika. Sve brojke i snimci stoje u `.ref/moncalisse/`.
 *
 * Redoslijed traka je isti kao tamo:
 *
 *   heroj sa slikom koja se siri -> natpis i naslov -> uvodni pasus ->
 *   traka slika -> pasus u dva stupca -> stara parcela -> sorte ->
 *   ploca koja prolazi u stranu -> panorama -> kartice na kraju
 *
 * Dvije izmjene, obje trazene: slike su siva mjesta sa upisanim omjerom, i
 * sav slog ide nasim serifom. Mjere su ostale uzorove.
 *
 * Nijedna rijec nije odande — tekst je nas i privremen, pisan da po duzini
 * odgovara bloku koji zamjenjuje. Vidi TODO copy u `content/pcelinjak.ts`.
 */
export default async function PcelinjakPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = pcelinjak[locale];

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
      />

      {/* --- natpis lijevo, naslov desno: sedam pa sedamnaest kolona ---- */}
      <section className="pcl-strip pcl-mb-md">
        <div className="pcl-cols pcl-cols--7-17">
          <p className="pcl-pretitle pcl-in">{t.uvod.pretitle}</p>
          <h2 className="pcl-display pcl-display--2 pcl-in">
            {t.uvod.title.map((r) => (
              <span className="pcl-display__word" key={r}>
                <span>{r}</span>
              </span>
            ))}
          </h2>
        </div>
      </section>

      {/* --- uvodni pasus u desnom stupcu: osam pa sesnaest ------------- */}
      <section className="pcl-strip pcl-mb-md">
        <div className="pcl-cols pcl-cols--8-16">
          <div aria-hidden="true" />
          <p className="pcl-body pcl-in">{t.uvod.lead}</p>
        </div>
      </section>

      {/*
        Traka slika. Preko cijele mjere, uvucena s lijeva i prelivena preko
        desne ivice — kao na uzoru, gdje niz namjerno izlazi iz sadrzaja.
      */}
      <section className="pcl-strip pcl-strip--wide pcl-mb-md pcl-in">
        <Rail
          slike={t.galerija}
          aria={
            locale === "sr" ? "Slike sa pčelinjaka" : "Pictures from the apiary"
          }
        />
      </section>

      {/* --- pasus koji se lomi u dva stupca ---------------------------- */}
      <section className="pcl-strip pcl-mb-lg">
        <div className="pcl-cols pcl-cols--8-16">
          <div aria-hidden="true" />
          <p className="pcl-body pcl-body--2col pcl-in">{t.tlo}</p>
        </div>
      </section>

      {/*
        Stara parcela: naslov, dugi pasus i uspravna slika u tri stupca
        (sedam / devet / osam). Slika je uza od svog stupca po mjeri, ali je
        na uzoru uvecana preko njega — otud `pcl-ph--zoom`, koji je i vraca na
        svoje kad udje u kadar.
      */}
      <section className="pcl-strip pcl-mt-lg pcl-mb-lg">
        <div className="pcl-cols pcl-cols--7-9-8">
          <h2 className="pcl-display pcl-display--2 pcl-in">
            {t.parcela.title.map((r) => (
              <span className="pcl-display__word" key={r}>
                <span>{r}</span>
              </span>
            ))}
          </h2>
          <p className="pcl-body pcl-in">{t.parcela.body}</p>
          <div>
            <ImagePlaceholder
              ratio={0.667}
              label="2:3"
              alt={t.parcela.slikaAlt}
              src={t.parcela.slika}
              sizes="(max-width: 767px) 90vw, 30vw"
              zoom
            />
          </div>
        </div>
      </section>

      {/* --- natpis i naslov iznad izbornika, u uskoj traci ------------- */}
      <section className="pcl-strip pcl-strip--narrow pcl-mb-md pcl-center">
        <p className="pcl-pretitle pcl-in">{t.pase.pretitle}</p>
        <h2 className="pcl-display pcl-display--2 pcl-in">
          {t.pase.title.map((r) => (
            <span className="pcl-display__word" key={r}>
              <span>{r}</span>
            </span>
          ))}
        </h2>
      </section>

      {/* --- sorte i ploca koja prolazi u stranu ------------------------ */}
      <Pase
        lista={t.pase.lista}
        tabelaAria={locale === "sr" ? "Podaci o paši" : "Forage data"}
        kvadratAlt={t.hscroll.kvadratAlt}
        kvadrat={t.hscroll.kvadrat}
        kolone={t.hscroll.kolone}
      />

      {/*
        Ploca pred krajem strane.
        
        Bila je siroka traka 1.84:1; snimak koji je dosao na to mjesto je
        uspravan, i isjecen na tu mjeru ostala bi od njega kriska bez korpe.
        Zato je kutija uspravna i po sredini — plocica, ne panorama.
      */}
      <section className="pcl-strip pcl-panorama pcl-mb-lg">
        <ImagePlaceholder
          ratio={0.75}
          label="3:4"
          alt={t.panorama.alt}
          src={t.panorama.src}
          sizes="(max-width: 767px) 90vw, 32rem"
          zoom
        />
      </section>

      {/*
        Kartice na kraju. Strana ovdje stane i karta se ispise dio po dio —
        brojac, naslov, snimak, tekst, veza, pa red imena — pa tek onda pusta
        dalje u podnozje.
      */}
      <section className="pcl-strip pcl-strip--wide">
        <Kraj>
          <div className="pcl-next">
            <div className="pcl-next__bg">
              <Image
                src={t.pozadina.src}
                alt={t.pozadina.alt}
                fill
                sizes="100vw"
                className="pcl-next__bgImg"
              />
            </div>

            {/* Prva kartica stoji otvorena; ostale su u redu ispod slike. */}
            <div className="pcl-next__card">
              <p className="pcl-next__counter" data-ulaz>
                <span>01</span>
                <span className="pcl-next__total">0{t.dalje.length}</span>
              </p>
              <h2 className="pcl-next__title" data-ulaz>
                {t.dalje[0].title}
              </h2>
              <div className="pcl-next__media" data-ulaz>
                <ImagePlaceholder
                  ratio={2}
                  label="2:1"
                  alt={t.dalje[0].alt}
                  src={t.dalje[0].src}
                  sizes="(max-width: 767px) 80vw, 28rem"
                />
              </div>
              <p className="pcl-body pcl-next__text" data-ulaz>
                {t.dalje[0].body}
              </p>
              <span data-ulaz>
                <TransitionLink
                  className="pcl-next__link"
                  href={localeHref(locale, t.dalje[0].href)}
                >
                  {t.dalje[0].link}
                </TransitionLink>
              </span>
            </div>

            <nav className="pcl-next__rail" data-ulaz>
              {t.dalje.map((d, i) => (
                <TransitionLink
                  key={d.key}
                  className="pcl-next__railLink"
                  href={localeHref(locale, d.href)}
                  aria-current={i === 0 ? "true" : undefined}
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
