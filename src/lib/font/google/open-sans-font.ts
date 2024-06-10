import { Open_Sans as OpenSans } from 'next/font/google'

const fontSans = OpenSans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sans',
})

export const openSansFont = () => `font-sans ${fontSans.variable}`
