'use client'

import { getWordsList } from '@/actions/conversations/get-words-list'
import { Separator } from '@radix-ui/react-separator'
import { getDay, getMonth, isSameWeek, startOfDay } from 'date-fns'
import { useTranslations } from 'next-intl'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Words = Awaited<ReturnType<typeof getWordsList>>

type DailyWordsProps = {
  greenWords: Words['green']['words']
  yellowWords: Words['yellow']['words']
  redWords: Words['red']['words']
}

const day = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

const month = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

export function DailyWords({
  greenWords,
  redWords,
  yellowWords,
}: DailyWordsProps) {
  const t = useTranslations()
  const currentDate = startOfDay(new Date())

  const weekGreenWords = greenWords.filter((w) =>
    isSameWeek(w.createdAt, currentDate),
  )
  const weekRedWords = redWords.filter((w) =>
    isSameWeek(w.createdAt, currentDate),
  )
  const weekYellowWords = yellowWords.filter((w) =>
    isSameWeek(w.createdAt, currentDate),
  )

  const getWordColors = (weekDay: keyof typeof day) => {
    const score = (words: Words['words']) =>
      words.filter((w) => getDay(w.createdAt) === day[weekDay]).length

    return {
      green: score(weekGreenWords),
      red: score(weekRedWords),
      yellow: score(weekYellowWords),
    }
  }

  const daysOfWeek = Object.keys(day) as (keyof typeof day)[]

  const daysOfWeekWithScores = daysOfWeek.map((d) => ({
    name: t(d),
    ...getWordColors(d),
  }))

  const monthEntries = Object.entries(month) as [keyof typeof month, number][]

  const months = monthEntries.map(([m, mAsNum]) => ({
    name: t(m),
    total: greenWords.filter((w) => getMonth(w.createdAt) === mAsNum).length,
  }))

  return (
    <div className="gap-2 flex flex-col">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={months}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar
            dataKey="total"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
      <Separator className="dark:bg-white/10 h-px my-10" />
      <h1 className="ml-5 mb-5 font-bold">Daily Words</h1>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={daysOfWeekWithScores} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0} />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip label="heelo" />
          <Legend />
          <Line type="monotone" dataKey="green" stroke="#82ca9d" />
          <Line type="monotone" dataKey="yellow" stroke="#c9d884" />
          <Line type="monotone" dataKey="red" stroke="#d88484" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
