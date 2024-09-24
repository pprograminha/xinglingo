import { ReactNode } from 'react'

export function TextToHTML({ text }: { text: string | ReactNode }) {
  if (typeof text !== 'string') return text

  return <div dangerouslySetInnerHTML={{ __html: text }} />
}
