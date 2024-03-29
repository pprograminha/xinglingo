/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { User } from '@/lib/db/drizzle/@types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '../ui/input'
import { makeUser } from '@/actions/users/make-user'
import { useFormState, useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from '../ui/use-toast'

const schemaBody = {
  email: z.string().email(),
  fullName: z.string().min(2),
}
const formSchema = z.strictObject(schemaBody)

async function makeUserForm(_: User | null, formData: FormData) {
  const email = formData.get('email')
  const fullName = formData.get('fullName')

  const data = z.object(schemaBody).safeParse({
    email,
    fullName,
  })

  if (data.success) {
    const makedUser = await makeUser({
      email: data.data.email,
      fullName: data.data.fullName,
    })

    return makedUser
  } else {
    toast({
      title: data.error.message,
      variant: 'destructive',
    })
  }
  return null
}

function ButtonAction() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="w-4 animate-spin" /> : 'Send'}
    </Button>
  )
}

type WhoYouFormProps = {
  onClose: () => void
}

export function WhoYouForm({ onClose }: WhoYouFormProps) {
  const [user, formAction] = useFormState<User | null, FormData>(
    makeUserForm,
    null,
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('@englishai:user-id', user.id)

      onClose()
    }
  }, [user, onClose])

  return (
    <>
      <Form {...form}>
        <form className="space-y-8" action={formAction}>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field: props }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...props} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field: props }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...props} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ButtonAction />
        </form>
      </Form>
    </>
  )
}
