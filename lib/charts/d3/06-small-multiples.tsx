'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface SmallMultiplesProps {
  earthquakes?: UnifiedDataPoint[]
  wildfires?: UnifiedDataPoint[]
  airQuality?: UnifiedDataPoint[]
  width?: number
  height?: number
}

export function SmallMultiples({
  earthquakes = [],
  wildfires = [],
  airQuality = [],
  width = 280,
  height = 180
}: SmallMultiplesProps) {
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
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 50, bottom: 20, left: 16, right: 16 }

    const eventTypes = [
      { name: 'Earthquakes', abbr: 'EQ', count: earthquakes.length, color: '#FF3B3B' },
      { name: 'Wildfires', abbr: 'FIRE', count: wildfires.length, color: '#FFB341' },
      { name: 'Air Quality', abbr: 'AQ', count: airQuality.length, color: '#39D0FF' },
    ]

    const cellWidth = (width - margin.left - margin.right) / eventTypes.length
    const maxCount = d3.max(eventTypes, d => d.count) || 10
    const totalEvents = eventTypes.reduce((sum, d) => sum + d.count, 0)

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
      .text('Event Distribution')

    // Subtitle with total
    svg.append('text')
      .attr('x', 0)
      .attr('y', 32)
      .attr('text-anchor', 'start')
      .style('fill', '#5E6A81')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '400')
      .text(`${totalEvents} total events`)

    // Minimal baseline
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', width - margin.right)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    eventTypes.forEach((type, i) => {
      const barHeight = maxCount > 0
        ? (type.count / maxCount) * (height - margin.top - margin.bottom)
        : 0
      const x = margin.left + i * cellWidth + cellWidth / 2
      const y = height - margin.bottom - barHeight

      // Bar with hover
      const barGroup = svg.append('g')
        .style('cursor', 'pointer')
        .on('mousemove', (event) => {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }

          setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            title: type.name,
            value: `${type.count} events`,
            source: 'Live Data',
            timestamp: `${((type.count / totalEvents) * 100).toFixed(1)}% of total`
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

      barGroup.append('rect')
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

      // Type abbreviation below
      svg.append('text')
        .attr('x', x)
        .attr('y', height - 4)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '400')
        .text(type.abbr)
    })
  }, [earthquakes, wildfires, airQuality, width, height])

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
