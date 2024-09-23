import { Sidebar } from './sidebar'

import { ChatHistory } from './chat-history'
import { getAuth } from '@/lib/auth/get-auth'

export async function SidebarDesktop() {
  const session = await getAuth()

  if (!session?.user?.id) {
    return null
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      <ChatHistory userId={session.user.id} />
    </Sidebar>
  )
}
