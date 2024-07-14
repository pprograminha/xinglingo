import { Logo } from '@/components/logo'
import { LogOut } from '@/components/logout'
import { Channels } from '../components/channels'

export default async function WrapperBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="h-screen flex flex-row">
      <Channels />

      <div className="flex flex-col h-full w-full">
        <div className="bg-zinc-900 h-16 w-full flex justify-between items-center px-4">
          <Logo />

          <LogOut />
        </div>
        {children}
      </div>
    </main>
  )
}
