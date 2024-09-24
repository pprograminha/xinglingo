import { Button } from '@/components/ui/button'
import { Textarea as TextareaPrimitive } from '@/components/ui/textarea'
import { useSize } from '@/hooks/use-size'
import { cn } from '@/lib/utils'
import { ArrowRightIcon, Loader2Icon } from 'lucide-react'
import React, {
  forwardRef,
  HtmlHTMLAttributes,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

type TextareaProps = {
  onSend: (text: string) => void
  onTyping: (text: string) => void
  isLoading: boolean
} & HtmlHTMLAttributes<HTMLFormElement>

export type TextareaHandler = {
  getHeight: () => number | undefined
}

const TextareaRef: React.ForwardRefRenderFunction<
  TextareaHandler,
  TextareaProps
> = ({ onSend, onTyping, isLoading, className, onSubmit, ...props }, ref) => {
  const [focused, setFocused] = useState(false)
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const textareaContainerRef = useRef<HTMLFormElement | null>(null)

  const { getHeight } = useSize(textareaContainerRef)

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useImperativeHandle(ref, () => ({
    getHeight,
  }))

  return (
    <form
      ref={textareaContainerRef}
      data-focused={focused}
      className={cn(
        'w-full relative bg-zinc-800 dark:border-zinc-700/60 ring-2 ring-transparent data-[focused=true]:ring-zinc-500 rounded-md border p-2 flex flex-col gap-4',
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault()
        setText('')
        onSend(text)

        onSubmit?.(e)
      }}
      {...props}
    >
      <TextareaPrimitive
        ref={textareaRef}
        autoFocus
        placeholder="Converse..."
        value={text}
        onBlur={() => {
          setFocused(false)
        }}
        onChange={(e) => {
          setText(e.target.value)
          onTyping(e.target.value)
          adjustTextareaHeight()
        }}
        onFocus={() => {
          setFocused(true)
        }}
        className="min-h-16 max-h-[45vh] lg:max-h-[40vh] sm:max-h-[25vh] outline-none p-0 border-none dark:focus-visible:ring-0 resize-none"
        autoComplete="off"
      />
      <div className="flex gap-4 justify-between items-end">
        <span className="text-zinc-500 text-xs">{text.length} / 1120</span>
        <Button
          type="submit"
          size="icon"
          disabled={!text || text.length > 1120 || isLoading}
        >
          {isLoading ? (
            <Loader2Icon className="w-4 animate-spin" />
          ) : (
            <ArrowRightIcon className="w-4" />
          )}
        </Button>
      </div>
    </form>
  )
}

export const Textarea = forwardRef(TextareaRef)
