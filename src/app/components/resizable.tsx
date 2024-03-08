'use client'
import ChatContainer from '@/components/chat'
import { PronunciationAssessment } from '@/components/pronunciation-assessment'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useBreakpoint } from '@/hooks/use-breakpoint'

export function ResizableHome() {
  const isMd = useBreakpoint('md')

  if (!isMd) return null

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen md:block hidden"
    >
      <ResizablePanel
        className="md:min-w-[400px] min-w-[200px]"
        defaultSize={50}
      >
        <div className="md:min-h-screen h-full">
          <PronunciationAssessment />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={50}
        className="md:min-w-[400px] min-w-[200px]"
      >
        <ChatContainer />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
