'use client'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { LogOut as LogOutIcon } from 'lucide-react'

export const LogOut = () => (
  <Button
    variant="outline"
    size="icon"
    onClick={() => {
      signOut({
        redirect: true,
      })
    }}
  >
    <LogOutIcon className="w-4" />
  </Button>
)
