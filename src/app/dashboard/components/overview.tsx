'use client'

import { Word } from '@/lib/db/drizzle/@types'
import { Separator } from '@radix-ui/react-separator'
import {
  getMonth,
  isSameDay,
  lastDayOfWeek,
  startOfDay,
  subDays,
} from 'date-fns'
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

  const isDayOfWeek = (d: Date, n: number) =>
    isSameDay(d, subDays(lastDayOfWeek(currentDate), n))

  const daysOfWeek = [
    {
      name: 'Mon',
      green: greenWords.filter((w) => isDayOfWeek(w.createdAt, 6)).length,
      red: redWords.filter((w) => isDayOfWeek(w.createdAt, 6)).length,
      yellow: yellowWords.filter((w) => isDayOfWeek(w.createdAt, 6)).length,
    },
    {
      name: 'Tue',
      green: greenWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 5)),
      ).length,
      yellow: yellowWords.filter((w) => isDayOfWeek(w.createdAt, 5)).length,
      red: redWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 5)),
      ).length,
    },
    {
      name: 'Wed',
      green: greenWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 4)),
      ).length,
      red: redWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 4)),
      ).length,
      yellow: yellowWords.filter((w) => isDayOfWeek(w.createdAt, 4)).length,
    },
    {
      name: 'Thu',
      green: greenWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 3)),
      ).length,
      red: redWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 3)),
      ).length,
      yellow: yellowWords.filter((w) => isDayOfWeek(w.createdAt, 3)).length,
    },
    {
      name: 'Fri',
      green: greenWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 2)),
      ).length,
      red: redWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 2)),
      ).length,
      yellow: yellowWords.filter((w) => isDayOfWeek(w.createdAt, 2)).length,
    },
    {
      name: 'Sat',
      green: greenWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 1)),
      ).length,
      red: redWords.filter((w) =>
        isSameDay(w.createdAt, subDays(lastDayOfWeek(currentDate), 1)),
      ).length,
      yellow: yellowWords.filter((w) => isDayOfWeek(w.createdAt, 1)).length,
    },
    {
      name: 'Sun',
      green: greenWords.filter((w) =>
        isSameDay(w.createdAt, lastDayOfWeek(w.createdAt)),
      ).length,
      yellow: yellowWords.filter((w) =>
        isSameDay(w.createdAt, lastDayOfWeek(w.createdAt)),
      ).length,
      red: redWords.filter((w) =>
        isSameDay(w.createdAt, lastDayOfWeek(w.createdAt)),
      ).length,
    },
  ]
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
        <LineChart data={daysOfWeek} barSize={20}>
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
