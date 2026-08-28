import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta 60 / 30 / 10 — ocitana sa deklaracije
        paper: '#FCF0DC',
        brown: '#885B27',
        gold: '#EEC660',

        // Stara imena mapirana na paletu
        ivory: 'var(--paper)',
        cream: 'var(--paper)',
        linen: 'var(--paper)',
        sand: 'var(--paper)',
        espresso: '#885B27',
        walnut: '#885B27',
        stone: '#885B27',
        bark: '#885B27',
        charcoal: '#885B27',
        sage: '#885B27',
        honey: {
          DEFAULT: '#EEC660',
          light: '#EEC660',
          dark: '#885B27',
          50: '#FCF0DC',
          100: '#FCF0DC',
          200: '#EEC660',
          300: '#EEC660',
          400: '#EEC660',
          500: '#EEC660',
          600: '#EEC660',
          700: '#885B27',
          800: '#885B27',
          900: '#885B27',
        },
      },
      fontFamily: {
        // Gazpacho — samo krupna tipografija. Vidi pravilo u globals.css.
        display: ['var(--font-gazpacho)', 'Georgia', 'serif'],
        body: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display skala je fluidna — raste sa sirinom ekrana, bez skokova.
        'display-sm': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        // Naslov sekcije. Ista mjera koju nose i naslovi pisani u globals.css.
        'display-md': ['var(--type-heading)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-xl': ['clamp(3.5rem, 12vw, 9.5rem)', { lineHeight: '0.92', letterSpacing: '-0.045em' }],
      },
      spacing: {
        13: '3.25rem',
        // Vertikalni ritam sekcija — namerno velik.
        section: 'clamp(7rem, 14vw, 13rem)',
        'section-sm': 'clamp(4.5rem, 9vw, 8rem)',
        gutter: 'clamp(1.5rem, 5vw, 5rem)',
      },
      maxWidth: {
        measure: '62ch',
      },
      borderRadius: {
        soft: '1.25rem',
        card: '2rem',
        arch: '3rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
