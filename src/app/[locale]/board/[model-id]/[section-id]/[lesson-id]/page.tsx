import { getSection } from '@/actions/units/get-section'
import { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { type Metadata } from 'next'
import { Section } from './components/section'

type SectionPageProps = {
  params: {
    'model-id': string
    'section-id': string
  }
}

export async function generateMetadata({
  params,
}: SectionPageProps): Promise<Metadata> {
  const section = await getSection({
    sectionId: params['section-id'],
  })

  return section
    ? {
        title: section.title.root.data.text,
      }
    : {}
}

export default async function LessonPage({ params }: SectionPageProps) {
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
          chatId: nanoid(),
        }}
      >
        <Section params={params} />
      </AI>
    </>
  )
}
