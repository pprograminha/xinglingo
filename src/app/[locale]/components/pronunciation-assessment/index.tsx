'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { HTMLAttributes } from 'react'
import { PronunciationAssessmentDash } from './pronunciation-assesment-dash'

type PronunciationAssessmentProps = HTMLAttributes<HTMLDivElement>

export function PronunciationAssessment({
  className,
  ...props
}: PronunciationAssessmentProps) {
  return (
    <Card
      className={cn(
        'w-full rounded-none min-h-screen  flex flex-col',
        className,
      )}
      {...props}
    >
      <CardContent className="flex flex-col justify-between flex-grow">
        <PronunciationAssessmentDash />
        <div className="md:my-4 ">
          <Separator className="my-4 md:block hidden" />
          <div className="flex gap-2">
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                signOut({
                  redirect: true,
                })
              }}
            >
              <LogOut className="w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
