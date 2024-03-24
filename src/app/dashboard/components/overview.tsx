'use client'

import { Word } from '@/lib/db/drizzle/@types'
import { Separator } from '@radix-ui/react-separator'
import { getDay, getMonth, isSameWeek, startOfDay } from 'date-fns'
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

type OverviewProps = {
  greenWords: Word[]
  yellowWords: Word[]
  redWords: Word[]
}

export function Overview({ greenWords, redWords, yellowWords }: OverviewProps) {
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

  const day = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }

  const getWordColors = (weekDay: keyof typeof day) => {
    const score = (words: Word[]) =>
      words.filter((w) => getDay(w.createdAt) === day[weekDay]).length

    return {
      green: score(weekGreenWords),
      red: score(weekRedWords),
      yellow: score(weekYellowWords),
    }
  }

  const daysOfWeek = Object.keys(day) as (keyof typeof day)[]

  const daysOfWeekWithScores = daysOfWeek.map((d) => ({
    name: d,
    ...getWordColors(d),
  }))

  const months = [
    {
      name: 'Jan',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 0).length,
    },
    {
      name: 'Feb',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 1).length,
    },
    {
      name: 'Mar',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 2).length,
    },
    {
      name: 'Apr',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 3).length,
    },
    {
      name: 'May',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 4).length,
    },
    {
      name: 'Jun',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 5).length,
    },
    {
      name: 'Jul',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 6).length,
    },
    {
      name: 'Aug',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 7).length,
    },
    {
      name: 'Sep',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 8).length,
    },
    {
      name: 'Oct',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 9).length,
    },
    {
      name: 'Nov',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 10).length,
    },
    {
      name: 'Dec',
      total: greenWords.filter((w) => getMonth(w.createdAt) === 11).length,
    },
  ]

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
          {/* <Bar
            dataKey="total"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
