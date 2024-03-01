'use client'

import { useAudioRecorder } from '@/hooks/audio-recording'
import { makeDownload } from '@/lib/make-download'
import { Download, Mic, Pause } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

type MicrophoneProps = {
  onAudio: (data: { blob: Blob | null; text: string }) => void
}

export function Microphone({ onAudio }: MicrophoneProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRecorder = useAudioRecorder()

  const startRecording = () => {
    setIsRecording(true)
    setRecordingComplete(false)
    setAudioBlob(null)
    setTranscript('')
    onAudio({
      blob: null,
      text: '',
    })

    const WebkitSpeechRecognition = webkitSpeechRecognition

    recognitionRef.current = new WebkitSpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onresult = (event) => {
      const transcriptCollection: string[] = []

      for (let index = 0; index < event.results.length; index++) {
        const element = event.results.item(index)

        transcriptCollection.push(element.item(0).transcript)
      }

      setTranscript(transcriptCollection.join(' '))
      onAudio({ text: transcript, blob: audioBlob })
    }

    recognitionRef.current.start()
    audioRecorder.start()
  }

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setRecordingComplete(true)
    }

    audioRecorder.stop().then((audioBlob) => {
      setAudioBlob(audioBlob)
      onAudio({ text: transcript, blob: audioBlob })
    })
  }

  const handleToggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
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
              className="resize-none min-h-[75px] mt-2"
              value={transcript}
              onChange={(e) => {
                onAudio({
                  text: e.target.value,
                  blob: audioBlob,
                })
                setTranscript(e.target.value)
              }}
            ></Textarea>
          </div>
        )}

        <div className="flex items-center">
          {isRecording ? (
            <button
              type="button"
              onClick={handleToggleRecording}
              className="mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-16 h-16 focus:outline-none"
            >
              <Pause className="w-8 h-8" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggleRecording}
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
