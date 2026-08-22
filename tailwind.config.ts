import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta 60 / 30 / 10 — ocitana sa deklaracije
        paper: '#FDF9DC',
        brown: '#73552E',
        gold: '#C79A3B',

        // Stara imena mapirana na paletu
        ivory: '#FDF9DC',
        cream: '#FDF9DC',
        linen: '#FDF9DC',
        sand: '#FDF9DC',
        espresso: '#73552E',
        walnut: '#73552E',
        stone: '#73552E',
        bark: '#73552E',
        charcoal: '#73552E',
        sage: '#73552E',
        honey: {
          DEFAULT: '#C79A3B',
          light: '#C79A3B',
          dark: '#73552E',
          50: '#FDF9DC',
          100: '#FDF9DC',
          200: '#C79A3B',
          300: '#C79A3B',
          400: '#C79A3B',
          500: '#C79A3B',
          600: '#C79A3B',
          700: '#73552E',
          800: '#73552E',
          900: '#73552E',
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
        'display-md': ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
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
