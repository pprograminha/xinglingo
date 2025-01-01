import { getSection } from '@/actions/units/get-section'
import { AI } from '@/lib/chat/actions'
import { type Metadata } from 'next'
import { Lesson } from './components/lesson'

type SectionPageProps = {
  params: Promise<{
    'model-id': string
    'section-id': string
    'lesson-id': string
  }>
}

export async function generateMetadata({
  params: paramsPromise,
}: SectionPageProps): Promise<Metadata> {
  const params = await paramsPromise

  const section = await getSection({
    sectionId: params['section-id'],
  })

  return section
    ? {
        title: section.title.root.data.text,
      }
    : {}
}

export default async function LessonPage({
  params: paramsPromise,
}: SectionPageProps) {
  const params = await paramsPromise
  // const conversations = await getConversations()
  return (
    <>
      <AI
        initialAIState={{
          messages: [],
          // conversations.map(
          //   (c) =>
          //     ({
          //       id: c.id,
          //       content: c.text,
          //       role: c.role as 'system',
          //     }) satisfies Message,
          // ),
          chatId: params['lesson-id'],
        }}
      >
        <Lesson params={params} />
      </AI>
    </>
  )
}
