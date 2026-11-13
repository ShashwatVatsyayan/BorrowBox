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
          50: 'var(--color-brand-50, #FFF7ED)',
          100: 'var(--color-brand-100, #FFEDD5)',
          200: 'var(--color-brand-200, #FED7AA)',
          300: 'var(--color-brand-300, #FDBA74)',
          400: 'var(--color-brand-400, #FB923C)',
          500: 'var(--color-brand-500, #F97316)',
          600: 'var(--color-brand-600, #EA580C)', // Vibrant Orange Highlight
          700: 'var(--color-brand-700, #C2410C)',
          800: 'var(--color-brand-800, #9A3412)',
          900: 'var(--color-brand-900, #7C2D12)',
          950: 'var(--color-brand-950, #431407)',
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
