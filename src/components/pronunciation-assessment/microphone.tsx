'use client'

import { getAudioConfigFromDefaultMicrophone } from '@/app/api/ai/pronunciation/ackaud/services/get-audio-config-from-default-mic'
import { getSpeechRecognitionResult } from '@/app/api/ai/pronunciation/ackaud/services/get-speech-recognition-result'
import { useRecordConversation } from '@/hooks/use-record-conversation'
import { Mic, Pause } from 'lucide-react'
import { SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast as sonner } from 'sonner'
import { Textarea } from '../ui/textarea'
import { toast } from '../ui/use-toast'
import { RecognitionResult } from './ponunciation-assesment-dash'

type RecognitionData = {
  referenceText?: string
  conversationId?: string
  speechRecognitionResult: RecognitionResult
}

type MicrophoneProps = {
  onRecognition: (data: RecognitionData) => void
}

export function Microphone({ onRecognition }: MicrophoneProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [textareaValue, setTextareaValue] = useState('')
  const [speechRecognizer, setSpeechRecognizer] =
    useState<SpeechRecognizer | null>(null)
  const [audioTranscript, setAudioTranscript] = useState('')

  const { conversation } = useRecordConversation()
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    setTextareaValue('')
    setAudioTranscript('')
    if (speechRecognizer) {
      try {
        speechRecognizer.close()
      } catch {}
    }
    if (recognitionRef.current) recognitionRef.current.stop()
  }, [speechRecognizer])

  const startRecording = useCallback(
    async (text?: string) => {
      setIsLoading(true)
      const recursive = () => {
        sonner('Wait a few minutes', {
          duration: 5000,

          action: {
            label: 'Undo',
            onClick: () => {},
          },
          position: 'bottom-left',
          onAutoClose: () => {
            setIsLoading((l) => {
              if (l) recursive()
              return l
            })
          },
        })
      }
      recursive()

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event) => {
          const transcriptCollection: string[] = []

          for (let index = 0; index < event.results.length; index++) {
            const element = event.results.item(index)

            transcriptCollection.push(element.item(0).transcript)
          }

          setAudioTranscript(transcriptCollection.join(' '))
        }

        recognitionRef.current.start()
      } else {
        toast({
          title: 'SpeechRecognition API is not supported in this browser.',
          variant: 'destructive',
        })
      }

      const { getResult, speechRecognizer } = await getSpeechRecognitionResult(
        {
          audioText: text || textareaValue,
        },
        {
          audioConfig: getAudioConfigFromDefaultMicrophone(),
        },
      )

      setSpeechRecognizer(speechRecognizer)

      const result = await getResult()

      if (result && result.RecognitionStatus === 'Success') {
        onRecognition({
          speechRecognitionResult: result,
          referenceText: textareaValue,
          conversationId: conversation?.id,
        })
        sonner('Wait a little bit more', {
          duration: 5000,
          position: 'bottom-left',
          action: {
            label: 'Undo',
            onClick: () => {},
          },
        })
      } else if (
        result &&
        result.RecognitionStatus === 'InitialSilenceTimeout'
      ) {
        toast({
          title: 'Initial silence timeout! Please try again.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Did not catch audio properly! Please try again.',
          variant: 'destructive',
        })
      }
      setIsLoading(false)
      stopRecording()
    },
    [onRecognition, stopRecording, conversation, textareaValue],
  )

  const toggleRecordingHandler = useCallback(() => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      startRecording(conversation?.text)
    } else {
      stopRecording()
    }
  }, [startRecording, stopRecording, isRecording, conversation])

  useEffect(() => {
    if (conversation !== undefined) {
      if (conversation) {
        startRecording(conversation.text)
        setTextareaValue(conversation.text)
        setIsRecording(true)
      } else {
        stopRecording()
        setIsRecording(false)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation])
  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <div className="m-auto rounded-md border flex flex-col border-zinc-200 dark:border-zinc-800 p-4 ">
          <div className="flex-1 flex w-full justify-between">
            <div className="space-y-1 flex flex-col w-full">
              <p className="text-sm font-medium leading-none">
                {isRecording ? (
                  'Recording'
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="rounded-full w-2 h-2 bg-blue-400 animate-pulse" />
                    Enter the text before starting recording
                  </div>
                )}
              </p>
              {isRecording && (
                <p className="text-sm text-muted-foreground">
                  Start speaking...
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-center">
              {isRecording && (
                <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
              )}
            </div>
          </div>
          <p className="my-1 text-xs text-zinc-700">{audioTranscript}</p>

          <Textarea
            disabled={!!conversation}
            className="resize-none min-h-[75px] mt-2"
            {...(conversation && {
              placeholder: conversation.text,
            })}
            value={textareaValue}
            onChange={(e) => {
              if (!conversation) {
                setTextareaValue(e.target.value)
              }
            }}
          />
        </div>

        <div className="flex items-center w-full">
          {isRecording ? (
            <div className="flex gap-2 items-center justify-center w-full">
              <button
                type="button"
                onClick={() => {
                  toggleRecordingHandler()
                }}
                className="mt-10 flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-16 h-16 focus:outline-none"
              >
                <Pause className="w-8 h-8" />
              </button>
            </div>
          ) : (
            <button
              disabled={isLoading || (!textareaValue && !conversation)}
              type="button"
              onClick={() => toggleRecordingHandler()}
              className="mt-10 m-auto flex items-center justify-center disabled:cursor-not-allowed disabled:bg-blue-300  bg-blue-400 hover:bg-blue-500 rounded-full w-16 h-16 focus:outline-none"
            >
              <Mic className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
