import { Logo } from '@/components/logo'

type LayoutProps = {
  children: React.ReactNode
}

export default function GetStartedLayout({ children }: LayoutProps) {
  return (
    <>
      <div className="bg-yellow-50 dark:bg-zinc-900 h-full">
        <div className="relative h-full bg-[url('/assets/svgs/bg.svg')] ">
          {children}
          <Logo className="absolute top-4 left-4 md:left-10 md:scale-150" />
        </div>
      </div>
      {/* <BackgroundSound /> */}
    </>
  )
}
