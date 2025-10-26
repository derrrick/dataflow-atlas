'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface ScatterProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  width?: number
  height?: number
}

export function Scatter({ data, unified, earthquakes, width = 280, height = 160 }: ScatterProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Determine which data source to use (unified preferred, fallback to legacy)
    const sourceData = unified || data || earthquakes || []

    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 20, bottom: 25, left: 35 }

    const plotData = sourceData.slice(0, 50)

    // Adapt to both unified and legacy earthquake format
    const chartData = plotData.map(item => {
      if ('primaryValue' in item) {
        // UnifiedDataPoint
        return {
          x: item.secondaryValue || 0,  // secondaryValue (depth, brightness, PM2.5, etc.)
          y: item.primaryValue / 10,     // primaryValue normalized 0-100, scale back
          original: item
        }
      } else {
        // Legacy Earthquake
        const eq = item as Earthquake
        return {
          x: eq.depth,
          y: eq.magnitude,
          original: item
        }
      }
    })

    const xExtent = d3.extent(chartData, d => d.x) as [number, number]
    const yExtent = d3.extent(chartData, d => d.y) as [number, number]

    const x = d3.scaleLinear()
      .domain(xExtent)
      .range([margin.left, width - margin.right])
      .nice()

    const y = d3.scaleLinear()
      .domain(yExtent)
      .range([height - margin.bottom, margin.top])
      .nice()

    svg.selectAll('*').remove()

    // Minimal axes
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

    // Data points
    svg.selectAll('.dot')
      .data(chartData)
      .join('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 2)
      .style('fill', '#FF3B3B')
      .style('opacity', 0.6)

    // Axis labels - minimal, direct
    const xTicks = x.ticks(3)
    xTicks.forEach(tick => {
      svg.append('text')
        .attr('x', x(tick))
        .attr('y', height - 8)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(`${tick}km`)
    })

    const yTicks = y.ticks(3)
    yTicks.forEach(tick => {
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(tick) + 3)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(`M${tick.toFixed(1)}`)
    })

    // Axis titles
    svg.append('text')
      .attr('x', (width + margin.left - margin.right) / 2)
      .attr('y', height - margin.bottom + 20)
      .attr('text-anchor', 'middle')
      .style('fill', '#8F9BB0')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Depth')

    svg.append('text')
      .attr('x', -(height - margin.top - margin.bottom) / 2 - margin.top)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90, 10, ${height / 2})`)
      .style('fill', '#8F9BB0')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Magnitude')
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
