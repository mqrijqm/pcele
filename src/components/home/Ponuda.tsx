'use client';

import Image from 'next/image';
import { useState } from 'react';

import { home } from '@/content/pages';
import { products } from '@/data/products';
import type { Locale } from '@/i18n/config';

/**
 * Dvije mjere livadskog meda, po redu kojim stoje u izborniku.
 *
 * Cijene se ne pisu ovdje. Uzimaju se iz kataloga po `slug`-u, iz istog izvora
 * iz kojeg ih cita i webshop — da se broj na ovoj sekciji ne moze razici sa
 * brojem u korpi.
 */
const MJERE = ['livadski-med-500g', 'livadski-med-1kg'] as const;

/**
 * Ponuda: jedna tegla i njena mjera.
 *
 * Sekcija stoji na medenoj plohi, izmedju crteza pcelinjaka i propolisa: prvo
 * se vidi odakle med dolazi, pa sta iz toga izlazi, pa tek onda ostalo iz
 * kosnice.
 *
 * **Dvije kolone.** Lijevo tegla, iza nje crtez kamilice u krugu; desno sve
 * sto se cita. Crtez i krug su jedan fajl (`cvijet-krug.svg`) i stoje samo uz
 * teglu — nikad iza sloga, jer bi linija crteza prosla kroz slova.
 *
 * **Slog.** Ono sto se cita ide u serif kojim je pisan cio sajt: ime, podnaslov,
 * tekst, cijene. U sans ostaje ono sto se ne cita nego ocitava — nadnaslov i
 * oznake cinjenica.
 *
 * **Boje.** Na medenoj plohi nema ni bijelog ni kremastog sloga: ime je u
 * mastilu, sve ostalo u tamnijem tonu istog mastila. Krem se pojavljuje jedino
 * kao slog na izabranoj mjeri i na pecatu, i kao ploha kruga iza tegle.
 *
 * **Sekcija nista ne prodaje.** Ovdje stoje samo tegla, njene mjere i cijene;
 * kupovina je na strani proizvoda. Zato ovdje nema ni dugmeta ni veze sa
 * korpom — izbor mjere je prikaz, ne radnja.
 */
export default function Ponuda({ locale }: { locale: Locale }) {
  const t = home.ponuda[locale];

  /* Veca mjera je unaprijed izabrana. */
  const [izabrana, setIzabrana] = useState(1);

  const stavke = MJERE.map((slug) => {
    const proizvod = products.find((p) => p.slug === slug)!;
    return { proizvod, varijanta: proizvod.variants[0] };
  });

  return (
    <section className="ponuda">
      <div className="ponuda__inner">
        {/* --- lijevo: tegla, iza nje krug s kamilicom --- */}
        <div className="ponuda__shot">
          {/*
            Krug i crtez su ukras i ne nose znacenje, pa nose `aria-hidden`:
            ono sto tegla jeste vec pise u njenom opisu i u imenu pored nje.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ponuda__cvijet"
            src="/images/brand/cvijet-krug.svg"
            alt=""
            aria-hidden="true"
          />

          <Image
            className="ponuda__tegla"
            src="/hero/jar.webp"
            alt={t.teglaAlt}
            width={407}
            height={612}
            sizes="(max-width: 900px) 62vw, 26vw"
          />

          {/* Pecat je znacka uz teglu — stoji kao oznaka, nista ne otvara. */}
          <span className="ponuda__pecat" aria-hidden="true">
            {t.pecat}
          </span>
        </div>

        {/* --- desno: sve sto se cita --- */}
        <div className="ponuda__copy">
          <p className="ponuda__eyebrow">{t.eyebrow}</p>

          <h2 className="ponuda__ime">{t.ime}</h2>

          <p className="ponuda__podnaslov">{t.podnaslov}</p>

          <dl className="ponuda__cinjenice">
            {t.cinjenice.map((c) => (
              <div key={c.oznaka}>
                <dt>{c.oznaka}</dt>
                <dd>{c.vrijednost}</dd>
              </div>
            ))}
          </dl>

          <p className="ponuda__tekst">{t.tekst}</p>

          {/*
            Dvije mjere, obje vidljive odjednom — ne padajuci izbornik.
            `aria-pressed` govori citacu ekrana koja je izabrana.
          */}
          <div className="ponuda__mjere">
            {stavke.map((s, i) => (
              <button
                key={s.proizvod.slug}
                type="button"
                className={`ponuda__mjera${i === izabrana ? ' is-selected' : ''}`}
                aria-pressed={i === izabrana}
                onClick={() => setIzabrana(i)}
              >
                {s.varijanta.title} — {s.varijanta.price} KM
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
