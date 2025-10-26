'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface ChoroplethProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function Choropleth({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: ChoroplethProps) {
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
    const margin = { top: 20, right: 40, bottom: 25, left: 40 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    let valueLabel: string, colorInterpolator: (t: number) => string

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        valueLabel = 'M'
        colorInterpolator = d3.interpolateReds
      } else if (dataType === 'wildfire') {
        valueLabel = ''
        colorInterpolator = d3.interpolateOranges
      } else if (dataType === 'air_quality') {
        valueLabel = 'AQI'
        colorInterpolator = d3.interpolatePurples
      } else {
        valueLabel = ''
        colorInterpolator = d3.interpolateReds
      }
    } else {
      valueLabel = 'M'
      colorInterpolator = d3.interpolateReds
    }

    // Create grid bins for regions
    const gridSize = 6

    // Bin events by region
    const regionData: { lat: number; lon: number; intensity: number; count: number }[] = []

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const latMin = -90 + (i * 180 / gridSize)
        const latMax = -90 + ((i + 1) * 180 / gridSize)
        const lonMin = -180 + (j * 360 / gridSize)
        const lonMax = -180 + ((j + 1) * 360 / gridSize)

        const eventsInRegion = sourceData.filter(e => {
          const lat = isUnified ? (e as UnifiedDataPoint).location?.lat || 0 : (e as Earthquake).lat
          const lon = isUnified ? (e as UnifiedDataPoint).location?.lon || 0 : (e as Earthquake).lon
          return lat >= latMin && lat < latMax && lon >= lonMin && lon < lonMax
        })

        const avgIntensity = eventsInRegion.length > 0
          ? d3.mean(eventsInRegion, e => {
              return isUnified ? (e as UnifiedDataPoint).primaryValue : (e as Earthquake).magnitude
            }) || 0
          : 0

        regionData.push({
          lat: (latMin + latMax) / 2,
          lon: (lonMin + lonMax) / 2,
          intensity: avgIntensity,
          count: eventsInRegion.length
        })
      }
    }

    const cellWidth = (width - margin.left - margin.right) / gridSize
    const cellHeight = (height - margin.top - margin.bottom) / gridSize

    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(regionData, d => d.intensity) || 8])
      .interpolator(colorInterpolator)

    svg.selectAll('*').remove()

    // Labels for high-intensity regions (calculate first to determine which cells to highlight)
    const topRegions = regionData
      .filter(d => d.count > 0)
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 3)

    const topRegionIndices = new Set(topRegions.map(r => regionData.indexOf(r)))

    // Grid cells - mute non-top-3 regions
    svg.selectAll('.cell')
      .data(regionData)
      .join('rect')
      .attr('class', 'cell')
      .attr('x', (d, i) => margin.left + (i % gridSize) * cellWidth)
      .attr('y', (d, i) => margin.top + Math.floor(i / gridSize) * cellHeight)
      .attr('width', cellWidth - 1)
      .attr('height', cellHeight - 1)
      .style('fill', d => d.count > 0 ? colorScale(d.intensity) : '#141821')
      .style('opacity', (d, i) => {
        if (d.count === 0) return 1
        return topRegionIndices.has(i) ? 1 : 0.3 // Mute non-top-3 to 30%
      })
      .style('stroke', '#1F2937') // More subtle stroke
      .style('stroke-width', '0.5px')
      .style('cursor', d => d.count > 0 ? 'pointer' : 'default')
      .on('mousemove', (event, d) => {
        if (d.count === 0) return

        // Clear existing timeout
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }

        const sourceType = isUnified ? (sourceData as UnifiedDataPoint[])[0]?.dataType : 'earthquake'
        const source = sourceType === 'earthquake' ? 'USGS' : sourceType === 'wildfire' ? 'NIFC' : 'AirNow'

        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          title: `Region (${d.lat.toFixed(1)}°, ${d.lon.toFixed(1)}°)`,
          value: `${valueLabel ? valueLabel : ''}${d.intensity.toFixed(1)} • ${d.count} events`,
          source,
          timestamp: 'Live'
        })

        // Auto-hide after 2 seconds
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

    // Label only top 3 regions with clear, bold text
    topRegions.forEach(region => {
      const index = regionData.indexOf(region)
      const x = margin.left + (index % gridSize) * cellWidth + cellWidth / 2
      const y = margin.top + Math.floor(index / gridSize) * cellHeight + cellHeight / 2

      svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', '#FFFFFF')
        .style('font-size', '12px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '700')
        .style('pointer-events', 'none')
        .style('text-shadow', '0 1px 3px rgba(0,0,0,0.8)') // Better contrast
        .text(valueLabel ? `${valueLabel}${region.intensity.toFixed(1)}` : region.intensity.toFixed(1))
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
