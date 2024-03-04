'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { blobToAudioBuffer } from '@/lib/blob-buffer'
import { zodResolver } from '@hookform/resolvers/zod'
import toWav from 'audiobuffer-to-wav'
import { Info, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useToast } from '../ui/use-toast'
import { Microphone } from './microphone'
import { useRecordConversation } from '@/hooks/use-record-conversation'
import { scoreStyle, scoreColor } from '@/lib/score-color'

const formSchema = z.strictObject({
  microphone: z.object(
    {
      audioText: z
        .string({
          required_error: 'Audio recording is required',
        })
        .min(2, {
          message: 'Audio recording is required',
        }),

      audioBlob: z.instanceof(Blob, {
        path: ['microphone'],
        message: 'Audio recording is required',
      }),
    },
    {
      required_error: 'Audio recording is required',
    },
  ),
})

type PronunciationAssessment = {
  AccuracyScore: number
  ErrorType?: string
  Feedback?: {
    Prosody?: {
      Break?: {
        ErrorTypes: string[]
        BreakLength: number
      }
      Intonation?: {
        ErrorTypes: string[]
        Monotone: {
          SyllablePitchDeltaConfidence: number
        }
      }
    }
  }
}

type Syllable = {
  Syllable: string
  PronunciationAssessment: PronunciationAssessment
  Offset: number
  Duration: number
}

type Phoneme = {
  Phoneme: string
  PronunciationAssessment: PronunciationAssessment
  Offset: number
  Duration: number
}

type Word = {
  Word: string
  Offset: number
  Duration: number
  PronunciationAssessment: PronunciationAssessment
  Syllables: Syllable[]
  Phonemes: Phoneme[]
}

type NBestPronunciationAssessment = {
  AccuracyScore: number
  FluencyScore: number
  ProsodyScore: number
  CompletenessScore: number
  PronScore: number
}

type NBest = {
  Confidence: number
  Lexical: string
  ITN: string
  MaskedITN: string
  Display: string
  PronunciationAssessment: NBestPronunciationAssessment
  ContentAssessment: {
    GrammarScore: number
    VocabularyScore: number
    TopicScore: number
  }
  Words: Word[]
}

type PrimaryLanguage = {
  Language: string
  Confidence: string
}

export type RecognitionResult = {
  Id: string
  RecognitionStatus: string
  Offset: number
  Duration: number
  PrimaryLanguage: PrimaryLanguage
  Channel: number
  DisplayText: string
  SNR: number
  NBest: NBest[]
}

export function PronunciationAssessmentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [recognition, setRecognition] = useState<RecognitionResult | null>(null)
  const { toast } = useToast()

  const { toggleRecord, conversation } = useRecordConversation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const formData = new FormData()

    formData.append(
      'audioBlob',
      new Blob([toWav(await blobToAudioBuffer(values.microphone.audioBlob))], {
        type: 'audio/wav',
      }),
      'pronunciation.wav',
    )

    formData.append('audioText', values.microphone.audioText)

    if (conversation?.id) formData.append('conversationId', conversation.id)

    let attempts = 0

    const retry = async () => {
      try {
        const response = await fetch('/api/ai/pronunciation/ackaud', {
          body: formData,
          method: 'POST',
        })

        const data = await response.json()

        if (data.RecognitionStatus === 'Success') {
          setRecognition(data)

          toast({
            title: 'Audio successfully loaded correctly',
          })

          toggleRecord()
        } else if (data.RecognitionStatus === 'InitialSilenceTimeout') {
          toast({
            title: 'Initial silence timeout! Please try again.',
            variant: 'destructive',
          })
        } else {
          throw new Error()
        }
      } catch {
        attempts += 1

        if (attempts <= 10) {
          setTimeout(() => {
            retry()
          }, 500)

          return
        }

        toast({
          title: 'Did not catch audio properly! Please try again.',
          variant: 'destructive',
        })
      }
    }

    await retry()

    setIsLoading(false)
  }

  const recognitionData = recognition?.NBest[0]

  const cellStyle =
    'data-[score-color=green]:text-green-600 dark:data-[score-color=green]:text-green-700 data-[score-color=red]:text-red-500 data-[score-color=yellow]:text-yellow-500 dark:data-[score-color=yellow]:text-yellow-400'

  const omittedWords =
    recognitionData?.Words.filter((w) =>
      w.PronunciationAssessment.ErrorType?.includes('Omission'),
    ).length || 0

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="microphone"
            render={({ field: { onChange }, formState }) => (
              <FormItem>
                <FormLabel>Reference Text</FormLabel>
                <FormControl>
                  <Microphone
                    onReset={() => {
                      setIsLoading(false)
                      setRecognition(null)
                    }}
                    onAudio={(data) => {
                      onChange({
                        target: {
                          value: {
                            audioBlob: data.blob,
                            audioText: data.text,
                          },
                        },
                      })
                    }}
                  />
                </FormControl>
                <FormDescription>Practice your pronunciation</FormDescription>
                <p className="text-[0.8rem] font-medium  text-red-400">
                  {formState.errors.microphone?.message ||
                    formState.errors.microphone?.audioBlob?.message ||
                    formState.errors.microphone?.audioText?.message}
                </p>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              'Verify pronunciation'
            )}
          </Button>
        </form>
      </Form>

      {recognitionData && (
        <>
          <Table className="rounded-lg overflow-hidden my-6">
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead
                  data-score-color={scoreColor(
                    recognitionData.PronunciationAssessment.AccuracyScore,
                  )}
                  className={`${scoreStyle}`}
                >
                  Accuracy Score
                </TableHead>
                <TableHead
                  data-score-color={scoreColor(
                    recognitionData.PronunciationAssessment.CompletenessScore,
                  )}
                  className={`${scoreStyle}`}
                >
                  Completeness Score
                </TableHead>
                <TableHead
                  data-score-color={scoreColor(
                    recognitionData.PronunciationAssessment.PronScore,
                  )}
                  className={`text-center ${scoreStyle}`}
                >
                  Pronunciation Score
                </TableHead>
                <TableHead
                  data-score-color={scoreColor(
                    recognitionData.PronunciationAssessment.FluencyScore,
                  )}
                  className={`text-right ${scoreStyle}`}
                >
                  Fluency Score
                </TableHead>
                {omittedWords > 0 && (
                  <TableHead className="text-right">Words Omitted</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell
                  data-score-color={scoreColor(
                    recognitionData.PronunciationAssessment.AccuracyScore,
                  )}
                  className={`${cellStyle}`}
                >
                  {recognitionData.PronunciationAssessment.AccuracyScore}
                </TableCell>
                <TableCell
                  data-score-color={scoreColor(
                    recognitionData.PronunciationAssessment.CompletenessScore,
                  )}
                  className={`${cellStyle}`}
                >
                  {recognitionData.PronunciationAssessment.CompletenessScore}
                </TableCell>
                <TableCell
                  data-score-color={scoreColor(
                    recognitionData.PronunciationAssessment.PronScore,
                  )}
                  className={`text-center ${cellStyle}`}
                >
                  {recognitionData.PronunciationAssessment.PronScore}
                </TableCell>
                <TableCell
                  data-score-color={scoreColor(
                    recognitionData.PronunciationAssessment.FluencyScore,
                  )}
                  className={`text-right ${cellStyle}`}
                >
                  {recognitionData.PronunciationAssessment.FluencyScore}
                </TableCell>
                {omittedWords > 0 && (
                  <TableCell className="text-right">{omittedWords}</TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
          <Table className="rounded-lg overflow-hidden my-6">
            <TableHeader>
              <TableRow className="text-xs">
                {recognitionData.Words.map((word, index) => (
                  <TableHead
                    key={index}
                    data-score-color={scoreColor(
                      word.PronunciationAssessment.AccuracyScore,
                    )}
                    className={`${scoreStyle} relative`}
                  >
                    {word.Word}{' '}
                    <span
                      data-score-color={scoreColor(
                        word.PronunciationAssessment.AccuracyScore,
                      )}
                      className="absolute top-1 rounded-full px-1"
                    >
                      {word.PronunciationAssessment.AccuracyScore}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="mt-1">
              <TableRow>
                {recognitionData.Words.map((word, index) => (
                  <TableCell key={index} className="dark:border-zinc-800 ">
                    {word.Phonemes.length === 0 && (
                      <Info className="text-red-500" />
                    )}
                    {word.Phonemes.map((p) => (
                      <TableCell
                        key={index}
                        data-score-color={scoreColor(
                          p.PronunciationAssessment.AccuracyScore,
                        )}
                        className={`${cellStyle} pr-[20px] pl-0 relative`}
                      >
                        {p.Phoneme}
                        <span
                          data-score-color={scoreColor(
                            p.PronunciationAssessment.AccuracyScore,
                          )}
                          className="absolute top-1 text-[0.6em] rounded-full"
                        >
                          {p.PronunciationAssessment.AccuracyScore}
                        </span>
                      </TableCell>
                    ))}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </>
  )
}
