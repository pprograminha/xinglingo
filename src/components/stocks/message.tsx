'use client'

import { MemoizedReactMarkdown } from '@/components/chat/markdown'
import { useStreamableText } from '@/hooks/use-streamable-text'
import { cn } from '@/lib/utils'
import { StreamableValue } from 'ai/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { CodeBlock } from '../ui/codeblock'
import { spinner } from './spinner'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start">
      <div
        className={`flex-1 space-y-2 overflow-hidden text-3xl ${pixelatedFont()}`}
      >
        {children}
      </div>
    </div>
  )
}

export function BotMessage({
  content,
  className,
}: {
  content: string | StreamableValue<string>
  className?: string
}) {
  const text = useStreamableText(content)

  return (
    <div className={cn('group relative flex items-start', className)}>
      <div className="flex-1 space-y-2 overflow-hidden">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ className, children, ...props }) {
              if (typeof children === 'string') {
                if (children[0] === '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children = (children as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            },
          }}
        >
          {text}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}

export function BotCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex w-full items-start">
      <div className="flex-1 ">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start ">
      <div className="h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}
