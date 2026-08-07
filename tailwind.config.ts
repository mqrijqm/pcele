import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#faf4e8',
        linen: '#f3e8d6',
        sand: '#d8c8b2',
        espresso: '#332a24',
        walnut: '#66594f',
        stone: '#7d6f63',
        bark: '#332a24',
        sage: '#9aa58c',
        charcoal: '#1a1714',
        gold: '#c2882b',
        cream: '#f5efe6',
        honey: {
          DEFAULT: '#b9822c',
          light: '#e8c47f',
          dark: '#82601f',
          50: '#fdf8ee',
          100: '#f6ebd4',
          200: '#dec590',
          300: '#cea85e',
          400: '#c2882b',
          500: '#b9822c',
          600: '#987028',
          700: '#82601f',
          800: '#6a4e1a',
          900: '#523c14',
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
