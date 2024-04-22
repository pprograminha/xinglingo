'use client'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { LogOut as LogOutIcon } from 'lucide-react'
import { useRouter } from '@/navigation'

export const LogOut = () => {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        signOut({
          redirect: false,
        })
        router.push('/auth')
      }}
    >
      <LogOutIcon className="w-4" />
    </Button>
  )
}
