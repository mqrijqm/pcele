import Link from 'next/link';

import type { LegalDoc } from '@/data/legal';
import { localeHref, type Locale } from '@/i18n/config';

export default function LegalPage({
  locale,
  doc,
  eyebrow,
  title,
  subtitle,
}: {
  locale: Locale;
  doc: LegalDoc;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="pt-20">
      <section className="relative overflow-hidden bg-linen py-20 md:py-28">
        <div className="container relative z-10 text-center">
          <div className="reveal stagger-1 divider mx-auto mb-6" />
          <span className="reveal stagger-1 mb-4 inline-block text-xs font-medium uppercase tracking-[0.3em] text-[#8A5A2B]">
            {eyebrow}
          </span>
          <h1 className="reveal stagger-2 font-display text-display-md text-[#8A5A2B]">{title}</h1>
          <p className="reveal stagger-3 mx-auto mt-4 max-w-lg text-lg leading-relaxed text-[#8A5A2B]/80">
            {subtitle}
          </p>
          <p className="reveal stagger-4 mt-6 text-xs uppercase tracking-wider text-[#8A5A2B]/70">
            {doc.effective}
          </p>
        </div>
      </section>

      <section className="section-padding bg-[#FFF7E6]">
        <div className="container">
          <div className="mx-auto max-w-prose">
            {doc.sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="mb-10 scroll-mt-28 border-b border-[#8A5A2B]/15 pb-10 last:mb-0 last:border-b-0 last:pb-0"
              >
                <h2 className="font-display text-2xl text-[#8A5A2B]">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-[#8A5A2B]/80">
                  {section.blocks.map((block, index) =>
                    block.t === 'p' ? (
                      <p key={index}>{block.text}</p>
                    ) : (
                      <ul key={index} className="list-disc space-y-2 pl-5 marker:text-[#C89B3C]">
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              </div>
            ))}

            <p className="mt-12 border-t border-[#8A5A2B]/15 pt-8 text-sm text-[#8A5A2B]/80">
              {locale === 'sr' ? 'Imate dodatnih pitanja? Posjetite našu ' : 'Have more questions? Visit our '}
              <Link
                href={localeHref(locale, '/contact')}
                className="border-b border-[#C89B3C] text-honey-700 transition-colors hover:text-[#8A5A2B]"
              >
                {locale === 'sr' ? 'kontakt stranicu' : 'contact page'}
              </Link>
              {locale === 'sr' ? ' ili nam pišite na ' : ' or write to us at '}
              <a
                href="mailto:info@pcelarstvo-jevtic.ba"
                className="border-b border-[#C89B3C] text-honey-700 transition-colors hover:text-[#8A5A2B]"
              >
                info@pcelarstvo-jevtic.ba
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
