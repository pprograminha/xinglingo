import { getUnits } from '@/actions/units/get-units'
import { getAuth } from '@/lib/auth/get-auth'
import { getCurrentLocale } from '@/lib/intl/get-current-locale'
import { redirect } from '@/navigation'
import { ConsoleContainer } from './console-container'
type ConsolePageProps = {
  params: Promise<{
    'model-id': string
  }>
}
export default async function ConsolePage({
  params: paramsPromise,
}: ConsolePageProps) {
  const { user } = await getAuth()
  const locale = await getCurrentLocale()

  if (!user || user.role !== 'superadmin')
    return redirect({
      href: '/auth',
      locale,
    })

  const params = await paramsPromise

  const units = await getUnits({
    modelId: params['model-id'],
    locale,
  })

  return <ConsoleContainer units={units} currentModelId={params['model-id']} />
}
