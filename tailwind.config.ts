import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'shadow-drop-2-center': {
          '0%': {
            transform: 'translateZ(0)',
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
          },
          '100%': {
            transform: 'translateZ(50px)',
            boxShadow: '0 0 20px 0px rgba(0, 0, 0, 0.35)',
          },
        },
        'shadow-pop-bl': {
          '0%': {
            transform: 'translateX(0) translateY(0)',
          },
          '100%': {
            transform: 'translateX(6px) translateY(-6px)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shadow-drop-2-center':
          'shadow-drop-2-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'shadow-pop-bl':
          'shadow-pop-bl 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
