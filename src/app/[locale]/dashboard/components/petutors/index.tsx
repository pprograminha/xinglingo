import { createHistory } from '@/actions/models/create-history'
import { getModels } from '@/actions/models/get-models'
import { Typing } from '@/components/typing'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getAuth } from '@/lib/auth/get-auth'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

type PetutorsProps = {
  t: Awaited<ReturnType<typeof getTranslations>>
  modelsData: Awaited<ReturnType<typeof getModels>>
  user: Awaited<ReturnType<typeof getAuth>>['user']
}

export const Petutors = ({ t, modelsData, user }: PetutorsProps) => {
  const petutorData = {
    ioua: {
      recommended: true,
      messages: [
        t("Hello, I'm Ioua"),
        t('With me, you can say whatever you want'),
      ],
    },
    luna: {
      recommended: false,
      messages: [
        t("Hello, I'm Luna"),
        t('Do you want to learn how to communicate in an interview?'),
      ],
    },
    ukki: {
      recommended: false,
      messages: [
        t("Hello, I'm Ukki"),
        t('Do you want to learn how to communicate in a restaurant?'),
      ],
    },
  }
  return (
    <Card className="bg-gradient-to-tr col-span-4 md:col-span-2  dark:from-zinc-920 dark:to-zinc-900">
      <div className="h-full md:bg-none bg-[url('/assets/svgs/layered-steps.svg')] w-full bg-repeat-y rounded-xl relative">
        <CardHeader className="mb-2">
          <CardTitle className={`text-2xl font-medium ${pixelatedFont()}`}>
            {t('Our AI Petutors')}
          </CardTitle>
          <CardDescription>
            {t(
              'The AI Petutor is a trained learning model designed to provide teaching and guidance',
            )}
          </CardDescription>

          {/* {user?.role === 'admin' && (
            <form
              action={async () => {
                'use server'
                createModel({
                  image: 'tutor-ai-03.png',
                  name: 'Ukki',
                  slug: 'ukki',
                })
              }}
            >
              <Button
                size="icon"
                className="absolute top-2 right-2"
                type="submit"
              >
                <PlusIcon />
              </Button>
            </form>
          )} */}
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {modelsData.models.map((model, index) => (
            <form
              key={model.id}
              action={async () => {
                'use server'
                if (user) {
                  createHistory({
                    modelId: model.id,
                    userId: user.id,
                  })
                }
              }}
              data-recommended={
                petutorData[model.slug as keyof typeof petutorData]?.recommended
              }
              className="basis-60 flex-basis group bg-gradient-to-tr hover:border-zinc-500/40  border-zinc-800 data-[recommended=true]:hover:shadow-[inset_0_0px_30px_#7c3aed50] cursor-pointer data-[recommended=true]:hover:border-violet-500  from-zinc-900 to-zinc-800 rounded-lg border data-[recommended=true]:border-violet-600 flex-1 flex items-center justify-center relative"
            >
              <button className="text-left">
                {petutorData[model.slug as keyof typeof petutorData]
                  ?.recommended && (
                  <Badge
                    variant="recommended"
                    className="absolute top-0 right-0 -translate-y-1/2 translate-x-2"
                  >
                    {t('Recommended')}
                  </Badge>
                )}

                <div className="bg-[url('/assets/svgs/bg.svg')]">
                  <div className="p-4">
                    {petutorData[
                      model.slug as keyof typeof petutorData
                    ]?.messages.map((message, i) => (
                      <p
                        key={message}
                        className={`text-lg group-data-[recommended=true]:group-hover:animate-float group-data-[recommended=true]:group-hover:delay-700  ${pixelatedFont()}`}
                      >
                        {i > 0 ? (
                          <Typing
                            text={`- ${message}`}
                            startDelay={500 * index}
                          />
                        ) : (
                          `- ${message}`
                        )}
                      </p>
                    ))}
                  </div>
                  <Image
                    src={`/assets/imgs/${model.image}`}
                    className="group-data-[recommended=true]:group-hover:animate-float mx-auto"
                    width={300}
                    height={200}
                    alt="Petutor AI"
                  />
                </div>
              </button>
            </form>
          ))}
        </CardContent>
      </div>
    </Card>
  )
}
