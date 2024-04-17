'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRecordConversation } from '@/hooks/use-record-conversation'
import { Mic, Pause } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

export function Microphone() {
  const [textareaValue, setTextareaValue] = useState('')
  const t = useTranslations()

  const {
    conversation,
    audioTranscript,
    isRecording,
    isLoading,
    stopRecording,
    startRecording,
  } = useRecordConversation()

  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <div className="m-auto rounded-md border flex flex-col border-zinc-200 dark:border-zinc-800 p-4 ">
          <div className="flex-1 flex w-full justify-between">
            <div className="space-y-1 flex flex-col w-full">
              <p className="text-sm font-medium leading-none">
                {isRecording ? (
                  t('Recording')
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="rounded-full w-2 h-2 bg-blue-400 animate-pulse" />
                    {t('Enter text before starting recording')}
                  </div>
                )}
              </p>
              {isRecording && (
                <p className="text-sm text-muted-foreground">
                  {t('Listening')}...
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

        <div className="flex items-center w-full relative overflow-hidden">
          {isLoading && (
            <Image
              src="/assets/loading.gif"
              width="160"
              className="absolute top-0 -right-5"
              height="160"
              alt="Thank you"
            />
          )}
          {isRecording ? (
            <div className="flex gap-2 items-center justify-center w-full">
              <Button
                type="button"
                onClick={() => {
                  stopRecording({
                    omit: {
                      loading: true,
                    },
                  })
                }}
                className="mt-4 flex items-center justify-center bg-red-400 dark:text-white dark:bg-red-400 hover:bg-red-500 rounded-full w-16 h-16"
              >
                <Pause className="w-8 h-8" />
              </Button>
            </div>
          ) : (
            <Button
              disabled={isLoading || (!textareaValue && !conversation)}
              type="button"
              onClick={() =>
                startRecording({
                  referenceText: textareaValue || conversation?.text || '',
                  conversation,
                })
              }
              className="mt-4 mx-auto flex items-center justify-center disabled:cursor-not-allowed disabled:bg-blue-200 dark:disabled:bg-blue-200 dark:disabled:text-white  disabled:text-white  dark:bg-blue-400 bg-blue-400 dark:hover:bg-blue-500  dark:text-white  hover:bg-blue-500 rounded-full w-16 h-16"
            >
              <Mic className="w-8 h-8" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
