import type { Metadata } from 'next'
import { SideBar } from './components/sidebar'

export const metadata: Metadata = {
  title: 'Xinglingo',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="bg-[url('/assets/svgs/bg.svg')] h-full p-4 md:p-8 overflow-y-auto ">
      <div className="flex relative flex-row gap-2 sm:gap-4 min-h-full">
        <SideBar />
        {children}
      </div>
    </section>
  )
}
