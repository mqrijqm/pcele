'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { home } from '@/content/pages';
import type { Locale } from '@/i18n/config';

export default function Faq({ locale }: { locale: Locale }) {
  const copy = home.faq[locale];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#8A5A2B]/[0.06] py-24 lg:py-32">
      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.36fr_0.64fr] lg:items-start lg:gap-20">
          <div className="reveal">
            <span className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-honey-700">
              <span className="h-px w-9 bg-[#C89B3C]" aria-hidden="true" />
              {copy.eyebrow}
            </span>
            <h2 className="font-display text-4xl font-medium leading-[1.06] tracking-[-0.04em] text-[#8A5A2B] sm:text-5xl">
              {copy.heading}
            </h2>
            <p className="mt-8 max-w-sm border-t border-[#8A5A2B]/20 pt-6 text-sm leading-7 text-[#8A5A2B]/80">
              {copy.intro}
            </p>
          </div>

          <div className="reveal stagger-1 border-t border-[#8A5A2B]/20">
            {copy.items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.question} className="border-b border-[#8A5A2B]/20">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="group flex w-full items-start justify-between gap-5 py-7 text-left sm:py-9"
                  >
                    <span className="flex gap-4 sm:gap-7">
                      <span className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-honey-700">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-xl font-medium leading-tight text-[#8A5A2B] transition-colors group-hover:text-[#8A5A2B]/70 lg:text-2xl">
                        {item.question}
                      </span>
                    </span>
                    <ChevronDown
                      className={`mt-1 h-5 w-5 shrink-0 text-[#8A5A2B] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{ maxHeight: isOpen ? 220 : 0, opacity: isOpen ? 1 : 0 }}
                  >
                    <p className="max-w-2xl pb-8 pl-10 text-base leading-relaxed text-[#8A5A2B]/80 sm:pl-[4.25rem]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
