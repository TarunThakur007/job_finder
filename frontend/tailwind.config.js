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
        surface: {
          canvas: 'var(--surface-canvas)',
          raised: 'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          sunken: 'var(--surface-sunken)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
        },
        ink: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        brand: {
          primary: '#14B8A6',
          hover: '#0D9488',
          active: '#0F766E',
          foreground: '#FFFFFF',
          mint: '#5EEAD4',
        },
        accent: {
          functional: '#14B8A6',
          subtle: 'rgba(20, 184, 166, 0.12)',
        },
        obsidian: {
          bg: '#090B0F',
          section: '#0D1117',
          card: '#141922',
          hover: '#1A2230',
          border: '#253044',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        dark: {
          950: '#0B0D0E',
          900: '#14171A',
          800: '#1C2024',
          700: '#24292F',
          600: '#383E47',
        },
        gray: {
          500: '#94A3B8',
          600: '#94A3B8',
        }
      },
      borderRadius: {
        'sm': 'var(--radius-sm, 4px)',
        'md': 'var(--radius-md, 6px)',
        'lg': 'var(--radius-lg, 8px)',
        'xl': 'var(--radius-xl, 12px)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
