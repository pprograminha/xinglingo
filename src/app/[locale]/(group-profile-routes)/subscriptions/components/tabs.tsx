'use client'
import { Subscriptions } from '@/components/subscriptions'
import {
  TabsContent,
  TabsList,
  Tabs as TabsPrimitive,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { User } from '@/lib/db/drizzle/types'
import { retrieveSubscription } from '@/lib/subscription'
import { MyPlans } from './my-plans'
import { useTranslations } from 'next-intl'
type TabsProps = {
  user?: User | null
}

export const Tabs = ({ user }: TabsProps) => {
  const subscription = retrieveSubscription(user)

  const t = useTranslations()
  return (
    <TabsPrimitive
      defaultValue={subscription ? 'my-plans' : 'plans'}
      className="w-full group"
    >
      <TabsList className="flex w-full flex-wrap gap-1 h-auto">
        <TabsTrigger className="flex-1" value="plans">
          {t('Plans')}
        </TabsTrigger>
        <TabsTrigger
          disabled={!subscription}
          className="flex-1"
          value="my-plans"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full h-full">
                {t('My plans')}
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="plans">
        <Subscriptions variant="list" user={user} />
      </TabsContent>
      <TabsContent value="my-plans">
        <MyPlans user={user} />
      </TabsContent>
    </TabsPrimitive>
  )
}
