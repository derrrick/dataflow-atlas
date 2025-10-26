'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { LatencyPoint, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface SlopegraphProps {
  data?: LatencyPoint[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  latency?: LatencyPoint[]
  width?: number
  height?: number
}

export function Slopegraph({ data, unified, latency, width = 280, height = 160 }: SlopegraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Determine which data source to use (unified preferred, fallback to legacy)
    const sourceData = unified || data || latency || []

    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 60, bottom: 20, left: 60 }

    // Group by region/location and calculate average value
    const regionData = d3.rollup(
      sourceData,
      v => {
        if (v.length > 0 && 'primaryValue' in v[0]) {
          // UnifiedDataPoint - use primaryValue (normalized 0-100 for latency)
          return d3.mean(v, d => (d as UnifiedDataPoint).primaryValue) || 0
        } else {
          // Legacy LatencyPoint - use latency directly
          return d3.mean(v, d => (d as LatencyPoint).latency) || 0
        }
      },
      d => {
        // Use region if available, otherwise use location
        return 'region' in d ? (d as LatencyPoint).region : d.location
      }
    )

    const slopes = Array.from(regionData, ([region, current]) => ({
      region,
      start: current * 0.85, // Simulated "before"
      end: current
    })).slice(0, 4)

    if (!slopes.length) return

    const maxLatency = d3.max(slopes, d => Math.max(d.start, d.end)) || 100

    const y = d3.scaleLinear()
      .domain([0, maxLatency * 1.1])
      .range([height - margin.bottom, margin.top])

    const x1 = margin.left
    const x2 = width - margin.right

    svg.selectAll('*').remove()

    // Baseline
    svg.append('line')
      .attr('x1', x1)
      .attr('y1', height - margin.bottom)
      .attr('x2', x2)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Highlighted slope
    const highlighted = slopes.reduce((max, d) =>
      (d.end - d.start) > (max.end - max.start) ? d : max
    )

    // Lines
    svg.selectAll('.slope-line')
      .data(slopes)
      .join('line')
      .attr('x1', x1)
      .attr('y1', d => y(d.start))
      .attr('x2', x2)
      .attr('y2', d => y(d.end))
      .style('stroke', d => d.region === highlighted.region ? '#39D0FF' : '#3F4B5E')
      .style('stroke-width', d => d.region === highlighted.region ? '2px' : '1px')
      .style('opacity', d => d.region === highlighted.region ? 1 : 0.4)

    // Start labels
    svg.selectAll('.start-label')
      .data(slopes)
      .join('text')
      .attr('x', x1 - 8)
      .attr('y', d => y(d.start))
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .style('fill', d => d.region === highlighted.region ? '#C6CFDA' : '#5E6A81')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', d => d.region === highlighted.region ? '500' : '400')
      .text(d => `${d.start.toFixed(0)}ms`)

    // End labels
    svg.selectAll('.end-label')
      .data(slopes)
      .join('text')
      .attr('x', x2 + 8)
      .attr('y', d => y(d.end))
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'middle')
      .style('fill', d => d.region === highlighted.region ? '#39D0FF' : '#5E6A81')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', d => d.region === highlighted.region ? '500' : '400')
      .text(d => `${d.end.toFixed(0)}ms`)

    // Change annotation
    const change = ((highlighted.end - highlighted.start) / highlighted.start) * 100
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .style('fill', '#39D0FF')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '500')
      .text(`${highlighted.region} ${change > 0 ? '+' : ''}${change.toFixed(1)}%`)
  }, [data, unified, latency, width, height])

  const sourceData = unified || data || latency || []

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
