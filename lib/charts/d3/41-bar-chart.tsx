'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, Hazard, Outage, LatencyPoint, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface BarChartProps {
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  hazards?: Hazard[]
  outages?: Outage[]
  latency?: LatencyPoint[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function BarChart({
  unified,
  earthquakes = [],
  hazards = [],
  outages = [],
  latency = [],
  wildfires = [],
  airQuality = [],
  width = 280,
  height = 160
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, bottom: 30, left: 16, right: 16 }

    let eventTypes: Array<{ name: string; count: number; color: string }>

    if (unified && unified.length > 0) {
      // Group unified data by dataType
      const counts = unified.reduce((acc, item) => {
        acc[item.dataType] = (acc[item.dataType] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      eventTypes = []
      if (counts.earthquake) {
        eventTypes.push({ name: 'EQ', count: counts.earthquake, color: '#FF3B3B' })
      }
      if (counts.wildfire) {
        eventTypes.push({ name: 'FIRE', count: counts.wildfire, color: '#FF8C00' })
      }
      if (counts.air_quality) {
        eventTypes.push({ name: 'AQI', count: counts.air_quality, color: '#9370DB' })
      }
      if (counts.hazard) {
        eventTypes.push({ name: 'HAZ', count: counts.hazard, color: '#FFB341' })
      }
      if (counts.outage) {
        eventTypes.push({ name: 'OUT', count: counts.outage, color: '#39D0FF' })
      }
      if (counts.latency) {
        eventTypes.push({ name: 'LAT', count: counts.latency, color: '#19C6A6' })
      }
    } else {
      // Legacy format - count each data source
      eventTypes = [
        { name: 'EQ', count: earthquakes.length, color: '#FF3B3B' },
        { name: 'FIRE', count: wildfires.length, color: '#FF8C00' },
        { name: 'AQI', count: airQuality.length, color: '#9370DB' },
        { name: 'HAZ', count: hazards.length, color: '#FFB341' },
        { name: 'OUT', count: outages.length, color: '#39D0FF' },
        { name: 'LAT', count: latency.length, color: '#19C6A6' }
      ].filter(type => type.count > 0)  // Only show types with data
    }

    const cellWidth = (width - margin.left - margin.right) / eventTypes.length
    const maxCount = d3.max(eventTypes, d => d.count) || 10
    const totalEvents = eventTypes.reduce((sum, d) => sum + d.count, 0)

    svg.selectAll('*').remove()

    // Minimal baseline
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', width - margin.right)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    eventTypes.forEach((type, i) => {
      const barHeight = (type.count / maxCount) * (height - margin.top - margin.bottom)
      const x = margin.left + i * cellWidth + cellWidth / 2
      const y = height - margin.bottom - barHeight

      // Bar
      svg.append('rect')
        .attr('x', x - 10)
        .attr('y', y)
        .attr('width', 20)
        .attr('height', barHeight)
        .style('fill', type.color)
        .style('opacity', 0.9)

      // Count label above bar
      svg.append('text')
        .attr('x', x)
        .attr('y', y - 6)
        .attr('text-anchor', 'middle')
        .style('fill', type.color)
        .style('font-size', '13px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '600')
        .text(type.count)

      // Type label below
      svg.append('text')
        .attr('x', x)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '400')
        .text(type.name)
    })

    // Total count annotation
    if (totalEvents > 0) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .text(`${totalEvents} total`)
    }
  }, [unified, earthquakes, hazards, outages, latency, wildfires, airQuality, width, height])

  return <svg ref={svgRef} width={width} height={height} />
}
