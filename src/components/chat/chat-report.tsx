import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { zodResolver } from '@hookform/resolvers/zod'
import { FlagTriangleRightIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Textarea } from '../ui/textarea'

const reportDataSchema = z.object({
  category: z.string().min(1),
  description: z.string().min(1).max(255),
})
type ReportData = z.infer<typeof reportDataSchema>
export const ChatReport = () => {
  const t = useTranslations()
  const form = useForm<ReportData>({
    resolver: zodResolver(reportDataSchema),
  })

  const allCategories = [
    t('Threats and harassment'),
    t('Excessive violence'),
    t('False statements'),
    t('Hate speech'),
    t('NSFW (Not Safe For Work)'),
    t('Sexual harassment'),
    t('Child exploitation'),
    t('Self-harm'),
    t('Terrorism and extremism'),
    t('Illegal activities'),
    t('Drug transactions'),
    t('Invasion of privacy'),
    t('Identity theft'),
    t('Commercial spam'),
  ]
  const categoriesPerGroup = allCategories.reduce(
    (previousValue, c, i) => {
      const middleIndex = Math.round(allCategories.length / 2)

      if (i <= middleIndex) {
        previousValue[0].push(c)
      } else {
        previousValue[1].push(c)
      }

      return previousValue
    },
    [[], []] as [typeof allCategories, typeof allCategories],
  )

  const reportHandler = (data: ReportData) => {
    toast('You submitted the following values:', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full shrink-0 ml-auto text-zinc-500"
        >
          <FlagTriangleRightIcon className="w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent overlayClassName="dark:bg-transparent">
        <DialogHeader className="flex flex-row gap-2 items-center mb-4">
          <FlagTriangleRightIcon className="w-4" />
          <DialogTitle
            className={`${pixelatedFont.className} text-2xl leading-3`}
          >
            {t('Report model')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(reportHandler)}
            className="space-y-8"
          >
            <div className="flex flex-row flex-wrap items-center justify-between gap-4">
              {categoriesPerGroup.map((categories, i) => (
                <div key={i} className="min-w-[10rem]">
                  <FormField
                    control={form.control}
                    name="category"
                    render={() => (
                      <FormItem>
                        {categories.map((category) => (
                          <FormField
                            key={category}
                            control={form.control}
                            name="category"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={category}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value === category}
                                      onCheckedChange={() => {
                                        return field.onChange(category)
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {category}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">
                    {t('Additional details')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t('Describe the problem in more detail')}
                      className="resize-none min-h-28 dark:border-zinc-700 border-2"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t('Cancel')}</Button>
              </DialogClose>
              <Button type="submit">{t('Confirm')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
