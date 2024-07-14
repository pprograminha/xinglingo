import { createHistory } from '@/actions/models/create-history'
import { getModels } from '@/actions/models/get-models'
import { getProducts } from '@/actions/stripe/get-products'
import { ButtonWithAccessChecker } from '@/components/button-with-access-checker'
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
import { openSansFont } from '@/lib/font/google/open-sans-font'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { retrieveActiveSubscription } from '@/lib/subscription'
import { redirect } from '@/navigation'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

type PetutorsProps = {
  t: Awaited<ReturnType<typeof getTranslations>>
  modelsData: Awaited<ReturnType<typeof getModels>>
  products: Awaited<ReturnType<typeof getProducts>>
  user: Awaited<ReturnType<typeof getAuth>>['user']
}

export const Petutors = ({ t, modelsData, user, products }: PetutorsProps) => {
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
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {modelsData.models.map((model, index) => (
            <form
              key={model.id}
              action={async () => {
                'use server'
                if (user && retrieveActiveSubscription(user)) {
                  createHistory({
                    modelId: model.id,
                    userId: user.id,
                  })

                  redirect(`/models/${model.slug}`)
                }
              }}
              data-recommended={
                petutorData[model.slug as keyof typeof petutorData]?.recommended
              }
              className="basis-60 flex-basis group bg-gradient-to-tr hover:border-zinc-500/40  border-zinc-800 data-[recommended=true]:hover:shadow-[inset_0_0px_30px_#7c3aed50] cursor-pointer data-[recommended=true]:hover:border-violet-500  from-zinc-900 to-zinc-800 rounded-lg border data-[recommended=true]:border-violet-600 flex-1 flex items-center justify-center relative"
            >
              <ButtonWithAccessChecker
                products={products}
                user={user}
                type="submit"
              >
                {petutorData[model.slug as keyof typeof petutorData]
                  ?.recommended && (
                  <Badge
                    variant="recommended"
                    className={`absolute top-0 right-0 -translate-y-1/2 translate-x-2 ${openSansFont()} tracking-wider`}
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
                        className={`text-lg whitespace-pre-wrap group-data-[recommended=true]:group-hover:animate-float group-data-[recommended=true]:group-hover:delay-700  ${pixelatedFont()}`}
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
                    className="group-data-[recommended=true]:group-hover:animate-float mx-auto max-w-[200px] h-[130px] md:max-w-[300px] md:h-[200px] "
                    width={300}
                    height={200}
                    alt="Petutor AI"
                  />
                </div>
              </ButtonWithAccessChecker>
            </form>
          ))}
        </CardContent>
      </div>
    </Card>
  )
}
