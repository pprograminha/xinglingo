'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type TypingProps = {
  text: string
  startDelay?: number
  delay?: number // ms
}
export const Typing = ({
  text: textBase,
  delay: delayTime = 30,
  startDelay = 0,
}: TypingProps) => {
  const [text, setText] = useState('')

  const delay = (d: number) => new Promise((resolve) => setTimeout(resolve, d))

  const effectRef = useRef<number>(0)

  const textHandler = useCallback(async () => {
    if (effectRef.current === 1) return

    effectRef.current = 1

    if (startDelay !== 0) await delay(startDelay)

    for (const c of textBase) {
      await delay(delayTime)
      setText((oldText) => oldText + c)
    }
  }, [textBase, startDelay, delayTime])

  useEffect(() => {
    textHandler()
  }, [textHandler])

  return text
}
