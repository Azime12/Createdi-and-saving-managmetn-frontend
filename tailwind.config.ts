import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enables dark mode support
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand-primary)',
          light: 'var(--brand-light)',
          dark: 'var(--brand-dark)',
          contrast: 'var(--brand-contrast)',
          accent: 'var(--brand-accent)', // New color for highlights/buttons
          muted: 'var(--brand-muted)', // Subtle variant for backgrounds
          shades: {
            50: 'var(--brand-50)',
            100: 'var(--brand-100)',
            200: 'var(--brand-200)',
            300: 'var(--brand-300)',
            400: 'var(--brand-400)',
            500: 'var(--brand-500)',
            600: 'var(--brand-600)',
            700: 'var(--brand-700)',
            800: 'var(--brand-800)',
            900: 'var(--brand-900)',
          }
        },
        blue: {
          400: '#3b82f6',
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;
