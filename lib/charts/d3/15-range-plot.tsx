'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface RangePlotProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function RangePlot({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: RangePlotProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const sourceData = unified || data || earthquakes || wildfires || airQuality || []
    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 16, bottom: 30, left: 40 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    let chartColor: string, chartTitle: string, valueLabel: string

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        chartColor = '#FF3B3B'
        chartTitle = 'Magnitude Range Over Time'
        valueLabel = 'M'
      } else if (dataType === 'wildfire') {
        chartColor = '#FF8C00'
        chartTitle = 'Wildfire Size Range Over Time'
        valueLabel = ''
      } else if (dataType === 'air_quality') {
        chartColor = '#9370DB'
        chartTitle = 'AQI Range Over Time'
        valueLabel = 'AQI'
      } else {
        chartColor = '#FF3B3B'
        chartTitle = 'Value Range Over Time'
        valueLabel = ''
      }
    } else {
      chartColor = '#FF3B3B'
      chartTitle = 'Magnitude Range Over Time'
      valueLabel = 'M'
    }

    // Sort by time
    const sortedData = [...sourceData].sort((a, b) => {
      const timeA = isUnified ? (a as UnifiedDataPoint).timestamp : (a as Earthquake).time
      const timeB = isUnified ? (b as UnifiedDataPoint).timestamp : (b as Earthquake).time
      return timeA - timeB
    })

    // Group into time buckets (every 2 hours)
    const timeExtent = d3.extent(sortedData, d => {
      return isUnified ? (d as UnifiedDataPoint).timestamp : (d as Earthquake).time
    }) as [number, number]
    const bucketSize = 2 * 60 * 60 * 1000 // 2 hours
    const timeBuckets: number[] = []
    for (let t = timeExtent[0]; t <= timeExtent[1]; t += bucketSize) {
      timeBuckets.push(t)
    }

    const bucketedData = timeBuckets.map(bucket => {
      const eventsInBucket = sortedData.filter(d => {
        const time = isUnified ? (d as UnifiedDataPoint).timestamp : (d as Earthquake).time
        return time >= bucket && time < bucket + bucketSize
      })

      if (eventsInBucket.length === 0) {
        return { time: bucket, min: 0, max: 0, avg: 0, count: 0 }
      }

      const values = eventsInBucket.map(d => {
        return isUnified ? (d as UnifiedDataPoint).primaryValue : (d as Earthquake).magnitude
      })
      return {
        time: bucket,
        min: d3.min(values) || 0,
        max: d3.max(values) || 0,
        avg: d3.mean(values) || 0,
        count: eventsInBucket.length
      }
    }).filter(d => d.count > 0)

    const x = d3.scaleTime()
      .domain(timeExtent)
      .range([margin.left, width - margin.right])

    const allValues = sourceData.map(d => {
      return isUnified ? (d as UnifiedDataPoint).primaryValue : (d as Earthquake).magnitude
    })
    const y = d3.scaleLinear()
      .domain([d3.min(allValues) || 0, d3.max(allValues) || 10])
      .range([height - margin.bottom, margin.top])
      .nice()

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

    // Range bands
    bucketedData.forEach((d, i) => {
      const x1 = x(d.time)
      const x2 = i < bucketedData.length - 1 ? x(bucketedData[i + 1].time) : x(d.time + bucketSize)
      const barWidth = Math.max(2, x2 - x1 - 2)

      // Range band
      svg.append('rect')
        .attr('x', x1)
        .attr('y', y(d.max))
        .attr('width', barWidth)
        .attr('height', y(d.min) - y(d.max))
        .style('fill', chartColor)
        .style('opacity', 0.2)

      // Average line
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y(d.avg))
        .attr('x2', x1 + barWidth)
        .attr('y2', y(d.avg))
        .style('stroke', chartColor)
        .style('stroke-width', '2px')

      // Min/max markers
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y(d.min))
        .attr('x2', x1 + barWidth)
        .attr('y2', y(d.min))
        .style('stroke', chartColor)
        .style('stroke-width', '1px')
        .style('opacity', 0.5)

      svg.append('line')
        .attr('x1', x1)
        .attr('y1', y(d.max))
        .attr('x2', x1 + barWidth)
        .attr('y2', y(d.max))
        .style('stroke', chartColor)
        .style('stroke-width', '1px')
        .style('opacity', 0.5)
    })

    // Highlight max range
    const maxRange = bucketedData.reduce((max, d) => {
      const range = d.max - d.min
      return range > max.range ? { range, data: d } : max
    }, { range: 0, data: bucketedData[0] })

    if (maxRange.data) {
      const d = maxRange.data
      svg.append('text')
        .attr('x', x(d.time))
        .attr('y', y(d.max) - 6)
        .style('fill', chartColor)
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '600')
        .text(`±${(maxRange.range / 2).toFixed(1)}`)
    }

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
        .text(valueLabel ? `${valueLabel}${tick.toFixed(1)}` : tick.toFixed(1))
    })

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .style('fill', '#C6CFDA')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .text(chartTitle)

    // Legend
    const legendX = width - margin.right - 100
    const legendY = margin.top + 10

    svg.append('line')
      .attr('x1', legendX)
      .attr('y1', legendY)
      .attr('x2', legendX + 20)
      .attr('y2', legendY)
      .style('stroke', chartColor)
      .style('stroke-width', '2px')

    svg.append('text')
      .attr('x', legendX + 24)
      .attr('y', legendY + 3)
      .style('fill', '#C6CFDA')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Average')

    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY + 8)
      .attr('width', 20)
      .attr('height', 8)
      .style('fill', chartColor)
      .style('opacity', 0.2)

    svg.append('text')
      .attr('x', legendX + 24)
      .attr('y', legendY + 16)
      .style('fill', '#C6CFDA')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Range')

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

  return <svg ref={svgRef} width={width} height={height} />
}
