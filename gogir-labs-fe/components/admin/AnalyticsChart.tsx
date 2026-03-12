'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AnalyticsChartProps {
  data: Array<{ [key: string]: string | number }>
  dataKey: string
  nameKey: string
  label: string
}

export function AnalyticsChart({ data, dataKey, nameKey, label }: AnalyticsChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-gray-500">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={nameKey} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke="#0ea5e9" strokeWidth={2} name={label} />
      </LineChart>
    </ResponsiveContainer>
  )
}

