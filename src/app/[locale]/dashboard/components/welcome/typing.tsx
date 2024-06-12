'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type TypingProps = {
  text: string
}
export const Typing = ({ text: textBase }: TypingProps) => {
  const [text, setText] = useState('')

  const delay = () => new Promise((resolve) => setTimeout(resolve, 30))

  const effectRef = useRef<number>(0)

  const textHandler = useCallback(async () => {
    if (effectRef.current === 1) return

    effectRef.current = 1

    for (const c of textBase) {
      await delay()
      setText((oldText) => oldText + c)
    }
  }, [textBase])

  useEffect(() => {
    textHandler()
  }, [textHandler])

  return text
}
