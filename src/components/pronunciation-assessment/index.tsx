'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AudioWaveform, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from '../mode-toggle'
import { Button } from '../ui/button'
import { PronunciationAssessmentDash } from './ponunciation-assesment-dash'

export function PronunciationAssessment() {
  return (
    <Card className="w-full h-full rounded-none md:min-h-screen flex flex-col">
      <CardHeader>
        <CardTitle className="text-[#7ae088] flex justify-between items-center">
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
        <div className="my-4">
          <Separator className="my-4 " />
          <ModeToggle />
        </div>
      </CardContent>
    </Card>
  )
}
