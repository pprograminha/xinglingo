export function TextToHTML({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />
}
