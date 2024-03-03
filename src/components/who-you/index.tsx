'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { WhoYouForm } from './form'
import { useEffect, useState } from 'react'
import { toast } from '../ui/use-toast'
import { uid } from '@/lib/get-uid'

export function WhoYou() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const userId = uid()

    if (!userId) {
      setIsOpen(!userId)
    }
  }, [])

  const onClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (isOpen === false) {
          toast({
            title: 'Please send the form',
            variant: 'destructive',
          })
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Who are you?</DialogTitle>
          <DialogDescription>Fill in the fields below</DialogDescription>
        </DialogHeader>
        <WhoYouForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
