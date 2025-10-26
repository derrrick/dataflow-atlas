'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface HexbinProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function Hexbin({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: HexbinProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const sourceData = unified || data || earthquakes || wildfires || airQuality || []
    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 50, bottom: 30, left: 40 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    let colorInterpolator: (t: number) => string

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        colorInterpolator = d3.interpolateReds
      } else if (dataType === 'wildfire') {
        colorInterpolator = d3.interpolateOranges
      } else if (dataType === 'air_quality') {
        colorInterpolator = d3.interpolatePurples
      } else {
        colorInterpolator = d3.interpolateReds
      }
    } else {
      colorInterpolator = d3.interpolateReds
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

    const x = d3.scaleLinear()
      .domain(lonExtent)
      .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
      .domain(latExtent)
      .range([height - margin.bottom, margin.top])

    // Create hexagonal grid with reduced density
    const hexRadius = 20
    const hexHeight = hexRadius * Math.sqrt(3)
    const hexWidth = hexRadius * 2

    // Limit grid size to prevent performance issues
    const maxCols = Math.min(12, Math.ceil((width - margin.left - margin.right) / (hexWidth * 0.75)))
    const maxRows = Math.min(8, Math.ceil((height - margin.top - margin.bottom) / hexHeight))

    // Generate hex grid points
    const hexGrid: { x: number; y: number; count: number; avgMag: number }[] = []

    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        const xOffset = row % 2 === 0 ? 0 : hexWidth * 0.75 / 2
        const cx = margin.left + col * hexWidth * 0.75 + xOffset
        const cy = margin.top + row * hexHeight

        // Find events near this hex
        const hexLon = x.invert(cx)
        const hexLat = y.invert(cy)
        const radius = Math.abs(x.invert(margin.left + hexRadius * 1.5) - x.invert(margin.left))

        const eventsInHex = sourceData.filter(d => {
          const lat = isUnified ? (d as UnifiedDataPoint).location?.lat || 0 : (d as Earthquake).lat
          const lon = isUnified ? (d as UnifiedDataPoint).location?.lon || 0 : (d as Earthquake).lon
          const dist = Math.sqrt(
            Math.pow(lon - hexLon, 2) + Math.pow(lat - hexLat, 2)
          )
          return dist < radius
        })

        if (eventsInHex.length > 0) {
          hexGrid.push({
            x: cx,
            y: cy,
            count: eventsInHex.length,
            avgMag: d3.mean(eventsInHex, d => {
              return isUnified ? (d as UnifiedDataPoint).primaryValue : (d as Earthquake).magnitude
            }) || 0
          })
        }
      }
    }

    const maxCount = d3.max(hexGrid, d => d.count) || 1

    const colorScale = d3.scaleSequential(colorInterpolator)
      .domain([0, maxCount])

    // Hexagon path generator
    const hexagonPath = (radius: number) => {
      const angles = d3.range(0, 2 * Math.PI, Math.PI / 3)
      const points = angles.map(angle => [
        radius * Math.cos(angle),
        radius * Math.sin(angle)
      ])
      return `M${points.map(p => p.join(',')).join('L')}Z`
    }

    svg.selectAll('*').remove()

    // Draw hexagons
    hexGrid.forEach(hex => {
      svg.append('path')
        .attr('d', hexagonPath(hexRadius))
        .attr('transform', `translate(${hex.x}, ${hex.y})`)
        .style('fill', colorScale(hex.count))
        .style('opacity', 0.8)
        .style('stroke', '#242C3A')
        .style('stroke-width', '0.5px')
    })

    // Highlight top density hexes
    const topHexes = hexGrid
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    topHexes.forEach(hex => {
      svg.append('text')
        .attr('x', hex.x)
        .attr('y', hex.y + 3)
        .attr('text-anchor', 'middle')
        .style('fill', '#FFFFFF')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '600')
        .text(hex.count)
    })

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

    // Legend
    const legendX = width - margin.right + 10
    const legendY = margin.top

    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY - 6)
      .style('fill', '#8F9BB0')
      .style('font-size', '8px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Density')

    const legendSamples = [1, Math.floor(maxCount / 2), maxCount]
    legendSamples.forEach((count, i) => {
      const ly = legendY + i * 24

      svg.append('path')
        .attr('d', hexagonPath(8))
        .attr('transform', `translate(${legendX + 8}, ${ly + 8})`)
        .style('fill', colorScale(count))
        .style('opacity', 0.8)
        .style('stroke', '#242C3A')
        .style('stroke-width', '0.5px')

      svg.append('text')
        .attr('x', legendX + 24)
        .attr('y', ly + 12)
        .style('fill', '#C6CFDA')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(count)
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
