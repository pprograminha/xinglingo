'use client'

import * as React from 'react'

import { useSidebar } from '@/hooks/use-sidebar'
import { Button } from '@/components/ui/button'
import { SidebarIcon } from 'lucide-react'

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      className="-ml-2 hidden size-9 p-0 lg:flex"
      onClick={() => {
        toggleSidebar()
      }}
    >
      <SidebarIcon className="size-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
