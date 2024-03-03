'use client'

import { useAudioRecorder } from '@/hooks/audio-recording'
import { makeDownload } from '@/lib/make-download'
import { Download, Mic, Pause, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { toast } from '../ui/use-toast'
import { useRecordConversation } from '@/hooks/use-record-conversation'

type MicrophoneProps = {
  onReset: () => void
  onAudio: (data: { blob: Blob | null; text: string }) => void
}

type ResetControlsData = {
  exclude: {
    setIsRecording?: boolean
  }
}

export function Microphone({ onAudio, onReset }: MicrophoneProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const { conversation } = useRecordConversation()

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRecorder = useAudioRecorder()

  const resetControls = useCallback(
    (data?: ResetControlsData) => {
      if (!data?.exclude.setIsRecording) {
        setIsRecording(false)
      }

      onReset()
      setRecordingComplete(false)

      if (!conversation) {
        setAudioBlob(null)
        setTranscript('')
        onAudio({
          blob: null,
          text: '',
        })
      }
    },
    [onAudio, onReset, conversation],
  )

  const startRecording = useCallback(
    (text?: string) => {
      resetControls({
        exclude: {
          setIsRecording: true,
        },
      })

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        toast({
          title: 'SpeechRecognition API is not supported in this browser.',
          variant: 'destructive',
        })

        setIsRecording(false)
        return
      }

      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        const transcriptCollection: string[] = []

        for (let index = 0; index < event.results.length; index++) {
          const element = event.results.item(index)

          transcriptCollection.push(element.item(0).transcript)
        }

        if (!text) {
          setTranscript(transcriptCollection.join(' '))
        }
        onAudio({
          text: text || transcriptCollection.join(' '),
          blob: audioBlob,
        })
      }

      recognitionRef.current.start()
      audioRecorder.start()
    },
    [audioBlob, audioRecorder, onAudio, resetControls],
  )

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setRecordingComplete(true)
    }

    audioRecorder.stop().then((audioBlob) => {
      setAudioBlob(audioBlob)
      onAudio({ text: transcript, blob: audioBlob })
    })
  }, [audioRecorder, onAudio, transcript])

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
        setTranscript(conversation.text)
        setIsRecording(true)
      } else {
        stopRecording()
        setIsRecording(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation])

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        {!conversation && (
          <Button
            type="button"
            className="mb-3"
            size="icon"
            variant="outline"
            onClick={() => resetControls()}
          >
            <RotateCcw className="w-5" />
          </Button>
        )}
        {(isRecording || transcript) && (
          <div className="m-auto rounded-md border border-zinc-200 dark:border-zinc-800 p-4 ">
            <div className="flex-1 flex w-full justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {recordingComplete ? 'Recorded' : 'Recording'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {recordingComplete
                    ? 'Thanks for talking.'
                    : 'Start speaking...'}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-center">
                {isRecording && (
                  <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
                )}
                {audioBlob && (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      makeDownload({
                        data: audioBlob,
                        filename: 'pronunciation.webm',
                      })
                    }
                  >
                    <Download className="w-5" />
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              disabled={!!conversation}
              className="resize-none min-h-[75px] mt-2"
              {...(conversation && {
                placeholder: conversation.text,
              })}
              value={transcript}
              onChange={(e) => {
                if (!conversation) {
                  onAudio({
                    text: e.target.value,
                    blob: audioBlob,
                  })
                  setTranscript(e.target.value)
                }
              }}
            />
          </div>
        )}

        <div className="flex items-center">
          {isRecording ? (
            <button
              type="button"
              onClick={() => {
                toggleRecordingHandler()
              }}
              className="mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-16 h-16 focus:outline-none"
            >
              <Pause className="w-8 h-8" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => toggleRecordingHandler()}
              className="mt-10 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-16 h-16 focus:outline-none"
            >
              <Mic className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
