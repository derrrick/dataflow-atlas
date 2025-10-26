'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { tufteColors, tufteTypography } from '@/lib/charts/core/tufte-theme'
import type { Earthquake, Hazard, Outage, LatencyPoint } from '@/lib/services/dataTypes'

interface TimelineProps {
  data: (Earthquake | Hazard | Outage | LatencyPoint)[]
  width?: number
  height?: number
}

export function Timeline({ data, width, height = 300 }: TimelineProps) {
  const chartData = useMemo(() => {
    if (!data.length) return []

    // Group by hour and count events
    const hourlyData = new Map<number, number>()

    data.forEach(item => {
      const hourTimestamp = Math.floor(item.timestamp / (60 * 60 * 1000)) * 60 * 60 * 1000
      hourlyData.set(hourTimestamp, (hourlyData.get(hourTimestamp) || 0) + 1)
    })

    // Convert to array and sort by time
    return Array.from(hourlyData.entries())
      .map(([timestamp, count]) => ({
        timestamp,
        time: new Date(timestamp).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        }),
        count
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(20, 24, 33, 0.95)',
          border: `1px solid ${tufteColors.border}`,
          padding: '8px 12px',
        }}>
          <p style={{
            ...tufteTypography.label,
            margin: 0,
            marginBottom: '4px'
          }}>
            {payload[0].payload.time}
          </p>
          <p style={{
            ...tufteTypography.value,
            margin: 0,
            color: tufteColors.foreground
          }}>
            {payload[0].value} events
          </p>
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div style={{
        width: width || '100%',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: tufteColors.muted,
        fontSize: tufteTypography.label.fontSize
      }}>
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width={width || '100%'} height={height}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="time"
          stroke={tufteColors.muted}
          style={tufteTypography.label}
          tickLine={false}
          axisLine={{ stroke: tufteColors.border }}
        />
        <YAxis
          stroke={tufteColors.muted}
          style={tufteTypography.label}
          tickLine={false}
          axisLine={{ stroke: tufteColors.border }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke={tufteColors.foreground}
          strokeWidth={2}
          dot={false}
          activeDot={{
            r: 4,
            fill: tufteColors.foreground,
            stroke: tufteColors.background,
            strokeWidth: 2
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
