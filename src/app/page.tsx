import ChatContainer from '@/components/chat'
import { ModeToggle } from '@/components/mode-toggle'
import { PronunciationAssessment } from '@/components/pronunciation-assessment'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-2">
      <PronunciationAssessment />
      <ModeToggle />

      <ChatContainer />
    </main>
  )
}
