'use client'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { LogOut as LogOutIcon } from 'lucide-react'
import { useRouter } from '@/navigation'
import { useEffect } from 'react'

export const LogOut = () => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth')
    }
  }, [status, router])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        signOut({
          redirect: false,
        })
      }}
    >
      <LogOutIcon className="w-4" />
    </Button>
  )
}
