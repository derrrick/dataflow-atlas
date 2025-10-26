'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface SparklineProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function Sparkline({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 280,
  height = 160
}: SparklineProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    value: '',
    source: '',
    timestamp: ''
  })
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const sourceData = unified || data || earthquakes || wildfires || airQuality || []
    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]
    const unifiedData = sourceData as UnifiedDataPoint[]
    const dataType = isUnified ? unifiedData[0]?.dataType || 'earthquake' : 'earthquake'

    let chartColor: string
    if (dataType === 'earthquake') chartColor = '#FF3B3B'
    else if (dataType === 'wildfire') chartColor = '#FF8C00'
    else if (dataType === 'air_quality') chartColor = '#9370DB'
    else chartColor = '#FF3B3B'

    const sortedData = [...sourceData].sort((a, b) => {
      const timeA = isUnified ? (a as UnifiedDataPoint).timestamp : (a as Earthquake).time
      const timeB = isUnified ? (b as UnifiedDataPoint).timestamp : (b as Earthquake).time
      return timeA - timeB
    })

    // Define 4 sparklines to show
    interface SparklineConfig {
      label: string
      getData: (d: any) => number
      format: (v: number) => string
      color: string | ((v: number) => string)
    }

    let sparklines: SparklineConfig[] = []

    if (dataType === 'earthquake') {
      sparklines = [
        {
          label: 'Magnitude',
          getData: (d) => isUnified ? d.primaryValue : d.magnitude,
          format: (v) => `${v.toFixed(1)}M`,
          color: chartColor
        },
        {
          label: 'Depth',
          getData: (d) => isUnified ? (d.secondaryValue || 0) : d.depth,
          format: (v) => `${v.toFixed(0)}km`,
          color: '#5E6A81'
        },
        {
          label: 'Significance',
          getData: (d) => isUnified ? (d.metadata?.significance || 0) : (d.significance || 0),
          format: (v) => `${v.toFixed(0)}`,
          color: '#8F9BB0'
        },
        {
          label: 'Events/hr',
          getData: () => 1, // Will calculate rolling count
          format: (v) => `${v.toFixed(0)}`,
          color: '#C6CFDA'
        }
      ]
    } else if (dataType === 'wildfire') {
      sparklines = [
        {
          label: 'Acres',
          getData: (d) => d.primaryValue,
          format: (v) => `${(v / 1000).toFixed(1)}K`,
          color: chartColor
        },
        {
          label: 'Containment',
          getData: (d) => d.secondaryValue || 0,
          format: (v) => `${v.toFixed(0)}%`,
          color: '#19C6A6'
        },
        {
          label: 'Active Fires',
          getData: () => 1, // Will count
          format: (v) => `${v.toFixed(0)}`,
          color: '#8F9BB0'
        },
        {
          label: 'Avg Size',
          getData: (d) => d.primaryValue,
          format: (v) => `${(v / 1000).toFixed(1)}K`,
          color: '#C6CFDA'
        }
      ]
    } else if (dataType === 'air_quality') {
      sparklines = [
        {
          label: 'AQI',
          getData: (d) => d.primaryValue,
          format: (v) => `${v.toFixed(0)}`,
          color: chartColor
        },
        {
          label: 'PM2.5',
          getData: (d) => d.secondaryValue || 0,
          format: (v) => `${v.toFixed(1)}`,
          color: '#8F9BB0'
        },
        {
          label: 'Stations',
          getData: () => 1,
          format: (v) => `${v.toFixed(0)}`,
          color: '#C6CFDA'
        },
        {
          label: 'Quality',
          getData: (d) => {
            const aqi = d.primaryValue
            if (aqi <= 50) return 100
            else if (aqi <= 100) return 75
            else if (aqi <= 150) return 50
            else return 25
          },
          format: (v) => `${v.toFixed(0)}%`,
          color: v => v >= 75 ? '#19C6A6' : v >= 50 ? '#FFB341' : '#FF6B6B'
        }
      ]
    }

    // Draw each sparkline - fill entire container height
    const spacingBetween = 16
    const totalSpacing = spacingBetween * 3 // 3 gaps between 4 sparklines
    const sparklineHeight = (height - totalSpacing) / 4
    const margin = { top: 2, right: 60, bottom: 2, left: 80 }

    sparklines.forEach((config, idx) => {
      const yOffset = idx * (sparklineHeight + spacingBetween)

      // Extract data for this sparkline
      let chartData: { index: number; value: number }[] = []

      if (config.label === 'Events/hr' || config.label === 'Active Fires' || config.label === 'Stations') {
        // For count-based metrics, bin by hour
        const bins = 24
        const binSize = sortedData.length / bins
        chartData = Array.from({ length: bins }, (_, i) => {
          const binStart = Math.floor(i * binSize)
          const binEnd = Math.floor((i + 1) * binSize)
          const binData = sortedData.slice(binStart, binEnd)
          return {
            index: i,
            value: binData.length
          }
        })
      } else if (config.label === 'Avg Size') {
        // Average by time bins
        const bins = 24
        const binSize = sortedData.length / bins
        chartData = Array.from({ length: bins }, (_, i) => {
          const binStart = Math.floor(i * binSize)
          const binEnd = Math.floor((i + 1) * binSize)
          const binData = sortedData.slice(binStart, binEnd)
          const avg = d3.mean(binData, config.getData) || 0
          return {
            index: i,
            value: avg
          }
        })
      } else {
        chartData = sortedData.slice(0, 24).map((d, i) => ({
          index: i,
          value: config.getData(d)
        }))
      }

      const latestValue = chartData[chartData.length - 1]?.value || 0
      const maxValue = d3.max(chartData, d => d.value) || 1
      const minValue = d3.min(chartData, d => d.value) || 0

      const x = d3.scaleLinear()
        .domain([0, chartData.length - 1])
        .range([margin.left, width - margin.right])

      const y = d3.scaleLinear()
        .domain([minValue * 0.95, maxValue * 1.05])
        .range([yOffset + sparklineHeight - margin.bottom, yOffset + margin.top])

      const line = d3.line<typeof chartData[0]>()
        .x(d => x(d.index))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX)

      const area = d3.area<typeof chartData[0]>()
        .x(d => x(d.index))
        .y0(yOffset + sparklineHeight - margin.bottom)
        .y1(d => y(d.value))
        .curve(d3.curveMonotoneX)

      // Area
      svg.append('path')
        .datum(chartData)
        .attr('d', area)
        .style('fill', typeof config.color === 'function' ? config.color(latestValue) : config.color)
        .style('opacity', 0.15)

      // Line
      svg.append('path')
        .datum(chartData)
        .attr('d', line)
        .style('stroke', typeof config.color === 'function' ? config.color(latestValue) : config.color)
        .style('stroke-width', '1.5px')
        .style('fill', 'none')

      // Hover zone for tooltip
      svg.append('rect')
        .attr('x', margin.left)
        .attr('y', yOffset)
        .attr('width', width - margin.left - margin.right)
        .attr('height', sparklineHeight)
        .style('fill', 'transparent')
        .style('cursor', 'pointer')
        .on('mousemove', (event) => {
          const [mouseX] = d3.pointer(event)
          const xIndex = Math.round(x.invert(mouseX))
          const dataPoint = chartData[Math.max(0, Math.min(xIndex, chartData.length - 1))]

          if (dataPoint) {
            // Clear existing timeout
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current)
            }

            setTooltip({
              visible: true,
              x: event.clientX,
              y: event.clientY,
              title: config.label,
              value: config.format(dataPoint.value),
              source: dataType === 'earthquake' ? 'USGS' : dataType === 'wildfire' ? 'NIFC' : 'AirNow',
              timestamp: 'Live'
            })

            // Auto-hide after 2 seconds
            hideTimeoutRef.current = setTimeout(() => {
              setTooltip(prev => ({ ...prev, visible: false }))
            }, 2000)
          }
        })
        .on('mouseleave', () => {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }
          setTooltip(prev => ({ ...prev, visible: false }))
        })

      // Calculate trend (compare latest to average of first 3 points)
      const firstThreeAvg = d3.mean(chartData.slice(0, 3), d => d.value) || 0
      const trend = latestValue > firstThreeAvg * 1.1 ? '↗' :
                    latestValue < firstThreeAvg * 0.9 ? '↘' : '→'
      const trendColor = latestValue > firstThreeAvg * 1.1 ? '#FF6B6B' :
                         latestValue < firstThreeAvg * 0.9 ? '#19C6A6' : '#8F9BB0'

      // Label (left) with trend arrow
      svg.append('text')
        .attr('x', 10)
        .attr('y', yOffset + sparklineHeight / 2 + 4)
        .style('fill', '#8F9BB0')
        .style('font-size', '11px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '500')
        .text(config.label)

      // Trend arrow
      svg.append('text')
        .attr('x', 10 + config.label.length * 6.5 + 4)
        .attr('y', yOffset + sparklineHeight / 2 + 4)
        .style('fill', trendColor)
        .style('font-size', '12px')
        .style('font-family', 'Geist Mono, monospace')
        .text(trend)

      // Current value (right)
      svg.append('text')
        .attr('x', width - 10)
        .attr('y', yOffset + sparklineHeight / 2 + 4)
        .attr('text-anchor', 'end')
        .style('fill', typeof config.color === 'function' ? config.color(latestValue) : config.color)
        .style('font-size', '13px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '700')
        .text(config.format(latestValue))

      // Separator line (except last) - very subtle
      if (idx < sparklines.length - 1) {
        svg.append('line')
          .attr('x1', margin.left)
          .attr('y1', yOffset + sparklineHeight)
          .attr('x2', width - margin.right)
          .attr('y2', yOffset + sparklineHeight)
          .style('stroke', '#1F2937')
          .style('stroke-width', '0.5px')
          .style('opacity', 0.3)
      }
    })
  }, [data, unified, earthquakes, wildfires, airQuality, width, height])

  const sourceData = unified || data || earthquakes || wildfires || airQuality || []

  if (!sourceData.length) {
    return (
      <div style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#5E6A81',
        fontSize: '11px',
        fontFamily: 'Geist Mono, monospace'
      }}>
        No data
      </div>
    )
  }

  return (
    <>
      <svg ref={svgRef} width={width} height={height} />
      <Tooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        title={tooltip.title}
        value={tooltip.value}
        source={tooltip.source}
        timestamp={tooltip.timestamp}
      />
    </>
  )
}
