'use client'
import { sendGAEvent } from '@next/third-parties/google'
import { Button } from '../ui/button'

type EventButtonProps = React.ComponentProps<typeof Button> & {
  event: 'buttonClicked'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}
export const EventButton = ({
  asChild = true,
  event,

  value,
  children,
  ...props
}: EventButtonProps) => {
  return (
    <Button
      variant="none"
      size="none"
      asChild={asChild}
      {...props}
      onClick={() =>
        sendGAEvent({
          event,
          value,
        })
      }
    >
      {children}
    </Button>
  )
}
