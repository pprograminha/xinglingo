'use client'

import { Minus, Plus } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible as UICollapsible,
} from '@/components/ui/collapsible'

type CollapsibleProps = {
  children: React.ReactNode
}

export function Collapsible({ children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <UICollapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2 flex flex-col"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="flex gap-2 ml-auto">
          {!isOpen ? (
            <>
              <span>See more</span>
              <Plus className="h-4 w-4" />
            </>
          ) : (
            <Minus className="w-4 h-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      {!isOpen && (
        <div className="relative max-h-[200px] overflow-hidden">
          {children}
          <div className="absolute h-[60px] w-full bottom-0 bg-gradient-to-b from-transparent dark:to-zinc-950"></div>
        </div>
      )}
      <CollapsibleContent>{children}</CollapsibleContent>
    </UICollapsible>
  )
}
