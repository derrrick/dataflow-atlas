'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface CDFProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function CDF({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: CDFProps) {
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
    const sourceData = unified || data || earthquakes || wildfires || airQuality || []
    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 40, bottom: 30, left: 40 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    let chartColor: string, valueLabel: string

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        chartColor = '#FF3B3B'
        valueLabel = 'M'
      } else if (dataType === 'wildfire') {
        chartColor = '#FF8C00'
        valueLabel = ''
      } else if (dataType === 'air_quality') {
        chartColor = '#9370DB'
        valueLabel = 'AQI'
      } else {
        chartColor = '#FF3B3B'
        valueLabel = ''
      }
    } else {
      chartColor = '#FF3B3B'
      valueLabel = 'M'
    }

    // Sort values
    const values = sourceData.map(d => {
      return isUnified ? (d as UnifiedDataPoint).primaryValue : (d as Earthquake).magnitude
    }).sort(d3.ascending)

    // Create CDF data
    const cdfData = values.map((v, i) => ({
      value: v,
      cumulative: (i + 1) / values.length
    }))

    const x = d3.scaleLinear()
      .domain(d3.extent(values) as [number, number])
      .range([margin.left, width - margin.right])
      .nice()

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top])

    const line = d3.line<{ value: number; cumulative: number }>()
      .x(d => x(d.value))
      .y(d => y(d.cumulative))

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

    // CDF line
    svg.append('path')
      .datum(cdfData)
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', chartColor)
      .style('stroke-width', '2px')

    // Reference lines removed - noise reduction per Nate Silver principles

    // Get data type for source
    const dataType = isUnified ? (sourceData as UnifiedDataPoint[])[0]?.dataType : 'earthquake'
    const source = dataType === 'earthquake' ? 'USGS' : dataType === 'wildfire' ? 'NIFC' : 'AirNow'

    // Hover zone for interactive crosshair
    svg.append('rect')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .style('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event)
        const xValue = x.invert(mouseX)

        // Find closest CDF data point
        const bisect = d3.bisector((d: typeof cdfData[0]) => d.value).left
        const index = bisect(cdfData, xValue)
        const closestPoint = cdfData[Math.min(index, cdfData.length - 1)]

        if (closestPoint) {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }

          setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            title: 'Cumulative Probability',
            value: `${valueLabel}${closestPoint.value.toFixed(1)} → ${(closestPoint.cumulative * 100).toFixed(1)}% of events`,
            source,
            timestamp: 'Live'
          })

          hideTimeoutRef.current = setTimeout(() => {
            setTooltip(prev => ({ ...prev, visible: false }))
          }, 2000)
        }
      })
      .on('mouseleave', () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }
        setTooltip(prev => ({ ...prev, visible: false }))
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
        .text(valueLabel ? `${valueLabel}${tick}` : tick.toString())
    })

    // Y-axis labels
    const yTicks = [0, 0.25, 0.5, 0.75, 1]
    yTicks.forEach(tick => {
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(tick) + 3)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(`${(tick * 100).toFixed(0)}%`)
    })

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .style('fill', '#C6CFDA')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Cumulative Distribution')

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
