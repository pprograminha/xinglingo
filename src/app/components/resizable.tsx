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

  return (
    <ResizablePanelGroup
      direction={isMd ? 'horizontal' : 'vertical'}
      className="min-h-screen"
    >
      <ResizablePanel className="md:min-w-[400px] min-w-[200px] min-h-[1000px]">
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
