/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50, #F2F8F5)',
          100: 'var(--color-brand-100, #E1EFEA)',
          200: 'var(--color-brand-200, #C2DFD4)',
          300: 'var(--color-brand-300, #93C4B2)',
          400: 'var(--color-brand-400, #4B9B80)',
          500: 'var(--color-brand-500, #1B5E46)',
          600: 'var(--color-brand-600, #0F382A)', // Signature Deep Emerald
          700: 'var(--color-brand-700, #0B2C21)',
          800: 'var(--color-brand-800, #082119)',
          900: 'var(--color-brand-900, #051711)',
          950: 'var(--color-brand-950, #020C09)',
        },
        gold: {
          300: '#F3DC99',
          400: '#E5C378',
          500: '#D4A853', // Signature Champagne Gold
          600: '#B88B38',
          700: '#946D25',
        },
        ink: {
          primary: 'var(--color-ink-primary, #172033)',
          muted: 'var(--color-ink-muted, #64748B)',
          light: 'var(--color-ink-light, #94A3B8)',
        },
        surface: {
          base: 'var(--color-surface-base, #F8FAFC)',
          card: 'var(--color-surface-card, #FFFFFF)',
          border: 'var(--color-surface-border, #E2E8F0)',
        },
        state: {
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
