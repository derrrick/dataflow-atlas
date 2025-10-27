'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface SlopegraphProps {
  unified?: UnifiedDataPoint[]
  width?: number
  height?: number
}

export function Slopegraph({
  unified = [],
  width = 280,
  height = 180
}: SlopegraphProps) {
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
    if (!svgRef.current || !unified.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 40, right: 56, bottom: 24, left: 56 }

    // Group data by region (using location or metadata)
    const regionData = d3.rollup(
      unified,
      v => d3.mean(v, d => d.primaryValue) || 0,
      d => {
        // Extract region from metadata or location
        if (d.metadata?.region) return d.metadata.region
        if (d.metadata?.state) return d.metadata.state
        if (d.metadata?.city) return d.metadata.city
        // Generate region from location
        const lat = d.location.lat
        const lon = d.location.lon
        if (lat > 40) return 'North'
        if (lat < 20) return 'South'
        if (lon < -100) return 'West'
        return 'East'
      }
    )

    // Create slope data (simulate "before" as 90% of current for visualization)
    const data = Array.from(regionData, ([region, current]) => ({
      region,
      start: current * 0.9,
      end: current,
    })).slice(0, 4)

    if (data.length === 0) return

    const maxValue = d3.max(data, d => Math.max(d.start, d.end)) || 100
    const highlighted = data.reduce((max, d) =>
      (d.end - d.start) > (max.end - max.start) ? d : max
    )

    const y = d3.scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([height - margin.bottom, margin.top])

    const x1 = margin.left
    const x2 = width - margin.right

    const change = ((highlighted.end - highlighted.start) / highlighted.start) * 100

    // Title
    svg.append('text')
      .attr('x', 0)
      .attr('y', 16)
      .attr('text-anchor', 'start')
      .style('fill', '#C6CFDA')
      .style('font-size', '13px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '500')
      .style('letter-spacing', '-0.01em')
      .text('Regional Comparison')

    // Subtitle showing largest change
    svg.append('text')
      .attr('x', 0)
      .attr('y', 32)
      .attr('text-anchor', 'start')
      .style('fill', '#39D0FF')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '500')
      .text(`${highlighted.region} ${change > 0 ? '+' : ''}${change.toFixed(1)}%`)

    // Minimal baseline
    svg.append('line')
      .attr('x1', x1)
      .attr('y1', height - margin.bottom)
      .attr('x2', x2)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Lines with hover interaction
    svg.selectAll('.slope-line')
      .data(data)
      .join('line')
      .attr('class', 'slope-line')
      .attr('x1', x1)
      .attr('y1', d => y(d.start))
      .attr('x2', x2)
      .attr('y2', d => y(d.end))
      .style('stroke', d => d.region === highlighted.region ? '#39D0FF' : '#3F4B5E')
      .style('stroke-width', d => d.region === highlighted.region ? '2px' : '1px')
      .style('opacity', d => d.region === highlighted.region ? 1 : 0.4)
      .style('cursor', 'pointer')
      .on('mousemove', (event, d) => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }

        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          title: d.region,
          value: `${d.start.toFixed(1)} → ${d.end.toFixed(1)}`,
          source: unified[0]?.source || 'Data',
          timestamp: `${((d.end - d.start) / d.start * 100).toFixed(1)}% change`
        })

        hideTimeoutRef.current = setTimeout(() => {
          setTooltip(prev => ({ ...prev, visible: false }))
        }, 2000)
      })
      .on('mouseleave', () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }
        setTooltip(prev => ({ ...prev, visible: false }))
      })

    // Start labels
    svg.selectAll('.start-label')
      .data(data)
      .join('text')
      .attr('class', 'start-label')
      .attr('x', x1 - 8)
      .attr('y', d => y(d.start))
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .style('fill', d => d.region === highlighted.region ? '#C6CFDA' : '#5E6A81')
      .style('font-size', '11px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', d => d.region === highlighted.region ? '500' : '400')
      .text(d => d.start.toFixed(1))

    // End labels
    svg.selectAll('.end-label')
      .data(data)
      .join('text')
      .attr('class', 'end-label')
      .attr('x', x2 + 8)
      .attr('y', d => y(d.end))
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'middle')
      .style('fill', d => d.region === highlighted.region ? '#39D0FF' : '#5E6A81')
      .style('font-size', '11px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', d => d.region === highlighted.region ? '500' : '400')
      .text(d => d.end.toFixed(1))
  }, [unified, width, height])

  if (!unified.length) {
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
