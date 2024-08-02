import { getModels } from '@/actions/models/get-models'
import { upsertUnits } from '@/actions/units/upsert-units'
import { Editable } from '@/components/editable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { snowflakeId } from '@/lib/snowflake'
import { unitFormSchema as unitFormSchemaFn } from '@/schemas/unit-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Unit } from '../../page'
import { GenerateUnitsButton } from './generate-units-button'

type UnitFormProps = {
  units: Unit[]
  currentModelId: string
}

const unitFormSchema = unitFormSchemaFn()

export const UnitForm = ({
  units: defaultUnits,
  currentModelId,
}: UnitFormProps) => {
  const form = useForm<z.infer<typeof unitFormSchema>>({
    resolver: zodResolver(unitFormSchema),
  })
  const { user } = useAuth()

  const [models, setModels] = useState<
    Awaited<ReturnType<typeof getModels>>['models']
  >([])

  const { fields: units } = useFieldArray({
    control: form.control,
    keyName: '_id',
    name: 'units',
  })
  const setValue = form.setValue

  useEffect(() => {
    const units = defaultUnits.map((u) => {
      const result = {
        _action: 'no action' as const,
        modelId: u.modelId,
        prompt: u.prompt,
        slug: u.slug,
        title: u.title,
        description: u.description,
        unitId: u.id,
        sections: u.sections.map((s, si) => ({
          _id: snowflakeId() + si,
          _action: 'no action' as const,
          sectionId: s.id,
          title: s.title,
          slug: s.slug,
          variant: s.variant,
          description: s.description,
          prompt: s.prompt,
          lessons: s.lessons.map((l, li) => ({
            _id: snowflakeId() + li,
            _action: 'no action' as const,
            lessonId: l.id,
            title: l.title,
            description: l.description,
            prompt: l.prompt,
          })),
        })),
      }
      return result
    })

    setValue('units', units)
  }, [defaultUnits, setValue])

  const upsertUnitHandler = async (values: z.infer<typeof unitFormSchema>) => {
    const ignoreAction = (
      units: typeof values.units,
      actionsToIgnore: (typeof values.units)[number]['_action'][],
    ) => {
      return units
        .filter((u) => !actionsToIgnore.includes(u._action))
        .map((u) => ({
          ...u,
          sections: u.sections
            .filter((s) => !actionsToIgnore.includes(s._action))
            .map((s) => ({
              ...s,
              lessons: s.lessons.filter(
                (l) => !actionsToIgnore.includes(l._action),
              ),
            })),
        }))
    }

    const unitsToSend = ignoreAction(
      values.units.filter((u) => {
        const hasSectionToUpsert = u.sections.some((s) => {
          const hasLessonToUpsert = s.lessons.some(
            (l) => l._action !== 'no action',
          )

          if (hasLessonToUpsert) {
            return hasLessonToUpsert
          }

          return s._action !== 'no action'
        })

        if (hasSectionToUpsert) {
          return hasSectionToUpsert
        }

        return u._action !== 'no action'
      }),
      ['remove'],
    )

    toast('Atualizando...')
    try {
      console.log(unitsToSend)
      if (unitsToSend.length > 0) await upsertUnits(unitsToSend)

      toast('Unidades atualizadas com sucesso!')

      setValue('units', ignoreAction(units, ['purge', 'remove']))
    } catch (error) {
      toast('Ocorreu um erro ao atualizar as unidades!', {
        description: (error as Error).message,
      })
    }
  }

  useEffect(() => {
    getModels(user).then((response) => {
      setModels(response.models)
    })
  }, [user])

  type UpdateUnitData<
    K extends keyof (typeof units)[number],
    SK extends keyof (typeof units)[number]['sections'][number],
    LK extends
      keyof (typeof units)[number]['sections'][number]['lessons'][number],
  > = {
    unit: (typeof units)[number]
    section?: (typeof units)[number]['sections'][number]
    lesson?: (typeof units)[number]['sections'][number]['lessons'][number]
    unitKey?: K
    unitValue?: (typeof units)[number][K]
    sectionKey?: SK
    sectionValue?: (typeof units)[number]['sections'][number][SK]
    lessonKey?: LK
    lessonValue?: (typeof units)[number]['sections'][number]['lessons'][number][LK]
  }

  type ChangeActionData = {
    unit: (typeof units)[number]
    section?: (typeof units)[number]['sections'][number]
    lesson?: (typeof units)[number]['sections'][number]['lessons'][number]
    action?: (typeof units)[number]['_action']
  }

  const changeAction = function ({
    action: overrideAction,
    unit,
    section,
    lesson,
  }: ChangeActionData) {
    let action: NonNullable<typeof overrideAction> = unit.unitId
      ? 'update'
      : 'create'

    if (section) {
      action = section.sectionId ? 'update' : 'create'
    }

    if (lesson) {
      action = lesson.lessonId ? 'update' : 'create'
    }

    if (overrideAction) {
      action = overrideAction
    }

    const updatedUnits = [...units]

    const unitIndex = updatedUnits.findIndex((u) => u._id === unit._id)

    if (!section && !lesson) updatedUnits[unitIndex]._action = action

    if (section) {
      const sectionIndex = updatedUnits[unitIndex].sections.findIndex(
        (s) => s._id === section._id,
      )
      if (!lesson)
        updatedUnits[unitIndex].sections[sectionIndex]._action = action

      if (lesson) {
        const lessonIndex = updatedUnits[unitIndex].sections[
          sectionIndex
        ].lessons.findIndex((l) => l._id === lesson._id)

        updatedUnits[unitIndex].sections[sectionIndex].lessons[
          lessonIndex
        ]._action = action
      }
    }

    setValue('units', updatedUnits)
  }

  const updateUnits = function <
    K extends keyof (typeof units)[number],
    SK extends keyof (typeof units)[number]['sections'][number],
    LK extends
      keyof (typeof units)[number]['sections'][number]['lessons'][number],
  >({
    unit,
    section,
    lesson,
    unitKey,
    unitValue,
    sectionKey,
    sectionValue,
    lessonKey,
    lessonValue,
  }: UpdateUnitData<K, SK, LK>) {
    const updatedUnits = [...units]

    const unitIndex = updatedUnits.findIndex((u) => u._id === unit._id)

    if (unitKey && unitValue !== undefined)
      updatedUnits[unitIndex][unitKey] = unitValue

    if (section) {
      const sectionIndex = updatedUnits[unitIndex].sections.findIndex(
        (s) => s._id === section._id,
      )
      if (sectionKey && sectionValue !== undefined) {
        updatedUnits[unitIndex].sections[sectionIndex][sectionKey] =
          sectionValue
      }

      if (lesson && lessonKey && lessonValue !== undefined) {
        const lessonIndex = updatedUnits[unitIndex].sections[
          sectionIndex
        ].lessons.findIndex((l) => l._id === lesson._id)

        updatedUnits[unitIndex].sections[sectionIndex].lessons[lessonIndex][
          lessonKey
        ] = lessonValue
      }
    }

    changeAction({
      unit,
      section,
      lesson,
    })
    setValue('units', updatedUnits)
  }

  const unitErrors = form.formState.errors.units

  useEffect(() => {
    if (unitErrors && Array.isArray(unitErrors))
      unitErrors.map((unit) =>
        toast('Ocorreu os seguintes erros:', {
          description: (
            <pre className="mt-2 w-full rounded-md bg-zinc-900 p-4 whitespace-break-spaces">
              <code className="text-white">
                {JSON.stringify(unit, null, 2)}
              </code>
            </pre>
          ),
        }),
      )
  }, [unitErrors])

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="dark:text-violet-400 mt-4">
            <PlusIcon className="w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <div className="flex flex-col justify-between gap-4 flex-wrap">
            <GenerateUnitsButton
              currentModelId={currentModelId}
              units={units}
              onUnits={(units) => {
                setValue('units', [...units])
              }}
            />
          </div>

          <h1 className={`text-3xl leading-none ${pixelatedFont()}`}>
            Unidades
          </h1>

          <div className="flex flex-col gap-2">
            {units.map((unit, ui) => (
              <div
                key={unit._id}
                data-remove={
                  unit._action === 'remove' || unit._action === 'purge'
                }
                className="data-[remove=true]:border-red-400 relative group flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-gradient-to-tr from-zinc-700/20 to-zinc-700/40"
              >
                {(unit._action === 'remove' || unit._action === 'purge') && (
                  <Badge
                    className="absolute top-2 right-2 dark:bg-red-500"
                    variant="destructive"
                  >
                    Estado de segurança
                  </Badge>
                )}
                <GenerateUnitsButton
                  currentModelId={currentModelId}
                  units={units}
                  sectionUnitId={unit._id}
                  sections={unit.sections}
                  title={unit.title}
                  onUnits={(units) => {
                    setValue('units', [...units])
                  }}
                />
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(upsertUnitHandler)}
                    className="w-full"
                  >
                    <div>
                      <Editable.Root>
                        <Editable.Trigger
                          onSave={(value) => {
                            updateUnits({
                              unit,
                              unitKey: 'title',
                              unitValue: value as string,
                            })
                          }}
                        />
                        <Editable.Content>
                          <h1
                            className={`text-2xl leading-none ${pixelatedFont()}`}
                          >
                            {unit.title}
                          </h1>
                        </Editable.Content>
                        <Editable.Input
                          className="w-full"
                          defaultValue={unit.title}
                        />
                      </Editable.Root>

                      <div className="mt-2" />
                      <Editable.Root>
                        <Editable.Trigger
                          className="p-0 h-6 w-6 [&_svg]:!w-3"
                          onSave={(value) =>
                            updateUnits({
                              unit,
                              unitKey: 'prompt',
                              unitValue: value as string,
                            })
                          }
                        />
                        <Editable.Content>
                          <p className="text-xs text-zinc-500 max-w-md">
                            Prompt: {unit.prompt}
                          </p>
                        </Editable.Content>
                        <Editable.Input
                          className="w-full h-6 text-zinc-500 "
                          defaultValue={unit.prompt}
                        />
                      </Editable.Root>
                      <div className="mt-2" />
                      <Editable.Root>
                        <Editable.Trigger
                          className="p-0 h-6 w-6 [&_svg]:!w-3"
                          onSave={(value) =>
                            updateUnits({
                              unit,
                              unitKey: 'slug',
                              unitValue: value as string,
                            })
                          }
                        />
                        <Editable.Content>
                          <p className="text-xs text-zinc-500 max-w-md">
                            Slug: {unit.slug}
                          </p>
                        </Editable.Content>
                        <Editable.Input
                          className="w-full h-6 text-zinc-500 "
                          defaultValue={unit.slug}
                        />
                      </Editable.Root>

                      <FormField
                        control={form.control}
                        name={`units.${ui}.modelId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={(v) => {
                                  changeAction({
                                    unit,
                                  })

                                  field.onChange(v)
                                }}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-[180px] mt-2">
                                  <SelectValue placeholder="Selecione o modelo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Modelos</SelectLabel>
                                    {models.map((m) => (
                                      <SelectItem value={m.id} key={m.id}>
                                        {m.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-4">
                      {unit.sections.length > 0 && (
                        <h1 className={`text-2xl mb-2 ${pixelatedFont()}`}>
                          Seções
                        </h1>
                      )}

                      <div className="flex flex-wrap gap-2 ">
                        {unit.sections.map((section, si) => (
                          <div
                            key={section._id}
                            data-section-remove={
                              section._action === 'remove' ||
                              section._action === 'purge'
                            }
                            className="p-4 border w-full border-zinc-800 data-[section-remove=true]:border-red-400 group rounded-xl"
                          >
                            <Editable.Root>
                              <Editable.Trigger
                                className="p-0 [&_svg]:!w-3"
                                onSave={(value) =>
                                  updateUnits({
                                    unit,
                                    section,
                                    sectionKey: 'title',
                                    sectionValue: value as string,
                                  })
                                }
                              />
                              <Editable.Content>
                                <h1 className={`text-2xl ${pixelatedFont()}`}>
                                  {section.title}
                                </h1>
                              </Editable.Content>
                              <Editable.Input
                                className="w-full"
                                defaultValue={section.title}
                              />
                            </Editable.Root>
                            <div className="mt-2" />
                            <Editable.Root>
                              <Editable.Trigger
                                className="p-0 h-6 w-6 [&_svg]:!w-3"
                                onSave={(value) =>
                                  updateUnits({
                                    unit,
                                    section,
                                    sectionKey: 'prompt',
                                    sectionValue: value as string,
                                  })
                                }
                              />
                              <Editable.Content>
                                <p className="text-xs text-zinc-500 max-w-md">
                                  Prompt: {section.prompt}
                                </p>
                              </Editable.Content>
                              <Editable.Input
                                className="w-full h-6 text-zinc-500 "
                                defaultValue={section.prompt}
                              />
                            </Editable.Root>
                            <div className="mt-2" />
                            <Editable.Root>
                              <Editable.Trigger
                                className="p-0 h-6 w-6 [&_svg]:!w-3"
                                onSave={(value) =>
                                  updateUnits({
                                    unit,
                                    section,
                                    sectionKey: 'slug',
                                    sectionValue: value as string,
                                  })
                                }
                              />
                              <Editable.Content>
                                <p className="text-xs text-zinc-500 max-w-md">
                                  Slug: {section.slug}
                                </p>
                              </Editable.Content>
                              <Editable.Input
                                className="w-full h-6 text-zinc-500 "
                                defaultValue={section.slug || undefined}
                              />
                            </Editable.Root>
                            <div className="mt-2" />
                            <FormField
                              control={form.control}
                              name={`units.${ui}.sections.${si}.variant`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Select
                                      onValueChange={(v) => {
                                        changeAction({
                                          unit,
                                          section,
                                        })

                                        field.onChange(v)
                                      }}
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger className="w-[180px] mt-2">
                                        <SelectValue placeholder="Selecione o modelo" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Variante</SelectLabel>
                                          <SelectItem value="book">
                                            Book
                                          </SelectItem>
                                          <SelectItem value="default">
                                            Default
                                          </SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="mt-4">
                              {section.lessons.length > 0 && (
                                <h1
                                  className={`text-2xl mb-2 ${pixelatedFont()}`}
                                >
                                  Lições
                                </h1>
                              )}

                              <div className="flex flex-col gap-2 ">
                                {section.lessons.map((lesson) => (
                                  <div
                                    key={lesson._id}
                                    data-lesson-remove={
                                      lesson._action === 'remove' ||
                                      lesson._action === 'purge'
                                    }
                                    className="p-4 border group border-zinc-800 data-[lesson-remove=true]:border-red-400 rounded-xl"
                                  >
                                    <Editable.Root>
                                      <Editable.Trigger
                                        className="p-0 [&_svg]:!w-3"
                                        onSave={(value) =>
                                          updateUnits({
                                            unit,
                                            section,
                                            lesson,
                                            lessonKey: 'title',
                                            lessonValue: value as string,
                                          })
                                        }
                                      />
                                      <Editable.Content>
                                        <h1
                                          className={`text-2xl ${pixelatedFont()}`}
                                        >
                                          {lesson.title}
                                        </h1>
                                      </Editable.Content>
                                      <Editable.Input
                                        className="w-full"
                                        defaultValue={lesson.title}
                                      />
                                    </Editable.Root>
                                    <div className="mt-2" />
                                    <Editable.Root>
                                      <Editable.Trigger
                                        className="p-0 h-6 w-6 [&_svg]:!w-3"
                                        onSave={(value) =>
                                          updateUnits({
                                            unit,
                                            section,
                                            lesson,
                                            lessonKey: 'prompt',
                                            lessonValue: value as string,
                                          })
                                        }
                                      />
                                      <Editable.Content>
                                        <p className="text-xs text-zinc-500 max-w-md">
                                          Prompt: {lesson.prompt}
                                        </p>
                                      </Editable.Content>
                                      <Editable.Input
                                        className="w-full h-6 text-zinc-500 "
                                        defaultValue={
                                          lesson.prompt || undefined
                                        }
                                      />
                                    </Editable.Root>
                                    <div className="mt-2" />
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      className="dark:text-red-400 group-data-[lesson-remove=true]:dark:text-zinc-400"
                                      onClick={() => {
                                        changeAction({
                                          unit,
                                          section,
                                          lesson,
                                          action:
                                            lesson._action === 'remove' ||
                                            lesson._action === 'purge'
                                              ? undefined
                                              : lesson.lessonId
                                                ? 'purge'
                                                : 'remove',
                                        })
                                      }}
                                    >
                                      {lesson._action === 'remove' ||
                                      lesson._action === 'purge'
                                        ? 'Resetar'
                                        : 'Remover'}
                                    </Button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    updateUnits({
                                      unit,
                                      section,
                                      sectionKey: 'lessons',
                                      sectionValue: [
                                        ...section.lessons,
                                        {
                                          _id: snowflakeId(),
                                          _action: 'create',
                                          title: '??????????????????',
                                          description: null,
                                          prompt: '?????????? ????????',
                                        },
                                      ],
                                    })
                                  }}
                                  className="p-4 border border-zinc-800 transition-all text-zinc-600 flex items-center justify-center bg-zinc-800/40 hover:bg-zinc-800/80  rounded-xl"
                                >
                                  <PlusIcon />
                                </button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="dark:text-red-400 group-data-[section-remove=true]:dark:text-zinc-400"
                                  onClick={() => {
                                    changeAction({
                                      unit,
                                      section,
                                      action:
                                        section._action === 'remove' ||
                                        section._action === 'purge'
                                          ? undefined
                                          : section.sectionId
                                            ? 'purge'
                                            : 'remove',
                                    })
                                  }}
                                >
                                  {section._action === 'remove' ||
                                  section._action === 'purge'
                                    ? 'Resetar'
                                    : 'Remover'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            updateUnits({
                              unit,
                              unitKey: 'sections',
                              unitValue: [
                                ...unit.sections,
                                {
                                  _id: snowflakeId(),
                                  _action: 'create',
                                  title: '?????????',
                                  variant: 'book',
                                  description: null,
                                  prompt: '??????? ??????? ???????',
                                  lessons: [],
                                  slug: '???',
                                },
                              ],
                            })
                          }}
                          className="p-4 border border-zinc-800 transition-all text-zinc-600 flex items-center justify-center bg-zinc-800/40 hover:bg-zinc-800/80  rounded-xl"
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        type="submit"
                        variant="secondary"
                        className="dark:text-violet-400"
                      >
                        Atualizar
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="dark:text-red-400 group-data-[remove=true]:dark:text-zinc-400"
                        onClick={() => {
                          changeAction({
                            unit,
                            action:
                              unit._action === 'remove' ||
                              unit._action === 'purge'
                                ? undefined
                                : unit.unitId
                                  ? 'purge'
                                  : 'remove',
                          })
                        }}
                      >
                        {unit._action === 'remove' || unit._action === 'purge'
                          ? 'Resetar'
                          : 'Remover'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ))}
            <button
              onClick={() => {
                setValue('units', [
                  ...units,
                  {
                    _action: 'create',
                    title: '?????????',
                    sections: [],
                    modelId: models[0]?.id,
                    description: null,
                    prompt: '??????? ??????? ???????',
                    slug: '???',
                  },
                ])
              }}
              className="p-4 border border-zinc-800 transition-all flex items-center justify-center bg-zinc-900 text-zinc-600  hover:bg-zinc-800  rounded-xl"
            >
              <PlusIcon />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
