'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface BubbleProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function Bubble({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 280,
  height = 160
}: BubbleProps) {
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
    const margin = { top: 20, right: 20, bottom: 25, left: 35 }

    const plotData = sourceData.slice(0, 30)

    // Detect data format and extract values
    const isUnified = plotData.length > 0 && 'primaryValue' in plotData[0]

    let xExtent: [number, number], yExtent: [number, number], sizeExtent: [number, number]
    let xLabel: string, yLabel: string

    if (isUnified) {
      const unifiedData = plotData as UnifiedDataPoint[]
      xExtent = d3.extent(unifiedData, d => d.secondaryValue || 0) as [number, number]
      yExtent = d3.extent(unifiedData, d => d.primaryValue) as [number, number]
      sizeExtent = d3.extent(unifiedData, d => d.primaryValue) as [number, number]

      // Dynamic labels based on data type
      const dataType = unifiedData[0]?.dataType || 'earthquake'
      if (dataType === 'earthquake') {
        xLabel = 'km'
        yLabel = 'M'
      } else if (dataType === 'wildfire') {
        xLabel = ''
        yLabel = 'acres'
      } else if (dataType === 'air_quality') {
        xLabel = ''
        yLabel = 'AQI'
      } else {
        xLabel = ''
        yLabel = ''
      }
    } else {
      const earthquakeData = plotData as Earthquake[]
      xExtent = d3.extent(earthquakeData, d => d.depth) as [number, number]
      yExtent = d3.extent(earthquakeData, d => d.magnitude) as [number, number]
      sizeExtent = d3.extent(earthquakeData, d => d.magnitude) as [number, number]
      xLabel = 'km'
      yLabel = 'M'
    }

    const x = d3.scaleLinear()
      .domain(xExtent)
      .range([margin.left, width - margin.right])
      .nice()

    const y = d3.scaleLinear()
      .domain(yExtent)
      .range([height - margin.bottom, margin.top])
      .nice()

    const size = d3.scaleSqrt()
      .domain(sizeExtent)
      .range([2, 8])

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

    // Bubbles
    const bubbles = svg.selectAll('.bubble')
      .data(plotData)
      .join('circle')
      .attr('class', 'bubble')
      .attr('cx', d => {
        if (isUnified) {
          const unified = d as UnifiedDataPoint
          return x(unified.secondaryValue || 0)
        }
        const eq = d as Earthquake
        return x(eq.depth)
      })
      .attr('cy', d => {
        if (isUnified) {
          const unified = d as UnifiedDataPoint
          return y(unified.primaryValue)
        }
        const eq = d as Earthquake
        return y(eq.magnitude)
      })
      .attr('r', d => {
        if (isUnified) {
          const unified = d as UnifiedDataPoint
          return size(unified.primaryValue)
        }
        const eq = d as Earthquake
        return size(eq.magnitude)
      })
      .style('fill', d => {
        if (isUnified) {
          const unified = d as UnifiedDataPoint
          return unified.color || '#FF3B3B'
        }
        return '#FF3B3B'
      })
      .style('opacity', 0.5)
      .style('stroke', d => {
        if (isUnified) {
          const unified = d as UnifiedDataPoint
          return unified.color || '#FF3B3B'
        }
        return '#FF3B3B'
      })
      .style('stroke-width', '0.5px')
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Fade other bubbles
        bubbles.style('opacity', 0.2)
        d3.select(this).style('opacity', 0.9)

        // Clear existing timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }

        const xValue = isUnified ? (d as UnifiedDataPoint).secondaryValue || 0 : (d as Earthquake).depth
        const yValue = isUnified ? (d as UnifiedDataPoint).primaryValue : (d as Earthquake).magnitude
        const dataType = isUnified ? (d as UnifiedDataPoint).dataType : 'earthquake'
        const source = dataType === 'earthquake' ? 'USGS' : dataType === 'wildfire' ? 'NIFC' : 'AirNow'

        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          title: dataType === 'earthquake' ? 'Earthquake' : dataType === 'wildfire' ? 'Wildfire' : 'Air Quality',
          value: `${yLabel}${yValue.toFixed(1)} • ${xLabel ? xValue.toFixed(0) + xLabel : xValue.toFixed(0)}`,
          source,
          timestamp: 'Live'
        })

        // Auto-hide after 2 seconds
        hideTimeoutRef.current = setTimeout(() => {
          setTooltip(prev => ({ ...prev, visible: false }))
        }, 2000)
      })
      .on('mouseleave', function() {
        // Restore opacity
        bubbles.style('opacity', 0.5)

        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }
        setTooltip(prev => ({ ...prev, visible: false }))
      })

    // Labels
    const xTicks = x.ticks(3)
    xTicks.forEach(tick => {
      svg.append('text')
        .attr('x', x(tick))
        .attr('y', height - 8)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(xLabel ? `${tick}${xLabel}` : tick.toString())
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
        .text(yLabel ? `${yLabel}${tick.toFixed(1)}` : tick.toFixed(1))
    })
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
