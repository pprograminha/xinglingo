import { SideBar } from '../../../(group-profile-routes)/profile/components/sidebar'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="h-screen flex flex-row p-4 gap-4">
      <SideBar />

      <div className="flex flex-col h-full w-full">
        <div className="mx-auto min-h-full bg-white dark:bg-zinc-900 md:border md:pb-0 pb-20 md:border-zinc-200  md:dark:border-zinc-800 w-full shadow-xl rounded-xl ">
          <div className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover min-h-full h-full rounded-xl overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
