import { VT323 } from 'next/font/google'

const fontSans = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sans',
})

export const pixelatedFont = () => `font-sans ${fontSans.variable}`
