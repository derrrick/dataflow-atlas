'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface HistogramProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  width?: number
  height?: number
}

export function Histogram({ data, unified, earthquakes, width = 280, height = 160 }: HistogramProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Determine which data source to use (unified preferred, fallback to legacy)
    const sourceData = unified || data || earthquakes || []

    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 16, bottom: 25, left: 30 }

    // Adapt to both unified and legacy earthquake format
    const magnitudes = sourceData.map(item => {
      if ('primaryValue' in item) {
        // UnifiedDataPoint - primaryValue normalized 0-100, scale back to magnitude
        return item.primaryValue / 10
      } else {
        // Legacy Earthquake
        return (item as Earthquake).magnitude
      }
    })

    const x = d3.scaleLinear()
      .domain([d3.min(magnitudes) || 0, d3.max(magnitudes) || 10])
      .range([margin.left, width - margin.right])
      .nice()

    const bins = d3.bin()
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(8))
      (magnitudes)

    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) || 0])
      .range([height - margin.bottom, margin.top])

    svg.selectAll('*').remove()

    // Minimal baseline
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', width - margin.right)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Bars
    svg.selectAll('.bar')
      .data(bins)
      .join('rect')
      .attr('x', d => x(d.x0!) + 1)
      .attr('y', d => y(d.length))
      .attr('width', d => Math.max(0, x(d.x1!) - x(d.x0!) - 2))
      .attr('height', d => height - margin.bottom - y(d.length))
      .style('fill', '#FF3B3B')
      .style('opacity', 0.85)

    // X-axis labels
    const xTicks = x.ticks(4)
    xTicks.forEach(tick => {
      svg.append('text')
        .attr('x', x(tick))
        .attr('y', height - 8)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(`M${tick.toFixed(1)}`)
    })

    // Y-axis labels
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

    // Count annotation
    const totalCount = magnitudes.length
    const avgMag = d3.mean(magnitudes) || 0

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .style('fill', '#8F9BB0')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .text(`n=${totalCount} • μ=${avgMag.toFixed(2)}`)
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
