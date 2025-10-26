'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface StepChartProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function StepChart({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: StepChartProps) {
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
    const margin = { top: 20, right: 16, bottom: 30, left: 40 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    let chartColor: string, significantThreshold: number

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        chartColor = '#FF3B3B'
        significantThreshold = 6
      } else if (dataType === 'wildfire') {
        chartColor = '#FF8C00'
        significantThreshold = 1000 // 1000+ acres
      } else if (dataType === 'air_quality') {
        chartColor = '#9370DB'
        significantThreshold = 150 // Unhealthy AQI
      } else {
        chartColor = '#FF3B3B'
        significantThreshold = 6
      }
    } else {
      chartColor = '#FF3B3B'
      significantThreshold = 6
    }

    // Sort by time and create cumulative data
    const sortedData = [...sourceData].sort((a, b) => {
      const timeA = isUnified ? (a as UnifiedDataPoint).timestamp : (a as Earthquake).time
      const timeB = isUnified ? (b as UnifiedDataPoint).timestamp : (b as Earthquake).time
      return timeA - timeB
    })

    const cumulativeData = sortedData.map((d, i) => {
      const time = isUnified ? (d as UnifiedDataPoint).timestamp : (d as Earthquake).time
      const value = isUnified ? (d as UnifiedDataPoint).primaryValue : (d as Earthquake).magnitude
      return {
        time,
        count: i + 1,
        value
      }
    })

    const timeExtent = d3.extent(cumulativeData, d => d.time) as [number, number]

    const x = d3.scaleTime()
      .domain(timeExtent)
      .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
      .domain([0, cumulativeData.length])
      .range([height - margin.bottom, margin.top])
      .nice()

    // Step function generator
    const line = d3.line<typeof cumulativeData[0]>()
      .x(d => x(d.time))
      .y(d => y(d.count))
      .curve(d3.curveStepAfter)

    svg.selectAll('*').remove()

    // Axes
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', width - margin.right)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', margin.left)
      .attr('y2', margin.top)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Step line
    svg.append('path')
      .datum(cumulativeData)
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', chartColor)
      .style('stroke-width', '2px')

    // Markers for significant events
    const significantEvents = cumulativeData.filter(d => d.value >= significantThreshold)

    significantEvents.forEach(event => {
      svg.append('circle')
        .attr('cx', x(event.time))
        .attr('cy', y(event.count))
        .attr('r', 3)
        .style('fill', '#FFB341')
        .style('stroke', '#0A0F16')
        .style('stroke-width', '2px')

      svg.append('text')
        .attr('x', x(event.time) + 6)
        .attr('y', y(event.count) - 6)
        .style('fill', '#FFB341')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '600')
        .text(event.value.toFixed(1))
    })

    // Milestone reference lines removed - noise reduction per Nate Silver principles

    // Get data type for source
    const dataType = isUnified ? (sourceData as UnifiedDataPoint[])[0]?.dataType : 'earthquake'
    const source = dataType === 'earthquake' ? 'USGS' : dataType === 'wildfire' ? 'NIFC' : 'AirNow'

    // Hover zone for interactive tooltip
    svg.append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .style('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event)
        const xTime = x.invert(mouseX)

        // Find closest data point
        const bisect = d3.bisector((d: typeof cumulativeData[0]) => d.time).left
        const index = bisect(cumulativeData, xTime.getTime())
        const closestPoint = cumulativeData[Math.min(index, cumulativeData.length - 1)]

        if (closestPoint) {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }

          const date = new Date(closestPoint.time)
          const duration = (timeExtent[1] - timeExtent[0]) / (1000 * 60 * 60) // hours
          const rate = cumulativeData.length / duration

          setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            title: 'Cumulative Events',
            value: `${closestPoint.count} events • ${d3.timeFormat('%b %d, %H:%M')(date)} • Rate: ${rate.toFixed(1)}/hr`,
            source,
            timestamp: 'Live'
          })

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

    // X-axis labels
    const xTicks = x.ticks(5)
    xTicks.forEach(tick => {
      svg.append('text')
        .attr('x', x(tick))
        .attr('y', height - 8)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(d3.timeFormat('%H:%M')(tick))
    })

    // Y-axis labels
    const yTicks = y.ticks(5)
    yTicks.forEach(tick => {
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(tick) + 3)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(tick)
    })

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .style('fill', '#C6CFDA')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Cumulative Event Count')

    // Stats
    const duration = (timeExtent[1] - timeExtent[0]) / (1000 * 60 * 60) // hours
    const rate = cumulativeData.length / duration

    svg.append('text')
      .attr('x', width - margin.right)
      .attr('y', height - 8)
      .attr('text-anchor', 'end')
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text(`Rate: ${rate.toFixed(1)}/hr`)

    // End marker
    const lastEvent = cumulativeData[cumulativeData.length - 1]
    svg.append('circle')
      .attr('cx', x(lastEvent.time))
      .attr('cy', y(lastEvent.count))
      .attr('r', 4)
      .style('fill', chartColor)
      .style('stroke', '#0A0F16')
      .style('stroke-width', '2px')

    svg.append('text')
      .attr('x', x(lastEvent.time))
      .attr('y', y(lastEvent.count) - 10)
      .attr('text-anchor', 'end')
      .style('fill', chartColor)
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '600')
      .text(lastEvent.count)

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
