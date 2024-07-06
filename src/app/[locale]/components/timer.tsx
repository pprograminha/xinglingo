'use client'

import { Badge } from '@/components/ui/badge'
import { pixelatedFont } from '@/lib/font/google/pixelated-font'
import { cn } from '@/lib/utils'
import { differenceInSeconds, subSeconds } from 'date-fns'
import { useTranslations } from 'next-intl'
import { HtmlHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'

type TimerProps = {
  expireAt: Date
} & HtmlHTMLAttributes<HTMLDivElement>

export const Timer = ({
  expireAt: defaultExpireAt,
  className,
  ...props
}: TimerProps) => {
  const [isClient, setIsClient] = useState(false)
  const expireAt = useRef(defaultExpireAt)
  const currentDate = useMemo(() => new Date(), [])
  const t = useTranslations()

  const defaultDate = differenceInSeconds(expireAt.current, currentDate)

  const [seconds, setSeconds] = useState(defaultDate)

  useEffect(() => {
    setIsClient(true)

    const timer = setTimeout(() => {
      expireAt.current = subSeconds(expireAt.current, 1)
      setSeconds(
        differenceInSeconds(subSeconds(expireAt.current, 1), currentDate),
      )
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [currentDate, seconds])

  const parseTime = () => {
    const daysInFloat = seconds / 60 / 60 / 24
    const days = Math.floor(daysInFloat)
    const daysRest = daysInFloat - days

    const hoursInFloat = daysRest * 24
    const hours = Math.floor(hoursInFloat)
    const hoursRest = hoursInFloat - hours

    const minutesInFloat = hoursRest * 60
    const minutes = Math.floor(minutesInFloat)
    const minutesRest = minutesInFloat - minutes

    const secondsInFloat = minutesRest * 60
    const secondsTime = Math.round(secondsInFloat).toString().padStart(2, '0')

    return {
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secondsTime,
    }
  }

  const time = parseTime()

  if (!isClient)
    return (
      <Badge
        variant="discount"
        className={cn(`${pixelatedFont()} text-md font-thin`, className)}
        {...props}
      >
        {0}d 00h 00m 00s
      </Badge>
    )

  return (
    <Badge
      variant="discount"
      className={cn(`${pixelatedFont()} text-md font-thin`, className)}
      {...props}
    >
      {time.days} {t('days')} {time.hours}h {time.minutes}m {time.seconds}s
    </Badge>
  )
}
