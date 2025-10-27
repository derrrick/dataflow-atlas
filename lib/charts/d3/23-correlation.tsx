'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface CorrelationProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function Correlation({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: CorrelationProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const sourceData = unified || data || earthquakes || wildfires || airQuality || []
    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 50, right: 16, bottom: 50, left: 50 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    // Variables to correlate (dynamic based on data type)
    let variables: Array<{ key: string; label: string; getValue: (d: any) => number }>

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        variables = [
          { key: 'primaryValue', label: 'Mag', getValue: (d: UnifiedDataPoint) => d.primaryValue },
          { key: 'secondaryValue', label: 'Depth', getValue: (d: UnifiedDataPoint) => d.secondaryValue || 0 },
          { key: 'lat', label: 'Lat', getValue: (d: UnifiedDataPoint) => d.location?.lat || 0 },
          { key: 'lon', label: 'Lon', getValue: (d: UnifiedDataPoint) => d.location?.lon || 0 }
        ]
      } else if (dataType === 'wildfire') {
        variables = [
          { key: 'primaryValue', label: 'Acres', getValue: (d: UnifiedDataPoint) => d.primaryValue },
          { key: 'secondaryValue', label: 'Contain', getValue: (d: UnifiedDataPoint) => d.secondaryValue || 0 },
          { key: 'lat', label: 'Lat', getValue: (d: UnifiedDataPoint) => d.location?.lat || 0 },
          { key: 'lon', label: 'Lon', getValue: (d: UnifiedDataPoint) => d.location?.lon || 0 }
        ]
      } else if (dataType === 'air_quality') {
        variables = [
          { key: 'primaryValue', label: 'AQI', getValue: (d: UnifiedDataPoint) => d.primaryValue },
          { key: 'secondaryValue', label: 'PM2.5', getValue: (d: UnifiedDataPoint) => d.secondaryValue || 0 },
          { key: 'lat', label: 'Lat', getValue: (d: UnifiedDataPoint) => d.location?.lat || 0 },
          { key: 'lon', label: 'Lon', getValue: (d: UnifiedDataPoint) => d.location?.lon || 0 }
        ]
      } else {
        variables = [
          { key: 'primaryValue', label: 'Val1', getValue: (d: UnifiedDataPoint) => d.primaryValue },
          { key: 'secondaryValue', label: 'Val2', getValue: (d: UnifiedDataPoint) => d.secondaryValue || 0 },
          { key: 'lat', label: 'Lat', getValue: (d: UnifiedDataPoint) => d.location?.lat || 0 },
          { key: 'lon', label: 'Lon', getValue: (d: UnifiedDataPoint) => d.location?.lon || 0 }
        ]
      }
    } else {
      const earthquakeData = sourceData as Earthquake[]
      variables = [
        { key: 'magnitude', label: 'Mag', getValue: (d: Earthquake) => d.magnitude },
        { key: 'depth', label: 'Depth', getValue: (d: Earthquake) => d.depth },
        { key: 'lat', label: 'Lat', getValue: (d: Earthquake) => d.lat },
        { key: 'lon', label: 'Lon', getValue: (d: Earthquake) => d.lon }
      ]
    }

    // Calculate correlation coefficient
    const correlation = (x: number[], y: number[]) => {
      const n = x.length
      const meanX = d3.mean(x) || 0
      const meanY = d3.mean(y) || 0

      const numerator = d3.sum(x.map((xi, i) => (xi - meanX) * (y[i] - meanY)))
      const denomX = Math.sqrt(d3.sum(x.map(xi => (xi - meanX) ** 2)))
      const denomY = Math.sqrt(d3.sum(y.map(yi => (yi - meanY) ** 2)))

      return denomX && denomY ? numerator / (denomX * denomY) : 0
    }

    // Build correlation matrix
    const matrix: number[][] = []
    for (let i = 0; i < variables.length; i++) {
      matrix[i] = []
      for (let j = 0; j < variables.length; j++) {
        const xValues = sourceData.map(d => variables[i].getValue(d))
        const yValues = sourceData.map(d => variables[j].getValue(d))
        matrix[i][j] = correlation(xValues, yValues)
      }
    }

    const cellSize = Math.min(
      (width - margin.left - margin.right) / variables.length,
      (height - margin.top - margin.bottom) / variables.length
    )

    // Diverging color scale: Blue (negative) → Dark Gray (zero) → Red (positive)
    const colorScale = d3.scaleLinear<string>()
      .domain([-1, -0.5, 0, 0.5, 1])
      .range([
        '#1E40AF',  // Strong negative: Dark blue
        '#60A5FA',  // Moderate negative: Light blue
        '#242C3A',  // Zero correlation: Dark gray (matches background)
        '#F87171',  // Moderate positive: Light red
        '#DC2626'   // Strong positive: Dark red
      ])
      .interpolate(d3.interpolateRgb)

    svg.selectAll('*').remove()

    // Row labels
    variables.forEach((v, i) => {
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', margin.top + i * cellSize + cellSize / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('fill', '#C6CFDA')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .text(v.label)
    })

    // Column labels
    variables.forEach((v, i) => {
      svg.append('text')
        .attr('x', margin.left + i * cellSize + cellSize / 2)
        .attr('y', margin.top - 8)
        .attr('text-anchor', 'middle')
        .style('fill', '#C6CFDA')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .text(v.label)
    })

    // Cells
    for (let i = 0; i < variables.length; i++) {
      for (let j = 0; j < variables.length; j++) {
        const corr = matrix[i][j]

        svg.append('rect')
          .attr('x', margin.left + j * cellSize)
          .attr('y', margin.top + i * cellSize)
          .attr('width', cellSize - 2)
          .attr('height', cellSize - 2)
          .style('fill', colorScale(corr))
          .style('stroke', '#242C3A')
          .style('stroke-width', '0.5px')

        // Correlation value with smart text color
        svg.append('text')
          .attr('x', margin.left + j * cellSize + cellSize / 2)
          .attr('y', margin.top + i * cellSize + cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('fill', () => {
            // Use white text on dark colors (strong correlations)
            // Use light gray on medium/light colors (weak correlations)
            if (Math.abs(corr) > 0.6) return '#FFFFFF'
            if (Math.abs(corr) < 0.2) return '#C6CFDA'
            return '#FFFFFF'
          })
          .style('font-size', '10px')
          .style('font-family', 'Geist Mono, monospace')
          .style('font-weight', '600')
          .text(corr.toFixed(2))
      }
    }

    // Color scale legend
    const legendWidth = 200
    const legendHeight = 12
    const legendX = width / 2 - legendWidth / 2
    const legendY = height - 30

    // Create gradient for legend
    const defs = svg.append('defs')
    const gradient = defs.append('linearGradient')
      .attr('id', 'correlation-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%')

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1E40AF')

    gradient.append('stop')
      .attr('offset', '25%')
      .attr('stop-color', '#60A5FA')

    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#242C3A')

    gradient.append('stop')
      .attr('offset', '75%')
      .attr('stop-color', '#F87171')

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#DC2626')

    // Legend rectangle
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#correlation-gradient)')
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Legend labels
    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY + legendHeight + 12)
      .attr('text-anchor', 'start')
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text('-1')

    svg.append('text')
      .attr('x', legendX + legendWidth / 2)
      .attr('y', legendY + legendHeight + 12)
      .attr('text-anchor', 'middle')
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text('0')

    svg.append('text')
      .attr('x', legendX + legendWidth)
      .attr('y', legendY + legendHeight + 12)
      .attr('text-anchor', 'end')
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text('+1')

    // Legend title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', legendY - 8)
      .attr('text-anchor', 'middle')
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Pearson Correlation')

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
