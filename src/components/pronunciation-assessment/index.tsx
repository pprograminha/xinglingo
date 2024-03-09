'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { AudioWaveform, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { HTMLAttributes } from 'react'
import { ModeToggle } from '../mode-toggle'
import { Button } from '../ui/button'
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
      <CardHeader>
        <CardTitle className="text-[#7ae088] justify-between items-center md:flex hidden">
          <div className=" flex gap-2 items-center">
            <AudioWaveform className="h-10 w-10" />
            Pronunciation assessment
            <Button size="icon" variant="outline" asChild>
              <Link
                href="https://elevenlabs.io/speech-synthesis"
                target="_blank"
              >
                <ExternalLink className="w-4" />
              </Link>
            </Button>
          </div>
          <Button size="sm" variant="link" asChild>
            <Link href="/dashboard" target="_blank">
              Dashboard
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-grow">
        <PronunciationAssessmentDash />
        <div className="md:my-4 ">
          <Separator className="my-4 md:block hidden" />
          <ModeToggle />
        </div>
      </CardContent>
    </Card>
  )
}
