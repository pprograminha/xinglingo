'use client'

import { getProducts } from '@/actions/stripe/get-products'
import { User } from '@/lib/db/drizzle/types'
import { retrieveActiveSubscription } from '@/lib/subscription'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Subscriptions } from '../subscriptions'
import { Button } from '../ui/button'

type ButtonWithAccessCheckerProps = Parameters<typeof Button>[0] & {
  products: Awaited<ReturnType<typeof getProducts>>
  user: User | null
}

export const ButtonWithAccessChecker = ({
  children,
  className,
  products,
  user,
  onClick,
  ...props
}: ButtonWithAccessCheckerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isOpen && !retrieveActiveSubscription(user) && (
        <Subscriptions
          variant="dialog"
          user={user}
          products={products}
          onOpenChange={setIsOpen}
        />
      )}
      <Button
        onClick={(e) => {
          if (!retrieveActiveSubscription(user)) {
            setIsOpen(true)
          }
          onClick?.(e)
        }}
        variant="none"
        size="none"
        className={cn('whitespace-pre-wrap text-left', className)}
        {...props}
      >
        {children}
      </Button>
    </>
  )
}
