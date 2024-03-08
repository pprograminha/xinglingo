'use client'
import ChatContainer from '@/components/chat'
import { Loading } from '@/components/loading'
import { PronunciationAssessment } from '@/components/pronunciation-assessment'
import { Button } from '@/components/ui/button'
import { useSwitch } from '@/hooks/use-switch'
import { AudioWaveform, ExternalLink, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ResizableHome } from './components/resizable'

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  const { mode, toggle } = useSwitch()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <Loading />

  return (
    <main className="min-h-screen">
      <ResizableHome />
      <div className="md:hidden block min-h-screen">
        <div className="text-[#7ae088] flex py-5 px-2 dark:bg-zinc-950 border  dark:border-zinc-800 justify-between items-center">
          <div className=" flex gap-2 items-center">
            <AudioWaveform className="h-10 w-10" />
            <p className="text-xs">PA</p>
            <Button size="icon" variant="outline" asChild>
              <Link
                href="https://elevenlabs.io/speech-synthesis"
                target="_blank"
              >
                <ExternalLink className="w-4" />
              </Link>
            </Button>
          </div>
          <Button
            size="sm"
            className="border border-green-400 flex items-center gap-2 text-xs"
            variant="link"
            onClick={() => toggle(['pronunciation', 'chat'])}
          >
            {mode !== 'pronunciation' ? (
              <AudioWaveform className="h-3 w-3" />
            ) : (
              <MessageCircle className="w-3" />
            )}
          </Button>
          <Button size="sm" variant="link" asChild>
            <Link href="/dashboard" target="_blank">
              Dashboard
            </Link>
          </Button>
        </div>

        <PronunciationAssessment
          data-hidden={mode !== 'pronunciation'}
          className="data-[hidden=true]:hidden"
        />
        <ChatContainer
          data-hidden={mode !== 'chat'}
          className="data-[hidden=true]:hidden"
        />
      </div>
    </main>
  )
}
