import { getTranslations } from 'next-intl/server'
import { toast } from 'sonner'

type Country = 'brazil' | 'unknown' | 'usa' | 'europe' | 'other'

const getInternalCountryOrContinent = (
  position: GeolocationPosition,
): Country => {
  const brazilMinLat = -33.832
  const brazilMaxLat = -5.001
  const brazilMinLon = -74.028
  const brazilMaxLon = -34.278
  const usaMinLat = 18.9208
  const usaMaxLat = 71.7076
  const usaMinLon = 67.0038
  const usaMaxLon = 125.3966
  const eurMinLat = 36.0
  const eurMaxLat = 71.0
  const eurMinLon = -20.0
  const eurMaxLon = 40.0

  const lat = position.coords.latitude
  const lon = position.coords.longitude
  if (
    lat >= eurMinLat &&
    lat <= eurMaxLat &&
    lon >= eurMinLon &&
    lon <= eurMaxLon
  ) {
    return 'europe'
  }
  if (
    lat >= usaMinLat &&
    lat <= usaMaxLat &&
    lon >= usaMinLon &&
    lon <= usaMaxLon
  ) {
    return 'usa'
  }
  if (
    lat >= brazilMinLat &&
    lat <= brazilMaxLat &&
    lon >= brazilMinLon &&
    lon <= brazilMaxLon
  ) {
    return 'brazil'
  }

  return 'other'
}

export async function getCountryOrContinent(
  t: Awaited<ReturnType<typeof getTranslations>>,
) {
  let contry: Country = 'unknown'

  contry = await new Promise<Country>((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(getInternalCountryOrContinent(position))
        },
        () => {
          toast(t('Could not obtain your location'), {
            description: t('Please allow your location to continue!'),
          })
          resolve('unknown')
        },
      )
    } else {
      toast(t('Your browser does not support Geolocation'), {
        description: t('Try again in another browser!'),
      })

      resolve('unknown')
    }
  })

  return contry
}
