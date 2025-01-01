import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config = {
  mode: 'jit',
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
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			amber: {
  				'900': '#723830'
  			},
  			zinc: {
  				'920': '#1b1b1d'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		textShadow: {
  			sm: '0 1px 2px var(--tw-shadow-color)',
  			DEFAULT: '0 2px 4px var(--tw-shadow-color)',
  			md: '0 2px 4px var(--tw-shadow-color)',
  			lg: '0 8px 16px var(--tw-shadow-color)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
                    ...fontFamily.sans
                ]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			float: {
  				'0%': {
  					transform: 'translate(0px, 0px)'
  				},
  				'50%': {
  					transform: 'translate(-10px, -20px)'
  				},
  				'100%': {
  					transform: 'translate(0px, 0px)'
  				}
  			},
  			'music-bar': {
  				'0%': {
  					height: '10%'
  				},
  				'25%': {
  					height: '75%'
  				},
  				'50%': {
  					height: '50%'
  				},
  				'75%': {
  					height: '100%'
  				},
  				'100%': {
  					height: '10%'
  				}
  			},
  			'shadow-drop-2-center': {
  				'0%': {
  					transform: 'translateZ(0)',
  					boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)'
  				},
  				'100%': {
  					transform: 'translateZ(50px)',
  					boxShadow: '0 0 20px 0px rgba(0, 0, 0, 0.35)'
  				}
  			},
  			'shadow-pop-bl': {
  				'0%': {
  					transform: 'translateX(0) translateY(0)'
  				},
  				'100%': {
  					transform: 'translateX(6px) translateY(-6px)'
  				}
  			}
  		},
  		animation: {
  			'music-bar': 'music-bar 1s ease-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			float: 'float 6s ease-in-out infinite',
  			'shadow-drop-2-center': 'shadow-drop-2-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
  			'shadow-pop-bl': 'shadow-pop-bl 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
  		}
  	}
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('@kamona/tailwindcss-perspective'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      )
    }),
  ],
} satisfies Config

export default config
