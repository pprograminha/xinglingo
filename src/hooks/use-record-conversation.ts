import { RecognitionResult } from '@/app/[locale]/components/pronunciation-assessment/pronunciation-assesment-dash'
import { getAudioConfigFromDefaultMicrophone } from '@/app/api/ai/pronunciation/ackaud/services/get-audio-config-from-default-mic'
import { getSpeechRecognitionResult } from '@/app/api/ai/pronunciation/ackaud/services/get-speech-recognition-result'
import { toast } from '@/components/ui/use-toast'
import { Conversation } from '@/lib/db/drizzle/types'
import { iOS } from '@/lib/ios'
import { SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk'
import { getSession } from 'next-auth/react'
import { create } from 'zustand'

type StartRecordingData = {
  referenceText: string
  conversation?: Conversation | null
}
type StopRecordingData = { omit?: { loading?: boolean } }

interface RecordConversationState {
  referenceText: string
  audioTranscript: string

  conversation: Conversation | null
  previousConversation: Conversation | null

  isRecording: boolean
  isLoading: boolean

  speechRecognitionResult: RecognitionResult | null
  speechRecognizer: SpeechRecognizer | null
  toggleRecord: (conversation?: Conversation | null) => void
  retryRecord: () => void
  startRecording: (data: StartRecordingData) => Promise<void>
  stopRecording: (data?: StopRecordingData) => void
}

export const useRecordConversation = create<RecordConversationState>(
  (set, get) => ({
    referenceText: '',

    audioTranscript: '',

    conversation: null,
    previousConversation: null,

    isRecording: false,
    isLoading: false,

    speechRecognitionResult: null,
    speechRecognizer: null,

    retryRecord: () => {
      const state = get()

      if (!state.previousConversation) {
        return toast({
          title: 'Unable to retry',
          variant: 'destructive',
        })
      }

      state.startRecording({
        referenceText: state.previousConversation.text,
        conversation: state.previousConversation,
      })
    },

    stopRecording: (data?: StopRecordingData) => {
      const omitLoading = data?.omit?.loading
      const state = get()

      if (omitLoading && state.speechRecognizer) {
        state.speechRecognizer.close()
      }

      set({
        isRecording: false,
        ...(!omitLoading && {
          isLoading: false,
        }),
        conversation: null,
        referenceText: '',
        audioTranscript: '',
      })
    },

    startRecording: async ({
      referenceText,
      conversation,
    }: StartRecordingData) => {
      const session = await getSession()

      if (!session) {
        toast({
          title: 'Você precisa ser um assinante :(',
        })
        return
      }

      set({
        isRecording: true,
        isLoading: true,
        conversation,
        referenceText,
        speechRecognitionResult: null,
        previousConversation: conversation,
      })

      let recognition: SpeechRecognition | null = null

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition && !iOS()) {
        recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event) => {
          const transcriptCollection: string[] = []

          for (let index = 0; index < event.results.length; index++) {
            const element = event.results.item(index)

            transcriptCollection.push(element.item(0).transcript)
          }

          set({
            audioTranscript: transcriptCollection.join(' '),
          })
        }

        recognition.start()
      }

      const { getResult, speechRecognizer } = await getSpeechRecognitionResult(
        {
          audioText: referenceText,
        },
        {
          audioConfig: getAudioConfigFromDefaultMicrophone(),
        },
      )

      set({
        speechRecognizer,
      })

      const speechRecognitionResult = await getResult()

      if (
        speechRecognitionResult &&
        speechRecognitionResult.RecognitionStatus === 'Success'
      ) {
        set({
          speechRecognitionResult,
        })

        toast({
          title: 'Audio successfully loaded correctly',
        })

        const formData = new FormData()

        if (referenceText) {
          formData.append('referenceText', referenceText)
        }

        if (conversation && conversation.id) {
          formData.append('conversationId', conversation.id)
        }

        formData.append(
          'speechRecognitionResult',
          JSON.stringify(speechRecognitionResult),
        )

        try {
          const response = await fetch('/api/ai/pronunciation/ackaud', {
            body: formData,
            method: 'POST',
          })

          const data = await response.json()

          if (data.ok !== 1) {
            throw new Error()
          }
        } catch {
          toast({
            title: 'Failed when trying to create pronunciation assessment.',
            variant: 'destructive',
          })
        }
      } else if (
        speechRecognitionResult &&
        speechRecognitionResult.RecognitionStatus === 'InitialSilenceTimeout'
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

      const state = get()

      if (recognition) recognition.stop()

      state.stopRecording()
    },

    toggleRecord: (conversation?: Conversation | null) => {
      const state = get()

      if (state.isRecording && conversation && conversation.text) {
        state.startRecording({
          conversation,
          referenceText: conversation.text,
        })
      } else if (!state.isRecording) {
        state.stopRecording()
      }
    },
  }),
)
