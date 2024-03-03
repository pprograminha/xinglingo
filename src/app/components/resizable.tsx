'use client'
import ChatContainer from '@/components/chat'
import { Loading } from '@/components/loading'
import { PronunciationAssessment } from '@/components/pronunciation-assessment'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { useEffect, useState } from 'react'

export function ResizableHome() {
  const isMd = useBreakpoint('md')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <Loading />

  return (
    <ResizablePanelGroup
      direction={isMd ? 'horizontal' : 'vertical'}
      className="min-h-screen"
    >
      <ResizablePanel
        className="md:min-w-[400px] min-w-[200px] min-h-[1000px]"
        defaultSize={50}
      >
        <div className="md:min-h-screen h-full">
          <PronunciationAssessment />
        </div>
      </ResizablePanel>
      {isMd && <ResizableHandle withHandle />}
      <ResizablePanel className="md:min-w-[400px] min-w-[200px] min-h-[625.77px]">
        <ChatContainer />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
