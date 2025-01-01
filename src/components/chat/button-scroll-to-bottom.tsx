'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { ArrowDownIcon } from 'lucide-react'

interface ButtonScrollToBottomProps extends ButtonProps {
  scrollToBottom: () => void
}

export function ButtonScrollToBottom({
  className,
  scrollToBottom,
  ...props
}: ButtonScrollToBottomProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn('top-1 z-10 transition-opacity duration-300', className)}
      onClick={() => scrollToBottom()}
      {...props}
    >
      <ArrowDownIcon className="w-4" />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  )
}
