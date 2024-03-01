'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PronunciationAssessmentForm } from './form'

export function PronunciationAssessment() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Pronunciation assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <PronunciationAssessmentForm />
        <Separator className="my-4" />
      </CardContent>
    </Card>
  )
}
