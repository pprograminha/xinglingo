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
import { Locale } from '@/lib/intl/locales'
import { snowflakeId } from '@/lib/snowflake'
import { unitFormSchema as unitFormSchemaFn } from '@/schemas/unit-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Unit } from '../../page'
import { GenerateUnitsButton } from './generate-units-button'
import { UnitLocales } from './locales'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { CaretSortIcon } from '@radix-ui/react-icons'

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

  const currentLocale = useLocale() as Locale

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
      const result: z.infer<typeof unitFormSchema>['units'][number] = {
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
  console.log(form.getValues('units'))
  const upsertUnitHandler = async (values: z.infer<typeof unitFormSchema>) => {
    console.log(values)
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

  const getLocaleTextIndex = (
    locales: { locale: Locale }[],
    locale: Locale,
  ) => {
    return locales.findIndex((l) => l.locale === locale)
  }
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
                  title={unit.title.root.data.text}
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
                      <UnitLocales
                        localeComponent={({ locale }) => (
                          <>
                            <Editable.Root>
                              <Editable.Trigger
                                onSave={(value) => {
                                  updateUnits({
                                    unit,
                                    unitKey: 'title',
                                    unitValue: (() => {
                                      const index = getLocaleTextIndex(
                                        unit.title.metadata,
                                        locale as Locale,
                                      )

                                      const metadata =
                                        unit.title.metadata[index]

                                      if (!metadata) {
                                        unit.title.metadata.push({
                                          data: {
                                            id: snowflakeId(),
                                            text: value as string,
                                          },
                                          locale: locale as Locale,
                                        })
                                      } else {
                                        const data = {
                                          ...metadata,
                                          data: {
                                            ...metadata?.data,
                                            text: value as string,
                                          },
                                        }

                                        unit.title.metadata[index] = data
                                      }

                                      if (currentLocale === locale) {
                                        unit.title.root.data = {
                                          ...unit.title.root.data,
                                          text: value as string,
                                        }
                                      }

                                      return unit.title
                                    })(),
                                  })
                                }}
                              />
                              <Editable.Content>
                                <h1
                                  className={`text-2xl leading-none ${pixelatedFont()}`}
                                >
                                  {
                                    unit.title.metadata.find(
                                      (md) => md.locale === locale,
                                    )?.data.text
                                  }
                                </h1>
                              </Editable.Content>
                              <Editable.Input
                                className="w-full"
                                defaultValue={
                                  unit.title.metadata.find(
                                    (md) => md.locale === locale,
                                  )?.data.text ?? ''
                                }
                              />
                            </Editable.Root>

                            <div className="mt-2" />
                            <Editable.Root>
                              <Editable.Trigger
                                className="p-0 h-6 w-6 [&_svg]:!w-3"
                                onSave={(value) => {
                                  updateUnits({
                                    unit,
                                    unitKey: 'prompt',
                                    unitValue: (() => {
                                      const index = getLocaleTextIndex(
                                        unit.prompt.metadata,
                                        locale as Locale,
                                      )
                                      const metadata =
                                        unit.prompt.metadata[index]

                                      if (!metadata) {
                                        unit.prompt.metadata.push({
                                          data: {
                                            id: snowflakeId(),
                                            text: value as string,
                                          },
                                          locale: locale as Locale,
                                        })
                                      } else {
                                        const data = {
                                          ...metadata,
                                          data: {
                                            ...metadata?.data,
                                            text: value as string,
                                          },
                                        }

                                        unit.prompt.metadata[index] = data
                                      }

                                      if (currentLocale === locale) {
                                        unit.prompt.root = {
                                          ...unit.prompt.root,
                                          data: {
                                            ...unit.prompt.root.data,
                                            text: value as string,
                                          },
                                        }
                                      }

                                      return unit.prompt
                                    })(),
                                  })
                                }}
                              />
                              <Editable.Content>
                                <p className="text-xs text-zinc-500 max-w-md">
                                  Prompt:{' '}
                                  {
                                    unit.prompt.metadata.find(
                                      (md) => md.locale === locale,
                                    )?.data.text
                                  }
                                </p>
                              </Editable.Content>
                              <Editable.Input
                                className="w-full h-6 text-zinc-500 "
                                defaultValue={
                                  unit.prompt.metadata.find(
                                    (md) => md.locale === locale,
                                  )?.data.text ?? ''
                                }
                              />
                            </Editable.Root>
                            <div className="mt-2" />
                            <Editable.Root>
                              <Editable.Trigger
                                className="p-0 h-6 w-6 [&_svg]:!w-3"
                                onSave={(value) => {
                                  updateUnits({
                                    unit,
                                    unitKey: 'slug',
                                    unitValue: (() => {
                                      const index = getLocaleTextIndex(
                                        unit.slug.metadata,
                                        locale as Locale,
                                      )
                                      const metadata = unit.slug.metadata[index]

                                      if (!metadata) {
                                        unit.slug.metadata.push({
                                          data: {
                                            id: snowflakeId(),
                                            text: value as string,
                                          },
                                          locale: locale as Locale,
                                        })
                                      } else {
                                        const data = {
                                          ...metadata,
                                          data: {
                                            ...metadata?.data,
                                            text: value as string,
                                          },
                                        }

                                        unit.slug.metadata[index] = data
                                      }

                                      if (currentLocale === locale) {
                                        unit.slug.root = {
                                          ...unit.slug.root,
                                          data: {
                                            ...unit.slug.root.data,
                                            text: value as string,
                                          },
                                        }
                                      }

                                      return unit.slug
                                    })(),
                                  })
                                }}
                              />
                              <Editable.Content>
                                <p className="text-xs text-zinc-500 max-w-md">
                                  Slug:{' '}
                                  {
                                    unit.slug.metadata.find(
                                      (md) => md.locale === locale,
                                    )?.data.text
                                  }
                                </p>
                              </Editable.Content>
                              <Editable.Input
                                className="w-full h-6 text-zinc-500 "
                                defaultValue={
                                  unit.slug.metadata.find(
                                    (md) => md.locale === locale,
                                  )?.data.text ?? ''
                                }
                              />
                            </Editable.Root>
                          </>
                        )}
                      />
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
                      <Collapsible>
                        <div className="flex items-center justify-between space-x-4 px-4">
                          <h1 className={`text-2xl mb-2 ${pixelatedFont()}`}>
                            Seções
                          </h1>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <CaretSortIcon className="h-4 w-4" />
                              <span className="sr-only">Toggle</span>
                            </Button>
                          </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="space-y-2">
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
                                <UnitLocales
                                  localeComponent={({ locale }) => (
                                    <>
                                      <Editable.Root>
                                        <Editable.Trigger
                                          className="p-0 [&_svg]:!w-3"
                                          onSave={(value) =>
                                            updateUnits({
                                              unit,
                                              section,
                                              sectionKey: 'title',
                                              sectionValue: (() => {
                                                const index =
                                                  getLocaleTextIndex(
                                                    section.title.metadata,
                                                    locale as Locale,
                                                  )
                                                const metadata =
                                                  section.title.metadata[index]

                                                if (!metadata) {
                                                  section.title.metadata.push({
                                                    data: {
                                                      id: snowflakeId(),
                                                      text: value as string,
                                                    },
                                                    locale: locale as Locale,
                                                  })
                                                } else {
                                                  const data = {
                                                    ...metadata,
                                                    data: {
                                                      ...metadata?.data,
                                                      text: value as string,
                                                    },
                                                  }

                                                  section.title.metadata[
                                                    index
                                                  ] = data
                                                }

                                                if (currentLocale === locale) {
                                                  section.title.root.data = {
                                                    ...section.title.root.data,
                                                    text: value as string,
                                                  }
                                                }

                                                return section.title
                                              })(),
                                            })
                                          }
                                        />
                                        <Editable.Content>
                                          <h1
                                            className={`text-2xl ${pixelatedFont()}`}
                                          >
                                            {
                                              section.title.metadata.find(
                                                (md) => md.locale === locale,
                                              )?.data.text
                                            }
                                          </h1>
                                        </Editable.Content>
                                        <Editable.Input
                                          className="w-full"
                                          defaultValue={
                                            section.title.metadata.find(
                                              (md) => md.locale === locale,
                                            )?.data.text ?? ''
                                          }
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
                                              sectionValue: (() => {
                                                const index =
                                                  getLocaleTextIndex(
                                                    section.prompt.metadata,
                                                    locale as Locale,
                                                  )
                                                const metadata =
                                                  section.prompt.metadata[index]

                                                if (!metadata) {
                                                  section.prompt.metadata.push({
                                                    data: {
                                                      id: snowflakeId(),
                                                      text: value as string,
                                                    },
                                                    locale: locale as Locale,
                                                  })
                                                } else {
                                                  const data = {
                                                    ...metadata,
                                                    data: {
                                                      ...metadata?.data,
                                                      text: value as string,
                                                    },
                                                  }

                                                  section.prompt.metadata[
                                                    index
                                                  ] = data
                                                }

                                                if (currentLocale === locale) {
                                                  section.prompt.root = {
                                                    ...section.prompt.root,
                                                    data: {
                                                      ...section.prompt.root
                                                        .data,
                                                      text: value as string,
                                                    },
                                                  }
                                                }

                                                return section.prompt
                                              })(),
                                            })
                                          }
                                        />
                                        <Editable.Content>
                                          <p className="text-xs text-zinc-500 max-w-md">
                                            Prompt:{' '}
                                            {
                                              section.prompt.metadata.find(
                                                (md) => md.locale === locale,
                                              )?.data.text
                                            }
                                          </p>
                                        </Editable.Content>
                                        <Editable.Input
                                          className="w-full h-6 text-zinc-500 "
                                          defaultValue={
                                            section.prompt.metadata.find(
                                              (md) => md.locale === locale,
                                            )?.data.text ?? ''
                                          }
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
                                              sectionValue: (() => {
                                                const index =
                                                  getLocaleTextIndex(
                                                    section.slug.metadata,
                                                    locale as Locale,
                                                  )
                                                const metadata =
                                                  section.slug.metadata[index]

                                                if (!metadata) {
                                                  section.slug.metadata.push({
                                                    data: {
                                                      id: snowflakeId(),
                                                      text: value as string,
                                                    },
                                                    locale: locale as Locale,
                                                  })
                                                } else {
                                                  const data = {
                                                    ...metadata,
                                                    data: {
                                                      ...metadata?.data,
                                                      text: value as string,
                                                    },
                                                  }

                                                  section.slug.metadata[index] =
                                                    data
                                                }

                                                if (currentLocale === locale) {
                                                  section.slug.root = {
                                                    ...section.slug.root,
                                                    data: {
                                                      ...section.slug.root.data,
                                                      text: value as string,
                                                    },
                                                  }
                                                }

                                                return section.slug
                                              })(),
                                            })
                                          }
                                        />
                                        <Editable.Content>
                                          <p className="text-xs text-zinc-500 max-w-md">
                                            Slug:{' '}
                                            {
                                              section.slug.metadata.find(
                                                (md) => md.locale === locale,
                                              )?.data?.text
                                            }
                                          </p>
                                        </Editable.Content>
                                        <Editable.Input
                                          className="w-full h-6 text-zinc-500 "
                                          defaultValue={
                                            section.slug.metadata.find(
                                              (md) => md.locale === locale,
                                            )?.data?.text ?? ''
                                          }
                                        />
                                      </Editable.Root>
                                    </>
                                  )}
                                />

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
                                              <SelectLabel>
                                                Variante
                                              </SelectLabel>
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
                                  <Collapsible>
                                    <div className="flex items-center justify-between space-x-4 px-4">
                                      <h1
                                        className={`text-2xl mb-2 ${pixelatedFont()}`}
                                      >
                                        Lições
                                      </h1>
                                      <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <CaretSortIcon className="h-4 w-4" />
                                          <span className="sr-only">
                                            Toggle
                                          </span>
                                        </Button>
                                      </CollapsibleTrigger>
                                    </div>

                                    <CollapsibleContent className="space-y-2">
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
                                            <UnitLocales
                                              localeComponent={({ locale }) => (
                                                <>
                                                  <Editable.Root>
                                                    <Editable.Trigger
                                                      className="p-0 [&_svg]:!w-3"
                                                      onSave={(value) =>
                                                        updateUnits({
                                                          unit,
                                                          section,
                                                          lesson,
                                                          lessonKey: 'title',
                                                          lessonValue: (() => {
                                                            const index =
                                                              getLocaleTextIndex(
                                                                lesson.title
                                                                  .metadata,
                                                                locale as Locale,
                                                              )
                                                            const metadata =
                                                              lesson.title
                                                                .metadata[index]

                                                            if (!metadata) {
                                                              lesson.title.metadata.push(
                                                                {
                                                                  data: {
                                                                    id: snowflakeId(),
                                                                    text: value as string,
                                                                  },
                                                                  locale:
                                                                    locale as Locale,
                                                                },
                                                              )
                                                            } else {
                                                              const data = {
                                                                ...metadata,
                                                                data: {
                                                                  ...metadata?.data,
                                                                  text: value as string,
                                                                },
                                                              }

                                                              lesson.title.metadata[
                                                                index
                                                              ] = data
                                                            }

                                                            if (
                                                              currentLocale ===
                                                              locale
                                                            ) {
                                                              lesson.title.root.data =
                                                                {
                                                                  ...lesson
                                                                    .title.root
                                                                    .data,
                                                                  text: value as string,
                                                                }
                                                            }

                                                            return lesson.title
                                                          })(),
                                                        })
                                                      }
                                                    />
                                                    <Editable.Content>
                                                      <h1
                                                        className={`text-2xl ${pixelatedFont()}`}
                                                      >
                                                        {
                                                          lesson.title.metadata.find(
                                                            (md) =>
                                                              md.locale ===
                                                              locale,
                                                          )?.data?.text
                                                        }
                                                      </h1>
                                                    </Editable.Content>
                                                    <Editable.Input
                                                      className="w-full"
                                                      defaultValue={
                                                        lesson.title.metadata.find(
                                                          (md) =>
                                                            md.locale ===
                                                            locale,
                                                        )?.data?.text ?? ''
                                                      }
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
                                                          lessonValue: (() => {
                                                            const index =
                                                              getLocaleTextIndex(
                                                                lesson.prompt
                                                                  .metadata,
                                                                locale as Locale,
                                                              )
                                                            const metadata =
                                                              lesson.prompt
                                                                .metadata[index]

                                                            if (!metadata) {
                                                              lesson.prompt.metadata.push(
                                                                {
                                                                  data: {
                                                                    id: snowflakeId(),
                                                                    text: value as string,
                                                                  },
                                                                  locale:
                                                                    locale as Locale,
                                                                },
                                                              )
                                                            } else {
                                                              const data = {
                                                                ...metadata,
                                                                data: {
                                                                  ...metadata?.data,
                                                                  text: value as string,
                                                                },
                                                              }

                                                              lesson.prompt.metadata[
                                                                index
                                                              ] = data
                                                            }

                                                            if (
                                                              currentLocale ===
                                                              locale
                                                            ) {
                                                              lesson.prompt.root =
                                                                {
                                                                  ...lesson
                                                                    .prompt
                                                                    .root,
                                                                  data: {
                                                                    ...lesson
                                                                      .prompt
                                                                      .root
                                                                      .data,
                                                                    text: value as string,
                                                                  },
                                                                }
                                                            }

                                                            return lesson.prompt
                                                          })(),
                                                        })
                                                      }
                                                    />
                                                    <Editable.Content>
                                                      <p className="text-xs text-zinc-500 max-w-md">
                                                        Prompt:{' '}
                                                        {
                                                          lesson.prompt.metadata.find(
                                                            (md) =>
                                                              md.locale ===
                                                              locale,
                                                          )?.data?.text
                                                        }
                                                      </p>
                                                    </Editable.Content>
                                                    <Editable.Input
                                                      className="w-full h-6 text-zinc-500 "
                                                      defaultValue={
                                                        lesson.prompt.metadata.find(
                                                          (md) =>
                                                            md.locale ===
                                                            locale,
                                                        )?.data?.text ?? ''
                                                      }
                                                    />
                                                  </Editable.Root>
                                                </>
                                              )}
                                            />

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
                                                    lesson._action ===
                                                      'remove' ||
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
                                                  title: (() => {
                                                    const rootId = snowflakeId()

                                                    return {
                                                      root: {
                                                        data: {
                                                          id: rootId,
                                                          text: '????????',
                                                        },
                                                        locale: currentLocale,
                                                      },
                                                      metadata: [
                                                        {
                                                          data: {
                                                            id: rootId,
                                                            text: '????????',
                                                          },
                                                          locale: currentLocale,
                                                        },
                                                      ],
                                                    }
                                                  })(),
                                                  description: (() => {
                                                    const rootId = snowflakeId()

                                                    return {
                                                      root: {
                                                        data: {
                                                          id: rootId,
                                                          text: '????????',
                                                        },
                                                        locale: currentLocale,
                                                      },
                                                      metadata: [
                                                        {
                                                          data: {
                                                            id: rootId,
                                                            text: '????????',
                                                          },
                                                          locale: currentLocale,
                                                        },
                                                      ],
                                                    }
                                                  })(),
                                                  prompt: (() => {
                                                    const rootId = snowflakeId()

                                                    return {
                                                      root: {
                                                        data: {
                                                          id: rootId,
                                                          text: '????????',
                                                        },
                                                        locale: currentLocale,
                                                      },
                                                      metadata: [
                                                        {
                                                          data: {
                                                            id: rootId,
                                                            text: '????????',
                                                          },
                                                          locale: currentLocale,
                                                        },
                                                      ],
                                                    }
                                                  })(),
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
                                    </CollapsibleContent>
                                  </Collapsible>
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
                                      title: (() => {
                                        const rootId = snowflakeId()

                                        return {
                                          root: {
                                            data: {
                                              id: rootId,
                                              text: '????????',
                                            },
                                            locale: currentLocale,
                                          },
                                          metadata: [
                                            {
                                              data: {
                                                id: rootId,
                                                text: '????????',
                                              },
                                              locale: currentLocale,
                                            },
                                          ],
                                        }
                                      })(),
                                      variant: 'book',
                                      description: (() => {
                                        const rootId = snowflakeId()

                                        return {
                                          root: {
                                            data: {
                                              id: rootId,
                                              text: '????????',
                                            },
                                            locale: currentLocale,
                                          },
                                          metadata: [
                                            {
                                              data: {
                                                id: rootId,
                                                text: '????????',
                                              },
                                              locale: currentLocale,
                                            },
                                          ],
                                        }
                                      })(),
                                      prompt: (() => {
                                        const rootId = snowflakeId()

                                        return {
                                          root: {
                                            data: {
                                              id: rootId,
                                              text: '????????',
                                            },
                                            locale: currentLocale,
                                          },
                                          metadata: [
                                            {
                                              data: {
                                                id: rootId,
                                                text: '????????',
                                              },
                                              locale: currentLocale,
                                            },
                                          ],
                                        }
                                      })(),
                                      lessons: [],
                                      slug: (() => {
                                        const rootId = snowflakeId()

                                        return {
                                          root: {
                                            data: {
                                              id: rootId,
                                              text: '????????',
                                            },
                                            locale: currentLocale,
                                          },
                                          metadata: [
                                            {
                                              data: {
                                                id: rootId,
                                                text: '????????',
                                              },
                                              locale: currentLocale,
                                            },
                                          ],
                                        }
                                      })(),
                                    },
                                  ],
                                })
                              }}
                              className="p-4 border border-zinc-800 transition-all text-zinc-600 flex items-center justify-center bg-zinc-800/40 hover:bg-zinc-800/80  rounded-xl"
                            >
                              <PlusIcon />
                            </button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
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
                    title: (() => {
                      const rootId = snowflakeId()

                      return {
                        root: {
                          data: {
                            id: rootId,
                            text: '????????',
                          },
                          locale: currentLocale,
                        },
                        metadata: [
                          {
                            data: {
                              id: rootId,
                              text: '????????',
                            },
                            locale: currentLocale,
                          },
                        ],
                      }
                    })(),
                    sections: [],
                    modelId: models[0]?.id,
                    description: {
                      root: {
                        data: {
                          id: null,
                          text: null,
                        },
                        locale: currentLocale,
                      },
                      metadata: [],
                    },
                    prompt: (() => {
                      const rootId = snowflakeId()

                      return {
                        root: {
                          data: {
                            id: rootId,
                            text: '????????',
                          },
                          locale: currentLocale,
                        },
                        metadata: [
                          {
                            data: {
                              id: rootId,
                              text: '????????',
                            },
                            locale: currentLocale,
                          },
                        ],
                      }
                    })(),
                    slug: (() => {
                      const rootId = snowflakeId()

                      return {
                        root: {
                          data: {
                            id: rootId,
                            text: '????????',
                          },
                          locale: currentLocale,
                        },
                        metadata: [
                          {
                            data: {
                              id: rootId,
                              text: '????????',
                            },
                            locale: currentLocale,
                          },
                        ],
                      }
                    })(),
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
