'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface IntensityZonesProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function IntensityZones({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: IntensityZonesProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const sourceData = unified || data || earthquakes || wildfires || airQuality || []
    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 30, right: 60, bottom: 30, left: 40 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    let chartTitle: string, colorInterpolator: (t: number) => string

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        chartTitle = 'Seismic Intensity Zones'
        colorInterpolator = d3.interpolateReds
      } else if (dataType === 'wildfire') {
        chartTitle = 'Wildfire Intensity Zones'
        colorInterpolator = d3.interpolateOranges
      } else if (dataType === 'air_quality') {
        chartTitle = 'Air Quality Intensity Zones'
        colorInterpolator = d3.interpolatePurples
      } else {
        chartTitle = 'Intensity Zones'
        colorInterpolator = d3.interpolateReds
      }
    } else {
      chartTitle = 'Seismic Intensity Zones'
      colorInterpolator = d3.interpolateReds
    }

    // Create grid bins with limited size for performance
    const gridSize = 8
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

    const latBins = d3.range(latExtent[0], latExtent[1], (latExtent[1] - latExtent[0]) / gridSize)
    const lonBins = d3.range(lonExtent[0], lonExtent[1], (lonExtent[1] - lonExtent[0]) / gridSize)

    // Calculate intensity for each grid cell (average value * count)
    const heatmapData: { lat: number; lon: number; intensity: number }[] = []

    for (let i = 0; i < latBins.length - 1; i++) {
      for (let j = 0; j < lonBins.length - 1; j++) {
        const eventsInCell = sourceData.filter(d => {
          const lat = isUnified ? (d as UnifiedDataPoint).location?.lat || 0 : (d as Earthquake).lat
          const lon = isUnified ? (d as UnifiedDataPoint).location?.lon || 0 : (d as Earthquake).lon
          return lat >= latBins[i] && lat < latBins[i + 1] &&
                 lon >= lonBins[j] && lon < lonBins[j + 1]
        })

        if (eventsInCell.length > 0) {
          const avgValue = d3.mean(eventsInCell, d => {
            return isUnified ? (d as UnifiedDataPoint).primaryValue : (d as Earthquake).magnitude
          }) || 0
          heatmapData.push({
            lat: (latBins[i] + latBins[i + 1]) / 2,
            lon: (lonBins[j] + lonBins[j + 1]) / 2,
            intensity: avgValue * eventsInCell.length
          })
        }
      }
    }

    const x = d3.scaleLinear()
      .domain(lonExtent)
      .range([margin.left, width - margin.right])

    const y = d3.scaleLinear()
      .domain(latExtent)
      .range([height - margin.bottom, margin.top])

    const cellWidth = (width - margin.left - margin.right) / gridSize
    const cellHeight = (height - margin.top - margin.bottom) / gridSize

    const maxIntensity = d3.max(heatmapData, d => d.intensity) || 1

    const colorScale = d3.scaleSequential(colorInterpolator)
      .domain([0, maxIntensity])

    svg.selectAll('*').remove()

    // Draw heatmap cells
    svg.selectAll('rect.heatcell')
      .data(heatmapData)
      .enter()
      .append('rect')
      .attr('class', 'heatcell')
      .attr('x', d => x(d.lon) - cellWidth / 2)
      .attr('y', d => y(d.lat) - cellHeight / 2)
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .style('fill', d => colorScale(d.intensity))
      .style('opacity', 0.8)

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

    // Color legend
    const legendHeight = 100
    const legendWidth = 12
    const legendX = width - margin.right + 20
    const legendY = margin.top

    // Gradient
    const defs = svg.append('defs')
    const gradient = defs.append('linearGradient')
      .attr('id', 'intensity-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%')

    const numStops = 10
    for (let i = 0; i <= numStops; i++) {
      const offset = i / numStops
      gradient.append('stop')
        .attr('offset', `${offset * 100}%`)
        .attr('stop-color', colorScale(maxIntensity * offset))
    }

    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#intensity-gradient)')
      .style('stroke', '#242C3A')
      .style('stroke-width', '0.5px')

    // Legend labels
    svg.append('text')
      .attr('x', legendX + legendWidth + 4)
      .attr('y', legendY + 4)
      .style('fill', '#C6CFDA')
      .style('font-size', '8px')
      .style('font-family', 'Geist Mono, monospace')
      .text('High')

    svg.append('text')
      .attr('x', legendX + legendWidth + 4)
      .attr('y', legendY + legendHeight)
      .style('fill', '#C6CFDA')
      .style('font-size', '8px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Low')

    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY - 6)
      .style('fill', '#8F9BB0')
      .style('font-size', '8px')
      .style('font-family', 'Geist Mono, monospace')
      .text('Intensity')

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .style('fill', '#C6CFDA')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .text(chartTitle)

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
