import type { Locale } from '@/i18n/config';

const copy = {
  sr: {
    rights: 'Dizajn i izrada zaštićeni autorskim pravom.',
    purpose: 'Za potrebe ličnog portfolija!',
  },
  en: {
    rights: 'Design and development protected by copyright.',
    purpose: 'For personal portfolio use!',
  },
} satisfies Record<Locale, { rights: string; purpose: string }>;

export default function PortfolioWatermark({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const text = copy[locale];

  return (
    <aside className="portfolio-watermark">
      <strong>© {year}</strong>
      <span>{text.rights}</span>
      <span>{text.purpose}</span>
    </aside>
  );
}
