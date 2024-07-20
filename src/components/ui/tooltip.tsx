'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { createContext } from 'react'

const TooltipProvider = TooltipPrimitive.Provider

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn('fill-zinc-900 dark:fill-zinc-900', className)}
    {...props}
  />
))

TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName

type TooltipTriggerContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const TooltipTriggerContext = createContext<TooltipTriggerContextType>({
  open: false,
  setOpen: () => {}, // eslint-disable-line
})

const Tooltip: React.FC<TooltipPrimitive.TooltipProps> = ({
  children,
  ...props
}) => {
  const [open, setOpen] = React.useState<boolean>(props.defaultOpen ?? false)

  const isMd = useBreakpoint('md')

  return (
    <TooltipPrimitive.Root
      delayDuration={isMd ? props.delayDuration : 0}
      onOpenChange={(e) => {
        setOpen(e)
      }}
      open={open}
      {...props}
    >
      <TooltipTriggerContext.Provider value={{ open, setOpen }}>
        {children}
      </TooltipTriggerContext.Provider>
    </TooltipPrimitive.Root>
  )
}
// eslint-disable-next-line react/display-name
const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> & {
    ignorePrevent?: boolean
  }
>(({ children, ignorePrevent = false, ...props }, ref) => {
  const isMd = useBreakpoint('md')
  const { setOpen } = React.useContext(TooltipTriggerContext)

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      {...props}
      onClick={(e) => {
        if (!ignorePrevent) !isMd && e.preventDefault()

        setOpen(true)
      }}
    >
      {children}
    </TooltipPrimitive.Trigger>
  )
})

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md bg-zinc-900 px-3 py-1.5 max-w-[80vw] md:max-w-md text-xs text-zinc-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-zinc-900 group',
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
}
