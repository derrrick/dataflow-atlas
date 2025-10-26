'use client'

import { useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { tufteColors, tufteTypography } from '@/lib/charts/core/tufte-theme'
import type { Earthquake } from '@/lib/services/dataTypes'

interface ScatterPlotProps {
  data: Earthquake[]
  width?: number
  height?: number
}

export function ScatterPlot({ data, width, height = 300 }: ScatterPlotProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      magnitude: item.magnitude,
      depth: item.depth,
      location: item.location
    }))
  }, [data])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div style={{
          backgroundColor: 'rgba(20, 24, 33, 0.95)',
          border: `1px solid ${tufteColors.border}`,
          padding: '8px 12px',
          maxWidth: '200px'
        }}>
          <p style={{
            ...tufteTypography.label,
            margin: 0,
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {data.location}
          </p>
          <p style={{
            ...tufteTypography.value,
            margin: 0,
            color: tufteColors.foreground
          }}>
            Magnitude: {data.magnitude.toFixed(1)}
          </p>
          <p style={{
            ...tufteTypography.value,
            margin: 0,
            color: tufteColors.foreground
          }}>
            Depth: {data.depth.toFixed(1)} km
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
        No earthquake data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width={width || '100%'} height={height}>
      <ScatterChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <XAxis
          type="number"
          dataKey="magnitude"
          name="Magnitude"
          stroke={tufteColors.muted}
          style={tufteTypography.label}
          tickLine={false}
          axisLine={{ stroke: tufteColors.border }}
          label={{
            value: 'Magnitude',
            position: 'bottom',
            style: tufteTypography.label
          }}
        />
        <YAxis
          type="number"
          dataKey="depth"
          name="Depth"
          stroke={tufteColors.muted}
          style={tufteTypography.label}
          tickLine={false}
          axisLine={{ stroke: tufteColors.border }}
          label={{
            value: 'Depth (km)',
            angle: -90,
            position: 'left',
            style: tufteTypography.label
          }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: tufteColors.muted, strokeWidth: 1 }} />
        <Scatter data={chartData}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={tufteColors.earthquakes}
              fillOpacity={0.6}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}
