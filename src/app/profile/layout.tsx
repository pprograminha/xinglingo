import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetOverlay, SheetTrigger } from '@/components/ui/sheet'
import { AlignJustify } from 'lucide-react'
import type { Metadata } from 'next'
import { SideBar } from './components/sidebar'

export const metadata: Metadata = {
  title: 'LingoAI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="h-screen flex relative">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className='lg:hidden bg-transparent dark:bg-transparent border-0 absolute z-20 top-5 left-5'>
            <AlignJustify className='w-5' />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] flex flex-col h-full border-r-1 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 lg:hidden" side="left">
          <SideBar />
        </SheetContent>
      </Sheet>
      <SideBar className='hidden lg:flex ' />
      {children}
    </section>
  )
}
