import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta — samo ovih 6 tonova
        paper: '#FFF7E6',
        cream: '#F6EEDB',
        yellow: '#F3D46A',
        gold: '#C89B3C',
        brown: '#8A5A2B',
        sage: '#7A8A6B',

        // Stara imena mapirana na paletu
        ivory: '#FFF7E6',
        linen: '#F6EEDB',
        sand: '#F6EEDB',
        espresso: '#8A5A2B',
        walnut: '#8A5A2B',
        stone: '#8A5A2B',
        bark: '#8A5A2B',
        charcoal: '#8A5A2B',
        honey: {
          DEFAULT: '#C89B3C',
          light: '#F3D46A',
          dark: '#8A5A2B',
          50: '#FFF7E6',
          100: '#F6EEDB',
          200: '#F3D46A',
          300: '#F3D46A',
          400: '#C89B3C',
          500: '#C89B3C',
          600: '#C89B3C',
          700: '#8A5A2B',
          800: '#8A5A2B',
          900: '#8A5A2B',
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
