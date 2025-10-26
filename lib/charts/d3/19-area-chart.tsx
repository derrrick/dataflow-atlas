'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface AreaChartProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function AreaChart({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: AreaChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const sourceData = unified || data || earthquakes || wildfires || airQuality || []
    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 16, bottom: 30, left: 40 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    let chartTitle: string, chartColor: string

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        chartTitle = 'Seismic Activity Over Time'
        chartColor = '#FF3B3B'
      } else if (dataType === 'wildfire') {
        chartTitle = 'Wildfire Activity Over Time'
        chartColor = '#FF8C00'
      } else if (dataType === 'air_quality') {
        chartTitle = 'Air Quality Over Time'
        chartColor = '#9370DB'
      } else {
        chartTitle = 'Activity Over Time'
        chartColor = '#FF3B3B'
      }
    } else {
      chartTitle = 'Seismic Activity Over Time'
      chartColor = '#FF3B3B'
    }

    // Sort by time
    const sortedData = [...sourceData].sort((a, b) => {
      const timeA = isUnified ? (a as UnifiedDataPoint).timestamp : (a as Earthquake).time
      const timeB = isUnified ? (b as UnifiedDataPoint).timestamp : (b as Earthquake).time
      return timeA - timeB
    })

    // Group into time buckets (hourly)
    const timeExtent = d3.extent(sortedData, d =>
      isUnified ? (d as UnifiedDataPoint).timestamp : (d as Earthquake).time
    ) as [number, number]
    const hourInMs = 60 * 60 * 1000
    const timeBuckets = d3.timeHour.range(new Date(timeExtent[0]), new Date(timeExtent[1] + hourInMs))

    const bucketedData = timeBuckets.map(bucket => {
      const bucketTime = bucket.getTime()
      const eventsInBucket = sortedData.filter(d => {
        const eventTime = isUnified ? (d as UnifiedDataPoint).timestamp : (d as Earthquake).time
        return eventTime >= bucketTime && eventTime < bucketTime + hourInMs
      })

      return {
        time: bucketTime,
        count: eventsInBucket.length,
        avgMagnitude: eventsInBucket.length > 0
          ? d3.mean(eventsInBucket, d => {
              if (isUnified) {
                return (d as UnifiedDataPoint).primaryValue
              }
              return (d as Earthquake).magnitude
            }) || 0
          : 0
      }
    })

    const x = d3.scaleTime()
      .domain(timeExtent)
      .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
      .domain([0, d3.max(bucketedData, d => d.count) || 1])
      .range([height - margin.bottom, margin.top])
      .nice()

    // Area generator
    const area = d3.area<typeof bucketedData[0]>()
      .x(d => x(d.time))
      .y0(height - margin.bottom)
      .y1(d => y(d.count))
      .curve(d3.curveMonotoneX)

    // Line generator for the top edge
    const line = d3.line<typeof bucketedData[0]>()
      .x(d => x(d.time))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX)

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

    // Area fill
    svg.append('path')
      .datum(bucketedData)
      .attr('d', area)
      .style('fill', chartColor)
      .style('opacity', 0.3)

    // Line stroke
    svg.append('path')
      .datum(bucketedData)
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', chartColor)
      .style('stroke-width', '2px')

    // Peak markers
    const maxCount = d3.max(bucketedData, d => d.count) || 0
    const peaks = bucketedData.filter(d => d.count === maxCount && d.count > 0)

    peaks.forEach(peak => {
      svg.append('circle')
        .attr('cx', x(peak.time))
        .attr('cy', y(peak.count))
        .attr('r', 3)
        .style('fill', chartColor)
        .style('stroke', '#0A0F16')
        .style('stroke-width', '2px')

      svg.append('text')
        .attr('x', x(peak.time))
        .attr('y', y(peak.count) - 8)
        .attr('text-anchor', 'middle')
        .style('fill', chartColor)
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '600')
        .text(`${peak.count}`)
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
    const yTicks = y.ticks(4)
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
      .text(chartTitle)

    // Stats
    const totalEvents = bucketedData.reduce((sum, d) => sum + d.count, 0)
    svg.append('text')
      .attr('x', width - margin.right)
      .attr('y', height - 8)
      .attr('text-anchor', 'end')
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text(`Total: ${totalEvents} events`)

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
