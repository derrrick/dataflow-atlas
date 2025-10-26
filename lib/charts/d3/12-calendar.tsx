'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface CalendarProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  width?: number
  height?: number
}

export function Calendar({ data, unified, earthquakes, width = 400, height = 280 }: CalendarProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Determine which data source to use (unified preferred, fallback to legacy)
    const sourceData = unified || data || earthquakes || []

    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 30, right: 16, bottom: 20, left: 40 }

    // Group events by day (works for both unified and legacy - both have timestamp)
    const dayData = d3.rollup(
      sourceData,
      v => v.length,
      d => d3.timeDay.floor(new Date(d.timestamp))
    )

    // Get date range
    const dates = Array.from(dayData.keys()).sort((a, b) => a.getTime() - b.getTime())
    const minDate = dates[0]
    const maxDate = dates[dates.length - 1]

    // Create 7x grid (7 days of week, multiple weeks)
    const weeks = d3.timeWeek.range(
      d3.timeWeek.floor(minDate),
      d3.timeWeek.ceil(maxDate)
    ).slice(0, 8) // Limit to 8 weeks for visibility

    const cellSize = Math.min(
      (width - margin.left - margin.right) / 8,
      (height - margin.top - margin.bottom) / 7
    )

    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(Array.from(dayData.values())) || 10])
      .interpolator(d3.interpolateReds)

    svg.selectAll('*').remove()

    // Day of week labels
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    daysOfWeek.forEach((day, i) => {
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', margin.top + i * cellSize + cellSize / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(day)
    })

    // Calendar cells
    weeks.forEach((weekStart, weekIndex) => {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const day = d3.timeDay.offset(weekStart, dayOfWeek)
        const count = dayData.get(day) || 0

        svg.append('rect')
          .attr('x', margin.left + weekIndex * cellSize)
          .attr('y', margin.top + dayOfWeek * cellSize)
          .attr('width', cellSize - 2)
          .attr('height', cellSize - 2)
          .style('fill', count > 0 ? colorScale(count) : '#141821')
          .style('stroke', '#242C3A')
          .style('stroke-width', '0.5px')

        // Add count labels for significant days
        if (count >= 5) {
          svg.append('text')
            .attr('x', margin.left + weekIndex * cellSize + cellSize / 2)
            .attr('y', margin.top + dayOfWeek * cellSize + cellSize / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('fill', '#FFFFFF')
            .style('font-size', '9px')
            .style('font-family', 'Geist Mono, monospace')
            .style('font-weight', '600')
            .text(count)
        }
      }
    })

    // Week labels (dates)
    weeks.forEach((weekStart, weekIndex) => {
      if (weekIndex % 2 === 0) {
        svg.append('text')
          .attr('x', margin.left + weekIndex * cellSize + cellSize / 2)
          .attr('y', margin.top - 8)
          .attr('text-anchor', 'middle')
          .style('fill', '#5E6A81')
          .style('font-size', '8px')
          .style('font-family', 'Geist Mono, monospace')
          .text(d3.timeFormat('%m/%d')(weekStart))
      }
    })

    // Stats
    const totalEvents = d3.sum(Array.from(dayData.values()))
    const avgPerDay = totalEvents / dayData.size

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 4)
      .attr('text-anchor', 'middle')
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text(`${dayData.size} days • ${totalEvents} events • ${avgPerDay.toFixed(1)} avg/day`)

  }, [data, unified, earthquakes, width, height])

  const sourceData = unified || data || earthquakes || []

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
