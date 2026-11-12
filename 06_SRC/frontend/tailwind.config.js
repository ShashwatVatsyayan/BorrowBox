/** @type {import('tailwindcss').Config} */
export default {
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
          primary: '#172033',
          muted: '#64748B',
          light: '#94A3B8',
        },
        surface: {
          base: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
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

