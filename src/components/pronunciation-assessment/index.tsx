'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '../mode-toggle'
import { PronunciationAssessmentForm } from './form'
import { AudioWaveform } from 'lucide-react'

export function PronunciationAssessment() {
  return (
    <Card className="w-full h-full rounded-none md:min-h-screen flex flex-col">
      <CardHeader>
        <CardTitle className="text-[#7ae088] flex gap-2 items-center">
          <AudioWaveform className="h-10 w-10" />
          Pronunciation assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-grow">
        <PronunciationAssessmentForm />
        <div className="my-4">
          <Separator className="my-4 " />
          <ModeToggle />
        </div>
      </CardContent>
    </Card>
  )
}
