'use client'

import { MemoizedReactMarkdown } from '@/components/chat/markdown'
import { useAuth } from '@/hooks/use-auth'
import { useModel } from '@/hooks/use-model'
import { useStreamableText } from '@/hooks/use-streamable-text'
import { interSansFont } from '@/lib/font/google/inter-sans-font'
import { openSansFont } from '@/lib/font/google/open-sans-font'
import { cn } from '@/lib/utils'
import { StreamableValue } from 'ai/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CodeBlock } from '../ui/codeblock'
import { spinner } from './spinner'

import {
  CopyIcon,
  EarIcon,
  MicVocalIcon,
  MoreHorizontal,
  RotateCcwIcon,
  TrashIcon,
} from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu as DropdownMenuPrimitive,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DropdownMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenuPrimitive open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full absolute top-1/2 -right-10 -translate-y-1/2 hover:dark:bg-zinc-900"
        >
          <MoreHorizontal className="w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Copiar
            <DropdownMenuShortcut>
              <CopyIcon className="w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Voltar aqui
            <DropdownMenuShortcut>
              <RotateCcwIcon className="w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Escutar mensagem
            <DropdownMenuShortcut>
              <EarIcon className="w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Pronunciar mensagem
            <DropdownMenuShortcut>
              <MicVocalIcon className="w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            Delete
            <DropdownMenuShortcut>
              <TrashIcon className="w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuPrimitive>
  )
}

type AvatarMessageProps = {
  avatarName?: string | null
  avatarUrl?: string | null
  placement?: 'right' | 'left'
  className?: string
}

function AvatarMessage({
  avatarName,
  placement = 'left',
  avatarUrl,
  className,
}: AvatarMessageProps) {
  const isRight = placement === 'right'

  return (
    <div
      data-right={isRight}
      className="flex data-[right=true]:flex-row-reverse gap-2 items-start relative data-[right=true]:left-auto data-[right=true]:-right-7  -left-7 select-none"
    >
      <Avatar className={cn('overflow-hidden h-6 w-6', className)}>
        <AvatarImage
          src={avatarUrl || undefined}
          alt={avatarName || undefined}
          className="object-contain "
        />
        <AvatarFallback>{avatarName?.[0]}</AvatarFallback>
      </Avatar>
      {avatarName && (
        <span
          className={`text-xs !font-bold text-zinc-500 ${openSansFont.className}`}
        >
          {avatarName}
        </span>
      )}
    </div>
  )
}

type ContainerMessageProps = {
  children: React.ReactNode
}

function ContainerMessage({ children }: ContainerMessageProps) {
  return (
    <div
      className={`inline-block bg-zinc-800 rounded-xl p-3 max-w-lg text-zinc-400 ${interSansFont.className} text-base font-extrabold`}
    >
      <div>{children}</div>
    </div>
  )
}

export function UserMessage({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="group relative flex flex-col items-end">
      <AvatarMessage
        avatarName={user?.fullName}
        avatarUrl={user?.image}
        placement="right"
      />
      <ContainerMessage>{children}</ContainerMessage>
      <DropdownMenu />
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

  const { model } = useModel()

  return (
    <div className={cn('group relative flex flex-col items-start', className)}>
      <AvatarMessage
        avatarName={model?.name}
        avatarUrl={model?.imageUrl}
        className="overflow-visible"
      />

      <ContainerMessage>
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
      </ContainerMessage>
      <DropdownMenu />
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
