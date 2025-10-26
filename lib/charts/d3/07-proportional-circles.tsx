'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface ProportionalCirclesProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function ProportionalCircles({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: ProportionalCirclesProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const sourceData = unified || data || earthquakes || wildfires || airQuality || []
    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 16, bottom: 30, left: 40 }

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

    // Get lat/lon extents
    const latExtent = d3.extent(sourceData, d => {
      if (isUnified) {
        return (d as UnifiedDataPoint).location?.lat || 0
      }
      return (d as Earthquake).lat
    }) as [number, number]

    const lonExtent = d3.extent(sourceData, d => {
      if (isUnified) {
        return (d as UnifiedDataPoint).location?.lon || 0
      }
      return (d as Earthquake).lon
    }) as [number, number]

    const magnitudes = sourceData.map(d => {
      if (isUnified) {
        return (d as UnifiedDataPoint).primaryValue
      }
      return (d as Earthquake).magnitude
    })

    const x = d3.scaleLinear()
      .domain(lonExtent)
      .range([margin.left, width - margin.right])
      .nice()

    const y = d3.scaleLinear()
      .domain(latExtent)
      .range([height - margin.bottom, margin.top])
      .nice()

    // Size scale for circles
    const radiusScale = d3.scaleSqrt()
      .domain([d3.min(magnitudes) || 0, d3.max(magnitudes) || 10])
      .range([2, 20])

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

    // Draw circles
    svg.selectAll('circle')
      .data(sourceData)
      .enter()
      .append('circle')
      .attr('cx', d => {
        if (isUnified) {
          return x((d as UnifiedDataPoint).location?.lon || 0)
        }
        return x((d as Earthquake).lon)
      })
      .attr('cy', d => {
        if (isUnified) {
          return y((d as UnifiedDataPoint).location?.lat || 0)
        }
        return y((d as Earthquake).lat)
      })
      .attr('r', d => {
        if (isUnified) {
          return radiusScale((d as UnifiedDataPoint).primaryValue)
        }
        return radiusScale((d as Earthquake).magnitude)
      })
      .style('fill', d => {
        if (isUnified) {
          return (d as UnifiedDataPoint).color || chartColor
        }
        return chartColor
      })
      .style('opacity', 0.6)
      .style('stroke', d => {
        if (isUnified) {
          return (d as UnifiedDataPoint).color || chartColor
        }
        return chartColor
      })
      .style('stroke-width', '0.5px')

    // Highlight largest events
    const topEvents = [...sourceData]
      .sort((a, b) => {
        const valA = isUnified ? (a as UnifiedDataPoint).primaryValue : (a as Earthquake).magnitude
        const valB = isUnified ? (b as UnifiedDataPoint).primaryValue : (b as Earthquake).magnitude
        return valB - valA
      })
      .slice(0, 3)

    topEvents.forEach(event => {
      const lon = isUnified ? (event as UnifiedDataPoint).location?.lon || 0 : (event as Earthquake).lon
      const lat = isUnified ? (event as UnifiedDataPoint).location?.lat || 0 : (event as Earthquake).lat
      const value = isUnified ? (event as UnifiedDataPoint).primaryValue : (event as Earthquake).magnitude
      const color = isUnified ? (event as UnifiedDataPoint).color || chartColor : chartColor

      // Outer ring for emphasis
      svg.append('circle')
        .attr('cx', x(lon))
        .attr('cy', y(lat))
        .attr('r', radiusScale(value) + 2)
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', '1px')
        .style('opacity', 0.8)

      // Label
      svg.append('text')
        .attr('x', x(lon))
        .attr('y', y(lat) - radiusScale(value) - 6)
        .attr('text-anchor', 'middle')
        .style('fill', color)
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '600')
        .text(valueLabel ? `${valueLabel}${value.toFixed(1)}` : value.toFixed(1))
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
        .text(`${tick.toFixed(0)}°`)
    })

    // Y-axis labels
    const yTicks = y.ticks(4)
    yTicks.forEach(tick => {
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(tick) + 3)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(`${tick.toFixed(0)}°`)
    })

    // Axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 2)
      .attr('text-anchor', 'middle')
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Longitude')

    svg.append('text')
      .attr('x', -height / 2)
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90 0 0)`)
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Latitude')

    // Legend
    const minMag = d3.min(magnitudes) || 0
    const maxMag = d3.max(magnitudes) || 10
    const legendSizes = [
      Math.ceil(minMag),
      Math.ceil(minMag + (maxMag - minMag) / 3),
      Math.ceil(minMag + 2 * (maxMag - minMag) / 3),
      Math.floor(maxMag)
    ].filter((v, i, arr) => arr.indexOf(v) === i) // Remove duplicates

    const legendX = width - margin.right - 80
    const legendY = margin.top + 10

    const legendTitle = isUnified
      ? (sourceData[0] as UnifiedDataPoint).dataType === 'earthquake'
        ? 'Magnitude'
        : (sourceData[0] as UnifiedDataPoint).dataType === 'wildfire'
        ? 'Acres'
        : 'Value'
      : 'Magnitude'

    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY - 4)
      .style('fill', '#8F9BB0')
      .style('font-size', '8px')
      .style('font-family', 'Geist Mono, monospace')
      .text(legendTitle)

    legendSizes.forEach((mag, i) => {
      const cy = legendY + 16 + i * 24
      svg.append('circle')
        .attr('cx', legendX + 12)
        .attr('cy', cy)
        .attr('r', radiusScale(mag))
        .style('fill', chartColor)
        .style('opacity', 0.6)
        .style('stroke', chartColor)
        .style('stroke-width', '0.5px')

      svg.append('text')
        .attr('x', legendX + 30)
        .attr('y', cy + 3)
        .style('fill', '#C6CFDA')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(valueLabel ? `${valueLabel}${mag}` : mag.toString())
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

  return <svg ref={svgRef} width={width} height={height} />
}
