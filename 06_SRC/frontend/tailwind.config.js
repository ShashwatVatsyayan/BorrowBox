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
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488', // PRD Primary
          700: '#0F766E', // PRD Primary Hover
          800: '#115E59',
          900: '#134E4A',
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

