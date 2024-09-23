import { getSection } from '@/actions/units/get-section'
import { type Metadata } from 'next'
import { Section } from './components/section'
import { AI } from '@/lib/chat/actions'
import { Chat } from '../../../../../components/chat/chat'

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

export default function SectionPage({ params }: SectionPageProps) {
  return (
    <>
      {/* <Section params={params} /> */}
      <AI initialAIState={{ messages: [], chatId: 'currentLesson.id' }}>
        <Chat initialMessages={[]} />
      </AI>
    </>
  )
}
