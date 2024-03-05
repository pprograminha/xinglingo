'use client'

import { Word } from '@/lib/db/drizzle/@types'
import { getMonth } from 'date-fns'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type OverviewProps = {
  wordsSameYear: Word[]
}
export function Overview({ wordsSameYear }: OverviewProps) {
  const data = [
    {
      name: 'Jan',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 0).length,
    },
    {
      name: 'Feb',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 1).length,
    },
    {
      name: 'Mar',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 2).length,
    },
    {
      name: 'Apr',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 3).length,
    },
    {
      name: 'May',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 4).length,
    },
    {
      name: 'Jun',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 5).length,
    },
    {
      name: 'Jul',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 6).length,
    },
    {
      name: 'Aug',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 7).length,
    },
    {
      name: 'Sep',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 8).length,
    },
    {
      name: 'Oct',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 9).length,
    },
    {
      name: 'Nov',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 10).length,
    },
    {
      name: 'Dec',
      total: wordsSameYear.filter((w) => getMonth(w.createdAt) === 11).length,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
  )
}
