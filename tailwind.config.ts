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
        display: ['var(--font-newsreader)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['1.875rem', { lineHeight: '1.2' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '0' }],
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      spacing: {
        13: '3.25rem',
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
