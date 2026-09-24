'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Snimak preko cijelog ekrana, sa malim krugom u sredini.
 *
 * Krug stoji u sredini sekcije i vodi na ono sto je ispod — isti posao koji
 * nosi i referentna strana. Snimak se ne pomjera, samo se lagano umanji dok
 * sekcija ulazi, pa se dobija dubina bez ijednog dodatnog sloja.
 */
export default function FullBleed({
  image,
  label,
  cta,
  href,
}: {
  image: string;
  label: string;
  cta: string;
  href: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const zoom = el.querySelector('.pe-banner__zoom');
      if (!zoom) return;

      const tween = gsap.fromTo(
        zoom,
        { scale: 1.12 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    mm.add('(min-width: 768px)', () => {
      const seal = el.querySelector<HTMLElement>('.pe-banner__cta');
      /*
       * Granica na kojoj se pečat zaustavlja: kontakt sekcija na dnu strane
       * (nosi `data-seal-stop`), a ako je nema, footer. Bez ovoga bi pečat
       * lebdio preko polja forme i dugmeta za slanje.
       */
      const footer =
        document.querySelector<HTMLElement>('[data-seal-stop]') ??
        document.querySelector<HTMLElement>('.stopa');
      if (!seal || !footer) return;

      const showSticky = () => {
        seal.classList.add('is-sticky');
        gsap.killTweensOf(seal);
        gsap.to(seal, { autoAlpha: 1, duration: 0.28, ease: 'power2.out' });
      };

      /*
       * Kad footer uđe u kadar, pečat više nije samo fixed: njegov donji rub
       * prati gornji rub footera. Tako izgleda kao da se zaustavio tačno prije
       * footera, umjesto da ga preleti ili naglo nestane.
       */
      const followFooterBoundary = () => {
        if (!seal.classList.contains('is-sticky')) return;
        const bottom = Number.parseFloat(getComputedStyle(seal).bottom) || 0;
        const fixedTop = window.innerHeight - bottom - seal.offsetHeight;
        const footerTop = footer.getBoundingClientRect().top;
        const y = Math.min(0, footerTop - fixedTop - seal.offsetHeight);
        gsap.set(seal, { y });
      };

      const hideAfterFooter = () => {
        gsap.killTweensOf(seal);
        gsap.to(seal, { autoAlpha: 0, duration: 0.22, ease: 'power2.out' });
      };

      const restoreToBanner = () => {
        gsap.killTweensOf(seal);
        gsap.set(seal, { autoAlpha: 1, y: 0 });
        seal.classList.remove('is-sticky');
      };

      const sticky = ScrollTrigger.create({
        trigger: el,
        start: 'bottom bottom',
        endTrigger: footer,
        end: 'bottom top',
        invalidateOnRefresh: true,
        /*
         * Granica (kontakt sekcija) stoji ISPOD prikvačenih sekcija ("Nas med",
         * "Zasto nas med"), koje dodaju svoj razmak tek kad se i one postave.
         * Okidac koji se prvi preracuna (a ovaj je najraniji na strani) bi granicu
         * mjerio bez tog razmaka i pecat bi nestao ~1000px prerano. Nizi prioritet
         * znaci: preracunaj me tek poslije svih ostalih.
         */
        refreshPriority: -1,
        onEnter: () => {
          showSticky();
          followFooterBoundary();
        },
        onEnterBack: () => {
          showSticky();
          followFooterBoundary();
        },
        onUpdate: followFooterBoundary,
        onRefresh: followFooterBoundary,
        onLeave: hideAfterFooter,
        onLeaveBack: restoreToBanner,
      });

      return () => {
        sticky.kill();
        gsap.killTweensOf(seal);
        gsap.set(seal, { clearProps: 'opacity,visibility,transform' });
        seal.classList.remove('is-sticky');
      };
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <section data-snap="off" className="pe-banner" ref={root}>
      <div className="pe-banner__frame">
        <div className="pe-banner__zoom">
          <Image
            src={image}
            alt={label}
            fill
            priority
            sizes="100vw"
            className="pe-banner__image"
          />
        </div>
      </div>

      <a className="brand-cta brand-cta--seal pe-banner__cta" href={href} aria-label={cta}>
        <Image
          src="/images/brand/pecat-okusi-tamni.svg"
          alt=""
          aria-hidden="true"
          width={421}
          height={414}
          className="brand-cta__art pe-banner__cta-art"
        />
      </a>
    </section>
  );
}
