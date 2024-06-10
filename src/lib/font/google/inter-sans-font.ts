import { Inter } from 'next/font/google'

const fontSans = Inter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sans',
})

export const interSansFont = () => `font-sans ${fontSans.variable}`
