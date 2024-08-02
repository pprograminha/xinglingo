import { generateUnitsByLLM } from '@/actions/ai/generate-units-by-llm'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { unitFormSchema } from '@/schemas/unit-form'

import { Loader2Icon, SparklesIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

type GenerateUnitsButtonProps = {
  onUnits: (units: z.infer<ReturnType<typeof unitFormSchema>>['units']) => void
  units: (z.infer<ReturnType<typeof unitFormSchema>>['units'][number] & {
    _id: string
  })[]
  title?: string
  sections?: z.infer<
    ReturnType<typeof unitFormSchema>
  >['units'][number]['sections']

  sectionUnitId?: string
  lessonSectionId?: string

  lessons?: z.infer<
    ReturnType<typeof unitFormSchema>
  >['units'][number]['sections'][number]['lessons']
  currentModelId?: string
}

export const GenerateUnitsButton = ({
  onUnits,
  units,
  lessons,
  title,
  sections,
  sectionUnitId,
  lessonSectionId,
  currentModelId,
}: GenerateUnitsButtonProps) => {
  const [isPending, startTransition] = useTransition()
  const type = lessons ? 'lesson' : sections ? 'section' : units ? 'unit' : 0

  const [prompt, setPrompt] = useState(
    `Você vai ser responsável por gerar "${type}" que vão ensinar um novo idioma para o usuário.
Crie as "${type}" como se fosse um cronograma de ensino do básico ao avançado.
${title ? `O tema dos "${type}" deve ser em relação "${title}"` : 'O tema deve referenciar coisas do dia a dia para uma conversa comum.'}

Respeite essas informações para geração do JSON:
- O campo "prompt" deve conter o essencial para a LLM ajudar o usuário a aprender sobre o tema.
- A quantidade máxima de "lessons" deve ser 8 por "section".
- A quantidade máxima de "lessons" deve ser 4 por "section".
- A quantidade mínima e máxima de "sections" deve ser 8 por "unit".
- A quantidade mínima e máxima de "units" deve ser 4.

Não duplique os "${type}" abaixo, apenas use como base para criar novas "${type}" sem relação com as "${type}" abaixo:

${JSON.stringify(
  (lessons || sections || units || []).map((u) => ({
    title: u.title,
    prompt: u.prompt,
  })),
)}
`,
  )

  const generateUnitsAction = async () => {
    if (type !== 0)
      startTransition(() => {
        generateUnitsByLLM({ prompt, type }).then((response) => {
          if (!response)
            return toast(
              'Algo deu errado ao tentar gerar as unidades com LLM, tente novamente.',
            )
          if (response.type === 'unit' && currentModelId)
            onUnits([
              ...units,
              ...response.units.map((u) => ({
                ...u,
                modelId: currentModelId,
              })),
            ])

          if (response.type === 'section' && sectionUnitId) {
            const unitIndex = units.findIndex(
              (unit) => unit._id === sectionUnitId,
            )

            if (unitIndex !== -1) {
              units[unitIndex].sections = [
                ...units[unitIndex].sections,
                ...response.sections,
              ]

              onUnits([...units])
            }
          }
          if (
            response.type === 'lesson' &&
            sections &&
            sectionUnitId &&
            lessonSectionId
          ) {
            const unitIndex = units.findIndex(
              (unit) => unit._id === sectionUnitId,
            )

            if (unitIndex !== -1) {
              const sectionIndex = sections.findIndex(
                (section) => section._id === lessonSectionId,
              )

              if (sectionIndex !== -1) {
                units[unitIndex].sections[sectionIndex].lessons = [
                  ...units[unitIndex].sections[sectionIndex].lessons,
                  ...response.lessons,
                ]

                onUnits([...units])
              }
            }
          }
        })
      })
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <form
        action={generateUnitsAction}
        className="flex gap-4 items-center flex-wrap"
      >
        <h1 className={`${pixelatedFont()} text-3xl`}>
          Gerar unidades com LLM
        </h1>
        <Button type="submit" variant="secondary" size="icon">
          {isPending ? (
            <Loader2Icon className="w-4 animate-spin text-yellow-300" />
          ) : (
            <SparklesIcon className="w-4 text-yellow-300" />
          )}
        </Button>
      </form>

      <Textarea
        onChange={(e) => setPrompt(e.target.value)}
        defaultValue={prompt}
        value={prompt}
        className="md:min-w-[400px] md:h-[200px] resize-none"
      />
    </div>
  )
}
