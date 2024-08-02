type LessonProps = {
  params: {
    'model-id': string
    'section-id': string
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Lesson({ params }: LessonProps) {
  return (
    <div className="p-4 md:p-8 min-h-full h-full">
      <section className="bg-[url('/assets/svgs/radiant-gradient.svg')] bg-cover w-full h-full overflow-y-auto px-4 pb-4 pt-4 md:pt-16 bg-zinc-900 border border-zinc-800 rounded-xl items-center justify-center md:mb-0 mb-20">
        <div className="md:container !max-w-[1000px]">sasa</div>
      </section>
    </div>
  )
}
