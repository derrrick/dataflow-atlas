'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, Hazard, Outage, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface TimelineProps {
  data?: (Earthquake | Hazard | Outage)[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  hazards?: Hazard[]
  outages?: Outage[]
  width?: number
  height?: number
}

export function Timeline({ data, unified, earthquakes, hazards, outages, width = 280, height = 160 }: TimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Determine which data source to use (unified preferred, fallback to legacy)
    const sourceData = unified || data || earthquakes || hazards || outages || []

    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 16, bottom: 25, left: 30 }

    // Group by hour and count
    const hourlyData = d3.rollup(
      sourceData,
      v => v.length,
      d => Math.floor(d.timestamp / (60 * 60 * 1000)) * 60 * 60 * 1000
    )

    const chartData = Array.from(hourlyData, ([timestamp, count]) => ({
      timestamp,
      count
    })).sort((a, b) => a.timestamp - b.timestamp).slice(0, 24)

    if (!chartData.length) return

    const x = d3.scaleTime()
      .domain(d3.extent(chartData, d => d.timestamp) as [number, number])
      .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.count) || 0])
      .range([height - margin.bottom, margin.top])
      .nice()

    const line = d3.line<typeof chartData[0]>()
      .x(d => x(d.timestamp))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX)

    svg.selectAll('*').remove()

    // Baseline
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', width - margin.right)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Line
    svg.append('path')
      .datum(chartData)
      .attr('d', line)
      .style('stroke', '#39D0FF')
      .style('stroke-width', '1.5px')
      .style('fill', 'none')

    // Peak annotation
    const maxPoint = chartData.reduce((max, d) => d.count > max.count ? d : max)
    svg.append('circle')
      .attr('cx', x(maxPoint.timestamp))
      .attr('cy', y(maxPoint.count))
      .attr('r', 2.5)
      .style('fill', '#39D0FF')
      .style('stroke', '#0A0F16')
      .style('stroke-width', '2px')

    svg.append('text')
      .attr('x', x(maxPoint.timestamp) + 6)
      .attr('y', y(maxPoint.count) + 1)
      .style('fill', '#39D0FF')
      .style('font-size', '11px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '600')
      .text(maxPoint.count)

    // Axis labels
    const yTicks = y.ticks(3)
    yTicks.forEach(tick => {
      if (tick === 0) return
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(tick) + 3)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(tick)
    })
  }, [data, unified, earthquakes, hazards, outages, width, height])

  const sourceData = unified || data || earthquakes || hazards || outages || []

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
